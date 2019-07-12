const pureLogger = require('./index');



test('Everything is gonna be OK', () => {
  console.log(pureLogger);
  console.log(typeof window !== 'undefined' && typeof window.document !== 'undefined');

  const {info, log, error, warn, debug} = pureLogger;
  global.DEBUG_LEVEL = 4;
  info("INFO", 123);
  log("LOG", 123);
  error("ERROR", 123);
  warn("WARN", 123);
  debug("DEBUG", 123);
});



