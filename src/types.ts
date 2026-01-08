import { IBaseCommand, CommandType } from "@tryforge/forgescript";

type ModuleList = 'clientSpecific' | 'dev' | 'automation' | 'automod' | 'economy' | 'leveling' | 'moderation' | 'fun' | 'permissions' | 'premium' | 'profile' | 'reactionRoles' | 'roleplay' | 'search' | 'settings' | 'utility';

export interface params {
  name: string;
  description: string;
  required: boolean;
  rest?: boolean;
}
export interface Command extends IBaseCommand<CommandType> {
  description: string;
  module: ModuleList
  version: string;
  params?: params[];
}