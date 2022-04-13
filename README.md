# pure-logger

A minimalistic logger for Typescript / Javascript projects (backend, browser and mobile):

- Minimum setup 
- Extends the console with the purpose of get rid of the overhead of logging 
- Optional Rollbar support
- Optional Cloudwatch support


Tested with Node applications, React and React Native, it should work with any other node applications without a problem.


## Examples:

### Simple

```typescript
import {log, error} from 'pure-logger';

// Logs any to the console
await log ("a",1,2, {"a": 2});

// Logs any to the console and raises an error
await log.error(new Error("Test"), {"s":1}, true, 1);
```

### Cloudwatch

```typescript
import { createLogger } from "../logger";

const { log } = createLogger({
  cloudWatch: {
    accessKeyId: env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? '',
    region: env.AWS_REGION ?? '',
    logGroupName: 'cli',
    logStreamName: 'local',
  },
});

await log('test');
await log('test1');
await log('test2');
await log('test3');
await log('test4');
```
