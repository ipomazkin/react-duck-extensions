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
 * @module StateExtension
 * @description State extension duck.
 * @version 1.0.1
 */

import { produce } from 'immer';
import { Duck } from '../Duck';
import { ActionNamespaced, RootState, Selector } from '../reduxStack';

// Reducer state, compatible with this extension
export interface CompatibleState {
  [p: string]: any;
}

/** *************************************************************************
 * Action types
 ************************************************************************** */
export enum ActionTypes {
  Set = 'set',
}

/** *************************************************************************
 * Actions
 ************************************************************************** */
export interface SetAction extends ActionNamespaced {
  type: ActionTypes.Set;
  values: {
    [p: string]: any;
  };
}

export type ExtAction = SetAction;

/** *************************************************************************
 * Extension class
 ************************************************************************** */
export class DuckExtension extends Duck<CompatibleState, typeof ActionTypes, ExtAction, any> {
  actionCreators: {
    /**
     * Sets fields in the reducer state
     * @param values - object with new fields
     */
    set: (values: { [p: string]: any }) => SetAction;
  };

  selectors: {
    /**
     * Selects field from the reducer state
     * @param s - root state
     * @param k - field key
     */
    selectField: (s: RootState, k: string) => any | undefined;
  };

  constructor(namespace: string, options: any = {}) {
    super(namespace, options);

    this.actionTypes = ActionTypes;

    /** *************************************************************************
     * Action creators
     ************************************************************************** */
    const set = function (values: { [p: string]: any }): SetAction {
      return {
        type: ActionTypes.Set,
        values,
        _namespace: namespace,
      };
    };

    this.actionCreators = {
      set,
    };

    /** *************************************************************************
     * Reducer
     ************************************************************************** */
    this.reducer = (s, a): CompatibleState => {
      if (a._namespace !== namespace) return s;

      switch (a.type) {
        case ActionTypes.Set:
          return produce(s, (ns) => {
            Object.keys(a.values).forEach((key) => {
              ns[key] = a.values[key];
            });
          });

        default:
          return s;
      }
    };

    /** *************************************************************************
     * Selectors
     ************************************************************************** */
    const selectField: Selector<any> = (s, k: string): any => s[namespace][k];

    this.selectors = {
      selectField,
    };

    /** *************************************************************************
     * Sagas
     ************************************************************************** */
    this.sagas = [];
  }
}
