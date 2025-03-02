export class Logger {
    private static instance: Logger;
    private prefix: string;

    private constructor(prefix: string = 'App') {
        this.prefix = prefix;
    }

    public static getInstance(prefix: string = 'App'): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(prefix);
        }
        return Logger.instance;
    }

    info(message: string, ...args: any[]): void {
        console.log(`[${this.prefix}] INFO: ${message}`, ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`[${this.prefix}] WARN: ${message}`, ...args);
    }

    error(message: string, ...args: any[]): void {
        console.error(`[${this.prefix}] ERROR: ${message}`, ...args);
    }
}

// Example usage:
// const log = Logger.getInstance('MyComponent');
// log.info('This is an info message');
// log.warn('This is a warning message');
// log.error('This is an error message');
