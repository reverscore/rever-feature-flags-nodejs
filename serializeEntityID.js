const serializeEntityID = (target) => {
  if (!target) return undefined

  if (target._id) return (target._id.toString) ? target._id.toString() : target._id
  if (target.id) return (target.id.toString) ? target.id.toString() : target.id
  return (target.toString) ? target.toString() : target
}

module.exports = serializeEntityID
