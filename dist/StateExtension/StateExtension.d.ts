import { Duck } from '../Duck';
import { ActionNamespaced, RootState } from '../reduxStack';
export interface CompatibleState {
    [p: string]: any;
}
/** *************************************************************************
 * Action types
 ************************************************************************** */
export declare enum ActionTypes {
    Set = "set"
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
export declare type ExtAction = SetAction;
/** *************************************************************************
 * Extension class
 ************************************************************************** */
export declare class DuckExtension extends Duck<CompatibleState, typeof ActionTypes, ExtAction, any> {
    actionCreators: {
        /**
         * Sets fields in the reducer state
         * @param values - object with new fields
         */
        set: (values: {
            [p: string]: any;
        }) => SetAction;
    };
    selectors: {
        /**
         * Selects field from the reducer state
         * @param s - root state
         * @param k - field key
         */
        selectField: (s: RootState, k: string) => any | undefined;
    };
    constructor(namespace: string, options?: any);
}
