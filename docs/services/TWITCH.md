# Twitch.tv Chat Integration

## Service Config

```json
{
  "platform": "TWITCH",
  "username": "{{ Your twitch username }}",
  "oauthKey": "{{ Your oauth key, see below }}",
}
```

## Obtaining an OAuth Key

1. Go to [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/)
2. Click "Connect"
3. Copy the OAuth key from the input box on screen and place it in your `services.json` file as above.

> Note: If you do not have a `services.json` file, just run the app - one will be created for you.
