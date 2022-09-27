import { BaseChatService } from "../chat/services/BaseChatService";
import { EMultiChatPlatform, IMultiChatMessage } from "../chat/services/ChatService.types";
import { WebSocketServer } from 'ws';

export class WebsocketService {
  private registeredChatServices: BaseChatService[] = [];
  private websocketServer: WebSocketServer;

  constructor(port: number) {
    this.websocketServer = new WebSocketServer({ port });

    this.websocketServer.on('ui:sendMessage', this.handleSendMessage.bind(this));
  }

  public async destroy() {
    for (const service of this.registeredChatServices) {
      await service.destroy();
    }
    this.websocketServer.close();
  }

  public registerChatService(chatService: BaseChatService) {
    this.registeredChatServices.push(chatService);
    this.websocketServer.clients.forEach(client => {
      client.send({
        type: 'server:registerChatService',
        data: {
          platform: chatService.getPlatform(),
          displayName: chatService.getDisplayName()
        }
      });
    });
  }

  public unregisterChatService(chatService: BaseChatService) {
    this.registeredChatServices = this.registeredChatServices.filter((registeredChatService) => registeredChatService !== chatService);
    this.websocketServer.clients.forEach(client => {
      client.send({
        type: 'server:unregisterChatService',
        data: {
          platform: chatService.getPlatform(),
          displayName: chatService.getDisplayName()
        }
      });
    });
  }

  /**
   * Handle a new message being sent from the UI, this should be sent to all platforms
   * @param message 
   */
  private handleSendMessage(platform: EMultiChatPlatform | 'ALL', message: string) {
    for (const chatService of this.registeredChatServices) {
      if (platform !== 'ALL' && chatService.getPlatform() !== platform) continue;
      chatService.sendMessage(message);
    }
  }

  /**
   * Send a chat message to the UI to add to the chat display
   * @param message The message to add to the chat display
   */
  public addChatMessages(messages: IMultiChatMessage[]) {
    for (const message of messages) {
      console.info(`Chat Message in ${message.platform} received: ${message.username} > ${message.content}`);
      this.websocketServer.clients.forEach(client => {
        const event = this.createMessageReceivedEvent(message);
        client.send(event);
      });
    }
  }

  /**
   * Send a chat message to the UI to delete it from the chat display
   * @param platform The platform of the message being deleted 
   * @param uuid The uuid of the message to delete from the chat display
   */
  public deleteChatMessage(platform: EMultiChatPlatform, uuid: string) {
    console.info(`Chat Message in ${platform} deleted: ${uuid}`);
    this.websocketServer.clients.forEach(client => {
      const event = this.createMessageDeletedEvent(platform, uuid);
      client.send(event);
    });
  }

  private createMessageReceivedEvent(message: IMultiChatMessage): string {
    return JSON.stringify({
      type: 'MESSAGE_RECEIVED',
      payload: { ...message, deleted: false }
    });
  }

  private createMessageDeletedEvent(platform: EMultiChatPlatform, uuid: string): string {
    return JSON.stringify({
      type: 'MESSAGE_DELETED',
      payload: {
        platform,
        uuid
      }
    });
  }
}