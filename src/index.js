/**
 * Returns true if it have to show the log message
 */
const itMustLog = () => {
  if (typeof __DEV__ !== undefined)
    return true;

  if (window)
    if (window.DEBUG)
      return true;

  if (process)
    if (process.env) {
      const enviroment = process.env.NODE_ENV
      if (typeof enviroment === "string") {
        if (enviroment === "development" || enviroment === "dev")
          return true;
      }
    }

  return false;
}

const info = (...args) => {
  if (!itMustLog())
    return;
  console.info(...args);
};


const log = (...args) => {
  if (!itMustLog())
    return;
  console.log(...args);
};

const error = (...args) => {
  if (!itMustLog())
    return;
  console.error(...args);
};

const debug = (...args) => {
  if (!itMustLog())
    return;
  console.debug(...args);
};

module.exports = { info, log, error, debug };