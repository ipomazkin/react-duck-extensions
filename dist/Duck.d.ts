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
export declare abstract class Duck<S, AT, A extends Action, OP extends DuckOptions> {
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
    constructor(namespace: string, options: OP);
    /**
     * Use it for injecting some initial state fields
     */
    getInitialState(): S;
}
