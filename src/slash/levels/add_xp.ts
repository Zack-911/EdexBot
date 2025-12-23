import { ApplicationCommand } from "@tryforge/forgescript";
import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from "discord.js";

export default new ApplicationCommand({
  data: {
    name: "add_xp",
    description: "Add XP to a server member",
    options: [
      {
        name: "target",
        description: "The user to add the XP to",
        required: true,
        type: ApplicationCommandOptionType.User
      },
      {
        name: "xp",
        description: "The amount of XP add",
        required: true,
        type: ApplicationCommandOptionType.Number
      }
    ],
    integration_types: [ApplicationIntegrationType.GuildInstall],
    contexts: [InteractionContextType.Guild]
  },
  code: `
    $onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];$ephemeral You need ManageGuild permission to use this command $deleteIn[5s]]
    
    $let[target;$option[target]]
    $let[amount;$option[xp]]
    
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
})