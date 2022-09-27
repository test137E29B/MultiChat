import { WebsocketService } from "../../websocket/WebsocketService";
import { BaseChatService } from "./BaseChatService";
import { EMultiChatPlatform, ITwitchServiceConfig } from "./ChatService.types";
import { ChatUserstate, Client, DeleteUserstate } from 'tmi.js';

export class TwitchChatService extends BaseChatService {
  private client: Client;

  constructor(websocketService: WebsocketService, private config: ITwitchServiceConfig) {
    super(EMultiChatPlatform.TWITCH, websocketService);
    this.client = new Client({
      options: { debug: false },
      identity: {
        username: config.username, // Connect as the user, so messages can be sent
        password: config.oauthKey
      },
      channels: [config.username] // Connect to the user's own chat only
    });
    this.init();
  }

  private async init() {
    try {
      this.client.on('message', this.handleChatMessageReceived.bind(this));
      this.client.on('messagedeleted', this.handleChatMessageDeleted.bind(this));
      await this.client.connect();
      console.info(`[TWITCH] Connected to chat for ${this.config.username}`);

      // Finally, Register the chat service to receive messages from the UI and forward them to the twitch api / irc
      this.websocketService.registerChatService(this);
    } catch (error) {
      console.error(`Could not connect to Twitch Service: `, error);
    }
  }

  private handleChatMessageReceived(_channel: string, tags: ChatUserstate, message: string, self: boolean) {
    if (self) return; // Ignore messages sent by the user
    if (!tags.username || !tags.id) return; // Either no username or no message id, ignore the message
    if (tags["message-type"] !== 'chat') return; // Not a chat message, ignore it

    // * Filtering messages out should be handled in the websocket service generically, instead of in each streaming integration
    this.websocketService.addChatMessages([
      {
        platform: this.platform,
        displayName: this.getDisplayName(),
        username: tags.username,
        content: message,
        uuid: tags.id
      }
    ]);
  }

  private handleChatMessageDeleted(_channel: string, _username: string, _deletedMessage: string, userstate: DeleteUserstate) {
    if (!userstate["target-msg-id"]) return; // Either no username or no message id, ignore the message
    this.websocketService.deleteChatMessage(this.platform, userstate["target-msg-id"]);
  }

  public getDisplayName(): string {
    return this.config.username;
  }

  public async destroy(): Promise<void> {
    this.websocketService.unregisterChatService(this);
    await this.client.disconnect();
  }

  public async sendMessage(message: string): Promise<boolean> {
    await this.client.say(this.config.username, message);
    return true;
  }
}
