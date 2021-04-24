/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { ReducerState, Action, ActionCreator, Reducer, Saga, Selector } from './reduxStack';

/**
 * A duck common interface
 */
export interface Duck<S extends ReducerState, AT, A extends Action> {
  namespace: string;

  actionTypes: AT;

  actionCreators: {
    [key: string]: ActionCreator<A>;
  };

  reducer: Reducer<S, A>;

  sagas: Saga[];

  selectors: {
    [key: string]: Selector<any>;
  };

  getInitialState(...args: any): S;
}

/**
 * A duck builder interface
 */
export interface DuckBuilder<D> {
  make: (...args: any) => D;
}
