import {createLogger} from "./logger";

interface Rollbar {
    debug: (toLog: (string | Error)[]) => void
    error: (toLog: (string | Error)[]) => void
}

let isColored = false;
let rollbarInstance: null | Rollbar = null;

const setColored = () => {
    isColored = true;
}

const setRollbar = (rollbar: any) => {
    rollbarInstance = rollbar;
}

const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

const isNode = new Function("try {return this===global;}catch(e){return false;}");


const isDebug: () => boolean = () => {
    if (isBrowser())
        if (window.hasOwnProperty("DEBUG_LEVEL"))
            return true;

    if (isNode()) // Node
        if (process && process.env && process.env.hasOwnProperty("DEBUG_LEVEL"))
            return true;
    return false;
};


function _log(e: Error | undefined, prefix: any[]) {
    const toLog: (string | Error)[] = [...prefix];
    if (e)
        toLog.push(e);

    if (isDebug()) {
        console.trace(...toLog);
    }
    if (isBrowser()) {
        if (isColored) {
            console.log(`%c${toLog.join(":")} `, `color:dark-blue`);
        } else {
            console.log(...toLog);
        }
    } else {
        console.log(...toLog);
    }
    if (rollbarInstance !== null) {
        rollbarInstance.debug(toLog);
    }
}

const log = (e?: Error | string, ...prefix: any[]) => {
    if (e === undefined && prefix.length == 0)
        throw new Error("Logger can't be called without arguments. Indicate an Error, or a list of messages");

    const spread = [...prefix];

    if (typeof e === "string") {
        spread.push(e);
        return _log(undefined, spread);
    }
    _log(e, prefix);
};

const error = (e?: Error | string, ...prefix: any[]) => {
    log(e, ...prefix);
    // @ts-ignore
    if (typeof e === "error")
        throw e;
}


export {setColored, setRollbar, log, error, createLogger};
