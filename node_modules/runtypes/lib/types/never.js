"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Never = void 0;
var runtype_1 = require("../runtype");
var util_1 = require("../util");
var self = { tag: 'never' };
/**
 * Validates nothing (unknown fails).
 */
exports.Never = runtype_1.create(util_1.FAILURE.NOTHING_EXPECTED, self);
