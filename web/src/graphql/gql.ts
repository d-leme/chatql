/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query getMessages($channelID: ID!) {\n    messages(channelID: $channelID) {\n      id\n      content\n      owner\n      createdAt\n    }\n  }\n": types.GetMessagesDocument,
    "\n  subscription messageAdded($channelID: ID!) {\n    messageAdded(channelID: $channelID) {\n      id\n      content\n      owner\n      createdAt\n    }\n  }\n": types.MessageAddedDocument,
    "\n  mutation addMessage($channelID: ID!, $content: String!) {\n    addMessage(channelID: $channelID, content: $content) {\n      id\n      content\n      owner\n      createdAt\n    }\n  }\n": types.AddMessageDocument,
    "\n  query channels {\n    channels {\n      id\n      name\n    }\n  }\n": types.ChannelsDocument,
    "\n  mutation createChannel($name: String!) {\n    createChannel(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateChannelDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMessages($channelID: ID!) {\n    messages(channelID: $channelID) {\n      id\n      content\n      owner\n      createdAt\n    }\n  }\n"): typeof import('./graphql').GetMessagesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription messageAdded($channelID: ID!) {\n    messageAdded(channelID: $channelID) {\n      id\n      content\n      owner\n      createdAt\n    }\n  }\n"): typeof import('./graphql').MessageAddedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addMessage($channelID: ID!, $content: String!) {\n    addMessage(channelID: $channelID, content: $content) {\n      id\n      content\n      owner\n      createdAt\n    }\n  }\n"): typeof import('./graphql').AddMessageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query channels {\n    channels {\n      id\n      name\n    }\n  }\n"): typeof import('./graphql').ChannelsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createChannel($name: String!) {\n    createChannel(name: $name) {\n      id\n      name\n    }\n  }\n"): typeof import('./graphql').CreateChannelDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
