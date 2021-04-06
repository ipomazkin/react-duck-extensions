/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Generator } from "../../libs/Generator";

/**
 * Operation unique id. Can be connected to some data item id
 */
export type ID = string | number;

/**
 * CacheID is using to decide whether to run operation again or not
 */
export type CacheID = string | number | null;

/**
 * Operation type. Use for grouping operations for one handler.
 * For example: "read" for all read operations, "readNews" for all read news operations, etc.
 */
export type Type = string;

/**
 * Just a status
 */
export enum Status {
  Initial,
  Running,
  Succeed,
  Failed
}

/**
 * Progress contains total points and done points to show progress of operation.
 * Useful for: preloading of images, pipeline files uploading, etc.
 */
export interface Progress {
  total: number,
  done: number,
}

/**
 * Result
 */
export type Result = any | null;

/**
 * Array of errors messages
 */
export type Errors = string[];

/**
 * Parameters object that will be passed to the operation handler
 */
export type Params = {[p: string]: any};

/**
 * The main entity of this extension
 */
export interface Operation {
  id: ID;
  cacheID: CacheID;
  type: Type;
  status: Status,
  errors: Errors,
  params: Params,
  result: Result,
  progress: Progress,
}

/**
 * Operation handler interface
 */
export interface Handler {
  (id: ID, params: Params, ...args: any): Generator<any, Result, any>;
}

/**
 * Default operation id
 */
export const DEFAULT_OPERATION_ID = 'main';

/**
 * Creates and operation with initial values
 * @param type
 * @param id
 */
export function createOperation(type: Type, id: ID = DEFAULT_OPERATION_ID): Operation {
  return {
    id,
    cacheID: null,
    type,
    status: Status.Initial,
    errors: [],
    result: null,
    params: {},
    progress: {
      total: 0,
      done: 0,
    },
  };
}
