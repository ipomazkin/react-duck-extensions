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
import { Action, ReducerState, Reducer, Selector, StoreState } from "../core/reduxStack";
import { ExtensionDuckBuilder, ActionTypeMap } from "../core/extensionStack";
import { Duck } from "../core/duckStack";

// Reducer state, compatible with this extension
export interface CompatibleState extends ReducerState {
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
export interface SetAction extends Action {
  type: string;
  values: {
    [p: string]: any;
  };
}

export type ExtAction = SetAction;

/**
 * Extension interface
 */
export interface StateExtension extends Duck<CompatibleState, ActionTypeMap, ExtAction> {
  selectors: {
    selectField: (s: StoreState, k: string) => any;
  },
  actionCreators: {
    set: (values: { [p: string]: any }) => SetAction;
  },
}

/**
 * Extension factory
 */
export class StateExtensionBuilder extends ExtensionDuckBuilder<StateExtension, CompatibleState, ExtAction> {
  makeActionTypes(): ActionTypeMap  {
    return {
      [ActionTypes.Set]: `${this.postfixedNamespace}/${ActionTypes.Set}`,
    };
  }

  makeActions(at: ActionTypeMap) {
    const set = function (values: { [p: string]: any }): SetAction {
      return {
        type: at[ActionTypes.Set],
        values,
      };
    };

    return {
      set,
    }
  }

  makeReducer(at: ActionTypeMap): Reducer<CompatibleState, ExtAction> {
    const handlers = {
      [at[ActionTypes.Set]]: (s: CompatibleState, a: SetAction) => {
        return produce(s, (ns) => {
          Object.keys(a.values).forEach((key) => {
            ns[key] = a.values[key];
          });
        });
      },
    };

    return (s, a) => {
      if (!handlers[a.type]) return s;
      return handlers[a.type](s, a);
    };
  }

  makeSelectors(): { [p: string]: Selector<any> } {
    const selectField: Selector<any> = (s, k: string): any => s[this.namespace][k];

    return {
      selectField,
    };
  }
}
