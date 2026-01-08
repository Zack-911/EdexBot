import { ApplicationCommand } from "@tryforge/forgescript";
import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from "discord.js";

export default new ApplicationCommand({
  data: {
    name: "ban",
    description: "ban a user from the server",
    contexts: [
      InteractionContextType.Guild
    ],
    integration_types: [
      ApplicationIntegrationType.GuildInstall
    ],
    options: [
      {
        name: "user",
        description: "The user to ban",
        required: true,
        type: ApplicationCommandOptionType.User
      },
      {
        name: "reason",
        description: "The reason for the ban",
        required: false,
        type: ApplicationCommandOptionType.String
      }
    ],
  },
  code: `
    $let[user;$option[user]]
    $let[reason;$default[$option[reason];No reason provided]]
    $onlyIf[$hasPerms[$guildID;$authorID;BanMembers]==true;$ephemeral You need BanMembers permission to use this command]
    $onlyIf[$hasPerms[$guildID;$clientID;BanMembers]==true;$ephemeral I don’t have permission to ban members]
    $onlyIf[$rolePosition[$guildID;$memberHighestRoleID[$guildID;$authorID]]<$rolePosition[$guildID;$memberHighestRoleID[$guildID;$get[user]]];$ephemeral You cannot ban this user. He is higher than you in the hierarchy]
    $onlyIf[$guildOwnerID!=$get[user];$ephemeral You cannot ban the owner of the server]
    $onlyIf[$authorID!=$get[user];$ephemeral You cannot ban yourself]
    $onlyIf[$botID!=$get[user];$ephemeral I cannot ban myself]
    $let[result;$banMember[$guildID;$get[user];$default[$get[reason];No reason provided]]]
    $if[$get[result]==true;
      $title[Member banned]
      $addField[Moderator:;<@!$authorID>;true]
      $addField[User:;<@!$get[user]>;true]
      $addField[Reason:;$get[reason];false] 
      $addField[Date:;<t:$timestamp:R>;false]
      $color[#9A2FF3]
      $deleteIn[5s]
      $if[$isUserDMEnabled;
        $let[dm;$sendDM[$get[user];
          $title[You have been banned from $serverName[$guildID]]]
          $addField[Moderator:;$username[$authorID];true]
          $addField[User:;<@!$get[user]>;true]
          $addField[Reason:;$get[reason];false]
          $addField[Date:;<t:$timestamp:R>;false]
          $color[#9A2FF3]
        ]]
        $if[$get[dm]==;
          $logger[Warn;Failed to send DM to $get[user] in ban command]
        ]
      ]
    ;
      $title[Unknown Error Occured]
      $description[An Unhandled Error Occured. This has been reported to the devs]
      $let[UUID;$randomUUID]
      $writeFile[logs/ban/$get[UUID].log;GuildID: $guildID
Author ID: $authorID
Target ID: $get[user]
Is Target Admin: $hasPerms[$guildID;$get[user];Administrator]
Is Author Admin: $hasPerms[$guildID;$authorID;Administrator]
Invite: $createInvite[$channelID;1;0]
]
      $logger[Error;Unhandled Error Occured In ban Command, Logs Saved at logs/ban/$get[UUID].log]
      $color[Red]
      $deleteIn[5s]
    ]
  `
})