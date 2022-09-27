import { Store } from '@reduxjs/toolkit';
import { addChatMessageAction, removeChatMessageAction } from '../store/Chat/Chat.actions';
import { ApplicationState } from '../store/store';
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from 'websocket';
import React from 'react';
import {
  IMultiChatMessageDeletedEvent,
  IMultiChatMessageReceivedEvent,
  isValidMultiChatEvent,
} from './MultiChatEvents.types';

export class WebSocketClient {
  private client: W3CWebSocket;
  constructor(port: number, private store: Store<ApplicationState>) {
    console.info('WebSocket Client Connecting...');
    this.client = new W3CWebSocket(`ws://localhost:${port}`);
    this.client.onmessage = this.processEvent.bind(this);
    this.client.onopen = () => console.info('WebSocket Client Connected');
    this.client.onerror = (error: Error) => {
      if (error.message === undefined) return; // This is not a real error, likely just a connection close during connect
      console.info(`WebSocket Client Error: ${error.message}`, error);
    };
  }

  public destroy() {
    this.client.close();
  }

  public isConnected() {
    return this.client.readyState === WebSocket.OPEN;
  }

  private processEvent(event: IMessageEvent) {
    try {
      if (typeof event.data !== 'string') return; // We only care about string messages

      const eventData = JSON.parse(event.data);
      if (!isValidMultiChatEvent(eventData)) return; // We only care about valid events
      switch (eventData.type) {
        case 'MESSAGE_RECEIVED':
          console.info('Received MESSAGE_RECEIVED event with payload:', eventData.payload);
          this.handleChatMessageReceived(eventData.payload);
          break;
        case 'MESSAGE_DELETED':
          console.info('Received MESSAGE_DELETED event with payload:', eventData.payload);
          this.handleChatMessageDeleted(eventData.payload);
          break;
      }
      console.info('Event received', eventData);
    } catch (err) {
      // Swallow error, it's likely a JSON parse error
    }
  }

  private handleChatMessageReceived(message: IMultiChatMessageReceivedEvent['payload']) {
    addChatMessageAction(message)(this.store.dispatch);
  }
  private handleChatMessageDeleted({ platform, uuid }: IMultiChatMessageDeletedEvent['payload']) {
    removeChatMessageAction(platform, uuid)(this.store.dispatch);
  }

  public deleteChatMessage() {
    // TODO
  }
  public sendChatMessage(message: string) {
    if (!this.isConnected()) return console.info('Cannot send message, websocket is not connected');
    this.client.send(message);
  }
}

export const WebSocketClientContext = React.createContext<WebSocketClient | null>(null);
