import React, { createContext, useReducer, useEffect } from "react"
import { useCollection } from "react-firebase-hooks/firestore"
import firebase from "gatsby-plugin-firebase"
import { isNode } from "@firebase/util"

const initialState = {
    isLoading: true,
    partnerIds: null,
    error: null,
}
const UserContext = createContext(initialState)
const { Provider } = UserContext

const types = {
    LOADING: "loading",
    SET_USER_DATA: "setUserData",
    SET_ERROR: "setError",
}

function Log(context) {
    return {
        log: (message, ...data) => console.log(context, message, data),
        error: (message, ...data) => console.error(context, message, data),
    }
}

const logger = new Log("UserContext")

const reducer = (state, { type, payload = {} }) => {
    logger.log("Dispatched Action", { type, state, payload })
    switch (type) {
        case types.INITIALIZING: {
            return { ...state, isLoading: true }
        }
        case types.SET_USER_DATA: {
            return { ...state, isLoading: false, partnerIds: payload.partnerIds }
        }
        case types.SET_ERROR: {
            return { ...state, isLoading: false, error: payload.error }
        }
        default:
            return state
    }
}

/**
 * Fixes the issue with building the pages since
 * Firebase is not available during build time in nodejs
 * @param {string} partner
 */
const getQuery = userId => {
    if (isNode() || !userId) {
        return null
    }
    return firebase.firestore().collection("users").doc(userId)
}

const UserContextProvider = props => {
    const [state, dispatch] = React.useReducer(reducer, { ...initialState })

    const [collection, loading, error] = useCollection(getQuery(props.userId + "1"), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })

    useEffect(() => {
        if (loading) {
            return dispatch({ type: types.LOADING })
        }
        if (collection) {
            const data = collection.data()
            if (data) {
                dispatch({
                    type: types.SET_USER_DATA,
                    payload: {
                        partnerIds: data.partnerIds,
                    },
                })
            }
        }
    }, [collection, loading])

    useEffect(() => {
        if (error) {
            dispatch({
                type: types.SET_ERROR,
                payload: {
                    error: error?.code,
                },
            })
        }
    }, [error])

    return <Provider value={{ state, dispatch }}>{props.children}</Provider>
}

export { UserContext, UserContextProvider }
