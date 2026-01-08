import { ApplicationCommand } from "@tryforge/forgescript";
import { ApplicationCommandOptionType, ApplicationIntegrationType, InteractionContextType } from "discord.js";

export default new ApplicationCommand({
  data: {
    name: "unban",
    description: "unban a user from the server",
    contexts: [
      InteractionContextType.Guild
    ],
    integration_types: [
      ApplicationIntegrationType.GuildInstall
    ],
    options: [
      {
        name: "userID",
        description: "The ID of the user to unban",
        required: true,
        type: ApplicationCommandOptionType.User
      },
      {
        name: "reason",
        description: "The reason for unbanning the user",
        required: false,
        type: ApplicationCommandOptionType.String
      }
    ],
  },
  code: `
    $let[user;$option[user]]
    $let[reason;$default[$option[reason];No reason provided]]
    $onlyIf[$hasPerms[$guildID;$authorID;BanMembers]==true;$ephemeral You need BanMembers permission to use this command]
    $onlyIf[$hasPerms[$guildID;$clientID;BanMembers]==true;$ephemeral I don’t have permission to unban members (Lacking ban members permission)]
    $let[result;$unbanMember[$guildID;$get[user];$default[$get[reason];No reason provided]]]
    $if[$get[result]==true;
      $title[Member unbanned]
      $addField[Moderator:;<@!$authorID>;true]
      $addField[User:;<@!$get[user]>;true]
      $addField[Reason:;$get[reason];false] 
      $addField[Date:;<t:$timestamp:R>;false]
      $color[#9A2FF3]
      $deleteIn[5s]
      $if[$isUserDMEnabled;
        $let[dm;$sendDM[$get[user];
          $title[You have been unbanned from $serverName[$guildID]]]
          $addField[Moderator:;$username[$authorID];true]
          $addField[User:;<@!$get[user]>;true]
          $addField[Reason:;$get[reason];false]
          $addField[Date:;<t:$timestamp:R>;false]
          $color[#9A2FF3]
          $addActionRow
          $addButton[https://discord.com/invite/$createInvite[$channelID;1;0];Join Server;Link;false]
        ]]
      ]
    ;
      $title[Unknown Error Occured]
      $description[An Unhandled Error Occured. This has been reported to the devs]
      $let[UUID;$randomUUID]
      $writeFile[logs/unban/$get[UUID].log;GuildID: $guildID
Author ID: $authorID
Target ID: $get[user]
Is Author Admin: $hasPerms[$guildID;$authorID;Administrator]
Invite: $createInvite[$channelID;1;0]
]
      $logger[Error;Unhandled Error Occured In unban Command, Logs Saved at logs/unban/$get[UUID].log]
      $color[Red]
      $deleteIn[5s]
    ]`
})