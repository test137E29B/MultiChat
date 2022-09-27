import { WebsocketService } from "../../websocket/WebsocketService";
import { EMultiChatPlatform } from "./ChatService.types";

export abstract class BaseChatService {
  constructor(protected platform: EMultiChatPlatform, protected websocketService: WebsocketService) {}

  public getPlatform(): EMultiChatPlatform {
    return this.platform;
  }

  public abstract getDisplayName(): string;
  public abstract destroy(): void | Promise<void>;
  public abstract sendMessage(message: string): Promise<boolean>;
}