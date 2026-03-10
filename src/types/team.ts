export enum ChangeableRoles {
  admin = "admin",
  member = "member",
}

export enum Roles {
  owner = "owner",
  admin = "admin",
  member = "member",
}

export interface TeamRole {
  id: string;
  name: Roles | ChangeableRoles;
}

export interface AccessList {
  id: string;
  name: string;
  config: object;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  email: string;
  role: TeamRole;
  id: string;
  user_id: string;
  accessList?: AccessList | null;
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
  avatarUrl?: string;
}

export interface TeamSettings {
  partition?: string | null;
  internal_tables?: string[];
}

export interface Team {
  id: string;
  name: string;
  role: Roles;
  creatorEmail: string;
  members: Member[];
  settings?: TeamSettings | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamSettingsForm {
  id?: string;
  name: string;
}
