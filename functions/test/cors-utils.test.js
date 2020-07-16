
exports.req = (body) => {
  return {
    ...body,
    headers: { origin: true }
  }
}

exports.res = (body) => {
  return {
    ...body,
    getHeader: (key) => {},
    setHeader: (key, value) => {},
  }
}
