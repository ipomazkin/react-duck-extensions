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
import { Action } from '../reduxStack';
import * as StorageExt from './index';

const NAMESPACE = 'reducerNamespace';
const NEWS_STORAGE_NAMESPACE = `${NAMESPACE}/news`;

interface NewsItem {
  id: number;
  title: string;
  content: string | null;
}

const newsStorageExt = new StorageExt.DuckExtension<NewsItem>(NEWS_STORAGE_NAMESPACE, { key: 'news' });

interface State {}

const initialState: State = {
  ...newsStorageExt.getInitialState(),
};

export default function reducer(s = initialState, a: Action): State {
  switch (a.type) {
    case 'ANY':
      // do something
      return s;
    default:
      // extend reducer here
      /* eslint no-case-declarations: 0 */
      const extended = newsStorageExt.reducer(s, a as StorageExt.ExtAction);
      return extended as State;
  }
}

// inject sagas
export const sagas = [...newsStorageExt.sagas];

// export action creators
export const { add: addNews, remove: removeNews, update: updateNews } = newsStorageExt.actionCreators;

// export selectors
export const { selectItem: selectNewsItem, selectItems: selectNewsList } = newsStorageExt.selectors;
