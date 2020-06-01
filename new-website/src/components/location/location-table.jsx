import React, { useState } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { LOCATION_COLLECTION } from "."
import { useIntl } from "gatsby-plugin-intl"
import { generateI18N } from "./table-i18n"
import { Roller } from "react-spinners-css"

function choosePartnerId(entryPartnerId, userPartnerIds = []) {
    if (entryPartnerId && userPartnerIds.includes(entryPartnerId)) {
        return entryPartnerId
    }
    return userPartnerIds[0]
}

function addNewRow(userPartnerIds, onError) {
    return async function add(data) {
        if (!userPartnerIds || userPartnerIds.length <= 0) {
            onError({ code: "no-permission" })
            throw new Error("Missing Partner Id")
        }
        const { title, partnerId } = data
        if (!title || title.length < 0) {
            onError({ code: "requiredFieldMissing/title" })
            throw new Error("missing title")
        }

        return firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .add({ ...data, partnerId: choosePartnerId(partnerId, userPartnerIds) })
            .catch(onError)
    }
}

function deleteRow(onError) {
    return async function deleteIt({ id }) {
        return firebase.firestore().collection(LOCATION_COLLECTION).doc(id).delete().catch(onError)
    }
}

function updateRow(onError) {
    return async function deleteIt({ id, ...rest }) {
        return firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .doc(id)
            .update({ ...rest })
            .catch(onError)
    }
}

export const LocationTable = ({
    userAllowedPartnerIds = [],
    partnerConfigs = {},
    locations = [],
    onError,
    isLoading = true,
}) => {
    const [state, setState] = useState({ data: [...locations], userAllowedPartnerIds, partnerConfigs })
    const { formatMessage, locale } = useIntl()

    React.useEffect(() => {
        setState({ ...state, data: [...locations] })
    }, [locations])

    React.useEffect(() => {
        setState({ ...state, userAllowedPartnerIds })
    }, [userAllowedPartnerIds])

    React.useEffect(() => {
        setState({ ...state, partnerConfigs })
    }, [partnerConfigs])

    const onRowUpdate = updateRow(onError)
    const onRowDelete = deleteRow(onError)
    const onRowAdd = addNewRow(state.userAllowedPartnerIds, onError)

    return (
        <MaterialTable
            style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0.0)", backgroundColor: "transparent" }}
            localization={generateI18N(locale, formatMessage)}
            isLoading={isLoading}
            columns={[
                { title: "ID", field: "id", hidden: true },
                {
                    title: "Partner",
                    field: "partnerId",
                    hidden: state.userAllowedPartnerIds?.length <= 1,
                    lookup: state.partnerConfigs?.reduce((prev, curr) => {
                        if (state.userAllowedPartnerIds.includes(curr.id)) {
                            prev[curr.id] = curr.name
                        }
                        return prev
                    }, {}),
                },
                { title: formatMessage({ id: "locationTable_Title" }), field: "title" },
                { title: formatMessage({ id: "locationTable_Address" }), field: "address" },
                { title: formatMessage({ id: "locationTable_Phone" }), field: "phone" },
                { title: formatMessage({ id: "locationTable_Email" }), field: "email" },
                { title: formatMessage({ id: "locationTable_Contact" }), field: "contact" },
            ]}
            data={state.data}
            title="Locations"
            options={{
                actionsColumnIndex: 0,
                draggable: false,
                showTitle: false,
            }}
            editable={{
                onRowAdd,
                onRowUpdate,
                onRowDelete,
            }}
        />
    )
}
