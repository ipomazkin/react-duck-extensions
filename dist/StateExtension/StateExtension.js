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
     * @module StateExtension
     * @description State extension duck.
     * @version 1.0.1
     */
    var immer_1 = require("immer");
    var Duck_1 = require("../Duck");
    /** *************************************************************************
     * Action types
     ************************************************************************** */
    var ActionTypes;
    (function (ActionTypes) {
        ActionTypes["Set"] = "set";
    })(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
    /** *************************************************************************
     * Extension class
     ************************************************************************** */
    var DuckExtension = /** @class */ (function (_super) {
        __extends(DuckExtension, _super);
        function DuckExtension(namespace, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, namespace, options) || this;
            _this.actionTypes = ActionTypes;
            /** *************************************************************************
             * Action creators
             ************************************************************************** */
            var set = function (values) {
                return {
                    type: ActionTypes.Set,
                    values: values,
                    _namespace: namespace,
                };
            };
            _this.actionCreators = {
                set: set,
            };
            /** *************************************************************************
             * Reducer
             ************************************************************************** */
            _this.reducer = function (s, a) {
                if (a._namespace !== namespace)
                    return s;
                switch (a.type) {
                    case ActionTypes.Set:
                        return immer_1.produce(s, function (ns) {
                            Object.keys(a.values).forEach(function (key) {
                                ns[key] = a.values[key];
                            });
                        });
                    default:
                        return s;
                }
            };
            /** *************************************************************************
             * Selectors
             ************************************************************************** */
            var selectField = function (s, k) { return s[namespace][k]; };
            _this.selectors = {
                selectField: selectField,
            };
            /** *************************************************************************
             * Sagas
             ************************************************************************** */
            _this.sagas = [];
            return _this;
        }
        return DuckExtension;
    }(Duck_1.Duck));
    exports.DuckExtension = DuckExtension;
});
