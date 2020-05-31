import React, { useState } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { LOCATION_COLLECTION } from "."
import { useIntl } from "gatsby-plugin-intl"
import { generateI18N } from "./table-i18n"

function addNewRow(partnerId, onError) {
    return async function add(data) {
        if (!partnerId) {
            throw new Error("Missing Partner Id")
        }
        const { title } = data
        if (!title || title.length < 0) {
            onError({ code: "requiredFieldMissing/title" })
            throw new Error("missing title")
        }
        return firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .add({ ...data, partnerId })
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

export const LocationTable = ({ partner, locations = [], onError }) => {
    const [state, setState] = useState({ data: [...locations] })
    const { formatMessage, locale } = useIntl()

    React.useEffect(() => {
        setState({ data: [...locations] })
    }, [locations])

    const onRowUpdate = updateRow(onError)
    const onRowDelete = deleteRow(onError)
    const onRowAdd = addNewRow(partner, onError)

    return (
        <MaterialTable
            style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0.0)", backgroundColor: "transparent" }}
            localization={generateI18N(locale, formatMessage)}
            columns={[
                { title: "ID", field: "id", hidden: true },
                { title: formatMessage({ id: "locationTable_Title" }), field: "title" },
                { title: formatMessage({ id: "locationTable_Address" }), field: "address" },
                { title: formatMessage({ id: "locationTable_Phone" }), field: "phone" },
                { title: formatMessage({ id: "locationTable_Email" }), field: "email" },
                { title: formatMessage({ id: "locationTable_Contact" }), field: "contact" },
            ]}
            data={state.data}
            title=""
            editable={{
                onRowAdd,
                onRowUpdate,
                onRowDelete,
            }}
        />
    )
}
