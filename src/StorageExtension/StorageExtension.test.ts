/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import * as Ext from './index';

describe("Action creators", function () {
  interface TestItem {
    id: number,
    title: string,
  }

  let namespace = 'test',
    ext = new Ext.DuckExtension<TestItem>(namespace, { key: 'test' }),
    testItem: TestItem = { id: 1, title: 'some' },
    testItem2: TestItem = { id: 2, title: 'some' };

  it('add', () => {
    expect(ext.actionCreators.add(testItem)).toEqual({
      type: ext.actionTypes.Add,
      item: testItem,
      _namespace: namespace,
    });
  });

  it('addBulk', () => {
    expect(ext.actionCreators.addBulk([testItem, testItem2])).toEqual({
      type: ext.actionTypes.AddBulk,
      items: [testItem, testItem2],
      _namespace: namespace,
    });
  });

  it('replace', () => {
    expect(ext.actionCreators.replace(testItem)).toEqual({
      type: ext.actionTypes.Replace,
      item: testItem,
      _namespace: namespace,
    });
  });

  it('replaceBulk', () => {
    expect(ext.actionCreators.replaceBulk([testItem, testItem2])).toEqual({
      type: ext.actionTypes.ReplaceBulk,
      items: [testItem, testItem2],
      _namespace: namespace,
    });
  });

  it('addOrReplace', () => {
    expect(ext.actionCreators.addOrReplace(testItem)).toEqual({
      type: ext.actionTypes.AddOrReplace,
      item: testItem,
      _namespace: namespace,
    });
  });

  it('addOrReplaceBulk', () => {
    expect(ext.actionCreators.addOrReplaceBulk([testItem, testItem2])).toEqual({
      type: ext.actionTypes.AddOrReplaceBulk,
      items: [testItem, testItem2],
      _namespace: namespace,
    });
  });

  it('update', () => {
    expect(ext.actionCreators.update(testItem)).toEqual({
      type: ext.actionTypes.Update,
      item: testItem,
      _namespace: namespace,
    });
  });

  it('updateBulk', () => {
    expect(ext.actionCreators.updateBulk([testItem, testItem2])).toEqual({
      type: ext.actionTypes.UpdateBulk,
      items: [testItem, testItem2],
      _namespace: namespace,
    });
  });

  it('addOrUpdate', () => {
    expect(ext.actionCreators.addOrUpdate(testItem)).toEqual({
      type: ext.actionTypes.AddOrUpdate,
      item: testItem,
      _namespace: namespace,
    });
  });

  it('addOrUpdateBulk', () => {
    expect(ext.actionCreators.addOrUpdateBulk([testItem, testItem2])).toEqual({
      type: ext.actionTypes.AddOrUpdateBulk,
      items: [testItem, testItem2],
      _namespace: namespace,
    });
  });

  it('remove', () => {
    expect(ext.actionCreators.remove(testItem.id)).toEqual({
      type: ext.actionTypes.Remove,
      id: testItem.id,
      _namespace: namespace,
    });
  });

  it('removeBulk', () => {
    expect(ext.actionCreators.removeBulk([testItem.id, testItem2.id])).toEqual({
      type: ext.actionTypes.RemoveBulk,
      ids: [testItem.id, testItem2.id],
      _namespace: namespace,
    });
  });
});

describe('Reducer', () => {
  interface TestItem {
    id: number,
    title: string,
  }

  let namespace = 'test',
    key = 'test',
    ext = new Ext.DuckExtension<TestItem>(namespace, { key: key }),
    testItem: TestItem = { id: 1, title: 'some' },
    testItem2: TestItem = { id: 2, title: 'some' },
    newItem1 = { id: testItem.id, title: 'new1' },
    newItem2 = { id: testItem2.id, title: 'new2' };

  it('add action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state = ext.reducer(state, ext.actionCreators.add(testItem));
    expect(state).toEqual({
      [key]: [
        testItem,
      ],
    });
  });

  it('addBulk action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state = ext.reducer(state, ext.actionCreators.addBulk([testItem, testItem2]));
    expect(state).toEqual({
      [key]: [
        testItem,
        testItem2,
      ],
    });
  });

  it('addBulk action with zero new items', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state = ext.reducer(state, ext.actionCreators.addBulk([]));
    expect(state).toEqual({
      [key]: [],
    });
  });

  it('replace action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.replace({ ...testItem2, id: testItem.id }));
    expect(state).toEqual({
      [key]: [
        { ...testItem2, id: testItem.id },
      ],
    });
  });

  it('replaceBulk action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state[key].push(testItem2);
    state = ext.reducer(state, ext.actionCreators.replaceBulk([newItem1, newItem2]));
    expect(state).toEqual({
      [key]: [
        newItem1,
        newItem2,
      ],
    });
  });

  it('addOrReplace action: add', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.addOrReplace(newItem2));
    expect(state).toEqual({
      [key]: [
        testItem,
        newItem2,
      ],
    });
  });

  it('addOrReplace action: update', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.addOrReplace(newItem1));
    expect(state).toEqual({
      [key]: [
        newItem1
      ],
    });
  });

  it('addOrReplaceBulk action: add', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.addOrReplaceBulk([newItem2]));
    expect(state).toEqual({
      [key]: [
        testItem,
        newItem2,
      ],
    });
  });

  it('addOrReplaceBulk action: update', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state[key].push(testItem2);
    state = ext.reducer(state, ext.actionCreators.addOrReplaceBulk([newItem1, newItem2]));
    expect(state).toEqual({
      [key]: [
        newItem1,
        newItem2,
      ],
    });
  });

  it('update action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.update(newItem1));
    expect(state).toEqual({
      [key]: [
        newItem1,
      ],
    });
  });

  it('updateBulk action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state[key].push(testItem2);
    state = ext.reducer(state, ext.actionCreators.updateBulk([newItem1, newItem2]));
    expect(state).toEqual({
      [key]: [
        newItem1,
        newItem2
      ],
    });
  });

  it('addOrUpdate action: add', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.addOrUpdate(newItem2));
    expect(state).toEqual({
      [key]: [
        testItem,
        newItem2,
      ],
    });
  });

  it('addOrUpdate action: update', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.addOrUpdate(newItem1));
    expect(state).toEqual({
      [key]: [
        newItem1
      ],
    });
  });

  it('addOrUpdateBulk action: add', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.addOrUpdateBulk([newItem2]));
    expect(state).toEqual({
      [key]: [
        testItem,
        newItem2,
      ],
    });
  });

  it('addOrUpdateBulk action: update', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state[key].push(testItem2);
    state = ext.reducer(state, ext.actionCreators.addOrUpdateBulk([newItem1, newItem2]));
    expect(state).toEqual({
      [key]: [
        newItem1,
        newItem2,
      ],
    });
  });

  it('remove action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.remove(testItem.id));
    expect(state).toEqual({
      [key]: [],
    });
  });

  it('removeBulk action', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state[key].push(testItem2);
    state = ext.reducer(state, ext.actionCreators.removeBulk([testItem.id, testItem2.id]));
    expect(state).toEqual({
      [key]: [],
    });
  });


  it('reset action: to zero items', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state[key].push(testItem2);
    state = ext.reducer(state, ext.actionCreators.reset([]));
    expect(state).toEqual({
      [key]: [],
    });
  });

  it('reset action: to new items', () => {
    let state = {
      ...ext.getInitialState(),
    };
    state[key].push(testItem);
    state = ext.reducer(state, ext.actionCreators.reset([testItem2, newItem1, newItem2]));
    expect(state).toEqual({
      [key]: [
        testItem2, newItem1, newItem2
      ],
    });
  });
});

describe('Selectors', () => {
  interface TestItem {
    id: number,
    title: string,
  }

  let namespace = 'test',
    key = 'test',
    ext = new Ext.DuckExtension<TestItem>(namespace, { key: key }),
    testItem: TestItem = { id: 1, title: 'some' },
    testItem2: TestItem = { id: 2, title: 'some' },
    rootState = {
      [namespace]: {
        [key]: [
          testItem,
          testItem2,
        ],
      }
    };

  it('selectAll', () => {
    expect(ext.selectors.selectAll(rootState)).toEqual([testItem, testItem2]);
  });

  it('selectItem', () => {
    expect(ext.selectors.selectItem(rootState, 1)).toEqual(testItem);
  });

  it('selectItem: item is not exist', () => {
    expect(ext.selectors.selectItem(rootState, 10)).toEqual(null);
  });

  it('selectItems: all items', () => {
    expect(ext.selectors.selectItems(rootState, [])).toEqual([testItem, testItem2]);
  });

  it('selectItems: item by id', () => {
    expect(ext.selectors.selectItems(rootState, [1])).toEqual([testItem]);
  });

  it('selectItems: item by id - item is not exist', () => {
    expect(ext.selectors.selectItems(rootState, [10])).toEqual([]);
  });
});

describe('Other', () => {
  interface TestItem {
    id: number,
    title: string,
  }

  let namespace = 'test',
    key = 'test',
    ext = new Ext.DuckExtension<TestItem>(namespace, { key: key });

  it('getInitialState', () => {
    expect(ext.getInitialState()).toEqual({
      [key]: [],
    });
  });
});
