/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Duck, DuckBuilder } from "./duckStack";
import { Action, ActionCreator, Reducer, ReducerState, Saga, Selector } from "./reduxStack";

/**
 * Map for action types
 */
export interface ActionTypeMap<V = string> {
  [p: string]: V;
}

/**
 * Builder options interface
 */
export interface ExtensionDuckBuilderOptions {
  nsPostfix?: string,
}

/**
 * Builder helper class
 */
export class ExtensionDuckBuilder<
  D extends Duck<S, ActionTypeMap, A>,
  S extends ReducerState,
  A extends Action,
  O extends ExtensionDuckBuilderOptions = ExtensionDuckBuilderOptions
> implements DuckBuilder<D> {
  /**
   * The extension real namespace
   */
  public namespace: string;

  /**
   * The extension namespace for action types
   */
  public postfixedNamespace: string;

  /**
   * Builder options
   */
  public options: O;

  constructor(ns: string, options?: O) {
    this.namespace = ns;
    this.options = {
      ...this.getDefaultOptions(),
      ...(options ? options : {}),
    };
    this.postfixedNamespace = `${this.namespace}/${this.options.nsPostfix}`;
  }

  getDefaultOptions(): O {
    return {
      nsPostfix: 'ext',
    } as O;
  }

  makeActionTypes(): ActionTypeMap {
    return {};
  }

  makeActions(at: ActionTypeMap): {[p: string]: ActionCreator<A>} {
    return {};
  }

  makeReducer(at: ActionTypeMap): Reducer<S, A> {
    return (s, a) => s;
  }

  makeSagas(at: ActionTypeMap): Saga[] {
    return [];
  }

  makeSelectors(): {[key: string]: Selector<any>} {
    return {};
  }

  makeInitialStateGetter(): (...args: any) => S {
    return (...args: any) => ({} as S);
  }

  make() {
    let actionTypes = this.makeActionTypes(),
      actions = this.makeActions(actionTypes),
      reducer = this.makeReducer(actionTypes),
      sagas = this.makeSagas(actionTypes),
      selectors = this.makeSelectors(),
      getInitialState = this.makeInitialStateGetter();

    return {
      namespace: this.namespace,
      actionTypes,
      actionCreators: actions,
      reducer,
      sagas,
      selectors,
      getInitialState,
    } as D;
  }
}
