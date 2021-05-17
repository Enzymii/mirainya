import { permission, groupListInfo, memberListInfo } from "./listType";

export type EventType =
  | {
      type: "BotOnlineEvent";
      qq: number;
    }
  | {
      type: "BotOfflineEventActive";
      qq: number;
    }
  | {
      type: "BotOfflineEventForce";
      qq: number;
    }
  | {
      type: "BotOfflineEventDropped";
      qq: number;
    }
  | {
      type: "BotReloginEvent";
      qq: number;
    }
  | {
      type: "BotGroupPermissionChangeEvent";
      origin: permission;
      new?: permission; //deprecated
      current: permission;
      group: groupListInfo;
    }
  | {
      type: "BotMuteEvent";
      durationSeconds: number;
      operator: memberListInfo;
    }
  | {
      type: "BotUnmuteEvent";
      operator: memberListInfo;
    }
  | {
      type: "BotJoinGroupEvent";
      group: groupListInfo;
    }
  | {
      type: "BotLeaveEventActive";
      group: groupListInfo;
    }
  | {
      type: "BotLeaveEventKick";
      group: groupListInfo;
    }
  | {
      type: "GroupRecallEvent";
      authorId: number;
      messageId: number;
      group: groupListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "FriendRecallEvent";
      authorId: number;
      messageId: number;
      time: number;
      operator: number;
    }
  | {
      type: "GroupNameChangeEvent";
      origin: string;
      new?: string; //deprecated
      current: string;
      group: groupListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "GroupEntranceAnnouncementChangeEvent"; //入群公告改变
      origin: string;
      new?: string; //deprecated
      current: string;
      group: groupListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "GroupMuteAllEvent";
      origin: boolean;
      new?: boolean; //deprecated
      current: boolean;
      group: groupListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "GroupAllowAnonymousChatEvent";
      origin: boolean;
      new?: boolean; //deprecated
      current: boolean;
      group: groupListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "GroupAllowConfessTalkEvent";
      origin: boolean;
      new?: boolean; //deprecated
      current: boolean;
      group: groupListInfo;
      isByBot: boolean;
    }
  | {
      type: "GroupAllMemberInviteEvent";
      origin: boolean;
      new?: boolean; //deprecated
      current: boolean;
      group: groupListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "MemberJoinEvent";
      member: memberListInfo;
    }
  | {
      type: "MemberLeaveEventKick";
      member: memberListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "MemberLeaveEventQuit";
      member: memberListInfo;
    }
  | {
      type: "MemberCardChangeEvent";
      origin: string;
      new?: string; //deprecated
      current: string;
      member: memberListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "MemberSpecialTitleChangeEvent";
      origin: string;
      new?: string; //deprecated
      current: string;
      member: memberListInfo;
      //operator只能是群主
    }
  | {
      type: "MemberPermissionChangeEvent";
      origin: permission;
      new: permission; //deprecated
      current: permission;
      member: memberListInfo;
      //operator只能是群主
    }
  | {
      type: "MemberMuteEvent"; //该成员不是bot
      durationSeconds: number;
      member: memberListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "MemberUnmuteEvent"; //该成员不是bot
      member: memberListInfo;
      operator?: memberListInfo;
    }
  | {
      type: "NewFriendRequestEvent";
      eventId: number;
      fromId: number;
      groupId: number; //申请人如果通过某个群添加好友，该项为该群群号；否则为0
      nick: string;
      message: string;
    }
  | {
      type: "MemberJoinRequestEvent";
      eventId: number;
      fromId: number;
      groupId: number;
      groupName: string;
      nick: string;
      message: string;
    }
  | {
      type: "BotInvitedJoinGroupRequestEvent";
      eventId: number;
      fromId: number;
      groupId: number;
      groupName: string;
      nick: string;
      message: string;
    };
