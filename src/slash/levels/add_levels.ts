import { ApplicationCommand } from "@tryforge/forgescript";
import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from "discord.js";

export default new ApplicationCommand({
  code: `
    $onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];You need ManageGuild permission to use this command $deleteIn[5s]]
    $let[target;$option[user]]
    $let[amount;$option[levels]]
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
  `,
  data: {
    name: "add-levels",
    description: "Add levels to a user",
    options: [
      {
        name: "user",
        type: ApplicationCommandOptionType.User,
        description: "The user to add levels to",
        required: true
      },
      {
        name: "levels",
        type: ApplicationCommandOptionType.Integer,
        description: "The levels to add",
        required: true
      }
    ]
  }
})