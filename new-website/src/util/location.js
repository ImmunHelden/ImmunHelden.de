export function mapLocation(prev, doc) {
    const {
        title = "NA",
        latlng = {},
        address = "NA",
        phone = "NA",
        email = "NA",
        contact = "NA",
        id = "NA",
        partnerId = "",
    } = doc
    const { latitude, longitude } = latlng
    return [
        ...prev,
        {
            title,
            latitude,
            longitude,
            latlng,
            address,
            phone,
            email,
            contact,
            id,
            partnerId,
        },
    ]
}
