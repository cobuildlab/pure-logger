# pure-logger

A minimalistic logger for node projects (backend, browser and mobile) that extends the console with the purpose of get rid of the overhead of logging on production enviroments (if you don't want to).

The logger check the value of: 

- `__DEV__`
- `process.env`
- `window.DEBUG`

To check if any logs needs to be done.

Tested with Node applications, React and React Native, it should work with any other node applications without problem.

Missing:

- Formatting


## Examples:

### For node:


```
const log = require('pure-logger');
log.log ("a",1,2, {"a": 2});
log.error(new Error("Test"));
```

### For Browser:

```
//setup
window.DEBUG = true;

import {log, error} from 'pure-logger';
log ("a",1,2, {"a": 2});
error(new Error("Test"));
```
