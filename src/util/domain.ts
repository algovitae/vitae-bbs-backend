import process from 'node:process';
import {SSM} from 'aws-sdk';

let cache: {api: string; web: string; email: string} | undefined;
export async function getDomains() {
  if (!cache) {
    const stage = process.env.STAGE ?? 'development';
    const suffix = stage[0].toUpperCase() + stage.slice(1);
    const ssm = new SSM();
    const parameter = await ssm.getParameter({
      Name: `Domain${suffix}`,
    }).promise();
    cache = JSON.parse(parameter.Parameter?.Value ?? '{}');
  }

  return cache!;
}
