import React, { useContext, createContext } from "react"

export const userContext = createContext({
    user: null,
    partner: null,
})

export const useSession = () => {
    const { user, partner } = useContext(userContext)
    return { user, partner }
}
