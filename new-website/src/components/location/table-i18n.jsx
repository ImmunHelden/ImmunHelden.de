export function generateI18N(locale, formatMessage) {
    // for now lets use the default translations for the table in
    // english ... to activate custom translations just remove this
    // flag.
    if (locale === "en") {
        return undefined
    }
    const t = id => formatMessage({ id: `locationTable_${id}` })

    return {
        body: {
            emptyDataSourceMessage: t("emptyDataSourceMessage"),
            filterRow: {
                // filterTooltip: t("filterTooltip"),
            },
            editRow: {
                saveTooltip: t("saveTooltip"),
                cancelTooltip: t("cancelTooltip"),
                deleteText: t("deleteText"),
            },
            addTooltip: t("addTooltip"),
            deleteTooltip: t("deleteTooltip"),
            editTooltip: t("editTooltip"),
        },
        header: {
            actions: "",
        },
        grouping: {
            // groupedBy: t("groupedBy"),
            // placeholder: t("placeholder"),
        },
        pagination: {
            firstTooltip: t("firstTooltip"),
            firstAriaLabel: t("firstAriaLabel"),
            previousTooltip: t("previousTooltip"),
            previousAriaLabel: t("previousAriaLabel"),
            nextTooltip: t("nextTooltip"),
            nextAriaLabel: t("nextAriaLabel"),
            //labelDisplayedRows: t("labelDisplayedRows"),
            // labelRowsPerPage: t("labelRowsPerPage"),
            lastTooltip: t("lastTooltip"),
            lastAriaLabel: t("lastAriaLabel"),
            labelRowsSelect: t("labelRowsSelect"),
        },
        toolbar: {
            // addRemoveColumns: t("addRemoveColumns"),
            // nRowsSelected: t("nRowsSelected"),
            // showColumnsTitle: t("showColumnsTitle"),
            // showColumnsAriaLabel: t("showColumnsAriaLabel"),
            // exportTitle: t("exportTitle"),
            // exportAriaLabel: t("exportAriaLabel"),
            // exportName: t("exportName"),
            searchTooltip: t("searchTooltip"),
            searchPlaceholder: t("searchPlaceholder"),
        },
    }
}
