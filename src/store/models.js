export function createFlatObject (id, name, depreciationRate, lowestPriceRate, emailsOfUninitializedUsers, flatmates, items) {
  return {
    id,
    name,
    depreciationRate,
    lowestPriceRate,
    emailsOfUninitializedUsers,
    flatmates,
    items
  }
}

export function createFlatmateObject (userRef) {
  return {
    userRef
  }
}

export function createUserObject (id, name, email, photo) {
  return {
    id,
    name,
    email,
    photo
  }
}
