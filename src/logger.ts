import { CloudWatchLog } from './cloud-watch';

type LogInput = (string | Error) | (string | Error)[];

const isBrowser = new Function(
  'try {return this===window;}catch(e){ return false;}',
);

const isNode = new Function(
  'try {return this===global;}catch(e){return false;}',
);

const isDebug: () => boolean = () => {
  if (isBrowser()) if (window.hasOwnProperty('DEBUG_LEVEL')) return true;

  if (isNode())
    if (process && process.env && process.env.hasOwnProperty('DEBUG_LEVEL'))
      // Node
      return true;
  return false;
};

export function createLogger({
  isColored,
  cloudWatch,
}: Partial<{
  isColored: boolean;
  cloudWatch: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    logGroupName: string;
    logStreamName: string;
  };
}> = {}): {
  log: (input: LogInput) => void;
} {
  let cloudWatchIntance: null | CloudWatchLog = null;

  if (cloudWatch) {
    cloudWatchIntance = new CloudWatchLog(cloudWatch);
    try {
      cloudWatchIntance.createLogStream(
        cloudWatch.logGroupName,
        cloudWatch.logStreamName,
      );
    } catch (error) {
      console.log("Couldn't create the log stream for cloudwatch");
    }
  }
  /**
   * @param e
   * @param prefix
   * @example
   */
  function log(e: LogInput) {
    const toLog: typeof e[] = Array.isArray(e) ? e : [e];

    if (isDebug()) {
      console.trace(...toLog);
    }
    if (isBrowser()) {
      if (isColored) {
        console.log(`%c${toLog.join(':')} `, `color:dark-blue`);
      } else {
        console.log(...toLog);
      }
    } else {
      console.log(...toLog);
    }
    if (cloudWatchIntance) {
      cloudWatchIntance.send(
        toLog.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))),
      );
    }
  }

  return {
    log,
  };
}
