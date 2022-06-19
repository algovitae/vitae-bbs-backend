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
    userIdentity?: NexusGenRootTypes['UserIdentity'] | null; // UserIdentity
  }
  Group: { // root type
    groupName: string; // String!
    id: string; // ID!
  }
  Membership: { // root type
    groupId: string; // String!
    id: string; // ID!
    userId: string; // String!
  }
  Mutation: {};
  Query: {};
  Thread: { // root type
    groupId: string; // String!
    id: string; // ID!
    threadName: string; // String!
  }
  ThreadComment: { // root type
    body: string; // String!
    commentedAt: string; // String!
    id: string; // ID!
    threadId: string; // String!
    title: string; // String!
  }
  User: { // root type
    id: string; // ID!
    userName: string; // String!
  }
  UserIdentity: { // root type
    email: string; // String!
    id: string; // ID!
    passwordHash: string; // String!
    userId: string; // String!
  }
}

export interface NexusGenInterfaces {
  Node: NexusGenRootTypes['Group'] | NexusGenRootTypes['Membership'] | NexusGenRootTypes['Thread'] | NexusGenRootTypes['ThreadComment'] | NexusGenRootTypes['User'] | NexusGenRootTypes['UserIdentity'];
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Auth: { // field return type
    token: string | null; // String
    userIdentity: NexusGenRootTypes['UserIdentity'] | null; // UserIdentity
  }
  Group: { // field return type
    groupName: string; // String!
    id: string; // ID!
    memberships: NexusGenRootTypes['Membership'][]; // [Membership!]!
    threads: NexusGenRootTypes['Thread'][]; // [Thread!]!
  }
  Membership: { // field return type
    group: NexusGenRootTypes['Group']; // Group!
    groupId: string; // String!
    id: string; // ID!
    user: NexusGenRootTypes['User']; // User!
    userId: string; // String!
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
    groupId: string; // String!
    id: string; // ID!
    threadName: string; // String!
  }
  ThreadComment: { // field return type
    body: string; // String!
    commentedAt: string; // String!
    commentedBy: NexusGenRootTypes['User']; // User!
    id: string; // ID!
    threadId: string; // String!
    title: string; // String!
  }
  User: { // field return type
    id: string; // ID!
    memberships: NexusGenRootTypes['Membership'][]; // [Membership!]!
    userName: string; // String!
  }
  UserIdentity: { // field return type
    email: string; // String!
    id: string; // ID!
    passwordHash: string; // String!
    user: NexusGenRootTypes['User'] | null; // User
    userId: string; // String!
  }
  Node: { // field return type
    id: string; // ID!
  }
}

export interface NexusGenFieldTypeNames {
  Auth: { // field return type name
    token: 'String'
    userIdentity: 'UserIdentity'
  }
  Group: { // field return type name
    groupName: 'String'
    id: 'ID'
    memberships: 'Membership'
    threads: 'Thread'
  }
  Membership: { // field return type name
    group: 'Group'
    groupId: 'String'
    id: 'ID'
    user: 'User'
    userId: 'String'
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
    groupId: 'String'
    id: 'ID'
    threadName: 'String'
  }
  ThreadComment: { // field return type name
    body: 'String'
    commentedAt: 'String'
    commentedBy: 'User'
    id: 'ID'
    threadId: 'String'
    title: 'String'
  }
  User: { // field return type name
    id: 'ID'
    memberships: 'Membership'
    userName: 'String'
  }
  UserIdentity: { // field return type name
    email: 'String'
    id: 'ID'
    passwordHash: 'String'
    user: 'User'
    userId: 'String'
  }
  Node: { // field return type name
    id: 'ID'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addMembership: { // args
      groupId: string; // String!
      userId: string; // String!
    }
    createGroup: { // args
      groupName: string; // String!
      memberships: string[]; // [String!]!
    }
    createThread: { // args
      groupId: string; // String!
      threadName: string; // String!
    }
    createThreadComment: { // args
      body: string; // String!
      threadId: string; // String!
      title: string; // String!
    }
    deleteMembership: { // args
      groupId: string; // String!
      userId: string; // String!
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
  }
  Query: {
    group: { // args
      id: string; // String!
    }
    thread: { // args
      id: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  Node: "Group" | "Membership" | "Thread" | "ThreadComment" | "User" | "UserIdentity"
}

export interface NexusGenTypeInterfaces {
  Group: "Node"
  Membership: "Node"
  Thread: "Node"
  ThreadComment: "Node"
  User: "Node"
  UserIdentity: "Node"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "Node";

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