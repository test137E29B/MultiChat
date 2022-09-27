# Planning for MultiChat

This document details the plans and integration structure for MultiChat.

## Services

MultiChat initially aims to support the following services

- Twitch.tv
- YouTube

Support initially is limited to receiving chat messages from the services, deleting chat messages where applicable, and sending chat messages to one or all services. Future support is planned for Moderation Actions as applicable per service, such as timeouts, bans, etc.

## App Websocket Events

The app should emit the following event types to all connected UI clients

- `CHAT_SERVICE_REGISTER` - When a chat service is registered and ready to be used for message receival and sending

  ```typescript
  interface IChatServiceRegisterEvent {
    type: "CHAT_SERVICE_REGISTER",
    payload: {
      platform: EMultiChatPlatform;
      displayName: string; // The username / channel name of the platform
    }
  }
  ```

- `CHAT_SERVICE_UNREGISTER` - When a chat service is unregistered and no longer available for message receival and sending

  ```typescript
  interface IChatServiceUnregisterEvent {
    type: "CHAT_SERVICE_UNREGISTER",
    payload: {
      platform: EMultiChatPlatform;
      displayName: string; // The username / channel name of the platform
    }
  }
  ```

- `MESSAGE_RECEIVED` - When a chat message is received from a service, such as Twitch or YouTube

  ```typescript
  interface IChatMessageReceivedEvent {
    type: "MESSAGE_RECEIVED",
    payload: {
      platform: EMultiChatPlatform;
      displayName: string; // The username / channel name of the platform
      uuid: string; // A unique identifier for the message
      username: string;
      content: string;
      deleted: boolean;
    }
  }
  ```

- `MESSAGE_DELETED` - When a chat message is deleted from a service, such as Twitch or YouTube

  ```typescript
  interface IChatMessageDeletedEvent {
    type: "MESSAGE_DELETED",
    payload: {
      platform: EMultiChatPlatform;
      uuid: string; // A unique identifier for the message
    }
  }
  ```

## UI Websocket Events

The UI should emit the following events to the app backend

- `MESSAGE_SEND` - When the ui wishes to send a message to one, or all chat services

  ```typescript
  interface IMessageSendEvent {
    type: "MESSAGE_SEND",
    payload: {
      platform: EMultiChatPlatform | 'ALL';
      content: string;
    }
  }
  ```

- `MESSAGE_DELETE` - When the ui wishes to delete a message from a chat service

  ```typescript
  interface IMessageDeleteEvent {
    type: "MESSAGE_DELETE",
    payload: {
      platform: EMultiChatPlatform;
      uuid: string; // A unique identifier for the message
    }
  }
  ```
