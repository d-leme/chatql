/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
};

export type Channel = {
  __typename?: 'Channel';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  owner: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage: Message;
  createChannel: Channel;
};


export type MutationAddMessageArgs = {
  channelID: Scalars['ID']['input'];
  content: Scalars['String']['input'];
};


export type MutationCreateChannelArgs = {
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  channels: Array<Channel>;
  messages: Array<Message>;
};


export type QueryMessagesArgs = {
  channelID: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: Message;
};


export type SubscriptionMessageAddedArgs = {
  channelID: Scalars['ID']['input'];
};

export type GetMessagesQueryVariables = Exact<{
  channelID: Scalars['ID']['input'];
}>;


export type GetMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', id: string, content: string, owner: string, createdAt: any }> };

export type MessageAddedSubscriptionVariables = Exact<{
  channelID: Scalars['ID']['input'];
}>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'Message', id: string, content: string, owner: string, createdAt: any } };

export type AddMessageMutationVariables = Exact<{
  channelID: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Message', id: string, content: string, owner: string, createdAt: any } };

export type ChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type ChannelsQuery = { __typename?: 'Query', channels: Array<{ __typename?: 'Channel', id: string, name: string }> };

export type CreateChannelMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'Channel', id: string, name: string } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(private value: string, public __meta__?: Record<string, any> | undefined) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetMessagesDocument = new TypedDocumentString(`
    query getMessages($channelID: ID!) {
  messages(channelID: $channelID) {
    id
    content
    owner
    createdAt
  }
}
    `) as unknown as TypedDocumentString<GetMessagesQuery, GetMessagesQueryVariables>;
export const MessageAddedDocument = new TypedDocumentString(`
    subscription messageAdded($channelID: ID!) {
  messageAdded(channelID: $channelID) {
    id
    content
    owner
    createdAt
  }
}
    `) as unknown as TypedDocumentString<MessageAddedSubscription, MessageAddedSubscriptionVariables>;
export const AddMessageDocument = new TypedDocumentString(`
    mutation addMessage($channelID: ID!, $content: String!) {
  addMessage(channelID: $channelID, content: $content) {
    id
    content
    owner
    createdAt
  }
}
    `) as unknown as TypedDocumentString<AddMessageMutation, AddMessageMutationVariables>;
export const ChannelsDocument = new TypedDocumentString(`
    query channels {
  channels {
    id
    name
  }
}
    `) as unknown as TypedDocumentString<ChannelsQuery, ChannelsQueryVariables>;
export const CreateChannelDocument = new TypedDocumentString(`
    mutation createChannel($name: String!) {
  createChannel(name: $name) {
    id
    name
  }
}
    `) as unknown as TypedDocumentString<CreateChannelMutation, CreateChannelMutationVariables>;