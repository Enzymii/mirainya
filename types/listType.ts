export type permission = "MEMBER" | "ADMINISTRATOR" | "OWNER";

export interface friendListInfo {
  id: number;
  nickname: string;
  remark: string;
}

export type friendList = friendListInfo[];

export interface groupListInfo {
  id: number;
  name: string;
  permission: permission;
}

export type groupList = groupListInfo[];

export interface memberListInfo {
  id: number;
  memberName: string;
  permission: permission;
  group: groupListInfo;
}

export type memberList = memberListInfo[];

export type personInfo = friendListInfo | memberListInfo;

export const isMember = (info: personInfo): info is memberListInfo => {
  return Boolean((<memberListInfo>info).group);
};

export const isFriend = (info: personInfo): info is friendListInfo => {
  return !Boolean((<memberListInfo>info).group);
};
