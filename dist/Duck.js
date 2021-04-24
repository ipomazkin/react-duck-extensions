/*
 * react-duck-extensions
 * Copyright (C) 2021 Ilya Pomazkin <ipomazkin.dev@pm.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DuckStack = void 0;
    /**
     * Abstract duck class. Use for inheritance or duck extensions
     */
    var Duck = /** @class */ (function () {
        function Duck(namespace, options) {
            this.namespace = namespace;
            this.options = options;
            this.actionTypes = {};
            this.actionCreators = {};
            this.reducer = function (s, a) { return s; };
            this.sagas = [];
            this.selectors = {};
        }
        /**
         * Use it for injecting some initial state fields
         */
        Duck.prototype.getInitialState = function () {
            return {};
        };
        return Duck;
    }());
    exports.DuckStack = Duck;
});
