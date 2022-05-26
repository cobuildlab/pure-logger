import {CloudWatchConfig} from './types';
import {CloudWatchLog} from './cloud-watch-logger';


type LogInput = (string | Error) | (string | Error)[];

const isBrowser = new Function(
    'try {return this===window;}catch(e){ return false;}',
);

const isNode = new Function(
    'try {return this===global;}catch(e){return false;}',
);

const isDebug: () => boolean = () => {
    if (isBrowser()) if (window.hasOwnProperty('DEBUG_LEVEL')) return true;

    if (isNode())
        if (process && process.env && process.env.hasOwnProperty('DEBUG_LEVEL'))
            // Node
            return true;
    return false;
};

const cloudWatchLoggers: CloudWatchLog[] = [];
let cloudWatchTimer: any | null = null;

const sendLogs = async () => {
    if (cloudWatchLoggers.length === 0) {
        if (cloudWatchTimer !== null) {
            clearInterval(cloudWatchTimer)
            cloudWatchTimer = null;
        }
        return;
    }
    for (const cloudWatchLogger of cloudWatchLoggers) {
        await cloudWatchLogger.flush();
    }
}
/**
 * Start cloud watch loop
 */
const setCloudWatchInterval = () => {
    if (cloudWatchTimer === null) {
        cloudWatchTimer = setInterval(sendLogs, 5000);
    }
};

export interface Logger {
    log: (input: LogInput) => void,
    messageCount: () => number,
    flush: () => Promise<void>,
}

/**
 * Just for testing purposes
 */
export const stopInterval = () => {
    if (cloudWatchTimer !== null) {
        clearInterval(cloudWatchTimer)
        cloudWatchTimer = null;
    }
}

export function createLogger({
                                 isColored,
                                 cloudWatch,
                             }: Partial<{
    isColored: boolean;
    cloudWatch: CloudWatchConfig;
}> = {}): Logger {
    let cloudWatchInstance: CloudWatchLog | null = null;
    let cloudWatchConfig: CloudWatchConfig | null = null;

    if (cloudWatch !== undefined) {
        cloudWatchConfig = {...cloudWatch};
    }

    /**
     * @param e
     * @param prefix
     * @example
     */
    function log(e: LogInput) {
        const toLog: typeof e[] = Array.isArray(e) ? e : [e];

        if (isDebug()) {
            console.trace(...toLog);
        }
        if (isBrowser()) {
            if (isColored) {
                console.log(`%c${toLog.join(':')} `, `color:dark-blue`);
            } else {
                console.log(...toLog);
            }
        } else {
            console.log(...toLog);
        }

        if (cloudWatchConfig !== undefined && cloudWatchConfig !== null) {
            if (cloudWatchInstance === null) {
                cloudWatchInstance = new CloudWatchLog(cloudWatchConfig);
                cloudWatchLoggers.push(cloudWatchInstance);
                setCloudWatchInterval();
            }
            cloudWatchInstance.send(
                toLog.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))),
            );
        }
    }

    async function flush() {
        if (cloudWatchInstance !== null) {
            return await cloudWatchInstance.flush();
        }
        return Promise.resolve();
    }

    return {
        log,
        messageCount: (): number => cloudWatchInstance === null ? 0 : cloudWatchInstance.messageCount(),
        flush,
    };
}
