import { ApplicationCommand } from "@tryforge/forgescript";
import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from "discord.js";

export default new ApplicationCommand({
  data: {
    name: "rank",
    description: "Get your rank",
    options: [
      {
        name: "user",
        description: "The user to get the rank of",
        type: ApplicationCommandOptionType.User,
        required: false
      }
    ],
    contexts: [
      InteractionContextType.Guild
    ],
    integration_types: [
      ApplicationIntegrationType.GuildInstall
    ]
  },
  code: `
    $let[user;$default[$option[user];$authorID]]
    $let[level_db;$getMemberVar[level;$get[user];$guildID;1]]
    $let[xp_db;$getMemberVar[xp;$get[user];$guildID;0]]
    $let[result;$getRequiredXp[$get[level_db];$get[xp_db]]]
    $textSplit[$get[result];,]
    $let[level;$splitText[0]]
    $let[xp;$splitText[1]]
    $let[req;$getRequiredXp[$get[level]]]

    $let[card;$generateRankCard[$get[user];$get[level];$get[xp];$get[req]]]

    $attachment[$get[card];rank.png;true;base64]

    $addContainer[
      $addMediaGallery[
        $addMediaItem[attachment://rank.png]
      ]
      $addSeparator[Small;true]
      $addTextDisplay[-# Level $get[level] | XP: $get[xp]/$get[req]]
    ;#9A2FF3]
  `
});