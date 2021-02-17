import {SQS} from 'aws-sdk';
import {AwsSqs} from './sqs/aws-sqs';

/**
 * Responsável por inicializar recursos da Amazon SDK.
 */
export class AwsService {
  /**
   * Busca pela variável ambiente.
   * @param key Nome da chave a ser buscada no ambiente.
   */
  private getValueFromEnv(key: string): string {
    const value = process.env[key];

    if (!value) {
      throw Error(`Value for process.env.${key} not found.`);
    }

    return value;
  }

  /**
   * Inicializa o serviço SQS.
   * @param origin Identifica a origem das mensagem que serão enviadas.
   * @param apiVersion Versão da api para recurso SQS da AWS.
   * @param region Região do recurso SQS.
   * @returns Uma instância do serviço de SQS.
   */
  getSqs(origin: string, apiVersion: string, region?: string): AwsSqs {
    if (!region) {
      region = this.getValueFromEnv('AWS_REGION');
    }

    const sqs = new SQS({apiVersion, region});
    const awsSqs = new AwsSqs(sqs, origin);
    return awsSqs;
  }
}
