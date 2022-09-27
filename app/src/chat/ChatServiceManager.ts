import { WebsocketService } from "../websocket/WebsocketService";
import { EMultiChatPlatform, MultiChatPlatformConfig } from "./services/ChatService.types";
import { TwitchChatService } from "./services/TwitchChatService";
import { pathExists, readFile, writeFile } from 'fs-extra';
import { resolve } from 'path';
import { YouTubeChatService } from "./services/YouTubeChatService";

const SERVICES_PATH = resolve(__dirname, '../services.json');

export class ChatServiceManager {
  constructor(private websocketService: WebsocketService) {
    this.init();
  }

  public async init() {
    let configuredServices: MultiChatPlatformConfig[] = [];

    // Read config, or generate one
    if (await pathExists(SERVICES_PATH)) {
      const configString = (await readFile(SERVICES_PATH)).toString();
      const config = JSON.parse(configString);
      // TODO typeguard
      configuredServices = config.services;
    } else {
      console.warn('No services file found, generating one');
      await writeFile(SERVICES_PATH, JSON.stringify({ services: configuredServices }, null, 2));
    }

    // Load from
    for (const serviceConfig of configuredServices) {
      this.loadPlatform(serviceConfig);
    }
  }

  public loadPlatform(config: MultiChatPlatformConfig) {
    // We can support multiple of the same platform, so there's no need to check if the service already exists
    switch(config.platform) {
      case EMultiChatPlatform.TWITCH:
        new TwitchChatService(this.websocketService, config);
        break;
      case EMultiChatPlatform.YOUTUBE:
        new YouTubeChatService(this.websocketService, config);
        break;
      default:
        // Bypass typescript thinking it might never actually be reached
        console.error(`Unknown service platform "${(config as MultiChatPlatformConfig).platform}". Ensure the service has been created.`);
        break;
    }
  }
}