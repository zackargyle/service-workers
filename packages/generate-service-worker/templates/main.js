/*
 * AUTOGENERATED FROM GENERATE-SERVICE-WORKER
 * Injected global: $DEBUG
 */

const logger = {
  print: function(fn, args) {
    if ($DEBUG) {
      console[fn].apply(console, args);
    }
  }
  log: (...args) => print('log', args),
  warn: (...args) => print('warn', args),
  error: (...args) => print('error', args),
};
