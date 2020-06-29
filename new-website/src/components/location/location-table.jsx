import React, { useState } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { LOCATION_COLLECTION } from "."
import { navigate, useIntl } from "gatsby-plugin-intl"
import { generateI18N } from "./table-i18n"
import { Roller } from "react-spinners-css"

function choosePartnerId(entryPartnerId, userPartnerIds) {
    if (entryPartnerId) {
        if (userPartnerIds.includes(entryPartnerId)) {
            console.log(entryPartnerId)
            return entryPartnerId
        }
        // TODO: Issue this error to sentry?
        throw new Error("partnerId/inaccessible")
    } else {
        // TODO: Depending on the context we may want users to choose and not just
        // take the first in the sequence.
        if (userPartnerIds.length > 0) {
            return userPartnerIds[0]
        }
        // TODO: Issue this error to sentry?
        throw new Error("partnerId/unavailable")
    }
}

function addNewRow(userPartnerIds, allPartnerConfigs, reportError) {
    return async (event) => {
        try {
            const partnerId = choosePartnerId(null, userPartnerIds)
            const partnerConfig = allPartnerConfigs.find(p => p.id == partnerId)
            const collection = LOCATION_COLLECTION

            navigate(`/partner/locations/`, {
                state: { partnerId, partnerConfig, collection },
            })
        } catch(err) {
            console.log(err);
            reportError({ code: err.message })
        }

        // Upon confirm in add page:
        //if (!userPartnerIds || userPartnerIds.length <= 0) {
        //    onError({ code: "no-permission" })
        //    throw new Error("Missing Partner Id")
        //}
        //const { title, partnerId } = data
        //if (!title || title.length < 0) {
        //    onError({ code: "requiredFieldMissing/title" })
        //    throw new Error("missing title")
        //}
        //
        //return firebase
        //    .firestore()
        //    .collection(LOCATION_COLLECTION)
        //    .add({ ...data, partnerId: choosePartnerId(partnerId, userPartnerIds) })
        //    .catch(onError)
    }
}

function deleteRow(reportError) {
    return async function deleteIt({ id }) {
        return firebase.firestore().collection(LOCATION_COLLECTION).doc(id).delete().catch(reportError)
    }
}

function updateRow(userPartnerIds, allPartnerConfigs, reportError) {
    return async function deleteIt(event, rowData) {
        try {
            const partnerId = choosePartnerId(rowData.partnerId, userPartnerIds)
            const partnerConfig = allPartnerConfigs.find(p => p.id == partnerId)
            const collection = LOCATION_COLLECTION

            navigate(`/partner/locations/?edit=${rowData.id}`, {
                state: { partnerId, partnerConfig, collection },
            })
        } catch(err) {
            console.log(err);
            reportError({ code: err.message })
        }

        // Upon confirm in edit page:
        //return firebase
        //    .firestore()
        //    .collection(LOCATION_COLLECTION)
        //    .doc(rowData.id)
        //    .update({ ...rest })
        //    .catch(onError)
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

    const onRowDelete = deleteRow(onError)
    const onRowUpdate = updateRow(state.userAllowedPartnerIds, state.partnerConfigs, onError)
    const onRowAdd = addNewRow(state.userAllowedPartnerIds, state.partnerConfigs, onError)

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
            actions={[
                {
                    icon: 'add',
                    tooltip: 'Add',
                    isFreeAction: true,
                    onClick: onRowAdd,
                },
                {
                    icon: 'edit',
                    tooltip: 'Edit',
                    onClick: onRowUpdate,
                }
            ]}
            editable={{
                onRowDelete,
            }}
        />
    )
}
