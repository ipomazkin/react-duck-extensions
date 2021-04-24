/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import * as Ext from "./StateExtension";

describe("Action creators", () => {
  let namespace = 'test',
    ext = new Ext.StateExtensionBuilder(namespace).make();

  it('set: one field', () => {
    expect(ext.actionCreators.set({
      some: 1,
    })).toEqual({
      type: ext.actionTypes[Ext.ActionTypes.Set],
      values: {
        some: 1,
      },
    })
  });

  it('set: many field', () => {
    expect(ext.actionCreators.set({
      some: 1,
      foo: 2,
      bar: 3,
    })).toEqual({
      type: ext.actionTypes[Ext.ActionTypes.Set],
      values: {
        some: 1,
        foo: 2,
        bar: 3,
      },
    })
  });

  it('set: zero fields', () => {
    expect(ext.actionCreators.set({})).toEqual({
      type: ext.actionTypes[Ext.ActionTypes.Set],
      values: {},
    })
  });
});


describe('Reducer', () => {
  let namespace = 'test',
    ext = new Ext.StateExtensionBuilder(namespace).make();

  it('set action: one field', () => {
    let state: Ext.CompatibleState = {
      ...ext.getInitialState(),
      one: true,
      two: true,
    };
    state = ext.reducer(state, ext.actionCreators.set({ one: false, }));
    expect(state).toEqual({
      one: false,
      two: true,
    });
  });

  it('set action: many fields', () => {
    let state: Ext.CompatibleState = {
      ...ext.getInitialState(),
      one: true,
      two: true,
    };
    state = ext.reducer(state, ext.actionCreators.set({ one: false, two: false }));
    expect(state).toEqual({
      one: false,
      two: false,
    });
  });

  it('set action: zero fields', () => {
    let state: Ext.CompatibleState = {
      ...ext.getInitialState(),
      one: true,
      two: true,
    };
    state = ext.reducer(state, ext.actionCreators.set({}));
    expect(state).toEqual({
      one: true,
      two: true,
    });
  });

  it('set action: add new field', () => {
    let state: Ext.CompatibleState = {
      ...ext.getInitialState(),
      one: true,
      two: true,
    };
    state = ext.reducer(state, ext.actionCreators.set({ three: true }));
    expect(state).toEqual({
      one: true,
      two: true,
      three: true,
    });
  });
});

describe('Selectors', () => {
  let namespace = 'test',
    ext = new Ext.StateExtensionBuilder(namespace).make(),
    rootState = {
      [namespace]: {
        one: true,
        two: true,
        three: true,
      }
    };

  it('select field', () => {
    expect(ext.selectors.selectField(rootState, 'one')).toEqual(true);
  });

  it('select undefined field', () => {
    expect(ext.selectors.selectField(rootState, 'four')).toEqual(undefined);
  });
});
