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
export declare type Action = redux.AnyAction;
/**
 * Redux action with an extra identifier - namespace. Useful for ducks extensions
 */
export interface ActionNamespaced extends Action {
    _namespace: string;
}
/**
 * Usual action create
 */
export declare type ActionCreator<A> = redux.ActionCreator<A>;
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
export declare type SagaEffect = Effect;
