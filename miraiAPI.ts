import axios from "axios";
import colors = require("colors/safe");
import { MessageChain, SourceMsg } from "./types/messageType";
import * as utils from "./utils/utils";
import * as listType from "./types/listType";
import { GroupConfig, MemberConfig } from "./types/configType";
import { RecvType, EMTypeChain } from "./types/emType";
import makeMsg from "./utils/makeMsg";

export default class MiraiAPI {
  private authed: boolean;
  private verified: boolean;
  private baseUrl: string;
  // private wsUrl: string;
  private session?: string;

  constructor(host: string, port: number) {
    this.baseUrl = `http://${host}:${port}`;
    // this.wsUrl = `ws://${host}:${port}`;
    this.authed = this.verified = false;
    this.session = null;
  }

  //一些原生的API
  async auth(authKey: string): Promise<boolean> {
    if (!(await this.testConnection())) {
      return false;
    }

    let { code, session } = (
      await axios.post(this.baseUrl + "/auth", {
        authKey: authKey,
      })
    ).data;

    if (code) {
      console.log(colors.red("Auth Failed!"));
    } else {
      this.authed = true;
      this.session = session;

      console.log(
        colors.green("Auth Success! Session: "),
        colors.blue(`${session}`)
      );
    }

    return this.authed;
  }

  async verify(qq: number): Promise<boolean> {
    if (!this.authed) {
      console.log(colors.red("Verify Failed: Not Authorized!"));
      return false;
    }
    let { code, msg } = (
      await axios.post(this.baseUrl + "/verify", {
        sessionKey: this.session,
        qq: qq,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`Verify Failed with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
    } else {
      this.verified = true;

      console.log(
        colors.green(`Verify Session[`) +
          colors.cyan(this.session) +
          colors.green(`] with QQ[`) +
          colors.cyan(qq.toString()) +
          colors.green("] Success!")
      );
    }

    return this.verified;
  }

  // 整合一下auth和verify
  async login(authKey: string, qq: number): Promise<boolean> {
    return (await this.auth(authKey)) && (await this.verify(qq));
  }

  async release(qq: number): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red("Release Failed: Not Verified!"));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/release", {
        session: this.session,
        qq: qq,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`Release Failed with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
    } else {
      console.log(
        colors.green(`Release Session${this.session} with QQ[${qq}] Success`)
      );

      this.verified = false;
      this.session = null;
    }

    return !this.isVerified();
  }

  /**
   * @method sendFriendMessage
   * @param qq: number
   * @param message: MessageChain
   * @param quote?: number
   * @returns messageId/-1 when failed
   */
  async sendFriendMessage(
    qq: number,
    message: MessageChain,
    quote?: number
  ): Promise<number> {
    if (!this.isVerified()) {
      console.log(colors.red(`SendFriendMessage Error: Not Verified!`));
      return -1;
    }

    let { code, msg, messageId } = (
      await axios.post(this.baseUrl + "/sendFriendMessage", {
        sessionKey: this.session,
        target: qq,
        messageChain: message,
        quote: quote,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SendFriendMessage Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return -1;
    } else {
      console.log(
        colors.green(`SendFriendMessage To [`) +
          colors.cyan(qq.toString()) +
          colors.green(`] Message ID: `) +
          colors.yellow(messageId.toString())
      );
      console.log(utils.outputMessage(message));
      return messageId;
    }
  }

  /**
   * @method sendTempMessage
   * @param qq: number
   * @param group: number
   * @param message: MessageChain
   * @param quote?: number
   * @returns messageId/-1 when failed
   */
  async sendTempMessage(
    qq: number,
    group: number,
    message: MessageChain,
    quote?: number
  ): Promise<number> {
    if (!this.isVerified()) {
      console.log(colors.red(`SendTempMessage Error: Not Verified!`));
      return -1;
    }

    let { code, msg, messageId } = (
      await axios.post(this.baseUrl + "/sendTempMessage", {
        sessionKey: this.session,
        qq: qq,
        group: group,
        messageChain: message,
        quote: quote,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SendTempMessage Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return -1;
    } else {
      console.log(
        colors.green(`SendTempMessage To [`) +
          colors.cyan(qq.toString()) +
          colors.green(`] Message ID: `) +
          colors.yellow(messageId.toString())
      );
      console.log(utils.outputMessage(message));
      return messageId;
    }
  }

  /**
   * @method sendGroupMessage
   * @param target: number
   * @param message: MessageChain
   * @param quote?: number
   * @returns messageId/-1 when failed
   */
  async sendGroupMessage(
    groupId: number,
    message: MessageChain,
    quote?: number
  ): Promise<number> {
    if (!this.isVerified()) {
      console.log(colors.red(`SendGroupMessage Error: Not Verified!`));
      return -1;
    }

    let { code, msg, messageId } = (
      await axios.post(this.baseUrl + "/sendGroupMessage", {
        sessionKey: this.session,
        target: groupId,
        messageChain: message,
        quote: quote,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SendGroupMessage Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return -1;
    } else {
      console.log(
        colors.green(`SendGroupMessage To [`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Message ID: `) +
          colors.yellow(messageId.toString())
      );
      console.log(utils.outputMessage(message));
      return messageId;
    }
  }

  /**
   * @method recall
   * @param messageId: number
   * @returns success or not
   */
  async recall(messageId: number): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`Recall Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/recall", {
        sessionKey: this.session,
        target: messageId,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`Recall Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(colors.green(`Recall msg#${messageId} Success`));
      return true;
    }
  }

  async getFriendList(): Promise<listType.friendList> {
    if (!this.isVerified()) {
      console.log(colors.red(`getFriendList Error: Not Verified!`));
      return null;
    }

    console.log(colors.yellow("Get Friend List.."));

    return (
      await axios.get(`${this.baseUrl}/friendList?sessionKey=${this.session}`)
    ).data;
  }

  async getGroupList(): Promise<listType.groupList> {
    if (!this.isVerified()) {
      console.log(colors.red(`getGroupList Error: Not Verified!`));
      return null;
    }

    console.log(colors.yellow("Get Group List.."));

    return (
      await axios.get(`${this.baseUrl}/groupList?sessionKey=${this.session}`)
    ).data;
  }

  async getMemberList(groupId: number): Promise<listType.memberList> {
    if (!this.isVerified()) {
      console.log(colors.red(`getMemberList Error: Not Verified!`));
      return null;
    }

    console.log(
      colors.yellow("Get Member List of [") +
        colors.cyan(groupId.toString()) +
        colors.yellow("]")
    );

    return (
      await axios.get(
        `${this.baseUrl}/memberList?sessionKey=${this.session}&target=${groupId}`
      )
    ).data;
  }

  async mute(
    groupId: number,
    memberId: number,
    time: number = 0
  ): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`Mute Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/mute", {
        sessionKey: this.session,
        target: groupId,
        memberId: memberId,
        time: time,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`Mute Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`Mute Member[`) +
          colors.cyan(memberId.toString()) +
          colors.green(`] in Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] for time`) +
          colors.red(time.toString()) +
          colors.green(`Success!`)
      );
      return true;
    }
  }

  async unmute(groupId: number, memberId: number): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`Unmute Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/unmute", {
        sessionKey: this.session,
        target: groupId,
        memberId: memberId,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`Unmute Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`Unmute Member[`) +
          colors.cyan(memberId.toString()) +
          colors.green(`] in Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Success!`)
      );
      return true;
    }
  }

  async kick(
    groupId: number,
    memberId: number,
    message?: string
  ): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`Kick Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/kick", {
        sessionKey: this.session,
        target: groupId,
        memberId: memberId,
        msg: message,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`Kick Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`Kick Member[`) +
          colors.cyan(memberId.toString()) +
          colors.green(`] from Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Success!`)
      );
      return true;
    }
  }

  async quit(groupId: number): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`Quit Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/kick", {
        sessionKey: this.session,
        target: groupId,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`Quit Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`Quit Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Success!`)
      );
      return true;
    }
  }

  async muteAll(groupId: number): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`MuteAll Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/muteAll", {
        sessionKey: this.session,
        target: groupId,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`MuteAll Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`MuteAll in Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Success!`)
      );
      return true;
    }
  }

  async unmuteAll(groupId: number): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`UnmuteAll Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/unmuteAll", {
        sessionKey: this.session,
        target: groupId,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`UnmuteAll Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`UnmuteAll in Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Success!`)
      );
      return true;
    }
  }

  async getGroupConfig(groupId: number): Promise<GroupConfig> {
    if (!this.isVerified()) {
      console.log(colors.red(`getGroupConfig Error: Not Verified!`));
      return null;
    }

    console.log(
      colors.yellow("Get Group Config of [") +
        colors.cyan(groupId.toString()) +
        colors.yellow("]")
    );

    return (
      await axios.get(
        `${this.baseUrl}/groupConfig?sessionKey=${this.session}&target=${groupId}`
      )
    ).data;
  }

  async setGroupConfig(groupId: number, config: GroupConfig): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`SetGroupConfig Error: Not Verified!`));
      return null;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/groupConfig", {
        sessionKey: this.session,
        target: groupId,
        config: config,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SetGroupConfig Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`SetGroupConfig in Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Success!`)
      );

      console.log(colors.magenta(JSON.stringify(config)));
      return true;
    }
  }

  async getMemberInfo(groupId: number, memberId: number): Promise<GroupConfig> {
    if (!this.isVerified()) {
      console.log(colors.red(`GetMemberInfo Error: Not Verified!`));
      return null;
    }

    console.log(
      colors.yellow("Get Member Info of [") +
        colors.cyan(memberId.toString()) +
        colors.yellow("] in group [") +
        colors.cyan(groupId.toString()) +
        colors.yellow("]")
    );

    return (
      await axios.get(
        `${this.baseUrl}/memberInfo?sessionKey=${this.session}&target=${groupId}&memberId=${memberId}`
      )
    ).data;
  }

  async setMemberInfo(
    groupId: number,
    memberId: number,
    config: MemberConfig
  ): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`SetMemberInfo Error: Not Verified!`));
      return null;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/memberInfp", {
        sessionKey: this.session,
        target: groupId,
        memberId: memberId,
        info: config,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SetMemberInfo Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      console.log(
        colors.green(`SetMemberInfo of [`) +
          colors.cyan(memberId.toString()) +
          colors.green(`] in Group[`) +
          colors.cyan(groupId.toString()) +
          colors.green(`] Success!`)
      );

      console.log(colors.magenta(JSON.stringify(config)));
      return true;
    }
  }

  /**
   * @method solveNewFriendRequest
   * @param id: number 请求id
   * @param qq: number 申请人id
   * @param groupId: number 来自群的id 不经过群则为0
   * @param operate: 0/1/2
   *      0 - 同意
   *      1 - 拒绝
   *      2 - 拒绝并不再接收
   * @param message
   */
  async solveNewFriendRequest(
    id: number,
    qq: number,
    groupId: number,
    operate: 0 | 1 | 2,
    message: string
  ): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`SolveNewFriendRequest Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/resp/newFriendRequestEvent", {
        sessionKey: this.session,
        eventId: id,
        fromId: qq,
        groupId: groupId,
        operate: operate,
        message: message,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SolveNewFriendRequest Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      switch (operate) {
        case 0:
          console.log(
            colors.green(`New Friend Request [`) +
              colors.cyan(id.toString()) +
              colors.green(`from [`) +
              colors.cyan(qq.toString()) +
              colors.green(`] Accepted.`)
          );
          break;
        case 1:
        case 2:
          console.log(
            colors.red(`New Friend Request [`) +
              colors.yellow(id.toString()) +
              colors.red(`from [`) +
              colors.yellow(qq.toString()) +
              colors.red(`] Rejected.`)
          );
          break;
      }
      return true;
    }
  }

  /**
   * @method solveMemberJoinRequestEvent
   * @param id: number
   * @param qq: number
   * @param groupId: number
   * @param operate: 0~4
   *        0 - 同意
   *        1 - 拒绝
   *        2 - 忽略
   *        3 - 拒绝并不再接收
   *        4 - 忽略并不再接收
   * @param message
   */
  async solveMemberJoinRequestEvent(
    id: number,
    qq: number,
    groupId: number,
    operate: 0 | 1 | 2 | 3 | 4,
    message: string
  ): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(colors.red(`SolveMemberJoinRequest Error: Not Verified!`));
      return false;
    }

    let { code, msg } = (
      await axios.post("/resp/memberJoinRequestEvent", {
        sessionKey: this.session,
        eventId: id,
        fromId: qq,
        groupId: groupId,
        operate: operate,
        message: message,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SolveMemberJoinRequest Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      switch (operate) {
        case 0:
          console.log(
            colors.green(`MemberJoin Request [`) +
              colors.cyan(id.toString()) +
              colors.green(`from [`) +
              colors.cyan(qq.toString()) +
              colors.green(`] to Group[`) +
              colors.cyan(groupId.toString()) +
              colors.green(`] Accepted.`)
          );
          break;
        case 1:
        case 3:
          console.log(
            colors.red(`MemberJoin Request [`) +
              colors.yellow(id.toString()) +
              colors.red(`] from [`) +
              colors.yellow(qq.toString()) +
              colors.red(`] to Group[`) +
              colors.yellow(groupId.toString()) +
              colors.red(`] Rejected.`)
          );
          break;
        case 2:
        case 4:
          console.log(
            colors.blue(`MemberJoin Request [`) +
              colors.white(id.toString()) +
              colors.blue(`] from [`) +
              colors.white(qq.toString()) +
              colors.blue(`] to Group[`) +
              colors.white(groupId.toString()) +
              colors.blue(`] Rejected.`)
          );
          break;
      }
      return true;
    }
  }

  /**
   * @method solveNewFriendRequest
   * @param id: number 请求id
   * @param qq: number 申请人id
   * @param groupId: number 来自群的id 不经过群则为0
   * @param operate: 0/1/2
   *      0 - 同意
   *      1 - 拒绝
   *      2 - 拒绝并不再接收
   * @param message
   */
  async solveBotInvitedJoinGroupRequest(
    id: number,
    qq: number,
    groupId: number,
    operate: 0 | 1,
    message: string
  ): Promise<boolean> {
    if (!this.isVerified()) {
      console.log(
        colors.red(`SolveBotInvitedJoinGroupRequest Error: Not Verified!`)
      );
      return false;
    }

    let { code, msg } = (
      await axios.post(this.baseUrl + "/resp/botInvitedJoinGroupRequestEvent", {
        sessionKey: this.session,
        eventId: id,
        fromId: qq,
        groupId: groupId,
        operate: operate,
        message: message,
      })
    ).data;

    if (code) {
      console.log(
        colors.red(`SolveBotInvitedJoinGroupRequest Error with Code ${code}:`),
        colors.magenta(`${msg}`)
      );
      return false;
    } else {
      switch (operate) {
        case 0:
          console.log(
            colors.green(`Join Group Request [`) +
              colors.cyan(id.toString()) +
              colors.green(`] to [`) +
              colors.cyan(groupId.toString()) +
              colors.green(`] Accepted.`)
          );
          break;
        case 1:
          console.log(
            colors.red(`Join Group Request [`) +
              colors.yellow(id.toString()) +
              colors.red(`from [`) +
              colors.yellow(groupId.toString()) +
              colors.red(`] Rejected.`)
          );
          break;
      }
      return true;
    }
  }

  async getMiraiMessage(
    message:
      | "fetchMessage"
      | "fetchLatestMessage"
      | "peekMessage"
      | "peekLatestMessage",
    count: number = 5
  ): Promise<EMTypeChain> {
    if (!this.isVerified()) {
      console.log(colors.red(`${message} Error: Not Verified!`));
      return null;
    }

    console.log(colors.blue(`${message} for at most ${count} records`));

    let msgCnt: number = await this.getMessageCount();
    console.log(colors.yellow(`There are ${msgCnt} left.`));

    let { code, errorMessage, data } = (
      await axios.get(
        `${this.baseUrl}/${message}?sessionKey=${this.session}&count=${count}`
      )
    ).data;

    if (code) {
      console.log(colors.red(`${message} Error: ${errorMessage}`));
      return null;
    }

    return data;
  }

  private async getMessageCount(): Promise<number> {
    return (
      await axios.get(`${this.baseUrl}/countMessage?sessionKey=${this.session}`)
    ).data.data;
  }

  //一些衍生的API

  //获取session
  getSession(): string {
    return this.session;
  }

  //看看是否验证成功
  isVerified(): boolean {
    return this.verified;
  }

  //检测连接(指访问about看看有没有掉)
  async testConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/about`);
      return true;
    } catch (e) {
      console.log(
        colors.red(
          "Failed on connection test! Perhaps mirai-api-http is not working?"
        )
      );
      return false;
    }
  }

  async reply(
    oldMsg: RecvType,
    respMsg: MessageChain,
    quote?: number
  ): Promise<boolean> {
    if (oldMsg.type == "FriendMessage") {
      let { sender } = oldMsg;
      await this.sendFriendMessage(sender.id, respMsg, quote);
      return true;
    } else if (oldMsg.type == "TempMessage") {
      let { sender } = oldMsg;
      await this.sendTempMessage(sender.id, sender.group.id, respMsg, quote);
      return true;
    } else if (oldMsg.type == "GroupMessage") {
      let { sender } = oldMsg;
      await this.sendGroupMessage(sender.group.id, respMsg, quote);
      return true;
    }
    return false;
  }

  async isFriend(qq: number): Promise<boolean> {
    let friends = await this.getFriendList();

    friends.forEach((friend: listType.friendListInfo) => {
      console.log(friend.id);
      if (friend.id == qq) {
        return true;
      }
    });

    return false;
  }

  async groupBroadCast(
    groupId: number,
    msg: MessageChain,
    delay: number = 2333
  ): Promise<boolean> {
    let members = await this.getMemberList(groupId);

    try {
      members.forEach(async (mem: listType.memberListInfo) => {
        if (await this.isFriend(mem.id)) {
          this.sendFriendMessage(mem.id, msg);
        } else {
          this.sendTempMessage(mem.id, groupId, msg);
        }

        await utils.sleep(delay);
      });

      console.log(members.length);
    } catch {
      return false;
    }
    return true;
  }
}
