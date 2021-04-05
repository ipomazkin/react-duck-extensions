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

import { produce } from 'immer';
import { Duck, DuckOptions } from '../Duck';
import { ActionNamespaced, RootState, Selector } from '../reduxStack';

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
export interface AddAction extends ActionNamespaced {
  type: ActionTypes.Add;
  item: StorableItem;
}

export interface AddBulkAction extends ActionNamespaced {
  type: ActionTypes.AddBulk;
  items: StorableItem[];
}

export interface ReplaceAction extends ActionNamespaced {
  type: ActionTypes.Replace;
  item: StorableItem;
}

export interface ReplaceBulkAction extends ActionNamespaced {
  type: ActionTypes.ReplaceBulk;
  items: StorableItem[];
}

export interface AddOrReplaceAction extends ActionNamespaced {
  type: ActionTypes.AddOrReplace;
  item: StorableItem;
}

export interface AddOrReplaceBulkAction extends ActionNamespaced {
  type: ActionTypes.AddOrReplaceBulk;
  items: StorableItem[];
}

export interface UpdateAction extends ActionNamespaced {
  type: ActionTypes.Update;
  item: StorableItem;
}

export interface UpdateBulkAction extends ActionNamespaced {
  type: ActionTypes.UpdateBulk;
  items: StorableItem[];
}

export interface AddOrUpdateAction extends ActionNamespaced {
  type: ActionTypes.AddOrUpdate;
  item: StorableItem;
}

export interface AddOrUpdateBulkAction extends ActionNamespaced {
  type: ActionTypes.AddOrUpdateBulk;
  items: StorableItem[];
}

export interface RemoveAction extends ActionNamespaced {
  type: ActionTypes.Remove;
  id: ID;
}

export interface RemoveBulkAction extends ActionNamespaced {
  type: ActionTypes.RemoveBulk;
  ids: ID[];
}

export interface ResetAction extends ActionNamespaced {
  type: ActionTypes.Reset;
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
interface DuckExtensionOptions extends DuckOptions {
  /**
   * The key of storage's object in reducer's state object
   */
  key: string;
}

/** *************************************************************************
 * Extension class
 ************************************************************************** */
export class DuckExtension<SI extends StorableItem> extends Duck<
  CompatibleState<SI>,
  typeof ActionTypes,
  ExtAction,
  DuckExtensionOptions
> {
  /**
   * Add a field to reducer state object
   */
  getInitialState(): CompatibleState<SI> {
    return {
      [this.options.key]: [] as SI[],
    };
  }

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
    selectAll: (s: RootState) => SI[];

    /**
     * Selects item by ID
     * @param s
     * @param id
     */
    selectItem: (s: RootState, id: ID) => SI | null;

    /**
     * Selects items by their IDs. If ids is empty - returns all items.
     * @param s
     * @param ids
     */
    selectItems: (s: RootState, ids: ID[]) => SI[];
  };

  constructor(namespace: string, options: DuckExtensionOptions) {
    super(namespace, options);

    this.options = options;

    this.actionTypes = ActionTypes;

    /** *************************************************************************
     * Action creators
     ************************************************************************** */
    const add = function (item: SI): AddAction {
      return {
        type: ActionTypes.Add,
        _namespace: namespace,
        item,
      };
    };

    const addBulk = function (items: SI[]): AddBulkAction {
      return {
        type: ActionTypes.AddBulk,
        _namespace: namespace,
        items,
      };
    };

    const replace = function (item: SI): ReplaceAction {
      return {
        type: ActionTypes.Replace,
        _namespace: namespace,
        item,
      };
    };

    const replaceBulk = function (items: SI[]): ReplaceBulkAction {
      return {
        type: ActionTypes.ReplaceBulk,
        _namespace: namespace,
        items,
      };
    };

    const addOrReplace = function (item: SI): AddOrReplaceAction {
      return {
        type: ActionTypes.AddOrReplace,
        _namespace: namespace,
        item,
      };
    };

    const addOrReplaceBulk = function (items: SI[]): AddOrReplaceBulkAction {
      return {
        type: ActionTypes.AddOrReplaceBulk,
        _namespace: namespace,
        items,
      };
    };

    const update = function (item: SI): UpdateAction {
      return {
        type: ActionTypes.Update,
        _namespace: namespace,
        item,
      };
    };

    const updateBulk = function (items: SI[]): UpdateBulkAction {
      return {
        type: ActionTypes.UpdateBulk,
        _namespace: namespace,
        items,
      };
    };

    const addOrUpdate = function (item: SI): AddOrUpdateAction {
      return {
        type: ActionTypes.AddOrUpdate,
        _namespace: namespace,
        item,
      };
    };

    const addOrUpdateBulk = function (items: SI[]): AddOrUpdateBulkAction {
      return {
        type: ActionTypes.AddOrUpdateBulk,
        _namespace: namespace,
        items,
      };
    };

    const remove = function (id: ID): RemoveAction {
      return {
        type: ActionTypes.Remove,
        _namespace: namespace,
        id,
      };
    };

    const removeBulk = function (ids: ID[]): RemoveBulkAction {
      return {
        type: ActionTypes.RemoveBulk,
        _namespace: namespace,
        ids,
      };
    };

    const reset = function (items: StorableItem[]): ResetAction {
      return {
        type: ActionTypes.Reset,
        _namespace: namespace,
        items,
      };
    };

    this.actionCreators = {
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

    /** *************************************************************************
     * Reducer
     ************************************************************************** */
    this.reducer = (s, a): CompatibleState<SI> => {
      if (a._namespace !== namespace) return s;

      switch (a.type) {
        case ActionTypes.Add:
          return produce(s, (ns) => {
            ns[options.key].push(a.item);
          });

        case ActionTypes.AddBulk:
          return produce(s, (ns) => {
            a.items.forEach((item) => {
              ns[options.key].push(item);
            });
          });

        case ActionTypes.Replace:
          return produce(s, (ns) => {
            const index = ns[options.key].findIndex((el: SI) => el.id === a.item.id);
            if (index > -1) ns[options.key][index] = a.item;
          });

        case ActionTypes.ReplaceBulk:
          return produce(s, (ns) => {
            if (!a.items.length) {
              ns[options.key] = a.items;
            } else {
              a.items.forEach((item) => {
                const index = ns[options.key].findIndex((el: SI) => el.id === item.id);
                if (index > -1) ns[options.key][index] = item;
              });
            }
          });

        case ActionTypes.AddOrReplace:
          return produce(s, (ns) => {
            const index = ns[options.key].findIndex((el: SI) => el.id === a.item.id);
            if (index > -1) {
              ns[options.key][index] = a.item;
            } else {
              ns[options.key].push(a.item);
            }
          });

        case ActionTypes.AddOrReplaceBulk:
          return produce(s, (ns) => {
            a.items.forEach((item) => {
              const index = ns[options.key].findIndex((el: SI) => el.id === item.id);
              if (index > -1) {
                ns[options.key][index] = item;
              } else {
                ns[options.key].push(item);
              }
            });
          });

        case ActionTypes.Update:
          return produce(s, (ns) => {
            const index = ns[options.key].findIndex((el: SI) => el.id === a.item.id);
            if (index > -1) {
              Object.keys(a.item).forEach((k) => {
                ns[options.key][index][k] = a.item[k];
              });
            }
          });

        case ActionTypes.UpdateBulk:
          return produce(s, (ns) => {
            a.items.forEach((item) => {
              const index = ns[options.key].findIndex((el: SI) => {
                return el.id === item.id;
              });
              if (index > -1) {
                Object.keys(item).forEach((k) => {
                  ns[options.key][index][k] = item[k];
                });
              }
            });
          });

        case ActionTypes.AddOrUpdate:
          return produce(s, (ns) => {
            const index = ns[options.key].findIndex((el: SI) => el.id === a.item.id);
            if (index > -1) {
              Object.keys(a.item).forEach((k) => {
                ns[options.key][index][k] = a.item[k];
              });
            } else {
              ns[options.key].push(a.item);
            }
          });

        case ActionTypes.AddOrUpdateBulk:
          return produce(s, (ns) => {
            a.items.forEach((item) => {
              const index = ns[options.key].findIndex((el: SI) => el.id === item.id);
              if (index > -1) {
                Object.keys(item).forEach((k) => {
                  ns[options.key][index][k] = item[k];
                });
              } else {
                ns[options.key].push(item);
              }
            });
          });

        case ActionTypes.Remove:
          return produce(s, (ns) => {
            ns[options.key].splice(ns[options.key].findIndex((el: SI) => el.id === a.id), 1);
          });

        case ActionTypes.RemoveBulk:
          return produce(s, (ns) => {
            a.ids.forEach((id) => {
              ns[options.key].splice(ns[options.key].findIndex((el: SI) => el.id === id), 1);
            });
          });

        case ActionTypes.Reset:
          return produce(s, (ns) => {
            ns[options.key].splice(0, ns[options.key].length, ...a.items);
          });

        default:
          return s;
      }
    };

    /** *************************************************************************
     * Selectors
     ************************************************************************** */
    const selectAll: Selector<SI[]> = (s) => s[namespace][options.key];

    const selectItem: Selector<SI | null> = (s, id: ID) => {
      const r = selectAll(s).find((el) => el.id === id);
      return r || null;
    };

    const selectItems: Selector<SI[]> = (s, ids: ID[] = []) => {
      const all = selectAll(s);
      if (!ids.length) return all;
      return all.filter((el) => !!ids.find((id) => id === el.id));
    };

    this.selectors = {
      selectAll,
      selectItem,
      selectItems,
    };

    /** *************************************************************************
     * Sagas
     ************************************************************************** */
    this.sagas = [];
  }
}
