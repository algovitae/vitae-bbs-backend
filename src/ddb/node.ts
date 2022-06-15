import {MapperForType, StringAttribute} from '@shiftcoders/dynamo-easy';
import KSUID from 'ksuid';

export enum TableNames {
  Group = 'Group',
  Membership = 'Membership',
  Thread = 'Thread',
  ThreadComment = 'ThreadComment',
  User = 'User',
  UserIdentity = 'UserIdentity',
}

export enum TableIdPrefixes {
  Group = 'GRP',
  Membership = 'MEM',
  Thread = 'THR',
  ThreadComment = 'CMT',
  User = 'USR',
  UserIdentity = 'USI',
}

const tableNameToIdPrefix = (table: TableNames) => TableIdPrefixes[table];

export function createIdFactory(table: TableNames) {
  return () => `${(tableNameToIdPrefix(table))}::${KSUID.randomSync().toString()}`;
}

export function createRawIdFactory(table: TableNames) {
  return (hash: string) => `${(tableNameToIdPrefix(table))}::${hash}`;
}

export function idMapperFactory(table: TableNames) {
  const prefix = tableNameToIdPrefix(table);
  const mapper: MapperForType<string, StringAttribute> = {
    fromDb: av => `${prefix}::${av.S}`,
    toDb: pv => ({S: pv.slice(prefix.length + 2)}),
  };
  return mapper;
}
