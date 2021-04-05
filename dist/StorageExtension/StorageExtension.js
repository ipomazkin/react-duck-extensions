/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "immer", "../Duck"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DuckExtension = exports.ActionTypes = void 0;
    /**
     * @module StorageExtension
     * @description Storage extension duck. Useful for storing a "model's" data
     * @version 1.0.0
     */
    var immer_1 = require("immer");
    var Duck_1 = require("../Duck");
    /** *************************************************************************
     * Action types
     ************************************************************************** */
    var ActionTypes;
    (function (ActionTypes) {
        ActionTypes["Add"] = "add";
        ActionTypes["AddBulk"] = "addBulk";
        ActionTypes["Replace"] = "replace";
        ActionTypes["ReplaceBulk"] = "replaceBulk";
        ActionTypes["AddOrReplace"] = "addOrReplace";
        ActionTypes["AddOrReplaceBulk"] = "addOrReplaceBulk";
        ActionTypes["Update"] = "update";
        ActionTypes["UpdateBulk"] = "updateBulk";
        ActionTypes["AddOrUpdate"] = "addOrUpdate";
        ActionTypes["AddOrUpdateBulk"] = "addOrUpdateBulk";
        ActionTypes["Remove"] = "remove";
        ActionTypes["RemoveBulk"] = "removeBulk";
        ActionTypes["Reset"] = "reset";
    })(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
    /** *************************************************************************
     * Extension class
     ************************************************************************** */
    var DuckExtension = /** @class */ (function (_super) {
        __extends(DuckExtension, _super);
        function DuckExtension(namespace, options) {
            var _this = _super.call(this, namespace, options) || this;
            _this.options = options;
            _this.actionTypes = ActionTypes;
            /** *************************************************************************
             * Action creators
             ************************************************************************** */
            var add = function (item) {
                return {
                    type: ActionTypes.Add,
                    _namespace: namespace,
                    item: item,
                };
            };
            var addBulk = function (items) {
                return {
                    type: ActionTypes.AddBulk,
                    _namespace: namespace,
                    items: items,
                };
            };
            var replace = function (item) {
                return {
                    type: ActionTypes.Replace,
                    _namespace: namespace,
                    item: item,
                };
            };
            var replaceBulk = function (items) {
                return {
                    type: ActionTypes.ReplaceBulk,
                    _namespace: namespace,
                    items: items,
                };
            };
            var addOrReplace = function (item) {
                return {
                    type: ActionTypes.AddOrReplace,
                    _namespace: namespace,
                    item: item,
                };
            };
            var addOrReplaceBulk = function (items) {
                return {
                    type: ActionTypes.AddOrReplaceBulk,
                    _namespace: namespace,
                    items: items,
                };
            };
            var update = function (item) {
                return {
                    type: ActionTypes.Update,
                    _namespace: namespace,
                    item: item,
                };
            };
            var updateBulk = function (items) {
                return {
                    type: ActionTypes.UpdateBulk,
                    _namespace: namespace,
                    items: items,
                };
            };
            var addOrUpdate = function (item) {
                return {
                    type: ActionTypes.AddOrUpdate,
                    _namespace: namespace,
                    item: item,
                };
            };
            var addOrUpdateBulk = function (items) {
                return {
                    type: ActionTypes.AddOrUpdateBulk,
                    _namespace: namespace,
                    items: items,
                };
            };
            var remove = function (id) {
                return {
                    type: ActionTypes.Remove,
                    _namespace: namespace,
                    id: id,
                };
            };
            var removeBulk = function (ids) {
                return {
                    type: ActionTypes.RemoveBulk,
                    _namespace: namespace,
                    ids: ids,
                };
            };
            var reset = function (items) {
                return {
                    type: ActionTypes.Reset,
                    _namespace: namespace,
                    items: items,
                };
            };
            _this.actionCreators = {
                add: add,
                addBulk: addBulk,
                replace: replace,
                replaceBulk: replaceBulk,
                addOrReplace: addOrReplace,
                addOrReplaceBulk: addOrReplaceBulk,
                update: update,
                updateBulk: updateBulk,
                addOrUpdate: addOrUpdate,
                addOrUpdateBulk: addOrUpdateBulk,
                remove: remove,
                removeBulk: removeBulk,
                reset: reset,
            };
            /** *************************************************************************
             * Reducer
             ************************************************************************** */
            _this.reducer = function (s, a) {
                if (a._namespace !== namespace)
                    return s;
                switch (a.type) {
                    case ActionTypes.Add:
                        return immer_1.produce(s, function (ns) {
                            ns[options.key].push(a.item);
                        });
                    case ActionTypes.AddBulk:
                        return immer_1.produce(s, function (ns) {
                            a.items.forEach(function (item) {
                                ns[options.key].push(item);
                            });
                        });
                    case ActionTypes.Replace:
                        return immer_1.produce(s, function (ns) {
                            var index = ns[options.key].findIndex(function (el) { return el.id === a.item.id; });
                            if (index > -1)
                                ns[options.key][index] = a.item;
                        });
                    case ActionTypes.ReplaceBulk:
                        return immer_1.produce(s, function (ns) {
                            if (!a.items.length) {
                                ns[options.key] = a.items;
                            }
                            else {
                                a.items.forEach(function (item) {
                                    var index = ns[options.key].findIndex(function (el) { return el.id === item.id; });
                                    if (index > -1)
                                        ns[options.key][index] = item;
                                });
                            }
                        });
                    case ActionTypes.AddOrReplace:
                        return immer_1.produce(s, function (ns) {
                            var index = ns[options.key].findIndex(function (el) { return el.id === a.item.id; });
                            if (index > -1) {
                                ns[options.key][index] = a.item;
                            }
                            else {
                                ns[options.key].push(a.item);
                            }
                        });
                    case ActionTypes.AddOrReplaceBulk:
                        return immer_1.produce(s, function (ns) {
                            a.items.forEach(function (item) {
                                var index = ns[options.key].findIndex(function (el) { return el.id === item.id; });
                                if (index > -1) {
                                    ns[options.key][index] = item;
                                }
                                else {
                                    ns[options.key].push(item);
                                }
                            });
                        });
                    case ActionTypes.Update:
                        return immer_1.produce(s, function (ns) {
                            var index = ns[options.key].findIndex(function (el) { return el.id === a.item.id; });
                            if (index > -1) {
                                Object.keys(a.item).forEach(function (k) {
                                    ns[options.key][index][k] = a.item[k];
                                });
                            }
                        });
                    case ActionTypes.UpdateBulk:
                        return immer_1.produce(s, function (ns) {
                            a.items.forEach(function (item) {
                                var index = ns[options.key].findIndex(function (el) {
                                    return el.id === item.id;
                                });
                                if (index > -1) {
                                    Object.keys(item).forEach(function (k) {
                                        ns[options.key][index][k] = item[k];
                                    });
                                }
                            });
                        });
                    case ActionTypes.AddOrUpdate:
                        return immer_1.produce(s, function (ns) {
                            var index = ns[options.key].findIndex(function (el) { return el.id === a.item.id; });
                            if (index > -1) {
                                Object.keys(a.item).forEach(function (k) {
                                    ns[options.key][index][k] = a.item[k];
                                });
                            }
                            else {
                                ns[options.key].push(a.item);
                            }
                        });
                    case ActionTypes.AddOrUpdateBulk:
                        return immer_1.produce(s, function (ns) {
                            a.items.forEach(function (item) {
                                var index = ns[options.key].findIndex(function (el) { return el.id === item.id; });
                                if (index > -1) {
                                    Object.keys(item).forEach(function (k) {
                                        ns[options.key][index][k] = item[k];
                                    });
                                }
                                else {
                                    ns[options.key].push(item);
                                }
                            });
                        });
                    case ActionTypes.Remove:
                        return immer_1.produce(s, function (ns) {
                            ns[options.key].splice(ns[options.key].findIndex(function (el) { return el.id === a.id; }), 1);
                        });
                    case ActionTypes.RemoveBulk:
                        return immer_1.produce(s, function (ns) {
                            a.ids.forEach(function (id) {
                                ns[options.key].splice(ns[options.key].findIndex(function (el) { return el.id === id; }), 1);
                            });
                        });
                    case ActionTypes.Reset:
                        return immer_1.produce(s, function (ns) {
                            var _a;
                            (_a = ns[options.key]).splice.apply(_a, __spreadArray([0, ns[options.key].length], a.items));
                        });
                    default:
                        return s;
                }
            };
            /** *************************************************************************
             * Selectors
             ************************************************************************** */
            var selectAll = function (s) { return s[namespace][options.key]; };
            var selectItem = function (s, id) {
                var r = selectAll(s).find(function (el) { return el.id === id; });
                return r || null;
            };
            var selectItems = function (s, ids) {
                if (ids === void 0) { ids = []; }
                var all = selectAll(s);
                if (!ids.length)
                    return all;
                return all.filter(function (el) { return !!ids.find(function (id) { return id === el.id; }); });
            };
            _this.selectors = {
                selectAll: selectAll,
                selectItem: selectItem,
                selectItems: selectItems,
            };
            /** *************************************************************************
             * Sagas
             ************************************************************************** */
            _this.sagas = [];
            return _this;
        }
        /**
         * Add a field to reducer state object
         */
        DuckExtension.prototype.getInitialState = function () {
            var _a;
            return _a = {},
                _a[this.options.key] = [],
                _a;
        };
        return DuckExtension;
    }(Duck_1.Duck));
    exports.DuckExtension = DuckExtension;
});
