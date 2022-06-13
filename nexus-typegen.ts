/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { AppContext } from "./src/graphql/context/app-context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Auth: { // root type
    token?: string | null; // String
    user_identity?: NexusGenRootTypes['UserIdentity'] | null; // UserIdentity
  }
  Group: { // root type
    group_id: string; // ID!
    group_name: string; // String!
  }
  Membership: { // root type
    group_id: string; // String!
    user_id: string; // String!
  }
  Mutation: {};
  Query: {};
  Thread: { // root type
    group_id: string; // ID!
    thread_id: string; // ID!
    thread_name: string; // String!
  }
  ThreadComment: { // root type
    body: string; // String!
    comment_id: string; // ID!
    commented_at: string; // String!
    thread_id: string; // ID!
    title: string; // String!
  }
  User: { // root type
    user_id: string; // ID!
    user_name: string; // String!
  }
  UserIdentity: { // root type
    email: string; // ID!
    password_hash: string; // String!
    user_id: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Auth: { // field return type
    token: string | null; // String
    user_identity: NexusGenRootTypes['UserIdentity'] | null; // UserIdentity
  }
  Group: { // field return type
    group_id: string; // ID!
    group_name: string; // String!
    threads: NexusGenRootTypes['Thread'][]; // [Thread!]!
  }
  Membership: { // field return type
    group: NexusGenRootTypes['Group']; // Group!
    group_id: string; // String!
    user: NexusGenRootTypes['User']; // User!
    user_id: string; // String!
  }
  Mutation: { // field return type
    addMembership: NexusGenRootTypes['Membership'] | null; // Membership
    createGroup: NexusGenRootTypes['Group'] | null; // Group
    createThread: NexusGenRootTypes['Thread'] | null; // Thread
    createThreadComment: NexusGenRootTypes['ThreadComment'] | null; // ThreadComment
    deleteMembership: NexusGenRootTypes['Group'] | null; // Group
    login: NexusGenRootTypes['Auth'] | null; // Auth
  }
  Query: { // field return type
    allUsers: NexusGenRootTypes['User'][]; // [User!]!
    group: NexusGenRootTypes['Group'] | null; // Group
    thread: NexusGenRootTypes['Thread'] | null; // Thread
    userIdentityByAuthorization: NexusGenRootTypes['UserIdentity'] | null; // UserIdentity
  }
  Thread: { // field return type
    comments: NexusGenRootTypes['ThreadComment'][]; // [ThreadComment!]!
    group_id: string; // ID!
    thread_id: string; // ID!
    thread_name: string; // String!
  }
  ThreadComment: { // field return type
    body: string; // String!
    comment_id: string; // ID!
    commented_at: string; // String!
    commented_by: NexusGenRootTypes['User']; // User!
    thread_id: string; // ID!
    title: string; // String!
  }
  User: { // field return type
    memberships: NexusGenRootTypes['Membership'][]; // [Membership!]!
    user_id: string; // ID!
    user_name: string; // String!
  }
  UserIdentity: { // field return type
    email: string; // ID!
    password_hash: string; // String!
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  Auth: { // field return type name
    token: 'String'
    user_identity: 'UserIdentity'
  }
  Group: { // field return type name
    group_id: 'ID'
    group_name: 'String'
    threads: 'Thread'
  }
  Membership: { // field return type name
    group: 'Group'
    group_id: 'String'
    user: 'User'
    user_id: 'String'
  }
  Mutation: { // field return type name
    addMembership: 'Membership'
    createGroup: 'Group'
    createThread: 'Thread'
    createThreadComment: 'ThreadComment'
    deleteMembership: 'Group'
    login: 'Auth'
  }
  Query: { // field return type name
    allUsers: 'User'
    group: 'Group'
    thread: 'Thread'
    userIdentityByAuthorization: 'UserIdentity'
  }
  Thread: { // field return type name
    comments: 'ThreadComment'
    group_id: 'ID'
    thread_id: 'ID'
    thread_name: 'String'
  }
  ThreadComment: { // field return type name
    body: 'String'
    comment_id: 'ID'
    commented_at: 'String'
    commented_by: 'User'
    thread_id: 'ID'
    title: 'String'
  }
  User: { // field return type name
    memberships: 'Membership'
    user_id: 'ID'
    user_name: 'String'
  }
  UserIdentity: { // field return type name
    email: 'ID'
    password_hash: 'String'
    user: 'User'
    user_id: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addMembership: { // args
      group_id: string; // String!
      user_id: string; // String!
    }
    createGroup: { // args
      group_name: string; // String!
      memberships: string[]; // [String!]!
    }
    createThread: { // args
      group_id: string; // String!
      thread_name: string; // String!
    }
    createThreadComment: { // args
      body: string; // String!
      group_id: string; // String!
      thread_id: string; // String!
      title: string; // String!
    }
    deleteMembership: { // args
      group_id: string; // String!
      user_id: string; // String!
    }
    login: { // args
      email?: string | null; // String
      password?: string | null; // String
    }
  }
  Query: {
    group: { // args
      group_id: string; // String!
    }
    thread: { // args
      group_id: string; // String!
      thread_id: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: AppContext;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}