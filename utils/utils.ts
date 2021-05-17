import { MessageChain, MessageType } from "../types/messageType";
import colors = require("colors/safe");

const escapeMessage = (message: string): string => {
  return message
    .replace("<", "&lt;")
    .replace(">", "&gt;")
    .replace("@", "&at;")
    .replace("[", "&lb;")
    .replace("]", "&rb;");
};

export const outputMessage = (message: MessageChain): string => {
  let result: string = "";

  message.forEach((msg: MessageType) => {
    switch (msg.type) {
      case "Plain":
        result += colors.white(escapeMessage(msg.text));
        break;
      case "Image":
      case "FlashImage":
      case "Voice":
        result += colors.cyan(`[msg:${msg.type}, url=${msg.url}]`);
        break;
      case "At":
        result += colors.magenta(`[@${msg.target}]`);
        break;
      case "AtAll":
        result += colors.magenta(`[@All]`);
        break;
      case "Face":
        result += `[msg:Face, id=${msg.faceId}].cyan`;
        break;
      case "Json":
        result += colors.blue(`[msg:Json\n${JSON.stringify(msg.json)}]`);
        break;
      case "Xml":
        result += colors.blue(`[msg:Xml\n${msg.xml}]`);
        break;
      case "App":
        result += colors.blue(`[msg:App\n${msg.content}]`);
        break;
      case "Quote":
        result += colors.yellow(`[msg:Quote, id=${msg.id}]`);
        break;
      case "Source": //好像不太清楚是干啥的
        break;
      default:
        result += colors.red(`[Unrecognized Message：${JSON.stringify(msg)}]`);
        break;
    }
  });

  return result;
};

export const sleep = async (ms: number): Promise<any> => {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
};
