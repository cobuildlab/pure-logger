# pure-logger

A minimalistic logger for Typescript / Javascript projects (backend, browser and mobile) that extends the console with the purpose of get rid of the overhead of logging and adds an optional Rollbar integration.


Tested with Node applications, React and React Native, it should work with any other node applications without a problem.


## Examples:

```
import {log, error} from 'pure-logger';

// Logs any to the console
log ("a",1,2, {"a": 2});

// Logs any to the console and raises an error
log.error(new Error("Test"), {"s":1}, true, 1);
```
