import React, { useState, useEffect } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { LOCATION_COLLECTION } from "."
import { navigate, useIntl } from "gatsby-plugin-intl"
import { generateI18N } from "./table-i18n"
import Moment from "moment"
import { Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MarkerIconPlasma from "../../images/marker-icon-plasma.png"
import MarkerIconMission from "../../images/marker-icon-mission.png"
import MarkerIconTafel from "../../images/marker-icon-tafel.png"
import MarkerIconResearch from "../../images/marker-icon-research.png"
import MarkerIconImmunhelden from "../../images/marker-icon-immunhelden.png"
import MarkerIconNew from "../../images/marker-icon-new.png"

const MAP_BASE_URL = "https://immunhelden.de/maps/all/"

const useStyles = makeStyles(() => ({
    markerIcon: {
        width: 20,
        height: 26,
    },
    permalink: {
        fontSize: "150%",
        textDecoration: "none",
        color: "#000",
        '&:hover': {
            textDecoration: "none",
        }
    },
}))

function isLiveNow(doc) {
    if (!doc.published)
        return false
    if (!doc.dateRangeExplicit)
        return true
    const begin = Moment(doc.dateRangeFrom, 'YYYY-MM-DD', true)
    const now = Moment(new Date())
    const end = Moment(doc.dateRangeTo, 'YYYY-MM-DD', true)
    const started = begin.isValid() ? begin.isSameOrBefore(now) : true
    const stillRunning = end.isValid() ? end.isSameOrAfter(now) : true
    return started && stillRunning
}

export const LocationTable = ({
    userAllowedPartnerIds = [],
    partnerConfigs = {},
    onError,
    onSuccess,
    isLoading = true,
}) => {
    const loadLocationData = async () => {
        const entries = []
        if (userAllowedPartnerIds && userAllowedPartnerIds.length > 0) {
            const collection = firebase.firestore().collection(LOCATION_COLLECTION)
            const query = collection.where("partnerId", "in", userAllowedPartnerIds)
            const snapshot = await query.get()
            snapshot.forEach(doc => entries.push({
                ...doc.data(),
                id: doc.id,
            }));
        }
        return entries
    }
    const dropLocation = (id, entries) => {
        const idx = entries.findIndex(loc => loc.id === id)
        if (idx >= 0)
            entries.splice(idx, 1)
        return entries
    }

    const [locations, setLocations] = useState([])
    useEffect(() => { (async () => {
        setLocations(await loadLocationData())
    })() }, [userAllowedPartnerIds])

    const { formatMessage, locale } = useIntl()
    const classes = useStyles()
    const icons = {
        "plasma": MarkerIconPlasma,
        "mission": MarkerIconMission,
        "tafel": MarkerIconTafel,
        "research": MarkerIconResearch,
        "immunhelden": MarkerIconImmunhelden,
        "new": MarkerIconNew,
    }
    const marker = (type) => {
        if (icons[type]) {
            return <img src={icons[type]} className={classes.markerIcon} alt={"icon-" + type} />
        } else {
            return ""
        }
    }
    const permalink = (rowData) => {
        if (!isLiveNow(rowData))
            return <span className={classes.permalink}>—</span>

        return <Link target="_blank" href={`${MAP_BASE_URL}#${rowData.id}`}
                     className={classes.permalink}>✓</Link>
    }
    const compressContacts = rowData => {
        const lines = []
        if (rowData.phone)
            // \xAO is &nbsp; and avoids wrapping within the phone number.
            lines.push(rowData.phone.replace(/\s/g, "\xA0"))
        if (rowData.email)
            lines.push(rowData.email)
        return lines.join(", ")
    }

    const onRowDelete = async ({ id }) => {
        // We could await the removal from the Database and reload, but we know
        // what we'd' get. Let's rethink, once we have concurrent edits in
        // practice.
        setLocations(dropLocation(id, locations))

        try {
            await firebase.firestore().collection(LOCATION_COLLECTION).doc(id).delete()
            onSuccess("partnerLocation_entryRemoved")
        } catch (err) {
            onError(err)
        }
    }
    const onRowUpdate = (event, rowData) => navigate(`/partner/locations/?edit=${rowData.id}`)
    const onRowAdd = (event) => navigate("/partner/locations/")

    // Render these columns as small as possible
    const smallColumn = {
        width: 1,
        cellStyle: {paddingRight: 0},
        headerStyle: {paddingRight: 0},
    }

    return (
        <MaterialTable
            style={{ boxShadow: "none" }}
            localization={generateI18N(locale, formatMessage)}
            isLoading={isLoading}
            columns={[
                {
                    title: "ID",
                    field: "id",
                    hidden: true,
                    searchable: true,
                },
                {
                    title: "TYPE",
                    field: "type",
                    hidden: true,
                    searchable: true,
                },
                {
                    title: formatMessage({ id: "locationTable_Title" }),
                    field: "title",
                },
                {
                    ...smallColumn,
                    title: formatMessage({ id: "locationTable_Type" }),
                    render: rowData => marker(rowData.type),
                },
                {
                    title: formatMessage({ id: "locationTable_Address" }),
                    field: "address"
                },
                {
                    title: formatMessage({ id: "locationTable_Contact" }),
                    render: rowData => compressContacts(rowData),
                },
                {
                    ...smallColumn,
                    title: formatMessage({ id: "locationTable_Live" }),
                    render: rowData => permalink(rowData),
                },
            ]}
            data={locations}
            title={formatMessage({ id: "partnerLocationsTitle" })}
            options={{
                actionsColumnIndex: 0,
                draggable: false,
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
