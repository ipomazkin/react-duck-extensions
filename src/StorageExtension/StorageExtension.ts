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
 * @module StorageExtension
 * @description Storage extension duck. Useful for storing a "model's" data
 * @version 1.0.0
 */

import { produce } from "immer";

import { Duck } from '../core/duckStack';
import { Action, Reducer, Selector, StoreState } from '../core/reduxStack';
import { ActionTypeMap, ExtensionDuckBuilder, ExtensionDuckBuilderOptions } from "../core/extensionStack";

// Reducer state, compatible with this extension
export interface CompatibleState<SI> {
  [p: string]: SI | any;
}

/** *************************************************************************
 * Util types
 ************************************************************************** */
type ID = string | number;

interface StorableItem {
  id: ID;
  [p: string]: any;
}

/** *************************************************************************
 * Action types
 ************************************************************************** */
export enum ActionTypes {
  Add = 'add',
  AddBulk = 'addBulk',
  Replace = 'replace',
  ReplaceBulk = 'replaceBulk',
  AddOrReplace = 'addOrReplace',
  AddOrReplaceBulk = 'addOrReplaceBulk',
  Update = 'update',
  UpdateBulk = 'updateBulk',
  AddOrUpdate = 'addOrUpdate',
  AddOrUpdateBulk = 'addOrUpdateBulk',
  Remove = 'remove',
  RemoveBulk = 'removeBulk',
  Reset = 'reset',
}

/** *************************************************************************
 * Actions
 ************************************************************************** */
export interface AddAction extends Action {
  type: string;
  item: StorableItem;
}

export interface AddBulkAction extends Action {
  type: string;
  items: StorableItem[];
}

export interface ReplaceAction extends Action {
  type: string;
  item: StorableItem;
}

export interface ReplaceBulkAction extends Action {
  type: string;
  items: StorableItem[];
}

export interface AddOrReplaceAction extends Action {
  type: string;
  item: StorableItem;
}

export interface AddOrReplaceBulkAction extends Action {
  type: string;
  items: StorableItem[];
}

export interface UpdateAction extends Action {
  type: string;
  item: StorableItem;
}

export interface UpdateBulkAction extends Action {
  type: string;
  items: StorableItem[];
}

export interface AddOrUpdateAction extends Action {
  type: string;
  item: StorableItem;
}

export interface AddOrUpdateBulkAction extends Action {
  type: string;
  items: StorableItem[];
}

export interface RemoveAction extends Action {
  type: string;
  id: ID;
}

export interface RemoveBulkAction extends Action {
  type: string;
  ids: ID[];
}

export interface ResetAction extends Action {
  type: string;
  items: StorableItem[];
}

export type ExtAction =
  | AddAction
  | AddBulkAction
  | ReplaceAction
  | ReplaceBulkAction
  | AddOrReplaceAction
  | AddOrReplaceBulkAction
  | UpdateAction
  | UpdateBulkAction
  | AddOrUpdateAction
  | AddOrUpdateBulkAction
  | RemoveAction
  | RemoveBulkAction
  | ResetAction;

/** *************************************************************************
 * Extension options
 ************************************************************************** */
interface StorageExtensionOptions extends ExtensionDuckBuilderOptions {
  /**
   * The key of storage's object in reducer's state object
   */
  key: string;
}

/** *************************************************************************
 * Extension interface
 ************************************************************************** */
export interface StorageExtension<SI extends StorableItem> extends Duck<CompatibleState<SI>, ActionTypeMap, ExtAction> {
  /**
   * Add a field to reducer state object
   */
  getInitialState(): CompatibleState<SI>;

  actionCreators: {
    /**
     * Adds item to the storage
     * @param item
     */
    add: (item: SI) => AddAction;

    /**
     * Adds items to the storage
     * @param items
     */
    addBulk: (items: SI[]) => AddBulkAction;

    /**
     * Replaces item in the storage, find one by ID.
     * @param item
     */
    replace: (item: SI) => ReplaceAction;

    /**
     * Replaces items in the storage, find ones by ID.
     * @param items
     */
    replaceBulk: (items: SI[]) => ReplaceBulkAction;

    /**
     * Tries to find an item by ID and replace it, otherwise adds the one to the storage
     * @param item
     */
    addOrReplace: (item: SI) => AddOrReplaceAction;

    /**
     * Tries to find an items by ID and replace it, otherwise adds ones to the storage
     * @param items
     */
    addOrReplaceBulk: (items: SI[]) => AddOrReplaceBulkAction;

    /**
     * Update item fields in storage, find one by ID.
     * @param item
     */
    update: (item: SI) => UpdateAction;

    /**
     * Update items fields in storage, find ones by ID
     * @param items
     */
    updateBulk: (items: SI[]) => UpdateBulkAction;

    /**
     * Tries to find an item by ID and update it's fields, otherwise adds the item to the storage
     * @param item
     */
    addOrUpdate: (item: SI) => AddOrUpdateAction;

    /**
     * Tries to find an items by ID and update their fields, otherwise adds items to the storage
     * @param items
     */
    addOrUpdateBulk: (items: SI[]) => AddOrUpdateBulkAction;

    /**
     * Removes item by ID
     * @param id
     */
    remove: (id: ID) => RemoveAction;

    /**
     * Removes items by ID
     * @param ids
     */
    removeBulk: (ids: ID[]) => RemoveBulkAction;

    /**
     * Replace all items on new ones
     * @param items
     */
    reset: (items: StorableItem[]) => ResetAction;
  };

  selectors: {
    /**
     * Selects all
     * @param s
     */
    selectAll: (s: StoreState) => SI[];

    /**
     * Selects item by ID
     * @param s
     * @param id
     */
    selectItem: (s: StoreState, id: ID) => SI | null;

    /**
     * Selects items by their IDs. If ids is empty - returns all items.
     * @param s
     * @param ids
     */
    selectItems: (s: StoreState, ids: ID[]) => SI[];
  };
}

export class StorageExtensionBuilder<SI extends StorableItem>
  extends ExtensionDuckBuilder<StorageExtension<SI>, CompatibleState<SI>, ExtAction, StorageExtensionOptions> {

  makeInitialStateGetter() {
    return () => {
      return {
        [this.options.key]: [] as SI[],
      };
    };
  }

  makeActionTypes(): ActionTypeMap<string> {
    return {
      [ActionTypes.Add]: `${this.postfixedNamespace}/${ActionTypes.Add}`,
      [ActionTypes.AddBulk]: `${this.postfixedNamespace}/${ActionTypes.AddBulk}`,
      [ActionTypes.Replace]: `${this.postfixedNamespace}/${ActionTypes.Replace}`,
      [ActionTypes.ReplaceBulk]: `${this.postfixedNamespace}/${ActionTypes.ReplaceBulk}`,
      [ActionTypes.AddOrReplace]: `${this.postfixedNamespace}/${ActionTypes.AddOrReplace}`,
      [ActionTypes.AddOrReplaceBulk]: `${this.postfixedNamespace}/${ActionTypes.AddOrReplaceBulk}`,
      [ActionTypes.Update]: `${this.postfixedNamespace}/${ActionTypes.Update}`,
      [ActionTypes.UpdateBulk]: `${this.postfixedNamespace}/${ActionTypes.UpdateBulk}`,
      [ActionTypes.AddOrUpdate]: `${this.postfixedNamespace}/${ActionTypes.AddOrUpdate}`,
      [ActionTypes.AddOrUpdateBulk]: `${this.postfixedNamespace}/${ActionTypes.AddOrUpdateBulk}`,
      [ActionTypes.Remove]: `${this.postfixedNamespace}/${ActionTypes.Remove}`,
      [ActionTypes.RemoveBulk]: `${this.postfixedNamespace}/${ActionTypes.RemoveBulk}`,
      [ActionTypes.Reset]: `${this.postfixedNamespace}/${ActionTypes.Reset}`,
    };
  }

  makeActions(at: ActionTypeMap) {
    const add = function (item: SI): AddAction {
      return {
        type: at[ActionTypes.Add],
        item,
      };
    };

    const addBulk = function (items: SI[]): AddBulkAction {
      return {
        type: at[ActionTypes.AddBulk],
        items,
      };
    };

    const replace = function (item: SI): ReplaceAction {
      return {
        type: at[ActionTypes.Replace],
        item,
      };
    };

    const replaceBulk = function (items: SI[]): ReplaceBulkAction {
      return {
        type: at[ActionTypes.ReplaceBulk],
        items,
      };
    };

    const addOrReplace = function (item: SI): AddOrReplaceAction {
      return {
        type: at[ActionTypes.AddOrReplace],
        item,
      };
    };

    const addOrReplaceBulk = function (items: SI[]): AddOrReplaceBulkAction {
      return {
        type: at[ActionTypes.AddOrReplaceBulk],
        items,
      };
    };

    const update = function (item: SI): UpdateAction {
      return {
        type: at[ActionTypes.Update],
        item,
      };
    };

    const updateBulk = function (items: SI[]): UpdateBulkAction {
      return {
        type: at[ActionTypes.UpdateBulk],
        items,
      };
    };

    const addOrUpdate = function (item: SI): AddOrUpdateAction {
      return {
        type: at[ActionTypes.AddOrUpdate],
        item,
      };
    };

    const addOrUpdateBulk = function (items: SI[]): AddOrUpdateBulkAction {
      return {
        type: at[ActionTypes.AddOrUpdateBulk],
        items,
      };
    };

    const remove = function (id: ID): RemoveAction {
      return {
        type: at[ActionTypes.Remove],
        id,
      };
    };

    const removeBulk = function (ids: ID[]): RemoveBulkAction {
      return {
        type: at[ActionTypes.RemoveBulk],
        ids,
      };
    };

    const reset = function (items: StorableItem[]): ResetAction {
      return {
        type: at[ActionTypes.Reset],
        items,
      };
    };

    return {
      add,
      addBulk,
      replace,
      replaceBulk,
      addOrReplace,
      addOrReplaceBulk,
      update,
      updateBulk,
      addOrUpdate,
      addOrUpdateBulk,
      remove,
      removeBulk,
      reset,
    };
  }

  makeReducer(at: ActionTypeMap): Reducer<CompatibleState<SI>, ExtAction> {
    const handlers = {
      [at[ActionTypes.Add]]: (s: CompatibleState<SI>, a: AddAction) => {
        return produce(s, (ns) => {
          ns[this.options.key].push(a.item);
        });
      },

      [at[ActionTypes.AddBulk]]: (s: CompatibleState<SI>, a: AddBulkAction) => {
        return produce(s, (ns) => {
          a.items.forEach((item) => {
            ns[this.options.key].push(item);
          });
        });
      },

      [at[ActionTypes.Replace]]: (s: CompatibleState<SI>, a: ReplaceAction) => {
        return produce(s, (ns) => {
          const index = ns[this.options.key].findIndex((el: SI) => el.id === a.item.id);
          if (index > -1) ns[this.options.key][index] = a.item;
        });
      },

      [at[ActionTypes.ReplaceBulk]]: (s: CompatibleState<SI>, a: ReplaceBulkAction) => {
        return produce(s, (ns) => {
          if (!a.items.length) {
            ns[this.options.key] = a.items;
          } else {
            a.items.forEach((item) => {
              const index = ns[this.options.key].findIndex((el: SI) => el.id === item.id);
              if (index > -1) ns[this.options.key][index] = item;
            });
          }
        });
      },

      [at[ActionTypes.AddOrReplace]]: (s: CompatibleState<SI>, a: AddOrReplaceAction) => {
        return produce(s, (ns) => {
          const index = ns[this.options.key].findIndex((el: SI) => el.id === a.item.id);
          if (index > -1) {
            ns[this.options.key][index] = a.item;
          } else {
            ns[this.options.key].push(a.item);
          }
        });
      },

      [at[ActionTypes.AddOrReplaceBulk]]: (s: CompatibleState<SI>, a: AddOrReplaceBulkAction) => {
        return produce(s, (ns) => {
          a.items.forEach((item) => {
            const index = ns[this.options.key].findIndex((el: SI) => el.id === item.id);
            if (index > -1) {
              ns[this.options.key][index] = item;
            } else {
              ns[this.options.key].push(item);
            }
          });
        });
      },

      [at[ActionTypes.Update]]: (s: CompatibleState<SI>, a: UpdateAction) => {
        return produce(s, (ns) => {
          const index = ns[this.options.key].findIndex((el: SI) => el.id === a.item.id);
          if (index > -1) {
            Object.keys(a.item).forEach((k) => {
              ns[this.options.key][index][k] = a.item[k];
            });
          }
        });
      },

      [at[ActionTypes.UpdateBulk]]: (s: CompatibleState<SI>, a: UpdateBulkAction) => {
        return produce(s, (ns) => {
          a.items.forEach((item) => {
            const index = ns[this.options.key].findIndex((el: SI) => {
              return el.id === item.id;
            });
            if (index > -1) {
              Object.keys(item).forEach((k) => {
                ns[this.options.key][index][k] = item[k];
              });
            }
          });
        });
      },

      [at[ActionTypes.AddOrUpdate]]: (s: CompatibleState<SI>, a: AddOrUpdateAction) => {
        return produce(s, (ns) => {
          const index = ns[this.options.key].findIndex((el: SI) => el.id === a.item.id);
          if (index > -1) {
            Object.keys(a.item).forEach((k) => {
              ns[this.options.key][index][k] = a.item[k];
            });
          } else {
            ns[this.options.key].push(a.item);
          }
        });
      },

      [at[ActionTypes.AddOrUpdateBulk]]: (s: CompatibleState<SI>, a: AddOrUpdateBulkAction) => {
        return produce(s, (ns) => {
          a.items.forEach((item) => {
            const index = ns[this.options.key].findIndex((el: SI) => el.id === item.id);
            if (index > -1) {
              Object.keys(item).forEach((k) => {
                ns[this.options.key][index][k] = item[k];
              });
            } else {
              ns[this.options.key].push(item);
            }
          });
        });
      },

      [at[ActionTypes.Remove]]: (s: CompatibleState<SI>, a: RemoveAction) => {
        return produce(s, (ns) => {
          ns[this.options.key].splice(ns[this.options.key].findIndex((el: SI) => el.id === a.id), 1);
        });
      },

      [at[ActionTypes.RemoveBulk]]: (s: CompatibleState<SI>, a: RemoveBulkAction) => {
        return produce(s, (ns) => {
          a.ids.forEach((id) => {
            ns[this.options.key].splice(ns[this.options.key].findIndex((el: SI) => el.id === id), 1);
          });
        });
      },

      [at[ActionTypes.Reset]]: (s: CompatibleState<SI>, a: ResetAction) => {
        return produce(s, (ns) => {
          ns[this.options.key].splice(0, ns[this.options.key].length, ...a.items);
        });
      },
    };

    return (s, a) => {
      if (!handlers[a.type]) return s;
      return handlers[a.type](s, a as any);
    };
  }

  makeSelectors() {
    const selectAll: Selector<SI[]> = (s) => s[this.namespace][this.options.key];

    const selectItem: Selector<SI | null> = (s, id: ID) => {
      const r = selectAll(s).find((el) => el.id === id);
      return r || null;
    };

    const selectItems: Selector<SI[]> = (s, ids: ID[] = []) => {
      const all = selectAll(s);
      if (!ids.length) return all;
      return all.filter((el) => !!ids.find((id) => id === el.id));
    };

    return {
      selectAll,
      selectItem,
      selectItems,
    };
  }
}
