"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodedError = exports.DnsproveStatusCode = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let DnsproveStatusCode;
exports.DnsproveStatusCode = DnsproveStatusCode;

(function (DnsproveStatusCode) {
  DnsproveStatusCode[DnsproveStatusCode["IDNS_QUERY_ERROR_GENERAL"] = 0] = "IDNS_QUERY_ERROR_GENERAL";
})(DnsproveStatusCode || (exports.DnsproveStatusCode = DnsproveStatusCode = {}));

class CodedError extends Error {
  constructor(message, code, codeString) {
    super(message);

    _defineProperty(this, "code", void 0);

    _defineProperty(this, "codeString", void 0);

    this.code = code;
    this.codeString = codeString;
  }

}

exports.CodedError = CodedError;