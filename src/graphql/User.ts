import { objectType } from "nexus"
import { Node } from "./Node"

export const User = objectType({
    name: 'User',
    definition(t) {
        t.implements(Node)
        t.string('user_name')
    }
})
