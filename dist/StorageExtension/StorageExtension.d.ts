import { Duck, DuckOptions } from '../Duck';
import { ActionNamespaced, RootState } from '../reduxStack';
export interface CompatibleState<SI> {
    [p: string]: SI | any;
}
/** *************************************************************************
 * Util types
 ************************************************************************** */
declare type ID = string | number;
interface StorableItem {
    id: ID;
    [p: string]: any;
}
/** *************************************************************************
 * Action types
 ************************************************************************** */
export declare enum ActionTypes {
    Add = "add",
    AddBulk = "addBulk",
    Replace = "replace",
    ReplaceBulk = "replaceBulk",
    AddOrReplace = "addOrReplace",
    AddOrReplaceBulk = "addOrReplaceBulk",
    Update = "update",
    UpdateBulk = "updateBulk",
    AddOrUpdate = "addOrUpdate",
    AddOrUpdateBulk = "addOrUpdateBulk",
    Remove = "remove",
    RemoveBulk = "removeBulk",
    Reset = "reset"
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
export declare type ExtAction = AddAction | AddBulkAction | ReplaceAction | ReplaceBulkAction | AddOrReplaceAction | AddOrReplaceBulkAction | UpdateAction | UpdateBulkAction | AddOrUpdateAction | AddOrUpdateBulkAction | RemoveAction | RemoveBulkAction | ResetAction;
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
export declare class DuckExtension<SI extends StorableItem> extends Duck<CompatibleState<SI>, typeof ActionTypes, ExtAction, DuckExtensionOptions> {
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
    constructor(namespace: string, options: DuckExtensionOptions);
}
export {};
