export type PokeName =
  | "Poke"
  | "ShowLove"
  | "Like"
  | "Heartbroken"
  | "SixSixSix"
  | "FangDaZhao";

export type SourceMsg = {
  type: "Source";
  id: number;
  time: number;
};
export type QuoteMsg = {
  type: "Quote";
  id: number; //原消息id
  groupId: number; //引用时群号, 好友消息时为0
  senderId: number; //发送者qq
  targetId: number; //接受者qq(被引用的)
  origin: MessageChain;
};
export type AtMsg = {
  type: "At";
  target: number;
  display?: string; //At时显示的文字，发送消息时无效，自动使用群名片
};
export type AtAllMsg = {
  type: "AtAll";
};
export type FaceMsg = {
  type: "Face";
  faceId?: number; //可选, 优先级高于name
  name?: string;
};
export type PlainMsg = {
  type: "Plain";
  text: string;
};
export type ImageMsg = {
  type: "Image";
  //优先级 imageId > url > path
  imageId?: string; //图片的imageId，**群图片**与**好友图片**格式不同。不为空时将忽略url属性 (我倾向于不用QAQ)
  url?: string; //图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
  path?: string; //图片的路径，发送本地图片，相对路径于plugins/MiraiAPIHTTP/images
};
export type FlashImageMsg = {
  type: "FlashImage";
  imageId?: string; //同上
  url?: string;
  path?: string;
};
export type VoiceMsg = {
  type: "Voice";
  voiceId?: string;
  url?: string;
  path?: string; //和上面差不多, 相对路径于plugins/MiraiAPIHTTP/voices
};
export type XmlMsg = {
  type: "Xml";
  xml: string;
};
export type JsonMsg = {
  type: "Json";
  json: string;
};
export type AppMsg = {
  type: "App";
  content: string;
};
export type PokeMsg = {
  type: "Poke";
  name: PokeName;
};

export type MessageType =
  | SourceMsg
  | QuoteMsg
  | AtMsg
  | AtAllMsg
  | FaceMsg
  | PlainMsg
  | ImageMsg
  | FlashImageMsg
  | VoiceMsg
  | XmlMsg
  | JsonMsg
  | AppMsg
  | PokeMsg;

export type MessageChain = MessageType[];
