export interface GroupConfig {
  name?: string;
  announcement?: string;
  confessTalk?: boolean;
  allowMemberInvite?: boolean;
  autoApprove?: boolean;
  anonymousChat?: boolean;
}

export interface MemberConfig {
  name?: string;
  specialTitle?: string;
}
