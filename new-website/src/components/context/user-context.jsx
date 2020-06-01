import React, { createContext, useReducer, useEffect, useContext } from "react"
import { useCollection, useCollectionOnce } from "react-firebase-hooks/firestore"
import firebase from "gatsby-plugin-firebase"
import { isNode } from "@firebase/util"
import { AuthContext } from "./auth-context"

const initialState = {
    isLoadingUser: true,
    isLoadingPartner: true,
    partnerIds: null,
    partnerId: null,
    partnerConfigs: null,
    error: null,
}
const UserContext = createContext(initialState)
const { Provider } = UserContext

const types = {
    LOADING_USER: "loadingUser",
    SET_USER_DATA: "setUserData",
    LOADING_PARTNER: "loadingPartner",
    SET_PARTNER_DATA: "setPartnerData",
    SET_ERROR: "setError",
}

function Log(context) {
    return {
        log: (message, ...data) => console.log(context, message, ...data),
        error: (message, ...data) => console.error(context, message, ...data),
    }
}

const logger = new Log("UserContext")

const reducer = (state, { type, payload = {} }) => {
    logger.log("Dispatched Action", type, { type, state, payload })
    switch (type) {
        case types.LOADING_USER: {
            return { ...state, isLoadingUser: true }
        }
        case types.SET_USER_DATA: {
            return { ...state, isLoadingUser: false, partnerIds: payload.partnerIds, partnerId: payload.partnerId }
        }
        case types.LOADING_PARTNER: {
            return { ...state, isLoadingPartner: true }
        }
        case types.SET_PARTNER_DATA: {
            return { ...state, isLoadingPartner: false, partnerConfigs: payload.partnerConfigs }
        }
        case types.SET_ERROR: {
            return { ...state, isLoadingPartner: false, error: payload.error }
        }
        default:
            return state
    }
}

/**
 * Fixes the issue with building the pages since
 * Firebase is not available during build time in nodejs
 * @param {string} userId
 */
const getUserQuery = userId => {
    if (isNode() || !userId) {
        return null
    }
    return firebase.firestore().collection("users").doc(userId)
}

/**
 * Fixes the issue with building the pages since
 * Firebase is not available during build time in nodejs
 */
const getPartnerQuery = () => {
    if (isNode()) {
        return null
    }
    return firebase.firestore().collection("partner")
}

const UserContextProvider = props => {
    const authContext = useContext(AuthContext)
    const [state, dispatch] = React.useReducer(reducer, { ...initialState })

    const [userCollection, userLoading, userError] = useCollection(getUserQuery(authContext?.state?.user?.uid), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })

    const [partnerCollection, partnerLoading, partnerError] = useCollectionOnce(getPartnerQuery(), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })

    useEffect(() => {
        if (userLoading) {
            return dispatch({ type: types.LOADING_USER })
        }
        if (userCollection) {
            const data = userCollection.data()
            if (data) {
                dispatch({
                    type: types.SET_USER_DATA,
                    payload: {
                        partnerIds: data.partnerIds,
                        partnerId: data.partner,
                    },
                })
            }
        }
    }, [userCollection, userLoading])

    useEffect(() => {
        if (!partnerLoading && partnerCollection) {
            const data = partnerCollection?.docs?.map(doc => ({ ...doc?.data(), id: doc.id }))
            if (data) {
                dispatch({
                    type: types.SET_PARTNER_DATA,
                    payload: {
                        partnerConfigs: data,
                    },
                })
            }
        }
    }, [partnerCollection, partnerLoading])

    useEffect(() => {
        const error = partnerError || userError
        if (error) {
            dispatch({
                type: types.SET_ERROR,
                payload: {
                    error: error?.code,
                },
            })
        }
    }, [userError, partnerError])

    return <Provider value={{ state, dispatch }}>{props.children}</Provider>
}

export { UserContext, UserContextProvider }
