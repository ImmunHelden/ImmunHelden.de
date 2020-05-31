import React, { useState } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { LOCATION_COLLECTION } from "."
import { useIntl } from "gatsby-plugin-intl"
import { generateI18N } from "./table-i18n"

export const LocationTable = ({ partner, locations = [] }) => {
    const [state, setState] = useState({ data: [...locations] })
    const { formatMessage, locale } = useIntl()

    React.useEffect(() => {
        setState({ data: [...locations] })
    }, [locations])

    const onRowUpdate = ({ id, ...rest }) => {
        return firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .doc(id)
            .update({ ...rest })
    }

    const onRowAdd = ({ id, ...rest }) => {
        return firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .add({ ...rest, partnerId: partner })
    }

    const onRowDelete = ({ id }) => firebase.firestore().collection(LOCATION_COLLECTION).doc(id).delete()

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
