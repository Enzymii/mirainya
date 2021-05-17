import MiraiApi from './miraiAPI';
import { RecvType } from './types/emType';
import WebSocket = require('ws');
import { red } from 'colors/safe';

export type MiraiConfig = {
  host?: string;
  port?: number;
  qq: number;
  authKey: string;
  enableWebsocket?: boolean;
};

export default class MiraiBot {
  api: MiraiApi;
  private url: string;
  qq: number;
  authKey: string;
  private enableWebsocket: boolean;
  private interval?: number;
  private heartbeatInterval: number;

  constructor(
    customConfig: MiraiConfig,
    interval: number = 1000,
    heartBeatInterval: number = 2333
  ) {
    const defaultConfig = {
      host: '127.0.0.1',
      port: 7777,
      enableWebsocket: true,
    };

    let completeConfig: MiraiConfig = Object.assign(
      defaultConfig,
      customConfig
    );

    let { host, port, qq, authKey, enableWebsocket } = completeConfig;
    this.api = new MiraiApi(host, port);
    this.qq = qq;
    this.url = `${host}:${port}`;
    this.enableWebsocket = enableWebsocket;
    this.authKey = authKey;

    //Only fetch message by loop needs interval
    this.interval = this.enableWebsocket ? 0 : interval;
  }

  async login(): Promise<boolean> {
    return await this.api.login(this.authKey, this.qq);
  }

  listen(
    callback: (msg: RecvType) => any,
    type: 'message' | 'event' | 'all' = 'all'
  ): any {
    if (!this.api.isVerified()) {
      console.log(red('Listen Failed: Not Verified!'));
      return;
    }

    setInterval(async () => {
      if (!(await this.api.testConnection())) {
        console.log('Connection Failed, Process Abort.');
        process.exit(0);
      }
    }, this.heartbeatInterval);

    const handle = (msg: RecvType, callback: (msg: RecvType) => any): any => {
      switch (type) {
        case 'message':
          if (
            msg.type == 'FriendMessage' ||
            msg.type == 'GroupMessage' ||
            msg.type == 'TempMessage'
          ) {
            callback(msg);
          }
          break;
        case 'event':
          if (
            !(
              msg.type == 'FriendMessage' ||
              msg.type == 'GroupMessage' ||
              msg.type == 'TempMessage'
            )
          ) {
            callback(msg);
          }
          break;
        default:
          callback(msg);
          break;
      }
    };

    if (this.enableWebsocket) {
      console.log(`listen on ws://${this.url}`);
      const ws = new WebSocket(
        `ws://${this.url}/${type}?sessionKey=${this.api.getSession()}`
      );
      ws.on('message', (data: WebSocket.Data) => {
        const msg: RecvType = JSON.parse(data.toString());
        handle(msg, callback);
      });
    } else {
      setInterval(async () => {
        let incomingMessages = await this.api.getMiraiMessage('fetchMessage');
        incomingMessages.forEach((inMsg: RecvType) => {
          handle(inMsg, callback);
        });
      }, this.interval);
    }
  }
}
