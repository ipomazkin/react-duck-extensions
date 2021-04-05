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
import { Effect } from 'redux-saga/effects';

/**
 * Root state of the redux store
 */
export interface RootState {
  [p: string]: any;
}

/**
 * Usual redux action
 */
export type Action = redux.AnyAction;

/**
 * Redux action with an extra identifier - namespace. Useful for ducks extensions
 */
export interface ActionNamespaced extends Action {
  _namespace: string;
}

/**
 * Usual action create
 */
export type ActionCreator<A> = redux.ActionCreator<A>;

/**
 * Usual reducer
 */
export interface Reducer<S, A> {
  (state: S, action: A): S;
}

/**
 * Basic selector
 */
export interface Selector<R> {
  (state: RootState, ...rest: any): R;
}

/**
 * Usual redux saga effect
 */
export type SagaEffect = Effect;
