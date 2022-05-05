import {createLogger, stopInterval} from "../logger";
import dotenv from "dotenv";
import {env} from "process";
import {sleep} from "../sleep";

dotenv.config();
it("It must create a log", async () => {
    jest.setTimeout(100000 * 60);
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
        console.log("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required to test CW integration");
        return;
    }

    const {log: logger1, messageCount: messageCount1} = createLogger({
        cloudWatch: {
            accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
            region: env.AWS_REGION ?? "",
            logGroupName: "cli",
            logStreamName: "local"
        }
    });

    const {log: logger2, messageCount: messageCount2} = createLogger({
        cloudWatch: {
            accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
            region: env.AWS_REGION ?? "",
            logGroupName: "cli",
            logStreamName: "local2"
        }
    });

    const nonBlockingSleep = (n: number) => new Promise<boolean>((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, n * 1000);
    });

    logger1("test 1");
    expect(messageCount1()).toBe(1);
    await nonBlockingSleep(1);
    expect(messageCount1()).toBe(1);
    await nonBlockingSleep(10);
    expect(messageCount1()).toBe(0);
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger1("test 2");
    logger2("test 3");
    logger2("test 3");
    logger2("test 3");
    logger2("test 3");
    logger2("test 4");
    //
    stopInterval();
});
