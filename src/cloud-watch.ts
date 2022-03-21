// import 'react-native-url-polyfill/auto';
// import 'react-native-get-random-values';
import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  PutLogEventsCommand,
  CreateLogStreamCommand,
  DescribeLogStreamsCommand,
  CreateLogGroupCommandInput,
  PutLogEventsCommandInput,
  LogStream,
} from '@aws-sdk/client-cloudwatch-logs';
import { parseUrl } from '@aws-sdk/url-parser-node';

export class CloudWatchLog {
  private client: CloudWatchLogsClient;
  private logGroupName: string | null = null;
  private logStreamName: string | null = null;
  private logStream: LogStream | null = null;

  constructor({
    accessKeyId,
    secretAccessKey,
    region,
  }: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }) {
    this.client = new CloudWatchLogsClient({
      region: region,
      urlParser: parseUrl,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  private async createLogGroup(logGroupName: string) {
    const input: CreateLogGroupCommandInput = {
      logGroupName: logGroupName,
    };
    const command = new CreateLogGroupCommand(input);

    try {
      await this.client.send(command);
    } catch (err) {
      console.log(err);
    }
  }

  async createLogStream(logGroupName: string, logStreamName: string) {
    this.logGroupName = logGroupName;
    this.logStreamName = logStreamName;

    await this.createLogGroup(this.logGroupName);

    const putStream = new CreateLogStreamCommand({
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
    });

    let stream = null;
    try {
      await this.client.send(putStream);
    } catch (error) {
      // Maybe already exists
      const inputDescribe = {
        logGroupName: logGroupName,
      };
      const describeStream = new DescribeLogStreamsCommand(inputDescribe);
      const response = await this.client.send(describeStream);
      if (response.logStreams) {
        this.logStream = response.logStreams[0];
        console.log('DescribeLogStreamsCommand:data', stream);
      }
    }
  }

  async send(messages: string | string[]) {
    if (!(this.logGroupName && this.logStreamName && this.logStream)) {
      throw new Error("Can't send logs");
    }
    const logs =
      typeof messages === 'string'
        ? [
            {
              message: messages,
              timestamp: new Date().getTime() + Math.round(Math.random() * 100),
            },
          ]
        : messages.map((msg) => ({
            message: msg,
            timestamp: new Date().getTime() + Math.round(Math.random() * 100),
          }));

    const putInput: PutLogEventsCommandInput = {
      logGroupName: this.logGroupName,
      logEvents: logs,
      logStreamName: this.logStreamName,
      sequenceToken: this.logStream.uploadSequenceToken,
    };

    const putCommand = new PutLogEventsCommand(putInput);
    try {
      const data = await this.client.send(putCommand);
      console.log('PutLogEventsCommand:data', data);
    } catch (error) {
      console.log('PutLogEventsCommand:error:', error);
    }
  }
}
