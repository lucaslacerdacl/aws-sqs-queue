import {SQS, Request, AWSError} from 'aws-sdk';
import {Mock} from 'moq.ts';
import {AwsSqs} from '../../src/sqs/aws-sqs.service';

describe('AWS Sqs', () => {
  const origin = 'origin-test';
  const sqs = new SQS();
  const awsSqs = new AwsSqs(sqs, origin);

  it('Envia mensagem para fila', async () => {
    const mockPromise = jest.fn();
    const mockRequest = new Mock<Request<SQS.SendMessageResult, AWSError>>();
    const request = mockRequest
      .setup(instance => instance.promise)
      .returns(mockPromise)
      .object();

    const spySendMessage = jest
      .spyOn(sqs, 'sendMessage')
      .mockImplementation(() => request);

    const message = {
      url: 'https://sqs.url.com',
      module: 'moduleTest',
      method: 'methodTest',
      body: {
        param1: 'param1',
        param2: 'param2',
      },
    };

    await awsSqs.sendMessageToQueue(message);

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
    expect(mockPromise).toHaveBeenCalled();
  });

  it('Envia mensagem para fila FIFO', async () => {
    const mockPromise = jest.fn();
    const mockRequest = new Mock<Request<SQS.SendMessageResult, AWSError>>();
    const request = mockRequest
      .setup(instance => instance.promise)
      .returns(mockPromise)
      .object();

    const spySendMessage = jest
      .spyOn(sqs, 'sendMessage')
      .mockImplementation(() => request);

    const message = {
      url: 'https://sqs.url.com',
      module: 'moduleTest',
      method: 'methodTest',
      body: {
        param1: 'param1',
        param2: 'param2',
      },
    };

    const groupId = '264b5233-d600-4298-b8bb-7758e5bcbe7b';

    await awsSqs.sendMessageToQueueFIFO(message, groupId);

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
      MessageGroupId: groupId,
    });
    expect(mockPromise).toHaveBeenCalled();
  });

  it('Deleta mensagem de uma fila.', async () => {
    const mockPromise = jest.fn();
    const mockRequest = new Mock<Request<SQS.DeleteMessageRequest, AWSError>>();
    const request = mockRequest
      .setup(instance => instance.promise)
      .returns(mockPromise)
      .object();

    const spyDeleteMessage = jest
      .spyOn(sqs, 'deleteMessage')
      .mockImplementation(() => request);

    const queueUrl = 'url';
    const receiptHandle = '8d84a4b2-306e-4dca-97ff-745b2237f39d';

    await awsSqs.deleteMessage(queueUrl, receiptHandle);

    expect(spyDeleteMessage).toHaveBeenCalledWith({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });
    expect(mockPromise).toHaveBeenCalled();
  });
});
