import { Static, Boolean, String, Literal, Record, Union, Partial } from "runtypes";
export declare const RecordTypesT: Literal<"openatts">;
export declare const BlockchainNetworkT: Literal<"ethereum">;
export declare const EthereumAddressT: import("runtypes").Constraint<String, string, unknown>;
export declare enum EthereumNetworks {
    homestead = "1",
    ropsten = "3",
    rinkeby = "4",
    goerli = "5",
    kovan = "42",
    polygon = "137",
    polygonMumbai = "80001"
}
export declare const EthereumNetworkIdT: Union<[Literal<EthereumNetworks.homestead>, Literal<EthereumNetworks.ropsten>, Literal<EthereumNetworks.rinkeby>, Literal<EthereumNetworks.goerli>, Literal<EthereumNetworks.polygon>, Literal<EthereumNetworks.polygonMumbai>]>;
export declare const OpenAttestationDNSTextRecordT: import("runtypes").Intersect<[Record<{
    type: Literal<"openatts">;
    net: Literal<"ethereum">;
    netId: Union<[Literal<EthereumNetworks.homestead>, Literal<EthereumNetworks.ropsten>, Literal<EthereumNetworks.rinkeby>, Literal<EthereumNetworks.goerli>, Literal<EthereumNetworks.polygon>, Literal<EthereumNetworks.polygonMumbai>]>;
    addr: import("runtypes").Constraint<String, string, unknown>;
}, false>, Partial<{
    dnssec: Boolean;
}, false>]>;
export declare type BlockchainNetwork = Static<typeof BlockchainNetworkT>;
export declare type EthereumAddress = Static<typeof EthereumAddressT>;
export declare type OpenAttestationDNSTextRecord = Static<typeof OpenAttestationDNSTextRecordT>;
export declare type RecordTypes = Static<typeof RecordTypesT>;
