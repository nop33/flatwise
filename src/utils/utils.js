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

function treatAsUTC (date) {
  var result = new Date(date)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
  return result
}

function calculateDaysBetween (startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
}

function calculateItemValueOnDate (item, date) {
  const daysSincePurchase = calculateDaysBetween(item.date, date)
  const dailyDepreciationRate = item.depreciationRate / 100 / 365
  const depreciation = daysSincePurchase * dailyDepreciationRate * item.price
  const lowestPrice = item.price * item.lowestPriceRate / 100
  const valueAfterDepreciation = item.price - depreciation
  const valueOnDate = Math.max(valueAfterDepreciation, lowestPrice)
  return valueOnDate
}

export {
  flatmateNamesOrEmails,
  flatmateIdsOrEmails,
  flatmates,
  getFlatmatesFromIds,
  calculateDaysBetween,
  calculateItemValueOnDate
}
