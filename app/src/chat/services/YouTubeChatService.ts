import { WebsocketService } from "../../websocket/WebsocketService";
import { BaseChatService } from "./BaseChatService";
import { EMultiChatPlatform, IYoutubeServiceConfig } from "./ChatService.types";
import {LiveChat} from 'youtube-chat';
import { ChatItem } from "youtube-chat/dist/types/data";

export class YouTubeChatService extends BaseChatService {
  private client: LiveChat;
  private destroyed: boolean = false;

  constructor(websocketService: WebsocketService, private config: IYoutubeServiceConfig) {
    super(EMultiChatPlatform.YOUTUBE, websocketService);
    this.client = new LiveChat({ channelId: this.config.channelId  });
    this.init();
  }

  private async awaitStreamConnection(): Promise<void> {
    try {
      const started = await this.client.start();
      if (this.destroyed) return; // Was closed before could even start
      if (!started) throw new Error("Live Stream was not found");
    } catch (err) {
      if ((err as Error).message === "Live Stream was not found") {
        await new Promise(res => setTimeout(res, 1000)); // Try once a second
        return this.awaitStreamConnection();
      }
      throw err;
    }
  }

  private async init() {
    try {
      await this.awaitStreamConnection();
      console.info(`[YOUTUBE] Connected to chat for ${this.config.channelName}`);

      this.client.on('chat', this.handleChatMessageReceived.bind(this));
      // * Currently deleting messages is not supported
      // this.client.on('messagedeleted', this.handleChatMessageDeleted.bind(this));

      // Finally, Register the chat service to receive messages from the UI and forward them to the twitch api / irc
      this.websocketService.registerChatService(this);
    } catch (error) {
      console.error(`Could not connect to YouTube Service -`, error);
    }
  }

  private handleChatMessageReceived(chatMessage: ChatItem) {
    // if (chatMessage.author.channelId === this.config.channelId) return; // Ignore the user's messages

    function isTextMessage(input: any): input is { text: string } {
      return input && typeof input.text === 'string';
    }

    // * Filtering messages out should be handled in the websocket service generically, instead of in each streaming integration
    this.websocketService.addChatMessages([
      {
        platform: this.platform,
        displayName: this.getDisplayName(),
        username: chatMessage.author.name,
        content: chatMessage.message.map(e => isTextMessage(e) ? e.text : null).filter(e => e !== null).join(' '),
        uuid: `${chatMessage.author.channelId}-${chatMessage.timestamp.getTime()}`
      }
    ]);
  }

  public getDisplayName(): string {
    return this.config.channelName;
  }

  public async destroy(): Promise<void> {
    this.websocketService.unregisterChatService(this);
    this.destroyed = true;
    await this.client.stop();
  }

  public async sendMessage(_message: string): Promise<boolean> {
    // TODO use api to send message
    // await this.client.say(this.config.username, message);
    return true;
  }
}
