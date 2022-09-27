import { ActionCreator } from 'redux';
import { EUIMultiChatPlatform, IUIMultiChatMessage } from './Chat.reducer';

export enum EChatActionTypes {
  ADD_MESSAGE = 'CHAT_ADD_MESSAGE',
  REMOVE_MESSAGE = 'CHAT_REMOVE_MESSAGE',
}

interface ChatAddMessageAction {
  type: EChatActionTypes.ADD_MESSAGE;
  data: IUIMultiChatMessage;
}

interface ChatRemoveMessageAction {
  type: EChatActionTypes.REMOVE_MESSAGE;
  data: {
    platform: EUIMultiChatPlatform;
    messageId: string;
  };
}

export type ChatAction = ChatAddMessageAction | ChatRemoveMessageAction;

export const addChatMessageAction =
  (message: IUIMultiChatMessage) => (dispatch: ActionCreator<ChatAddMessageAction>) => {
    dispatch({
      type: EChatActionTypes.ADD_MESSAGE,
      data: message,
    });
  };

export const removeChatMessageAction =
  (platform: EUIMultiChatPlatform, messageId: string) =>
  (dispatch: ActionCreator<ChatRemoveMessageAction>) => {
    dispatch({
      type: EChatActionTypes.REMOVE_MESSAGE,
      data: {
        platform,
        messageId,
      },
    });
  };
