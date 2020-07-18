
exports.req = (body) => {
  return {
    ...body,
    headers: { origin: true }
  }
}

exports.res = (body) => {
  return {
    ...body,
    status: (no) => ({
      send: (txt) => {}
    }),
    getHeader: (key) => {},
    setHeader: (key, value) => {},
  }
}
