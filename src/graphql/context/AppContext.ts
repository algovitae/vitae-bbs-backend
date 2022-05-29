import { groupDataLoaderFactory, groupStore } from "../../ddb/Group";
import { membershipStore } from "../../ddb/Membrtship";
import { userDataLoaderFactory, userStore } from "../../ddb/User";
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

    get userDataLoader() {
        return userDataLoaderFactory(this.userStore)
    }

    
    get userIdentityStore() {
        return userIdentityStore;
    }

    get groupStore() {
        return groupStore;
    }

    get groupDataLoader() {
        return groupDataLoaderFactory(this.groupStore)
    }

    get membershipStore() {
        return membershipStore;
    }

}