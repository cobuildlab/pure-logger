/**
 * Returns true if it have to show the log message
 */

const PURE_LOGGER = {
  isBrowser: typeof window !== 'undefined' && typeof window.document !== 'undefined'
};

const getLogLevel = () => {
  if (window)
    if (typeof window.DEBUG_LEVEL === 'number')
      if (window.DEBUG_LEVEL < 4)
        return window.DEBUG_LEVEL;

  if (global) // Node
    if (process.env) {
      const debugLevel = process.env.DEBUG_LEVEL;
      if (typeof debugLevel !== "undefined") {
        const debugLevelNumber = parseInt(debugLevel);
        if (debugLevelNumber < 4)
          return debugLevelNumber;
      }
    }

  return 4;
};

const debug = (...args) => {
  if (getLogLevel() < 4)
    return;
  if (PURE_LOGGER.isBrowser) {
    const [first, ...second] = args;
    if (second.length > 0)
      console.debug(`%c${first} `, `color:dark-blue`, second);
    else
      console.debug(`%c${first} `, `color:dark-blue`);
  } else
    console.debug(args);
};

const info = (...args) => {
  if (getLogLevel() < 3)
    return;
  if (PURE_LOGGER.isBrowser) {
    const [first, ...second] = args;
    if (second.length > 0)
      console.info(`%c${first} `, `color:dark-blue`, second);
    else
      console.info(`%c${first} `, `color:dark-blue`);
  } else
    console.info(args);
};

const log = (...args) => {
  if (getLogLevel() < 3)
    return;
  if (PURE_LOGGER.isBrowser) {
    const [first, ...second] = args;
    if (second.length > 0)
      console.log(`%c${first} `, `color:dark-blue`, second);
    else
      console.log(`%c${first} `, `color:dark-blue`);
  } else
    console.log(args);
};

const warn = (...args) => {
  if (getLogLevel() < 2)
    return;
  if (PURE_LOGGER.isBrowser) {
    const [first, ...second] = args;
    if (second.length > 0)
      console.warn(`%c${first} `, `color:dark-blue`, second);
    else
      console.warn(`%c${first} `, `color:dark-blue`);
  } else
    console.warn(args);
};

const error = (...args) => {
  if (!getLogLevel() < 1)
    return;
  if (PURE_LOGGER.isBrowser) {
    const [first, ...second] = args;
    if (second.length > 0)
      console.error(`%c${first} `, `color:dark-blue`, second);
    else
      console.error(`%c${first} `, `color:dark-blue`);
  } else
    console.error(args);
};

module.exports = {info, log, error, debug, warn};
