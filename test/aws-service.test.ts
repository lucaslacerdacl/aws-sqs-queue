import {AwsService} from '../src/aws-service';

test('Inicializa classe com todos os parâmetros', () => {
  const origin = 'origin';
  const apiVersion = 'v1';
  const region = 'br';

  const awsService = new AwsService();
  const sqs = awsService.getSqs(origin, apiVersion, region);

  expect(sqs).toBeTruthy();
});
