// If a user has not yet been initialized, we don't know their name
// so their email gets appended in the list of emails
function flatmateNamesOrEmails (flat) {
  return [
    ...flat.flatmates.map(flatmate => flatmate.name),
    ...flat.emailsOfUninitializedUsers
  ].sort()
}

// If a user has not yet been initialized, we don't know their ID
// so their email gets appended in the list of IDs
function flatmateIdsOrEmails (flat) {
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
      name: email,
      email
    }))
  ]
}

function getFlatmatesFromIds (flat, ids) {
  return ids.map(id => (flat.flatmates.find(flatmate => flatmate.id === id) || { email: id, name: id, id }))
}

export {
  flatmateNamesOrEmails,
  flatmateIdsOrEmails,
  flatmates,
  getFlatmatesFromIds
}
