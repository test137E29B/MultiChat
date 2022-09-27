# YouTube Chat Integration

The YouTube Chat Integration allows you to connect to your YouTube Live Chat and receive messages from it. Currently it does not support sending messages to the chat, or deleting them. YouTube's API is quite limiting in their quotas, and you'd have to jump through hoops to set it up - support is planned in future!

## Service Config

```json
{
  "platform": "YOUTUBE",
  "channelId": "{{ Your Channel ID }}",
  "channelName": "{{ Your Channel Name }}"
}
```

The `channelName` property is only used in the UI to display the specific channel name in the case we support multiple channels from a single platform. It is not used for any other purpose - so make it anything you like!

## Obtaining your Channel ID

1. Go to your channel on YouTube.com
2. Your Channel ID is after `/channel/` in the URL. For example, if your channel URL is `https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw`, your Channel ID is `UCXuqSBlHAE6Xw-yeJA0Tunw`.

> Note: If you do not have a `services.json` file, just run the app - one will be created for you.
