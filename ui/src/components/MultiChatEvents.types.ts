import {
  EUIMultiChatPlatform,
  isMultiChatMessage,
  IUIMultiChatMessage,
} from '../store/Chat/Chat.reducer';

export interface IMultiChatMessageReceivedEvent {
  type: 'MESSAGE_RECEIVED';
  payload: IUIMultiChatMessage;
}

export const isMultiChatMessageReceivedEvent = (
  obj: any,
): obj is IMultiChatMessageReceivedEvent => {
  return obj && obj.type === 'MESSAGE_RECEIVED' && isMultiChatMessage(obj.payload);
};

export interface IMultiChatMessageDeletedEvent {
  type: 'MESSAGE_DELETED';
  payload: {
    platform: IUIMultiChatMessage['platform'];
    uuid: IUIMultiChatMessage['uuid'];
  };
}

export const isMultiChatMessageDeletedEvent = (obj: any): obj is IMultiChatMessageDeletedEvent => {
  return (
    obj &&
    obj.type === 'MESSAGE_DELETED' &&
    obj.payload &&
    obj.payload.platform in EUIMultiChatPlatform &&
    typeof obj.payload.uuid === 'string'
  );
};

export type MultiChatEvent = IMultiChatMessageReceivedEvent | IMultiChatMessageDeletedEvent;

export const isValidMultiChatEvent = (event: any): event is MultiChatEvent => {
  return isMultiChatMessageReceivedEvent(event) || isMultiChatMessageDeletedEvent(event);
};
