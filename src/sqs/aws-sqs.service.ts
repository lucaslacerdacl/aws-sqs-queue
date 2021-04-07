import {
  DeleteMessageBatchRequest,
  SendMessageRequest,
} from 'aws-sdk/clients/sqs';

import {MessageModel} from './message.model';
import {SQS} from 'aws-sdk';
import {BatchModel} from './batch.model';

/**
 * Responsável por gerenciar o serviço de SQS.
 */
export class AwsSqs {
  /**
   * Cria os parâmetros para envio da mensagem.
   * @param message Mensagem para ser formatada.
   * @param groupId Agrupa as mensagens em uma subfila (Obrigatório para filas FIFO).
   * @returns Parametros formatados a partir da mensagem.
   */
  private createMessageParams(
    message: MessageModel,
    groupId?: string | undefined
  ): SendMessageRequest {
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
      MessageGroupId: groupId && groupId,
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

  /**
   * Envia uma mensagem para o serviço de SQS FIFO da Amazon.
   * @param message Mensagem para ser enviada.
   * @param messageGroupId Grupo onde a mensagem será adicionada.
   */
  async sendMessageToQueueFIFO(
    message: MessageModel,
    messageGroupId: string
  ): Promise<void> {
    const params = this.createMessageParams(message, messageGroupId);

    await this.sqs.sendMessage(params).promise();
  }

  /**
   * Formata as mensagens dentro do lote.
   * @param batch Lote de mensagens.
   * @returns Parametros formatados a partir da mensagem.
   */
  private createBatchDeleteParams(
    batch: BatchModel
  ): DeleteMessageBatchRequest {
    const entries = batch.entries.map(entry => ({
      Id: entry.messageId,
      ReceiptHandle: entry.receiptHandle,
    }));

    const params = {
      QueueUrl: batch.queueUrl,
      Entries: entries,
    };

    return params;
  }

  /**
   * Deleta o lote de mensagens.
   * @param batch Lote de mensagens.
   */
  async deleteMessageBatch(batch: BatchModel): Promise<void> {
    const params = this.createBatchDeleteParams(batch);

    await this.sqs.deleteMessageBatch(params).promise();
  }
}
