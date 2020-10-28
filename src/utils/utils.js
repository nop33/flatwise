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
  getFlatmatesFromIds,
  calculateDaysBetween,
  calculateItemValueOnDate
}
