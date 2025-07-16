export const args: string[];
export function cwd(): string;
export function readDir(path: any): Promise<{
    name: string;
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
}[]>;
export function statFile(path: any): Promise<{
    isFile: boolean;
    isDirectory: boolean;
    size: number;
    mtime: Date;
    atime: Date;
    birthtime: Date;
}>;
export function readTextFile(path: any): Promise<string>;
export function writeTextFile(path: any, content: any): Promise<void>;
export function remove(path: any): Promise<void>;
export function mkdirSync(path: any, options?: {}): void;
export function mkdirAsync(path: any, options?: {}): Promise<void>;
export const pid: number;
export function kill(pid: any, signal?: string): void;
export function exit(code?: number): never;
export function execPath(): string;
export namespace stdin {
    function read(buffer: any): Promise<any>;
}
export namespace stdout {
    function write(data: any): Promise<any>;
}
export namespace stderr {
    export function write_1(data: any): Promise<any>;
    export { write_1 as write };
}
export namespace errors {
    export { NotFound };
    export { AlreadyExists };
    export { PermissionDenied };
}
export function getImportMetaUrl(): string;
export function getDirname(importMetaUrl: any): string;
export function getFilename(importMetaUrl: any): string;
export function isMainModule(importMetaUrl: any): boolean;
export { existsSync };
export namespace build {
    let os: string;
    let arch: NodeJS.Architecture;
    let target: string;
}
export namespace env {
    function get(key: any): string | undefined;
    function set(key: any, value: any): void;
    function toObject(): {
        [key: string]: string | undefined;
        TZ?: string;
    };
}
export class Command {
    constructor(command: any, options?: {});
    command: any;
    options: {};
    output(): Promise<any>;
    spawn(): {
        status: Promise<any>;
        stdout: import("stream").Readable;
        stderr: import("stream").Readable;
        kill: (signal: any) => boolean;
    };
}
export namespace Deno {
    export { args };
    export { cwd };
    export { readDir };
    export { statFile as stat };
    export { readTextFile };
    export { writeTextFile };
    export { remove };
    export { mkdirAsync as mkdir };
    export { pid };
    export { kill };
    export { exit };
    export { execPath };
    export { errors };
    export { build };
    export { stdin };
    export { stdout };
    export { stderr };
    export { env };
    export { Command };
}
export default Deno;
declare class NotFound extends Error {
    constructor(message: any);
}
declare class AlreadyExists extends Error {
    constructor(message: any);
}
declare class PermissionDenied extends Error {
    constructor(message: any);
}
import { existsSync } from 'fs';
//# sourceMappingURL=node-compat.d.ts.map