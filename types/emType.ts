import * as ListType from './listType';
import { EventType } from './eventType';
import { MessageChain } from './messageType';

export type FriendMessageType = {
  type: 'FriendMessage';
  messageChain: MessageChain;
  sender?: ListType.friendListInfo;
};

export type GroupMessageType = {
  type: 'GroupMessage';
  messageChain: MessageChain;
  sender?: ListType.memberListInfo;
};

export type TempMessageType = {
  type: 'TempMessage';
  messageChain: MessageChain;
  sender?: ListType.memberListInfo;
};

export type RecvMessageType =
  | FriendMessageType
  | GroupMessageType
  | TempMessageType;

export type RecvType = EventType | RecvMessageType;

export type EMTypeChain = RecvType[];

export const isRecvMessage = (x: RecvType): x is RecvMessageType => {
  return (
    x.type == 'GroupMessage' ||
    x.type == 'FriendMessage' ||
    x.type == 'TempMessage'
  );
};
