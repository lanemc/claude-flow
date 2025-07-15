/**
 * Module declarations for packages without TypeScript definitions
 */

// Gradient-string module
declare module 'gradient-string' {
  interface Gradient {
    (text: string): string;
    multiline(text: string): string;
  }
  
  const gradient: {
    (colors: string[]): Gradient;
    rainbow: Gradient;
    cristal: Gradient;
    teen: Gradient;
    mind: Gradient;
    morning: Gradient;
    vice: Gradient;
    passion: Gradient;
    fruit: Gradient;
    instagram: Gradient;
    atlas: Gradient;
    retro: Gradient;
    summer: Gradient;
    pastel: Gradient;
  };
  
  export = gradient;
}

// Node-pty module extension
declare module 'node-pty' {
  export interface IPtyForkOptions {
    name?: string;
    cols?: number;
    rows?: number;
    cwd?: string;
    env?: { [key: string]: string };
    encoding?: string;
    handleFlowControl?: boolean;
    flowControlPause?: string;
    flowControlResume?: string;
  }
  
  export interface IPty {
    pid: number;
    cols: number;
    rows: number;
    process: string;
    handleFlowControl: boolean;
    
    on(event: 'data', listener: (data: string) => void): void;
    on(event: 'exit', listener: (exitCode: number, signal?: number) => void): void;
    on(event: 'error', listener: (error: Error) => void): void;
    
    resize(columns: number, rows: number): void;
    write(data: string): void;
    kill(signal?: string): void;
    pause(): void;
    resume(): void;
  }
  
  export function spawn(
    file: string,
    args: string[] | string,
    options?: IPtyForkOptions
  ): IPty;
}

// Blessed module extension
declare module 'blessed' {
  export interface Widgets {
    Screen: unknown;
    Box: unknown;
    Text: unknown;
    List: unknown;
    Log: unknown;
    Table: unknown;
    Terminal: unknown;
    Form: unknown;
    Input: unknown;
    Textarea: unknown;
    Button: unknown;
    ProgressBar: unknown;
  }
  
  export function screen(options?: unknown): unknown;
  export function box(options?: unknown): unknown;
  export function text(options?: unknown): unknown;
  export function list(options?: unknown): unknown;
  export function log(options?: unknown): unknown;
  export function table(options?: unknown): unknown;
  export function terminal(options?: unknown): unknown;
  export function form(options?: unknown): unknown;
  export function input(options?: unknown): unknown;
  export function textarea(options?: unknown): unknown;
  export function button(options?: unknown): unknown;
  export function progressbar(options?: unknown): unknown;
}

// CLI-Table3 module extension
declare module 'cli-table3' {
  interface TableOptions {
    head?: string[];
    colWidths?: number[];
    colAligns?: ('left' | 'right' | 'center')[];
    style?: {
      head?: string[];
      border?: string[];
      compact?: boolean;
    };
    chars?: Record<string, string>;
  }
  
  class Table {
    constructor(options?: TableOptions);
    push(...rows: unknown[]): void;
    toString(): string;
  }
  
  export = Table;
}

// Ora module extension
declare module 'ora' {
  interface Options {
    text?: string;
    spinner?: string | any;
    color?: string;
    hideCursor?: boolean;
    interval?: number;
    stream?: NodeJS.WritableStream;
    enabled?: boolean;
    isSilent?: boolean;
    discardStdin?: boolean;
  }
  
  interface Ora {
    text: string;
    color: string;
    spinner: unknown;
    
    start(text?: string): this;
    stop(): this;
    succeed(text?: string): this;
    fail(text?: string): this;
    warn(text?: string): this;
    info(text?: string): this;
    stopAndPersist(options?: { symbol?: string; text?: string }): this;
    clear(): this;
    render(): this;
    frame(): string;
  }
  
  function ora(options?: string | Options): Ora;
  
  export = ora;
}

// Figlet module extension
declare module 'figlet' {
  interface Options {
    font?: string;
    horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing';
    verticalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing';
    width?: number;
    whitespaceBreak?: boolean;
  }
  
  interface Fonts {
    [key: string]: unknown;
  }
  
  function figlet(text: string, callback: (error: Error | null, result?: string) => void): void;
  function figlet(text: string, options: Options, callback: (error: Error | null, result?: string) => void): void;
  
  namespace figlet {
    function text(text: string, options?: Options, callback?: (error: Error | null, result?: string) => void): void;
    function textSync(text: string, options?: Options): string;
    function metadata(font: string, callback: (error: Error | null, result?: unknown) => void): void;
    function fonts(callback: (error: Error | null, fonts?: string[]) => void): void;
    function fontsSync(): string[];
  }
  
  export = figlet;
}