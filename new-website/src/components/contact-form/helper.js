function protect() {
    var _0x5144 = [
        "onclick",
        "charCodeAt",
        "fgrsna.tenravgm",
        "hvdgoj",
        "replace",
        "href",
        "fromCharCode",
        "setAttribute",
        "pvjru.lxv",
    ]
    ;(function (_0x38b0de, _0x5144e6) {
        const _0x389c69 = function (_0x2651ae) {
            while (--_0x2651ae) {
                _0x38b0de["push"](_0x38b0de["shift"]())
            }
        }
        _0x389c69(++_0x5144e6)
    })(_0x5144, 0x72)

    const _0x389c = function (_0x38b0de, _0x5144e6) {
        _0x38b0de = _0x38b0de - 0x0
        var _0x389c69 = _0x5144[_0x38b0de]
        return _0x389c69
    }

    return function kkl(_0x407246, _0x1f0d61) {
        return _0x407246[_0x389c("0x7")](/[a-zA-Z]/g, function (_0x2c18ed) {
            return String[_0x389c("0x0")](
                (_0x2c18ed <= "Z" ? 0x5a : 0x7a) >= (_0x2c18ed = _0x2c18ed[_0x389c("0x4")](0x0) + _0x1f0d61)
                    ? _0x2c18ed
                    : _0x2c18ed - 0x1a
            )
        })
    }
}

export async function submitToSlack(setError, data) {
    setError(false)
    const kkl = protect()

    // Apparently, the Slack API endpoint fails to return an Access-Control-Allow-Headers response
    // header that contains Content-Type in its value. Thus, the browsers CORS preflight OPTIONS
    // request fails, if our request included the field contentType: 'application/json'. Not sure
    // whether they do it on purpose or not, but in response we omit the contentType setting
    // on purpose in our request. More details here: https://stackoverflow.com/questions/45752537
    const baseUrl = "https://hooks.slack.com/services/"
    const url = baseUrl + kkl("R011AC9ZOQ2", 2) + "/" + kkl("T012TN47R7K", 8) + "/" + kkl("zBl73CY5pLsDH8TUgZSzsXtp", 1)
    const message = JSON.stringify({
        text: `*Anfrage:*\n${data.message}\n*Kontakt:* ${data.contact}`,
    })
    const postInit = {
        method: "POST",
        body: message,
    }
    try {
        await fetch(url, postInit)
        alert("Deine Anfrage ist bei uns eingegangen. Wir werden uns so schnell wie möglich bei dir melden.")
    } catch (err) {
        setError(true)
        alert(
            `Bitte endschuldige, bei der Verarbeitung deiner Anfrage ist ein Fehler aufgetreten.\n\nAlternativ kannst du uns per E-Mail erreichen: ${kkl(
                "dhhpiczgyzi",
                5
            )}@${kkl("ihlmxh", 7)}.${kkl("fg", -2)}`
        )
    }
}
