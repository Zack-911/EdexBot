import { BaseCommand } from "@tryforge/forgescript";

export default new BaseCommand({
  unprefixed: true,
  type: "messageCreate",
  guildOnly: true,
  allowBots: false,
  code: `
    $onlyIf[$charCount[$message]>10]
    $let[xp;$math[$getMemberVar[xp;$authorID;$guildID;0]+$randomNumber[5;10;false]]]
    $setMemberVar[xp;$get[xp];$authorID;$guildID]
    $let[level;$getMemberVar[level;$authorID;$guildID;1]]
    $let[required_xp;$getRequiredXp[$get[level]]]
    $let[xp_to_level_up;$getRequiredXp[$get[level];$get[xp]]]
    $if[$get[xp_to_level_up]==0;
      $setMemberVar[xp;$sub[$get[xp];$get[required_xp]];$authorID;$guildID]
      $setMemberVar[level;$math[$get[level]+1];$authorID;$guildID]
      $reply[$channelID;$messageID;false]
      $userDisplayName[$authorID] Level Up! You're now level $math[$get[level]+1]
      $deleteIn[5s]
    ]
  `
})

