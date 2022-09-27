export enum EMultiChatPlatform {
  TWITCH = 'TWITCH',
  YOUTUBE = 'YOUTUBE'
}

export interface IMultiChatMessage {
  // * PLATFORM DATA
  platform: EMultiChatPlatform;
  displayName: string;

  // * MESSAGE DATA
  uuid: string;
  username: string;
  content: string;
}

export interface ITwitchServiceConfig {
  platform: EMultiChatPlatform.TWITCH;
  username: string;
  oauthKey: string;
}

export interface IYoutubeServiceConfig {
  platform: EMultiChatPlatform.YOUTUBE;
  channelId: string;
  channelName: string;
}

export type MultiChatPlatformConfig = ITwitchServiceConfig | IYoutubeServiceConfig;