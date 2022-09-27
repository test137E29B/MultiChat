import { ChatServiceManager } from "./chat/ChatServiceManager";
import { WebsocketService } from "./websocket/WebsocketService";

let closed = false;
const exitHandler = (websocketService: WebsocketService) => async (code: number) => {
  if (closed) return;
  closed = true;
  console.info(`Exiting MultiChat...`);
  await websocketService.destroy();
  console.info('All services cleaned up, thanks for using MultiChat!');
  process.exit(code);
};

(async () => {
  console.info(`Starting MultiChat...`);
  const websocketService = new WebsocketService(9000);
  new ChatServiceManager(websocketService);
  process.on('exit', exitHandler(websocketService));
  process.on('SIGINT', exitHandler(websocketService));
  process.on('SIGUSR1', exitHandler(websocketService));
  process.on('SIGUSR2', exitHandler(websocketService));
  process.on('uncaughtException', exitHandler(websocketService));
  console.info(`MultiChat has been started. Visit http://localhost:9000 to view the chat`);
})();
