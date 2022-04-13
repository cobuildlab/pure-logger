import { CloudWatchLog } from "./cloud-watch";

type LogInput = (string | Error) | (string | Error)[];

const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
);

const isNode = new Function(
  "try {return this===global;}catch(e){return false;}"
);

const isDebug: () => boolean = () => {
  if (isBrowser()) if (window.hasOwnProperty("DEBUG_LEVEL")) return true;

  if (isNode())
    if (process && process.env && process.env.hasOwnProperty("DEBUG_LEVEL"))
      // Node
      return true;
  return false;
};


export function createLogger({
                               isColored,
                               cloudWatch
                             }: Partial<{
  isColored: boolean;
  cloudWatch: CloudWatchConfig;
}> = {}): {
  log: (input: LogInput) => void;
} {
  let cloudWatchInstance: CloudWatchLog | null = null;
  let cloudWatchConfig: CloudWatchConfig | null = null;

  if (cloudWatch !== undefined) {
    cloudWatchConfig = { ...cloudWatch };
  }

  /**
   * @param e
   * @param prefix
   * @example
   */
  async function log(e: LogInput) {
    const toLog: typeof e[] = Array.isArray(e) ? e : [e];

    if (isDebug()) {
      console.trace(...toLog);
    }
    if (isBrowser()) {
      if (isColored) {
        console.log(`%c${toLog.join(":")} `, `color:dark-blue`);
      } else {
        console.log(...toLog);
      }
    } else {
      console.log(...toLog);
    }

    if (cloudWatchConfig !== undefined && cloudWatchConfig !== null) {
      cloudWatchInstance = new CloudWatchLog(cloudWatchConfig);
      await cloudWatchInstance.send(
        toLog.map((e) => (typeof e === "string" ? e : JSON.stringify(e)))
      );
    }

  }

  return {
    log
  };
}
