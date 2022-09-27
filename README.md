# MultiChat for Streamers

MultiChat is a free self-hosted chat service for streamers. It allows you to connect to multiple chat services at once, such as Twitch, YouTube, and more.

MultiChat allows you to combine chats in your browser, and even add the URL as a source in OBS Studio and Streamlabs to show on stream.

## Features

- Connect to multiple chat services at once
- Manage chats in your browser, delete messages or send new ones!
- Send messages to multiple services at once
- Show combined chats on stream with OBS Studio or Streamlabs

## Supported Chat Services

- Twitch.tv
- YouTube

Missing support for your favourite platform? [Open an issue](https://github.com/test137E29B/MultiChat/issues/new)

## Installation

MultiChat is an application written in Node.js. You will not need to install Node however, as it is bundled with the application exe. This application does not install itself, the exe just runs the program. You can move the exe wherever you like, and it will still work.

MultiChat is currently only available for Windows as an exe - though if you have Node.js installed, you can run from the source code in this repository directly on all platforms.

- Download the latest release from the [releases page](https://github.com/test137E29B/MultiChat/releases)
- Run the exe to generate a services file, and then close the application with `CTRL + C`
- Complete the services file for your chat services. You can find the instructions for each service [here](docs/services)
- Run the exe again to start the application - it should connect to your chat services and start receiving messages

## Usage

MultiChat is a self-hosted application, so you will need to run it on your own computer. You must run it on the same computer as your streaming software, since the UI only responds to local connections from the same computer.

After you start the application, you will be given the URL to go to for your chat UI. This is an admministrator version of the UI for you to use while streaming - your moderators cannot use this view.

Once you open the URL, you can click the settings cog in the bottom right to open the settings menu. The settings menu can be used for the following:

- Change the chat theme between the built in themes
- Change the font size
- Copy the URL for your streaming software (OBS Studio or Streamlabs) - essentially it's the same as the URL you were given when you started the application, but with `?embedded=true` at the end. This prevents deleted messages from being shown on stream, as well as hides the chatbox and settings.

## Contributing

Contributions are welcome! If you would like to contribute, please open an issue or pull request.

We use the git flow branching model, so please open pull requests against the `develop` branch, from branches named `feature/your-feature-name` or `fix/your-fix-name`.

You can add new themes, chat services, or anything you feel makes this application better. If you have any questions, please open an issue!

## License

MultiChat is licensed under the MIT license. See the [LICENSE](LICENSE.md) file for more information.

## Credits

The following packages have made this project possible:

- [tmi.js](https://github.com/tmijs/tmi.js) - Twitch Chat IRC library (very good one too!)
- [youtube-chat](https://github.com/LinaTsukusu/youtube-chat) - YouTube Chat library
