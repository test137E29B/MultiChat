import React from 'react';
import { WebSocketClientContext } from '../components/WebsocketClient';
import { ApplicationState } from '../store/store';
import { useSelector } from 'react-redux';
import { EUIMultiChatPlatform, IUIMultiChatMessage } from '../store/Chat/Chat.reducer';
import { useQuery } from '../hooks/useQuery';
import { TwitchChatMessage } from '../components/Chat/TwitchChatMessage';

export const ChatPage: React.FC = () => {
  const webSocketClient = React.useContext(WebSocketClientContext);
  const { messages } = useSelector((state: ApplicationState) => state.chat);
  const embedded = useQuery('embedded');

  const renderChatMessage = React.useCallback(
    (message: IUIMultiChatMessage) => {
      if (!!embedded && message.deleted) return null;
      switch (message.platform) {
        case EUIMultiChatPlatform.TWITCH:
          return (
            <TwitchChatMessage message={message} key={`${message.platform}---${message.uuid}`} />
          );
        default:
          return null;
      }
    },
    [embedded],
  );

  const isWebsocketConnected = React.useMemo(() => {
    console.info('Memo Trigger with', webSocketClient);
    return !!(webSocketClient && webSocketClient.isConnected());
  }, [webSocketClient]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 1, width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {messages.map(renderChatMessage)}
        </div>
        {!embedded && (
          <textarea disabled={isWebsocketConnected} rows={4} style={{ resize: 'none' }} />
        )}
      </div>
    </div>
  );
};
