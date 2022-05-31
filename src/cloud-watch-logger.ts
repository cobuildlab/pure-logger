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
    LogGroup,
    DescribeLogGroupsCommand,
    // CreateLogGroupCommandOutput,
} from '@aws-sdk/client-cloudwatch-logs';
import {parseUrl} from '@aws-sdk/url-parser-node';
import {
    DescribeLogGroupsCommandInput
} from '@aws-sdk/client-cloudwatch-logs/dist-types/commands/DescribeLogGroupsCommand';
import {InputLogEvent} from '@aws-sdk/client-cloudwatch-logs/dist-types/models/models_0';
import {CloudWatchConfig} from './types';

export class CloudWatchLog {
    private client: CloudWatchLogsClient;
    private readonly logGroupName: string | null = null;
    private readonly logStreamName: string | null = null;
    private logStream: Partial<LogStream> | null = null;
    private logGroup: Partial<LogGroup> | null = null;
    private nextSequenceToken: string | null = null;
    private messages: string[] = [];

    constructor(config: CloudWatchConfig) {
        this.client = new CloudWatchLogsClient({
            region: config.region,
            urlParser: parseUrl,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
        this.logGroupName = config.logGroupName;
        this.logStreamName = config.logStreamName;
    }

    private async createLogGroup() {
        if (this.logGroupName === null) {
            throw new Error('logGroupName is null');
        }
        if (this.logGroup != null) {
            return;
        }
        const input: CreateLogGroupCommandInput = {
            logGroupName: this.logGroupName,
        };
        const command = new CreateLogGroupCommand(input);
        try {
            await this.client.send(command);
        } catch (err) {
            if (
                err.__type !== undefined &&
                err.__type !== 'ResourceAlreadyExistsException'
            ) {
                throw err;
            }
            // Maybe already exists
            const inputDescribe: DescribeLogGroupsCommandInput = {
                logGroupNamePrefix: this.logGroupName,
            };
            const describeStream = new DescribeLogGroupsCommand(inputDescribe);
            const response = await this.client.send(describeStream);
            if (response.logGroups !== undefined && response.logGroups.length > 0) {
                this.logGroup = response.logGroups[0];
                return;
            }
            throw new Error('Failed to create log group');
        }
        this.logGroup = {
            logGroupName: this.logGroupName,
        };
    }

    private async createLogStream() {
        if (this.logGroupName === null) {
            throw new Error('logGroupName is null');
        }
        if (this.logStreamName === null) {
            throw new Error('logStreamName is null');
        }

        if (this.logStream != null) {
            return;
        }

        const putStream = new CreateLogStreamCommand({
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
        });

        try {
            await this.client.send(putStream);
        } catch (error) {
            // Maybe already exists
            const inputDescribe = {
                logGroupName: this.logGroupName,
            };
            const describeStream = new DescribeLogStreamsCommand(inputDescribe);
            const response = await this.client.send(describeStream);
            if (response.logStreams) {
                this.logStream = response.logStreams[0];
                if (this.logStream.uploadSequenceToken !== undefined)
                    this.nextSequenceToken = this.logStream.uploadSequenceToken;
                return;
            }
            throw new Error('Failed to create log stream');
        }
        this.logStream = {
            logStreamName: this.logStreamName,
        };
    }

    send(messages: string | string[]) {
        if (Array.isArray(messages)) {
            for (const message of messages) {
                this.messages.push(message);
            }
        } else {
            this.messages.push(messages);
        }

    }

    messageCount(){
        return this.messages.length;
    }

    async flush() {
        if(this.messages.length === 0 ){
            return;
        }
        if (!(this.logGroupName && this.logStreamName)) {
            throw new Error("Can't send logs, client not initialized");
        }

        await this.createLogGroup();
        await this.createLogStream();

        const logs: InputLogEvent[] = this.messages.map((msg) => ({
            message: msg,
            timestamp: new Date().getTime() + Math.round(Math.random() * 100),
        })).sort(function(a, b){ return a.timestamp - b.timestamp });

        let callCounter = 0;
        while (true) {
            if (callCounter > 1)
                break;

            const putInput: PutLogEventsCommandInput = {
                logGroupName: this.logGroupName,
                logEvents: logs,
                logStreamName: this.logStreamName,
                sequenceToken: this.nextSequenceToken ?? undefined,
            };
            const putCommand = new PutLogEventsCommand(putInput);

            try {
                const data = await this.client.send(putCommand);
                this.nextSequenceToken = data.nextSequenceToken ?? null;
                break;
            } catch (error) {
                if (error.name !== "InvalidSequenceTokenException")
                    throw error;
                this.nextSequenceToken = error.expectedSequenceToken;
                callCounter++;
            }
        }
        this.messages = [];
    }
}
