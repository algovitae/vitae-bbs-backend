import process from 'node:process';
import {SSM} from 'aws-sdk';

let cache: {title: string; maintainer: string; user_title_label: string} | undefined;
export async function getSiteConfig() {
  if (!cache) {
    const stage = process.env.STAGE ?? 'development';
    const suffix = stage[0].toUpperCase() + stage.slice(1);
    const ssm = new SSM();
    const parameter = await ssm.getParameter({
      Name: `Site${suffix}`,
    }).promise();
    cache = JSON.parse(parameter.Parameter?.Value ?? '{}');
  }

  return cache!;
}
