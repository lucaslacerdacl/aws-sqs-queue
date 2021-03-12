import {SQS} from 'aws-sdk';
import {SendMessageRequest} from 'aws-sdk/clients/sqs';
import {MessageModel} from './message.model';

/**
 * Responsável por gerenciar o serviço de SQS.
 */
export class AwsSqs {
  /**
   * Cria os parâmetros para envio da mensagem.
   * @param message Mensagem para ser formatada.
   */
  private createMessageParams(message: MessageModel): SendMessageRequest {
    const params = {
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
          StringValue: this.origin,
        },
        url: {
          DataType: 'String',
          StringValue: message.url,
        },
      },
      MessageBody: JSON.stringify(message.body),
      QueueUrl: message.url,
      MessageGroupId: this.origin,
    };

    return params;
  }

  /**
   * Habilita o recurso SQS fornecido pela AWS para uso.
   * @param sqs Recurso fornecido pela AWS já inicializado.
   * @param origin Identificação daa origem das mensagem.
   */
  constructor(private sqs: SQS, private origin: string) {}

  /**
   * Envia uma mensagem para o serviço de SQS da Amazon.
   * @param message Mensagem para ser enviada.
   */
  async sendMessageToQueue(message: MessageModel): Promise<void> {
    const params = this.createMessageParams(message);

    await this.sqs.sendMessage(params).promise();
  }
}
