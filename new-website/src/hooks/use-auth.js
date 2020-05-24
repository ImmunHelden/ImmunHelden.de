import React from "react"
import { isNode } from "@firebase/util"

export const useAuth = firebase => {
    const signOut = () => {
        firebase.auth().signOut()
    }

    const [state, setState] = React.useState(() => {
        if (isNode()) {
            return { initializing: false, user: null }
        }
        const user = firebase.auth().currentUser
        return { initializing: !user, user, signOut }
    })

    function onChange(user) {
        setState({ initializing: false, user, signOut })
    }

    React.useEffect(() => {
        // listen for auth state changes
        const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
        // unsubscribe to the listener when unmounting
        return () => unsubscribe()
    }, [firebase])

    return state
}
