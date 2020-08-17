function flatmateNames (flat) {
  return [
    ...flat.flatmates.map(flatmate => flatmate.name),
    ...flat.emailsOfUninitializedUsers
  ].sort()
}

function flatmateIds (flat) {
  return [
    ...flat.flatmates.map(flatmate => flatmate.id),
    ...flat.emailsOfUninitializedUsers
  ]
}

function flatmates (flat) {
  return [
    ...flat.flatmates,
    ...flat.emailsOfUninitializedUsers.map(email => ({
      id: email,
      name: email
    }))
  ]
}

function namesFromIds (flat, ids) {
  return ids.map(id => {
    const flatmate = flat.flatmates.find(flatmate => flatmate.id === id)
    if (flatmate) {
      return flatmate.name
    }
    // otherwise the id is the email
    return id
  }).sort()
}

export {
  flatmateNames,
  flatmateIds,
  flatmates,
  namesFromIds
}
