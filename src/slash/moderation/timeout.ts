import { ApplicationCommand } from "@tryforge/forgescript";
import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from "discord.js";

export default new ApplicationCommand({
  data: {
    name: "timeout",
    description: "Timeout a user from the server",
    contexts: [
      InteractionContextType.Guild
    ],
    integration_types: [
      ApplicationIntegrationType.GuildInstall
    ],
    options: [
      {
        name: "user",
        description: "The user to timeout",
        required: true,
        type: ApplicationCommandOptionType.User
      },
      {
        name: "duration",
        description: "The duration of the timeout. eg: 10m, 3h30m, 1d2h10s",
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "reason",
        description: "The reason for the timeout",
        required: false,
        type: ApplicationCommandOptionType.String
      }
    ],
  },
  code: `
    $let[user;$option[user]]
    $let[reason;$default[$option[reason];No reason provided]]
    $onlyIf[$hasPerms[$guildID;$authorID;ModerateMembers]==true;$ephemeral You need ModerateMembers permission to use this command]
    $onlyIf[$hasPerms[$guildID;$clientID;ModerateMembers]==true;$ephemeral I don’t have permission to timeout members]
    $onlyIf[$rolePosition[$guildID;$memberHighestRoleID[$guildID;$authorID]]<$rolePosition[$guildID;$memberHighestRoleID[$guildID;$get[user]]];$ephemeral You cannot timeout this user. He is higher than you in the hierarchy]
    $onlyIf[$guildOwnerID!=$get[user];$ephemeral You cannot timeout the owner of the server]
    $onlyIf[$authorID!=$get[user];$ephemeral You cannot timeout yourself]
    $onlyIf[$botID!=$get[user];$ephemeral I cannot timeout myself]
    $let[result;$timeoutMember[$guildID;$get[user];$option[duration];$default[$get[reason];No reason provided]]]
    $if[$get[result]==true;
      $title[Member Kicked]
      $addField[Moderator:;<@!$authorID>;true]
      $addField[User:;<@!$get[user]>;true]
      $addField[Duration:;$option[duration];true]
      $addField[Reason:;$get[reason];false]
      $addField[Date:;<t:$timestamp:R>;false]
      $color[#9A2FF3]
      $deleteIn[5s]
      $if[$isUserDMEnabled;
        $let[dm;$sendDM[$get[user];
          $title[You have been timed out]
          $addField[Moderator:;$username[$authorID];true]
          $addField[User:;<@!$get[user]>;true]
          $addField[Duration:;$option[duration];true]
          $addField[Reason:;$get[reason];false]
          $addField[Date:;<t:$timestamp:R>;false]
          $color[#9A2FF3]
        ]]
        $if[$get[dm]==;
          $logger[Warn;Failed to send DM to $get[user] in timeout command]
        ]
      ]
    ;
      $title[Unknown Error Occured]
      $description[An Unhandled Error Occured. This has been reported to the devs]
      $let[UUID;$randomUUID]
      $writeFile[logs/timeout/$get[UUID].log;GuildID: $guildID
Author ID: $authorID
Target ID: $get[user]
Is Target Admin: $hasPerms[$guildID;$get[user];Administrator]
Is Author Admin: $hasPerms[$guildID;$authorID;Administrator]
Invite: $createInvite[$channelID;1;0]
]
      $logger[Error;Unhandled Error Occured In Timeout Command, Logs Saved at logs/timeout/$get[UUID].log]
      $color[Red]
      $deleteIn[5s]
    ]
  `
})