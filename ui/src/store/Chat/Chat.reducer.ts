import { ChatAction, EChatActionTypes } from './Chat.actions';

export enum EUIMultiChatPlatform {
  TWITCH = 'TWITCH',
  YOUTUBE = 'YOUTUBE',
}

export interface IUIMultiChatMessage {
  // * PLATFORM DATA
  platform: EUIMultiChatPlatform;
  displayName: string;

  // * MESSAGE DATA
  uuid: string;
  username: string;
  content: string;

  // * UI INFO
  deleted: boolean;
}

export function isMultiChatMessage(obj: any): obj is IUIMultiChatMessage {
  return (
    obj &&
    obj.platform in EUIMultiChatPlatform &&
    typeof obj.displayName === 'string' &&
    typeof obj.uuid === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.deleted === 'boolean'
  );
}

export interface ChatState {
  messages: IUIMultiChatMessage[];
}

export const initialState: ChatState = {
  messages: [],
};

export default function (state: ChatState = initialState, action: ChatAction) {
  switch (action.type) {
    case EChatActionTypes.ADD_MESSAGE: {
      const newState = { ...state };
      const newMessages = [...state.messages];
      newState.messages = newMessages;
      newState.messages.push(action.data);
      if (newState.messages.length > 200) {
        // This message would be over the previous 200 messages limit, so remove the oldest message to remain under
        // This limit could be configurable in future
        newState.messages.shift();
      }
      return newState;
    }
    case EChatActionTypes.REMOVE_MESSAGE: {
      const newState = { ...state };
      const newMessages = [...state.messages];
      newState.messages = newMessages;
      const deletedMessage = newState.messages.find(
        (message) =>
          message.uuid === action.data.messageId && message.platform === action.data.platform,
      );
      if (deletedMessage) {
        deletedMessage.deleted = true;
      }
      return newState;
    }
    default:
      return state;
  }
}
