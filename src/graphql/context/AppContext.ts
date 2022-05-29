import { userStore } from "../../ddb/User";
import { userIdentityStore } from "../../ddb/UserIdentity";
import { AuthSource } from "./AuthSource";

export class AppContext {
    constructor(protected token?: string) {}

    authSource = new AuthSource(this)

    get rawToken() {
        return this.token
    }

    get userStore() {
        return userStore
    }
    get userIdentityStore() {
        return userIdentityStore;
    }
}