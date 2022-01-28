"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partial = exports.Record = exports.InternalRecord = void 0;
var runtype_1 = require("../runtype");
var util_1 = require("../util");
/**
 * Construct a record runtype from runtypes for its values.
 */
function InternalRecord(fields, isPartial, isReadonly) {
    var self = { tag: 'record', isPartial: isPartial, isReadonly: isReadonly, fields: fields };
    return withExtraModifierFuncs(runtype_1.create(function (x, visited) {
        if (x === null || x === undefined) {
            return util_1.FAILURE.TYPE_INCORRECT(self, x);
        }
        var keysOfFields = util_1.enumerableKeysOf(fields);
        if (keysOfFields.length !== 0 && typeof x !== 'object')
            return util_1.FAILURE.TYPE_INCORRECT(self, x);
        var keys = __spreadArray([], __read(new Set(__spreadArray(__spreadArray([], __read(keysOfFields)), __read(util_1.enumerableKeysOf(x))))));
        var results = keys.reduce(function (results, key) {
            var fieldsHasKey = util_1.hasKey(key, fields);
            var xHasKey = util_1.hasKey(key, x);
            if (fieldsHasKey) {
                var runtype = fields[key];
                var isOptional = isPartial || runtype.reflect.tag === 'optional';
                if (xHasKey) {
                    var value = x[key];
                    if (isOptional && value === undefined)
                        results[key] = util_1.SUCCESS(value);
                    else
                        results[key] = runtype_1.innerValidate(runtype, value, visited);
                }
                else {
                    if (!isOptional)
                        results[key] = util_1.FAILURE.PROPERTY_MISSING(runtype.reflect);
                    else
                        results[key] = util_1.SUCCESS(undefined);
                }
            }
            else if (xHasKey) {
                // TODO: exact record validation
                var value = x[key];
                results[key] = util_1.SUCCESS(value);
            }
            else {
                /* istanbul ignore next */
                throw new Error('impossible');
            }
            return results;
        }, {});
        var details = keys.reduce(function (details, key) {
            var result = results[key];
            if (!result.success)
                details[key] = result.details || result.message;
            return details;
        }, {});
        if (util_1.enumerableKeysOf(details).length !== 0)
            return util_1.FAILURE.CONTENT_INCORRECT(self, details);
        else
            return util_1.SUCCESS(x);
    }, self));
}
exports.InternalRecord = InternalRecord;
function Record(fields) {
    return InternalRecord(fields, false, false);
}
exports.Record = Record;
function Partial(fields) {
    return InternalRecord(fields, true, false);
}
exports.Partial = Partial;
function withExtraModifierFuncs(A) {
    A.asPartial = asPartial;
    A.asReadonly = asReadonly;
    A.pick = pick;
    A.omit = omit;
    A.extend = extend;
    return A;
    function asPartial() {
        return InternalRecord(A.fields, true, A.isReadonly);
    }
    function asReadonly() {
        return InternalRecord(A.fields, A.isPartial, true);
    }
    function pick() {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var result = {};
        keys.forEach(function (key) {
            result[key] = A.fields[key];
        });
        return InternalRecord(result, A.isPartial, A.isReadonly);
    }
    function omit() {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var result = {};
        var existingKeys = util_1.enumerableKeysOf(A.fields);
        existingKeys.forEach(function (key) {
            if (!keys.includes(key))
                result[key] = A.fields[key];
        });
        return InternalRecord(result, A.isPartial, A.isReadonly);
    }
    function extend(fields) {
        return InternalRecord(Object.assign({}, A.fields, fields), A.isPartial, A.isReadonly);
    }
}
