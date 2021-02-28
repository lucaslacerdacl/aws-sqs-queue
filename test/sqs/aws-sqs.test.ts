import {SQS} from 'aws-sdk';
import {AwsSqs} from '../../src/sqs/aws-sqs';

describe('AWS Sqs', () => {
  const origin = 'origin-test';
  const sqs = new SQS();
  const awsSqs = new AwsSqs(sqs, origin);

  it('Envia mensagem para fila', () => {
    const spySendMessage = jest.spyOn(sqs, 'sendMessage').mockImplementation();
    const message = {
      url: 'https://sqs.url.com',
      module: 'moduleTest',
      method: 'methodTest',
      body: {
        param1: 'param1',
        param2: 'param2',
      },
    };

    awsSqs.sendMessageToQueue(message);

    expect(spySendMessage).toHaveBeenCalledWith({
      DelaySeconds: 0,
      MessageAttributes: {
        module: {
          DataType: 'String',
          StringValue: message.module,
        },
        method: {
          DataType: 'String',
          StringValue: message.method,
        },
        origin: {
          DataType: 'String',
          StringValue: origin,
        },
        url: {
          DataType: 'String',
          StringValue: message.url,
        },
      },
      MessageBody: JSON.stringify(message.body),
      QueueUrl: message.url,
    });
  });
});
