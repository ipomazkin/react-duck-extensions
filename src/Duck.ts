/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Action, ActionCreator, Reducer, SagaEffect, Selector } from './reduxStack';

/**
 * An options common interface
 */
export interface DuckOptions {
  [p: string]: any;
}

/**
 * Abstract duck class. Use for inheritance or duck extensions
 */
export abstract class Duck<S, AT, A extends Action, OP extends DuckOptions> {
  namespace: string;

  options: OP;

  actionTypes: AT;

  actionCreators: {
    [key: string]: ActionCreator<A>;
  };

  reducer: Reducer<S, A>;

  sagas: SagaEffect[];

  selectors: {
    [key: string]: Selector<any>;
  };

  constructor(namespace: string, options: OP) {
    this.namespace = namespace;
    this.options = options;
    this.actionTypes = {} as AT;
    this.actionCreators = {};
    this.reducer = (s, a) => s;
    this.sagas = [];
    this.selectors = {};
  }

  /**
   * Use it for injecting some initial state fields
   */
  getInitialState(): S {
    return {} as S;
  }
}
