"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function = void 0;
var runtype_1 = require("../runtype");
var util_1 = require("../util");
var self = { tag: 'function' };
/**
 * Construct a runtype for functions.
 */
exports.Function = runtype_1.create(function (value) { return (typeof value === 'function' ? util_1.SUCCESS(value) : util_1.FAILURE.TYPE_INCORRECT(self, value)); }, self);
