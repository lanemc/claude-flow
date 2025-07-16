/**
 * Cross-platform terminal I/O layer
 */
export class UnifiedTerminalIO {
    decoder: any;
    encoder: any;
    runtime: any;
    /**
     * Write to stdout
     */
    write(data: any): Promise<any>;
    /**
     * Read from stdin
     */
    read(buffer: any): Promise<any>;
    /**
     * Set up signal handlers
     */
    onSignal(signal: any, handler: any): void;
    /**
     * Exit the process
     */
    exit(code?: number): void;
    /**
     * Get process ID
     */
    getPid(): any;
    /**
     * Set raw mode for stdin (Node.js only)
     */
    setRawMode(enabled: any): void;
    /**
     * Resume stdin (Node.js only)
     */
    resume(): void;
    /**
     * Pause stdin (Node.js only)
     */
    pause(): void;
}
export namespace RuntimeDetector {
    function isNode(): string | false;
    function isDeno(): boolean;
    function getRuntime(): any;
    function getPlatform(): {
        os: any;
        arch: any;
        target: any;
    };
    function hasAPI(apiName: any): string | boolean;
    function getEnv(key: any): any;
    function setEnv(key: any, value: any): void;
}
export function createCompatibilityLayer(): {
    runtime: any;
    terminal: UnifiedTerminalIO;
    detector: {
        isNode: () => string | false;
        isDeno: () => boolean;
        getRuntime: () => any;
        /**
         * Get platform-specific information
         */
        getPlatform: () => {
            os: any;
            arch: any;
            target: any;
        };
        /**
         * Check if API is available
         */
        hasAPI: (apiName: any) => string | boolean;
        /**
         * Get environment variables
         */
        getEnv: (key: any) => any;
        /**
         * Set environment variables
         */
        setEnv: (key: any, value: any) => void;
    };
    TextEncoder: {
        new (): TextEncoder;
        prototype: TextEncoder;
    };
    TextDecoder: {
        new (label?: string, options?: TextDecoderOptions): TextDecoder;
        prototype: TextDecoder;
    };
    platform: {
        os: any;
        arch: any;
        target: any;
    };
    getEnv: (key: any) => any;
    setEnv: (key: any, value: any) => void;
    exit: any;
    pid: any;
    safeCall: (fn: any, fallback?: null) => Promise<any>;
    hasFeature: (feature: any) => string | boolean;
};
export namespace compat {
    export { runtime };
    export let terminal: UnifiedTerminalIO;
    export { RuntimeDetector as detector };
    export { TextEncoder };
    export { TextDecoder };
    export namespace platform {
        let os: any;
        let arch: any;
        let target: any;
    }
    import getEnv_1 = RuntimeDetector.getEnv;
    export { getEnv_1 as getEnv };
    import setEnv_1 = RuntimeDetector.setEnv;
    export { setEnv_1 as setEnv };
    export { exit };
    export { pid };
    export function safeCall(fn: any, fallback?: null): Promise<any>;
    export function hasFeature(feature: any): string | boolean;
}
export let runtime: any;
declare let TextEncoder: any;
declare let TextDecoder: any;
declare let exit: any;
declare let pid: any;
/**
 * Runtime Environment Detection
 * Cross-platform detection and compatibility layer for Node.js and Deno
 */
export const isNode: string | false;
export const isDeno: boolean;
export {};
//# sourceMappingURL=runtime-detector.d.ts.map