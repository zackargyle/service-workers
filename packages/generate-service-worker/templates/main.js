if (!$Cache) {
  self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });
}

function print(fn) {
  return function (message, group) {
    if ($DEBUG) {
      if (group && logger.groups[group]) {
        logger.groups[group].push({
          fn: fn,
          message: message
        });
      } else {
        console[fn].call(console, message);
      }
    }
  };
}

const logger = {
  groups: {},
  group: group => {
    logger.groups[group] = [];
  },
  groupEnd: group => {
    const groupLogs = logger.groups[group];
    if (groupLogs && groupLogs.length > 0) {
      console.groupCollapsed(group);
      groupLogs.forEach(log => {
        console[log.fn].call(console, log.message);
      });
      console.groupEnd();
    }
    delete logger.groups[group];
  },
  log: print('log'),
  warn: print('warn'),
  error: print('error')
};
