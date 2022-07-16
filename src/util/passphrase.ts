import process from 'node:process';
import {SSM} from 'aws-sdk';

let cache: {signup: string} | undefined;
export async function getPassphraseConfig() {
  if (!cache) {
    const stage = process.env.STAGE ?? 'development';
    const suffix = stage[0].toUpperCase() + stage.slice(1);
    const ssm = new SSM();
    const parameter = await ssm.getParameter({
      Name: `Passphrase${suffix}`,
    }).promise();
    cache = JSON.parse(parameter.Parameter?.Value ?? '{}');
  }

  return cache!;
}
