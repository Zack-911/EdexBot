import { BaseCommand } from "@tryforge/forgescript"
import type { Command } from "src/types";

export default new BaseCommand({
  name: "addlevels",
  type: "messageCreate",
  description: "Add levels to a user",
  module: "leveling",
  version: "1.0.0",
  params: [
    {
      name: "user",
      description: "The user to add levels to",
      required: true,
    },
    {
      name: "amount",
      description: "The amount of levels to add",
      required: true,
    }
  ],
  code: `
    $onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need ManageGuild permission to use this command $deleteIn[5s]]
    $onlyIf[$and[$mentioned[0]!=;$message[1]!=;$isNumber[$message[1]]==true]==true;Incorrect Usage: \`.addlevels <user> <amount>\` $deleteIn[5s]]
    $let[target;$mentioned[0]]
    $let[amount;$message[1]]
    $setMemberVar[level;$math[$get[amount]+$getMemberVar[level;$get[target];$guildID;1]];$authorID;$guildID]
    $let[card;$generateRankCard[$get[target];$getMemberVar[level;$get[target];$guildID;1];$getMemberVar[xp;$get[target];$guildID;0];$getRequiredXp[$getMemberVar[level;$get[target];$guildID]]]]
    $attachment[$get[card];rank.png;true;base64]

    $addContainer[
      $addMediaGallery[
        $addMediaItem[attachment://rank.png]
      ]
      $addSeparator[Small;true]
      $addTextDisplay[-# Level $getMemberVar[level;$get[target];$guildID] | XP: $getMemberVar[xp;$get[target];$guildID]/$getRequiredXp[$getMemberVar[level;$get[target];$guildID]]]
    ;#9A2FF3]
  `
} satisfies Command);