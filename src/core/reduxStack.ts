/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import * as redux from 'redux';
import { Saga as ReduxSaga } from '@redux-saga/types';

/**
 * Root state of the redux store
 */
export interface StoreState {
  [p: string]: any;
}

/**
 * State of the reducer
 */
export interface ReducerState {
  [p: string]: any;
}

/**
 * Usual redux action
 */
export type Action = redux.AnyAction;

/**
 * Usual action create
 */
export type ActionCreator<A> = redux.ActionCreator<A>;

/**
 * Usual reducer
 */
export interface Reducer<S extends ReducerState, A extends Action> {
  (state: S, action: A): S;
}

/**
 * Basic selector
 */
export interface Selector<R, S extends StoreState = StoreState> {
  (state: S, ...rest: any): R;
}

/**
 * Usual redux saga effect
 */
export type Saga = ReduxSaga;
