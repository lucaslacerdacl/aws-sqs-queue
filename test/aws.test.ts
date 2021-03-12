import {AwsService} from '../src/aws.service';

describe('AWS Service', () => {
  const awsService = new AwsService();

  it('Retorna a instância SQS', () => {
    const origin = 'origin';
    const apiVersion = 'v1';
    const region = 'us-east-1';

    const sqs = awsService.getSqs(origin, apiVersion, region);

    expect(sqs).toBeTruthy();
  });

  it('Busca região das váriveis ambientes.', () => {
    const origin = 'origin';
    const apiVersion = 'v1';

    process.env[AwsService.AWS_REGION] = 'us-test';

    const sqs = awsService.getSqs(origin, apiVersion);

    expect(sqs).toBeTruthy();
  });

  it('Erro ao buscar região nas variáveis ambientes', () => {
    const origin = 'origin';
    const apiVersion = 'v1';

    delete process.env[AwsService.AWS_REGION];

    expect(() => awsService.getSqs(origin, apiVersion)).toThrow(
      `Value for process.env.${AwsService.AWS_REGION} not found.`
    );
  });
});
