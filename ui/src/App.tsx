import React from 'react';
import './App.css';
import { initStore } from './store/store';
import { WebSocketClient, WebSocketClientContext } from './components/WebsocketClient';
import { Provider } from 'react-redux';
import { ChatPage } from './pages/Chat.page';
import { BrowserRouter } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';

const store = initStore();

const App: React.FC = () => {
  const [webSocketClient, setWebSocketClient] = React.useState<WebSocketClient | null>(null);
  const [theme, setTheme] = useLocalStorage('theme', 'dark-theme');

  React.useEffect(() => {
    let client: WebSocketClient | null = null;
    // Give the page time to load before connecting to the websocket, incase there are re-renders and such
    const pageLoadTimeout = setTimeout(() => {
      client = new WebSocketClient(9000, store);
      setWebSocketClient(client);
    }, 1000);

    return () => {
      clearTimeout(pageLoadTimeout);
      client?.destroy();
    };
  }, []);

  React.useEffect(() => {
    // Theme handler
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark-theme' ? 'light-theme' : 'dark-theme');
  }, [theme, setTheme]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <WebSocketClientContext.Provider value={webSocketClient}>
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%' }}>
            <ChatPage />
            <div>
              <button onClick={handleToggleTheme}>{'Toggle Theme'}</button>
            </div>
          </div>
          {/* Add a settings cog in the top right that can be used to change settings, or the bottom right under the chat input */}
          {/* Add a settings UI overlay */}
        </WebSocketClientContext.Provider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
