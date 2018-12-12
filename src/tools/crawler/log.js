// Log configuration.
const log4js = require('log4js');

log4js.configure({
  appenders: {
    all: { type: 'file', filename: 'jinx.log' },
    error: { type: 'file', filename: 'jinx_error.log' },
    just_error : { type: 'logLevelFilter', appender: 'error', level: 'error' }
  },
  categories: {
    default: { appenders: ['all', 'just_error'], level: 'info' }
  }
});

const logger = log4js.getLogger();

const log = (level, msg) => logger[level](msg);

module.exports = log;