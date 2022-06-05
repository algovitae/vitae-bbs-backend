// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
import process from 'node:process';

const stage = process.env.STAGE ?? 'development';
export const ddbTableSuffix = stage[0].toUpperCase() + stage.slice(1);

