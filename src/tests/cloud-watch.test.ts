import { createLogger } from "../logger";
import dotenv from "dotenv";
import { env } from "process";

dotenv.config();
it("It must create a log", async () => {

  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    console.log("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required to test CW integration");
    return;
  }

  const { log } = createLogger({
    cloudWatch: {
      accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
      region: env.AWS_REGION ?? "",
      logGroupName: "cli",
      logStreamName: "local"
    }
  });

  await log("test");
  await log("test1");
  await log("test2");
  await log("test3");
  await log("test4");

  expect(log).not.toBe(undefined);


});
