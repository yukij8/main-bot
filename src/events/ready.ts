import chalk from "chalk"
import TimedPunishment from "../entities/TimedPunishment"
import Client from "../struct/Client"
import Guild from "../struct/discord/Guild"
import TextChannel from "../struct/discord/TextChannel"

export default async function ready(this: Client): Promise<void> {
    const main = this.guilds.cache.get(this.config.guilds.main) as Guild
    this.user.setActivity(`with ${main.memberCount} users`, { type: "PLAYING" })

    const punishments = await TimedPunishment.find()
    for (const punishment of punishments) punishment.schedule(this)

    // cache reaction role messages
    for (const channelID of Object.keys(this.config.reactionRoles)) {
        const channel: TextChannel = await this.channels
            .fetch(channelID)
            .catch(() => null)
        if (channel) {
            for (const messageID of Object.keys(this.config.reactionRoles[channelID])) {
                await channel.messages.fetch(messageID).catch(() => null)
            }
        }
    }

    if (main.features.includes("VANITY_URL")) {
        const current = await main.fetchVanityData()
        const outdated = current?.code !== this.config.vanity
        if (outdated) {
            await main.setVanityCode(this.config.vanity, "Reached level 3 boosting")
            this.logger.info(
                `Set vanity code to ${chalk.hex("#FF73FA")(this.config.vanity)}`
            )
        }
    }
}
