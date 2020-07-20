import React, { useState } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { LOCATION_COLLECTION } from "."
import { navigate, useIntl } from "gatsby-plugin-intl"
import { generateI18N } from "./table-i18n"

function deleteRow(reportError) {
    return async function deleteIt({ id }) {
        return firebase.firestore().collection(LOCATION_COLLECTION).doc(id).delete().catch(reportError)
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
    const onRowUpdate = (event, rowData) => navigate(`/partner/locations/?edit=${rowData.id}`)
    const onRowAdd = (event) => navigate("/partner/locations/")

    return (
        <MaterialTable
            style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0.0)", backgroundColor: "transparent" }}
            localization={generateI18N(locale, formatMessage)}
            isLoading={isLoading}
            columns={[
                { title: "ID", field: "id", hidden: true },
                { title: formatMessage({ id: "locationTable_Type" }), field: "type" },
                { title: formatMessage({ id: "locationTable_Title" }), field: "title" },
                { title: formatMessage({ id: "locationTable_Address" }), field: "address" },
                { title: formatMessage({ id: "locationTable_Phone" }), field: "phone" },
                { title: formatMessage({ id: "locationTable_Email" }), field: "email" },
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
