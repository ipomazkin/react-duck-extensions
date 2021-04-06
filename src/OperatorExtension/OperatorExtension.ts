/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * @module OperatorExtension
 * @description Operations extension duck.
 * @version 0.9.1
 */

import { ActionMatchingPattern, ActionPattern, Task } from '@redux-saga/types'
import { all, cancel, fork, take, ForkEffect, put } from "redux-saga/effects";
import { Action } from "redux";

import { Duck } from '../Duck';
import { ActionNamespaced, RootState } from '../reduxStack';
import * as Operation from './Operation';
import { Generator } from "../../libs/Generator";

// Reducer state, compatible with this extension
export interface CompatibleState {
  [p: string]: any;
}

/***************************************************************************
 * Action types
 ***************************************************************************/
export enum ActionTypes {
  Reset = 'reset',
  Start = 'start',
  Progress = 'progress',
  Finish = 'finish',
  EmitStart = 'emitStart',
}

/***************************************************************************
 * Actions
 ***************************************************************************/
export interface ResetAction extends ActionNamespaced {
  type: ActionTypes.Reset;
  operationType: Operation.Type,
  id: Operation.ID,
}

export interface StartAction extends ActionNamespaced {
  type: ActionTypes.Start;
  operationType: Operation.Type,
  id: Operation.ID,
  cacheID: Operation.CacheID,
  progress: Operation.Progress,
  params: Operation.Params,
}

export interface ProgressAction extends ActionNamespaced {
  type: ActionTypes.Progress;
  operationType: Operation.Type,
  id: Operation.ID,
  addTotal: number,
  addDone: number,
}

export interface FinishAction extends ActionNamespaced {
  type: ActionTypes.Finish;
  operationType: Operation.Type,
  id: Operation.ID,
  errors: Operation.Errors,
  result: any,
  progress?: Operation.Progress,
}

export interface EmitStartAction extends ActionNamespaced {
  type: ActionTypes.EmitStart;
  operationType: Operation.Type,
  id: Operation.ID,
  cacheID: Operation.CacheID,
  progress: Operation.Progress,
  params: Operation.Params,
}

export type ExtAction =
  ResetAction |
  StartAction |
  ProgressAction |
  FinishAction |
  EmitStartAction;

/***************************************************************************
 * Extension options
 ***************************************************************************/
interface DuckExtensionOptions {
  /** Where in reducer state store an operations */
  fieldKey: string,

  /** Operations types on handlers map */
  operations: {
    type: Operation.Type,
    handler: Operation.Handler,
  }[]
}

/***************************************************************************
 * Extension class
 ***************************************************************************/
export class DuckExtension extends Duck<CompatibleState, typeof ActionTypes, ExtAction, DuckExtensionOptions> {
  actionCreators: {
    /**
     * Resets operation state to initial
     * @param p
     */
    reset: (p: {
      type: Operation.Type,
      id?: Operation.ID,
    }) => ResetAction;

    /**
     * Starts operation
     * @param p
     */
    start: (p: {
      type: Operation.Type,
      id?: Operation.ID,
      cacheID?: Operation.CacheID,
      progress?: Operation.Progress,
      params?: Operation.Params,
    }) => StartAction;

    /**
     * Add progress to operation
     * @param p
     */
    progress: (p: {
      type: Operation.Type,
      id?: Operation.ID,
      addDone: number,
      addTotal?: number,
    }) => ProgressAction;

    /**
     * Finish the operation
     * @param p
     */
    finish: (p: {
      type: Operation.Type,
      id?: Operation.ID,
      result?: any,
      errors?: Operation.Errors,
      progress?: Operation.Progress,
    }) => FinishAction;

    /**
     * Runs operation start
     * @param p
     */
    emitStart: (p: {
      type: Operation.Type,
      id?: Operation.ID,
      cacheID?: Operation.CacheID,
      progress?: Operation.Progress,
      params?: Operation.Params,
    }) => EmitStartAction;
  };

  selectors: {
    selectOperation: (s: RootState, type: Operation.Type, id?: Operation.ID) => Operation.Operation | null;
    selectStatus: (s: RootState, type: Operation.Type, id?: Operation.ID) => Operation.Status | null;
    selectIsCanRun: (s: RootState, type: Operation.Type, id?: Operation.ID) => boolean;
    selectIsRunning: (s: RootState, type: Operation.Type, id?: Operation.ID) => boolean;
    selectIsSucceed: (s: RootState, type: Operation.Type, id?: Operation.ID) => boolean;
    selectIsFailed: (s: RootState, type: Operation.Type, id?: Operation.ID) => boolean;
    selectIsFinished: (s: RootState, type: Operation.Type, id?: Operation.ID) => boolean;
    selectErrors: (s: RootState, type: Operation.Type, id?: Operation.ID) => Operation.Errors | null;
    selectResult: (s: RootState, type: Operation.Type, id?: Operation.ID) => any | null;
    selectProgress: (s: RootState, type: Operation.Type, id?: Operation.ID) => Operation.Progress | null;
    selectProgressTotal: (s: RootState, type: Operation.Type, id?: Operation.ID) => number | null;
    selectProgressDone: (s: RootState, type: Operation.Type, id?: Operation.ID) => number | null;
    selectProgressRatio: (s: RootState, type: Operation.Type, id?: Operation.ID) => number | null;
  };

  constructor(namespace: string, options: DuckExtensionOptions) {
    super(namespace, options);

    const self = this;

    this.actionTypes = ActionTypes;

    /***************************************************************************
     * Action creators
     ***************************************************************************/
    function reset(p: {
      type: Operation.Type,
      id?: Operation.ID,
    }): ResetAction {
      return {
        type: ActionTypes.Reset,
        id: p.id === undefined ? Operation.DEFAULT_OPERATION_ID : p.id,
        operationType: p.type,
        _namespace: namespace,
      }
    }

    function start(p: {
      type: Operation.Type,
      id?: Operation.ID,
      cacheID?: Operation.CacheID,
      progress?: Operation.Progress,
      params?: Operation.Params,
    }): StartAction {
      return {
        type: ActionTypes.Start,
        id: p.id === undefined ? Operation.DEFAULT_OPERATION_ID : p.id,
        operationType: p.type,
        cacheID: p.cacheID === undefined ? null : p.cacheID,
        progress: p.progress === undefined ? {
          total: 2,
          done: 0,
        } : p.progress,
        params: p.params || {},
        _namespace: namespace,
      }
    }

    function progress(p: {
      type: Operation.Type,
      id?: Operation.ID,
      addDone: number,
      addTotal?: number,
    }): ProgressAction {
      return {
        type: ActionTypes.Progress,
        id: p.id === undefined ? Operation.DEFAULT_OPERATION_ID : p.id,
        operationType: p.type,
        addDone: p.addDone,
        addTotal: p.addTotal || 0,
        _namespace: namespace,
      }
    }

    function finish(p: {
      type: Operation.Type,
      id?: Operation.ID,
      result?: any,
      errors?: Operation.Errors,
      progress?: Operation.Progress,
    }): FinishAction {
      return {
        type: ActionTypes.Finish,
        id: p.id === undefined ? Operation.DEFAULT_OPERATION_ID : p.id,
        operationType: p.type,
        progress: p.progress,
        result: p.result || null,
        errors: p.errors || [],
        _namespace: namespace,
      }
    }

    function emitStart(p: {
      type: Operation.Type,
      id?: Operation.ID,
      cacheID?: Operation.CacheID,
      progress?: Operation.Progress,
      params?: Operation.Params,
    }): EmitStartAction {
      return {
        type: ActionTypes.EmitStart,
        id: p.id === undefined ? Operation.DEFAULT_OPERATION_ID : p.id,
        operationType: p.type,
        cacheID: p.cacheID === undefined ? null : p.cacheID,
        progress: p.progress === undefined ? {
          total: 2,
          done: 0,
        } : p.progress,
        params: p.params || {},
        _namespace: namespace,
      }
    }

    this.actionCreators = {
      reset,
      start,
      progress,
      finish,
      emitStart,
    };

    /***************************************************************************
     * Reducer
     ***************************************************************************/
    this.reducer = (s, a): CompatibleState => {
      if (a._namespace !== namespace) return s;

      switch (a.type) {
        default:
          return s;
      }
    };

    /***************************************************************************
     * Selectors
     ***************************************************************************/
    this.selectors = {};

    /***************************************************************************
     * Helpers
     ***************************************************************************/

    /**
     * Custom takeLatest redux-saga effect.
     * Cancels previous running effect with same type, namespace, id and operationType.
     * The purpose it to prevent running an action when it have already started.
     * @param pattern
     * @param worker
     * @param args
     */
    function takeLatest<P extends ActionPattern>(
      pattern: P,
      worker: (action: ActionMatchingPattern<P>) => any,
      ...args: any
    ): ForkEffect {
      return fork(function* () {
        const register: {
          task: Task,
          action: ExtAction
        }[] = [];

        while (true) {
          const action: ExtAction = yield take(pattern),
            toCancel: number[] = [];

          if (action._namespace === namespace) {
            register.forEach((rl, i) => {
              if (
                rl.action.operationType === action.operationType
                && rl.action.type === action.type
                && rl.action.id === action.id
                && rl.action._namespace === action._namespace
                && rl.task.isRunning()
              ) {
                toCancel.push(i);
              }
            });

            yield all([
              ...toCancel.map(i => cancel(register[i].task))
            ]);
            toCancel.forEach(i => register.splice(i, 1));

            let t: Task = yield fork(worker as (...args: any[]) => any, ...args.concat(action));
            register.push({
              task: t,
              action,
            });
          } else {
            yield fork(worker as (...args: any[]) => any, ...args.concat(action));
          }
        }
      });
    }

    /***************************************************************************
     * Sagas
     ***************************************************************************/
    this.sagas = [
      takeLatest(ActionTypes.EmitStart, function* (a: EmitStartAction): Generator<any, any, any> {
        const handlerConf = self.options.operations.find(el => el.type === a.operationType);
        if (!handlerConf) return;
        const handler: Operation.Handler = handlerConf.handler;

        yield put(start({
          type: a.operationType,
          id: a.id,
          cacheID: a.cacheID,
          progress: a.progress,
          params: a.params,
        }));

        let result: any = null,
          errors: string[] = [];

        try {
          result = yield handler(a.id, a.params);
          yield put(progress({ type: a.operationType, id: a.id, addDone: 1, }));
        } catch (e) {
          errors.push(e.message); // todo how to get an array of errors?
        }

        yield put(finish({
          type: a.operationType,
          id: a.id,
          result: result,
          errors: errors,
        }));

        yield put(progress({ type: a.operationType, id: a.id, addDone: 1, }));
      } as (action: Action) => any),
    ];
  }
}
