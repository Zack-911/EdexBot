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
    $let[result;$getRequiredXp[$get[level];$get[xp]]]
    $textSplit[$get[result];,]
    $let[new_level;$splitText[0]]
    $let[remaining_xp;$splitText[1]]
    
    $if[$get[has_leveled_up]==true;
      $setMemberVar[xp;$get[remaining_xp];$authorID;$guildID]
      $setMemberVar[level;$get[new_level];$authorID;$guildID] 
      $let[image;$generateLevelUpCard[$authorID;$get[new_level]]]
      $attachment[$get[image\];levelup.png;true;base64]
      $deleteIn[10s]
    ]
  `
});