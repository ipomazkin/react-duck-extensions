/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/** *************************************************************************
 * It's an example duck
 ************************************************************************** */
import { Action } from '../core/reduxStack';
import * as StateExtension from './StateExtension';

const NAMESPACE = 'reducerNamespace';

const stateExt = new StateExtension.StateExtensionBuilder(NAMESPACE).make();

interface State {
  isOpen: boolean;
}

const initialState: State = {
  isOpen: false,
  ...stateExt.getInitialState(),
};

export default function reducer(s = initialState, a: Action): State {
  switch (a.type) {
    case 'ANY':
      // do sonwthing
      return s;
    default:
      // extend reducer here
      /* eslint no-case-declarations: 0 */
      const extended = stateExt.reducer(s, a as StateExtension.ExtAction);
      return extended as State;
  }
}

// inject sagas
export const sagas = [...stateExt.sagas];

// export action creators
export const { set } = stateExt.actionCreators;

export const { selectField } = stateExt.selectors;
