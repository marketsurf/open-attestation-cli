"use strict";
// Type guard to determine if an object has a given key
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAILURE = exports.SUCCESS = exports.enumerableKeysOf = exports.typeOf = exports.hasKey = void 0;
var result_1 = require("./result");
var show_1 = require("./show");
// If this feature gets implemented, we can use `in` instead: https://github.com/Microsoft/TypeScript/issues/10485
function hasKey(key, object) {
    return typeof object === 'object' && object !== null && key in object;
}
exports.hasKey = hasKey;
var typeOf = function (value) {
    var _a, _b, _c;
    return typeof value === 'object'
        ? value === null
            ? 'null'
            : Array.isArray(value)
                ? 'array'
                : ((_a = value.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Object'
                    ? 'object'
                    : (_c = (_b = value.constructor) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : typeof value
        : typeof value;
};
exports.typeOf = typeOf;
var enumerableKeysOf = function (object) {
    return typeof object === 'object' && object !== null
        ? // Objects with a null prototype may not have `propertyIsEnumerable`
            Reflect.ownKeys(object).filter(function (key) { var _a, _b; return (_b = (_a = object.propertyIsEnumerable) === null || _a === void 0 ? void 0 : _a.call(object, key)) !== null && _b !== void 0 ? _b : true; })
        : [];
};
exports.enumerableKeysOf = enumerableKeysOf;
function SUCCESS(value) {
    return { success: true, value: value };
}
exports.SUCCESS = SUCCESS;
exports.FAILURE = Object.assign(function (code, message, details) { return (__assign({ success: false, code: code,
    message: message }, (details ? { details: details } : {}))); }, {
    TYPE_INCORRECT: function (self, value) {
        var message = "Expected " + (self.tag === 'template' ? "string " + show_1.default(self) : show_1.default(self)) + ", but was " + exports.typeOf(value);
        return exports.FAILURE(result_1.Failcode.TYPE_INCORRECT, message);
    },
    VALUE_INCORRECT: function (name, expected, received) {
        return exports.FAILURE(result_1.Failcode.VALUE_INCORRECT, "Expected " + name + " " + String(expected) + ", but was " + String(received));
    },
    KEY_INCORRECT: function (self, expected, value) {
        return exports.FAILURE(result_1.Failcode.KEY_INCORRECT, "Expected " + show_1.default(self) + " key to be " + show_1.default(expected) + ", but was " + exports.typeOf(value));
    },
    CONTENT_INCORRECT: function (self, details) {
        var message = "Expected " + show_1.default(self) + ", but was incompatible";
        return exports.FAILURE(result_1.Failcode.CONTENT_INCORRECT, message, details);
    },
    ARGUMENT_INCORRECT: function (message) {
        return exports.FAILURE(result_1.Failcode.ARGUMENT_INCORRECT, message);
    },
    RETURN_INCORRECT: function (message) {
        return exports.FAILURE(result_1.Failcode.RETURN_INCORRECT, message);
    },
    CONSTRAINT_FAILED: function (self, message) {
        var info = message ? ": " + message : '';
        return exports.FAILURE(result_1.Failcode.CONSTRAINT_FAILED, "Failed constraint check for " + show_1.default(self) + info);
    },
    PROPERTY_MISSING: function (self) {
        var message = "Expected " + show_1.default(self) + ", but was missing";
        return exports.FAILURE(result_1.Failcode.PROPERTY_MISSING, message);
    },
    PROPERTY_PRESENT: function (value) {
        var message = "Expected nothing, but was " + exports.typeOf(value);
        return exports.FAILURE(result_1.Failcode.PROPERTY_PRESENT, message);
    },
    NOTHING_EXPECTED: function (value) {
        var message = "Expected nothing, but was " + exports.typeOf(value);
        return exports.FAILURE(result_1.Failcode.NOTHING_EXPECTED, message);
    },
});
