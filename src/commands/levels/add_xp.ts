import { BaseCommand } from "@tryforge/forgescript";
import type { Command } from "src/types";

export default new BaseCommand({
  name: "addxp",
  type: "messageCreate",
  description: "Add XP to a user",
  module: "leveling",
  version: "1.0.0",
  params: [
    {
      name: "user",
      description: "The user to add XP to",
      required: true,
    },
    {
      name: "amount",
      description: "The amount of XP to add",
      required: true,
    }
  ], 
  code: `
    $onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need ManageGuild permission to use this command $deleteIn[5s]]
    $onlyIf[$and[$mentioned[0]!=;$message[1]!=;$isNumber[$message[1]]==true]==true;Incorrect Usage: \`.addxp <user> <amount>\` $deleteIn[5s]]
    
    $let[target;$mentioned[0]]
    $let[amount;$message[1]]
    
    $let[currentXP;$getMemberVar[xp;$get[target];$guildID;0]]
    $let[newXP;$math[$get[currentXP] + $get[amount]]]
    
    $let[level;$getMemberVar[level;$get[target];$guildID;1]]
    
    $let[result;$getRequiredXp[$get[level];$get[newXP]]]
    
    $textSplit[$get[result];,]
    $let[new_level;$splitText[0]]
    $let[remaining_xp;$splitText[1]]
    $let[has_leveled_up;$splitText[2]]
    
    $if[$get[has_leveled_up]==true;
      $setMemberVar[xp;$get[remaining_xp];$get[target];$guildID]
      $setMemberVar[level;$get[new_level];$get[target];$guildID]
      $let[image;$generateLevelUpCard[$get[target];$get[new_level]]]
      $attachment[$get[image];levelup.png;true;base64]
    ;
      $setMemberVar[xp;$get[newXP];$get[target];$guildID]
      Added $get[amount] XP to $userDisplayName[$get[target]]
    ]
  `
} satisfies Command);