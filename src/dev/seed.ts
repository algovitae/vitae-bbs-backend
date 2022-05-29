import { LogInfo, updateDynamoEasyConfig } from "@shiftcoders/dynamo-easy";
import { userIdentityStore } from "../ddb/UserIdentity";

async function seed() {
    updateDynamoEasyConfig({
        logReceiver: (logInfo: LogInfo) => {
            if (logInfo.className === 'dynamo.mapper.mapper') {
                return
            }
            const msg = `[${logInfo.level}] ${logInfo.timestamp} ${logInfo.className} (${logInfo.modelConstructor
                }): ${logInfo.message}`
            console.debug(msg, logInfo.data)
        }
    })

    await userIdentityStore.put({
        email: 'hoge@example.com',
        user_id: '29onBfWqwv90Dvlaszo0mWUSJ6x',
        password_hash: '$2a$12$60/wigMCSIg5JpHAjxHS9ukk9RIZHRD1oynlLT6ObdMQScLRq2DiG',
    }).exec()

    console.log("seeded")
}

seed().catch(console.error)