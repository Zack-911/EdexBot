import { ForgeClient } from "@tryforge/forgescript"
import { ForgeDB } from "@tryforge/forge.db"
import { ForgeCanvas } from "@tryforge/forge.canvas"
import * as dotenv from "dotenv"

dotenv.config()

const db: ForgeDB = new ForgeDB({
    type: "sqlite",
    events: [
        "connect",
        "variableCreate",
        "variableUpdate",
        "variableDelete",
    ],
})

const client: ForgeClient = new ForgeClient({
    prefixes: [
        ".",
        "<@$botID>",
        "<@!$botID>",
    ],
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildMembers",
        "MessageContent",
        "DirectMessages",
        "DirectMessageReactions",
        "DirectMessageTyping",
    ],
    events: [
        "clientReady",
        "messageCreate",
        "interactionCreate",
    ],
    extensions: [
        db,
        new ForgeCanvas(),
    ],
})
client.functions.load("dist/custom_functions")
client.commands.load("dist/commands")
client.applicationCommands.load("dist/slash")

client.login(process.env.BOT_TOKEN)