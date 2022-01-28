"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "OpenAttestationDNSTextRecord", {
  enumerable: true,
  get: function get() {
    return _dnsTxt.OpenAttestationDNSTextRecord;
  }
});
Object.defineProperty(exports, "OpenAttestationDnsDidRecord", {
  enumerable: true,
  get: function get() {
    return _dnsDid.OpenAttestationDnsDidRecord;
  }
});
exports.getDnsDidRecords = exports.getDocumentStoreRecords = exports.parseDnsDidResults = exports.parseDocumentStoreResults = exports.parseOpenAttestationRecord = exports.queryDns = exports.defaultDnsResolvers = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _dnsTxt = require("./records/dnsTxt");

var _dnsDid = require("./records/dnsDid");

var _logger = require("./util/logger");

var _error = require("./common/error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const _getLogger = (0, _logger.getLogger)("index"),
      trace = _getLogger.trace;

const defaultDnsResolvers = [/*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (domain) {
    const _yield$axios = yield (0, _axios.default)({
      method: "GET",
      url: `https://dns.google/resolve?name=${domain}&type=TXT`
    }),
          data = _yield$axios.data;

    return data;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (domain) {
    const _yield$axios2 = yield (0, _axios.default)({
      method: "GET",
      url: `https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`,
      headers: {
        accept: "application/dns-json",
        contentType: "application/json",
        connection: "keep-alive"
      }
    }),
          data = _yield$axios2.data;

    return data;
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()];
/**
 * Returns true for strings that are openattestation records
 * @param txtDataString e.g: '"openatts net=ethereum netId=3 addr=0x0c9d5E6C766030cc6f0f49951D275Ad0701F81EC"'
 */

exports.defaultDnsResolvers = defaultDnsResolvers;

const isOpenAttestationRecord = txtDataString => {
  return txtDataString.startsWith("openatts");
};

const trimValue = str => {
  return str.endsWith(";") ? str.substring(0, str.length - 1).trim() : str.trim();
};
/**
 * Takes a string in the format of "key=value" and adds it to a JS object as key: value
 * @param obj Object that will be modified
 * @param keyValuePair A key value pair to add to the given object
 * @example addKeyValuePairToObject(objectToModify, "foo=bar")
 */


const addKeyValuePairToObject = (obj, keyValuePair) => {
  const _keyValuePair$split = keyValuePair.split("="),
        _keyValuePair$split2 = _toArray(_keyValuePair$split),
        key = _keyValuePair$split2[0],
        values = _keyValuePair$split2.slice(1);

  const value = values.join("="); // in case there were values with = in them

  /* eslint-disable no-param-reassign */
  // this is necessary because we modify the accumulator in .reduce

  obj[key.trim()] = trimValue(value);
  return obj;
};

const formatDnsDidRecord = ({
  a,
  v,
  p,
  type
}) => {
  return {
    type,
    algorithm: a,
    publicKey: p,
    version: v
  };
};

const queryDns = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (domain, customDnsResolvers) {
    let data;
    let i = 0;

    while (!data && i < customDnsResolvers.length) {
      try {
        const customDnsResolver = customDnsResolvers[i]; // eslint-disable-next-line no-await-in-loop

        data = yield customDnsResolver(domain);
      } catch (e) {
        i += 1;
      }
    }

    if (!data) {
      throw new _error.CodedError("Unable to query DNS", _error.DnsproveStatusCode.IDNS_QUERY_ERROR_GENERAL, "IDNS_QUERY_ERROR_GENERAL");
    }

    return data;
  });

  return function queryDns(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Parses one openattestation DNS-TXT record and turns it into an OpenAttestationsDNSTextRecord object
 * @param record e.g: '"openatts net=ethereum netId=3 addr=0x0c9d5E6C766030cc6f0f49951D275Ad0701F81EC"'
 */


exports.queryDns = queryDns;

const parseOpenAttestationRecord = record => {
  trace(`Parsing record: ${record}`);
  const keyValuePairs = record.trim().split(" "); // tokenize into key=value elements

  const recordObject = {}; // @ts-ignore: we already checked for this token

  recordObject.type = keyValuePairs.shift();
  keyValuePairs.reduce(addKeyValuePairToObject, recordObject);
  return recordObject;
};
/**
 * Currying function that applies a given dnssec result
 */


exports.parseOpenAttestationRecord = parseOpenAttestationRecord;

const applyDnssecResults = dnssecStatus => record => {
  return _objectSpread(_objectSpread({}, record), {}, {
    dnssec: dnssecStatus
  });
};
/**
 * Some DNS servers return TXT records with quoted strings, others don't :D
 * @param record
 * @returns unquoted DNS record
 */


const trimDoubleQuotes = record => {
  return record.startsWith('"') ? record.slice(1, -1) : record;
};
/**
 * Takes a record set and breaks that info array of key value pairs
 * @param recordSet e.g: [{name: "google.com", type: 16, TTL: 3599, data: '"openatts net=ethereum netId=3 addr=0x2f60375e8144e16Adf1979936301D8341D58C36C"}]
 */


const parseOpenAttestationRecords = (recordSet = []) => {
  trace(`Parsing DNS results: ${JSON.stringify(recordSet)}`);
  return recordSet.map(record => record.data).map(trimDoubleQuotes) // removing leading and trailing quotes if they exist
  .filter(isOpenAttestationRecord).map(parseOpenAttestationRecord);
};
/**
 * Takes a DNS-TXT Record set and returns openattestation document store records if any
 * @param recordSet Refer to tests for examples
 */


const parseDocumentStoreResults = (recordSet = [], dnssec) => {
  return parseOpenAttestationRecords(recordSet).reduce((prev, curr) => {
    return _dnsTxt.OpenAttestationDNSTextRecordT.guard(curr) ? [...prev, curr] : prev;
  }, []).map(applyDnssecResults(dnssec));
};

exports.parseDocumentStoreResults = parseDocumentStoreResults;

const parseDnsDidResults = (recordSet = [], dnssec) => {
  return parseOpenAttestationRecords(recordSet).map(formatDnsDidRecord).reduce((prev, curr) => {
    return _dnsDid.OpenAttestationDnsDidRecordT.guard(curr) ? [...prev, curr] : prev;
  }, []).map(applyDnssecResults(dnssec));
};
/**
 * Queries a given domain and parses the results to retrieve openattestation document store records if any
 * @param domain e.g: "example.openattestation.com"
 * @example
 * > getDocumentStoreRecords("example.openattestation.com")
 * > [ { type: 'openatts',
    net: 'ethereum',
    netId: '3',
    addr: '0x2f60375e8144e16Adf1979936301D8341D58C36C',
    dnssec: true } ]
 */


exports.parseDnsDidResults = parseDnsDidResults;

const getDocumentStoreRecords = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (domain, customDnsResolvers) {
    trace(`Received request to resolve ${domain}`);
    const dnsResolvers = customDnsResolvers || defaultDnsResolvers;
    const results = yield queryDns(domain, dnsResolvers);
    const answers = results.Answer || [];
    trace(`Lookup results: ${JSON.stringify(answers)}`);
    return parseDocumentStoreResults(answers, results.AD);
  });

  return function getDocumentStoreRecords(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getDocumentStoreRecords = getDocumentStoreRecords;

const getDnsDidRecords = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(function* (domain, customDnsResolvers) {
    trace(`Received request to resolve ${domain}`);
    const dnsResolvers = customDnsResolvers || defaultDnsResolvers;
    const results = yield queryDns(domain, dnsResolvers);
    const answers = results.Answer || [];
    trace(`Lookup results: ${JSON.stringify(answers)}`);
    return parseDnsDidResults(answers, results.AD);
  });

  return function getDnsDidRecords(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getDnsDidRecords = getDnsDidRecords;