import React, { createContext, useReducer, useEffect } from "react"
import { useAuth } from "../../hooks/use-auth"
import firebase from "gatsby-plugin-firebase"

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
}
const AuthContext = createContext(initialState)
const { Provider } = AuthContext

const types = {
    LOGIN: "login",
    LOGOUT: "logout",
    INITIALIZING: "initializing",
}

const logger = (msg, { ...data }) => console.log("AuthContextProvider", msg, data)

const reducer = (state, { type, payload = {} }) => {
    logger("Dispatched Action", { type, state, payload })
    switch (type) {
        case types.INITIALIZING: {
            return { ...state, isLoading: true }
        }
        case types.LOGIN:
            return {
                ...state,
                user: payload?.user,
                isAuthenticated: payload?.isAuthenticated,
                isLoading: false,
            }
        case types.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            }
        default:
            return state
    }
}
const AuthContextProvider = props => {
    const { user, initializing } = useAuth(firebase)
    const [state, dispatch] = React.useReducer(reducer, { ...initialState, isLoading: true })

    useEffect(() => {
        if (initializing) {
            return dispatch({ type: types.INITIALIZING })
        }
        if (!user) {
            return dispatch({
                type: types.LOGOUT,
            })
        }

        return dispatch({
            type: types.LOGIN,
            payload: {
                user,
                isAuthenticated: true,
            },
        })
    }, [user, initializing])

    return <Provider value={{ state, dispatch }}>{props.children}</Provider>
}

export { AuthContext, AuthContextProvider }
