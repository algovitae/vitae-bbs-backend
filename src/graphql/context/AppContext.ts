import { userStore } from "../../ddb/User";
import { userIdentityStore } from "../../ddb/UserIdentity";

export class AppContext {

    get userStore() {
        return userStore
    }
    get userIdentityStore() {
        return userIdentityStore;
    }
}