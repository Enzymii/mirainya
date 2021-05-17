import { MessageChain, MessageType, PokeName } from "../types/messageType";

const MessageTxt = (txt: string): MessageType => ({
  type: "Plain",
  text: txt,
});

const MessageJson = (json: JSON): MessageType => ({
  type: "Json",
  json: JSON.stringify(json),
});

const MessageImage = (
  imgid?: string,
  url?: string,
  path?: string
): MessageType => ({
  type: "Image",
  imageId: imgid,
  url: url,
  path: path,
});

const MessageFlashImage = (
  imgid?: string,
  url?: string,
  path?: string
): MessageType => ({
  type: "FlashImage",
  imageId: imgid,
  url: url,
  path: path,
});

const MessageVoice = (
  voiceId?: string,
  url?: string,
  path?: string
): MessageType => ({
  type: "Voice",
  voiceId: voiceId,
  url: url,
  path: path,
});

//显然我不懂表情的中文 所以只考虑用id就好了吧:-P
const MessageEmoji = (id: number): MessageType => ({
  type: "Face",
  faceId: id,
  name: null,
});

const MessageAt = (qq: number): MessageType => ({
  type: "At",
  target: qq,
});

const MessageAtAll = (): MessageType => ({ type: "AtAll" });

const MessagePoke = (name: PokeName) => ({
  type: "Poke",
  name: name,
});

//Quote好像没有必要封装...

//Xml和App作为TODO吧先...


export default  {
  Text: MessageTxt,
  Json: MessageJson,
  Image: MessageImage,
  Flash: MessageFlashImage,
  Emoji: MessageEmoji,
  Voice: MessageVoice,
  At: MessageAt,
  AtAll: MessageAtAll,
  Poke: MessagePoke,
};