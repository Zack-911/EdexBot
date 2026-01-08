import { BaseCommand } from "@tryforge/forgescript";
import type { Command } from "src/types";

export default new BaseCommand({
  name: "rank",
  aliases: ["r"],
  type: "messageCreate",
  description: "View user rank",
  module: "leveling",
  version: "1.0.0",
  params: [
    {
      name: "user",
      description: "The user to view rank of",
      required: false,
    }
  ],
  guildOnly: true,
  code: `
    $let[user;$default[$mentioned[0];$authorID]]
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
} satisfies Command);
