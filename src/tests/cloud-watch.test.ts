import {createLogger} from "../logger";
import dotenv from "dotenv";
import {env} from "process";

dotenv.config();
it("It must create a log", async () => {

    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
        console.log("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required to test CW integration");
        return;
    }

    const {log: logger1} = createLogger({
        cloudWatch: {
            accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
            region: env.AWS_REGION ?? "",
            logGroupName: "cli",
            logStreamName: "local"
        }
    });

    const {log: logger2} = createLogger({
        cloudWatch: {
            accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
            region: env.AWS_REGION ?? "",
            logGroupName: "cli",
            logStreamName: "local2"
        }
    });

    jest.setTimeout(100000 * 60);
    await logger1("test 1");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger1("test 2");
    await logger2("test 3");
    await logger2("test 3");
    await logger2("test 3");
    await logger2("test 3");
    await logger2("test 4");

    expect(logger1).not.toBe(undefined);

});
