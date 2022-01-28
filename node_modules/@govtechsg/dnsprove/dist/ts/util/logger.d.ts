/// <reference types="debug" />
export declare const trace: (namespace: string) => import("debug").Debugger;
export declare const info: (namespace: string) => import("debug").Debugger;
export declare const error: (namespace: string) => import("debug").Debugger;
export declare const getLogger: (namespace: string) => {
    trace: import("debug").Debugger;
    info: import("debug").Debugger;
    error: import("debug").Debugger;
};
