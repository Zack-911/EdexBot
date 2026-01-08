import { BaseCommand } from "@tryforge/forgescript";
import type { Command } from "src/types";

export default new BaseCommand({
  name: "timeout",
  guildOnly: true,
  type: "messageCreate",
  description: "Timeout a member",
  module: "moderation",
  version: "1.0.0",
  params: [
    {
      name: "user",
      description: "The user to timeout",
      required: true,
    },
    {
      name: "duration",
      description: "The duration of the timeout",
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      required: false,
    }
  ],
  code: `
    $onlyIf[$and[$mentioned[0]!=;$message[0]!=$mentioned[0];$message[1]!=]==true;Incorrect Usage: \`.timeout <user> <duration> <reason?>\` $deleteIn[5s]]
    $let[user;$mentioned[0]]
    $let[reason;$message[2;500]]
    $let[duration;$message[1]]
    $onlyIf[$hasPerms[$guildID;$authorID;KickMembers]==true;You need KickMembers permission to use this command $deleteIn[5s]]
    $onlyIf[$hasPerms[$guildID;$clientID;KickMembers]==true;I don’t have permission to kick members $deleteIn[5s]]
    $onlyIf[$rolePosition[$guildID;$memberHighestRoleID[$guildID;$authorID]]<$rolePosition[$guildID;$memberHighestRoleID[$guildID;$get[user]]];You cannot kick this user. He is higher than you in the hierarchy $deleteIn[5s]]
    $onlyIf[$guildOwnerID!=$get[user];You cannot kick the owner of the server $deleteIn[5s]]
    $onlyIf[$authorID!=$get[user];You cannot kick yourself $deleteIn[5s]]
    $onlyIf[$botID!=$get[user];I cannot kick myself $deleteIn[5s]]
    $let[result;$kickMember[$guildID;$get[user];$default[$get[reason];No reason provided]]]
    $if[$get[result]==true;
      $title[Member kicked]
      $addField[Moderator:;<@!$authorID>;true]
      $addField[User:;<@!$get[user]>;true]
      $addField[Reason:;$get[reason];false]
      $addField[Date:;<t:$timestamp:R>;false]
      $color[#9A2FF3]
      $deleteIn[5s]
      $if[$isUserDMEnabled;
        $let[dm;$sendDM[$get[user];
          $title[You have been kicked from $serverName[$guildID]]]
          $addField[Moderator:;<@!$authorID>;true]
          $addField[User:;<@!$get[user]>;true]
          $addField[Reason:;$get[reason];false]
          $addField[Date:;<t:$timestamp:R>;false]
          $color[#9A2FF3]
        ]]
        $if[$get[dm]==;
          $logger[Warn;Failed to send DM to $get[user] in kick command]
        ]
      ]
    ;
      $title[Unknown Error Occured]
      $description[An Unhandled Error Occured. This has been reported to the devs]
      $let[UUID;$randomUUID]
      $writeFile[logs/kick/$get[UUID].log;GuildID: $guildID
Author ID: $authorID
Target ID: $get[user]
Is Target Admin: $hasPerms[$guildID;$get[user];Administrator]
Is Author Admin: $hasPerms[$guildID;$authorID;Administrator]
Invite: $createInvite[$channelID;1;0]
]
      $logger[Error;Unhandled Error Occured In Kick Command, Logs Saved at logs/kick/$get[UUID].log]
      $color[Red]
      $deleteIn[5s]
    ]
  `
} satisfies Command)