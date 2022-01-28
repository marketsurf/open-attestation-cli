"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenAttestationDNSTextRecordT = exports.EthereumNetworkIdT = exports.EthereumNetworks = exports.EthereumAddressT = exports.BlockchainNetworkT = exports.RecordTypesT = void 0;

var _runtypes = require("runtypes");

const RecordTypesT = (0, _runtypes.Literal)("openatts");
exports.RecordTypesT = RecordTypesT;
const BlockchainNetworkT = (0, _runtypes.Literal)("ethereum");
exports.BlockchainNetworkT = BlockchainNetworkT;

const EthereumAddressT = _runtypes.String.withConstraint(maybeAddress => {
  return /0x[a-fA-F0-9]{40}/.test(maybeAddress) || `${maybeAddress} is not a valid ethereum address`;
});

exports.EthereumAddressT = EthereumAddressT;
let EthereumNetworks;
exports.EthereumNetworks = EthereumNetworks;

(function (EthereumNetworks) {
  EthereumNetworks["homestead"] = "1";
  EthereumNetworks["ropsten"] = "3";
  EthereumNetworks["rinkeby"] = "4";
  EthereumNetworks["goerli"] = "5";
  EthereumNetworks["kovan"] = "42";
  EthereumNetworks["polygon"] = "137";
  EthereumNetworks["polygonMumbai"] = "80001";
})(EthereumNetworks || (exports.EthereumNetworks = EthereumNetworks = {}));

const EthereumNetworkIdT = (0, _runtypes.Union)((0, _runtypes.Literal)(EthereumNetworks.homestead), (0, _runtypes.Literal)(EthereumNetworks.ropsten), (0, _runtypes.Literal)(EthereumNetworks.rinkeby), (0, _runtypes.Literal)(EthereumNetworks.goerli), (0, _runtypes.Literal)(EthereumNetworks.polygon), (0, _runtypes.Literal)(EthereumNetworks.polygonMumbai));
exports.EthereumNetworkIdT = EthereumNetworkIdT;
const OpenAttestationDNSTextRecordT = (0, _runtypes.Record)({
  type: RecordTypesT,
  net: BlockchainNetworkT,
  // key names are directly lifted from the dns-txt record format
  netId: EthereumNetworkIdT,
  // they are abbreviated because of 255 char constraint on dns-txt records
  addr: EthereumAddressT
}).And((0, _runtypes.Partial)({
  dnssec: _runtypes.Boolean
}));
exports.OpenAttestationDNSTextRecordT = OpenAttestationDNSTextRecordT;