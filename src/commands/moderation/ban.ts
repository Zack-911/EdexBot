import { BaseCommand } from "@tryforge/forgescript";
import type { Command } from "src/types";

export default new BaseCommand({
  name: "ban",
  guildOnly: true,
  type: "messageCreate",
  description: "Ban a member",
  module: "moderation",
  version: "1.0.0",
  params: [
    {
      name: "user",
      description: "The user to ban",
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the ban",
      required: false,
    }
  ],
  code: `
    $onlyIf[$and[$mentioned[0]!=;$message[0]!=$mentioned[0]]==true;Incorrect Usage: \`.ban <user> <reason?>\` $deleteIn[5s]]
    $let[user;$mentioned[0]]
    $let[reason;$message[1;500]]
    $onlyIf[$hasPerms[$guildID;$authorID;BanMembers]==true;You need BanMembers permission to use this command $deleteIn[5s]]
    $onlyIf[$hasPerms[$guildID;$clientID;BanMembers]==true;I don’t have permission to ban members $deleteIn[5s]]
    $onlyIf[$rolePosition[$guildID;$memberHighestRoleID[$guildID;$authorID]]<$rolePosition[$guildID;$memberHighestRoleID[$guildID;$get[user]]];You cannot ban this user. He is higher than you in the hierarchy $deleteIn[5s]]
    $onlyIf[$guildOwnerID!=$get[user];You cannot ban the owner of the server $deleteIn[5s]]
    $onlyIf[$authorID!=$get[user];You cannot ban yourself $deleteIn[5s]]
    $onlyIf[$botID!=$get[user];I cannot ban myself $deleteIn[5s]]
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
          $addField[Moderator:;<@!$authorID>;true]
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
} satisfies Command);