function treatAsUTC(date) {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
  return result
}

function calculateDaysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
}

function calculateItemValueOnDate(item, date) {
  const daysSincePurchase = calculateDaysBetween(item.date, date)
  if (daysSincePurchase < 0) {
    return 0
  }
  const dailyDepreciationRate = item.depreciationRate / 100 / 365
  const depreciation = daysSincePurchase * dailyDepreciationRate * item.price
  const lowestPrice = (item.price * item.lowestPriceRate) / 100
  const valueAfterDepreciation = item.price - depreciation
  const valueOnDate = Math.max(valueAfterDepreciation, lowestPrice)
  return valueOnDate
}

// Stolen from https://medium.com/@pppped/compute-an-arbitrary-color-for-user-avatar-starting-from-his-username-with-javascript-cd0675943b66
function stringToHslColor(str, saturation = 30, lightness = 75) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = hash % 360
  return 'hsl(' + h + ', ' + saturation + '%, ' + lightness + '%)'
}

function getFirstName(name) {
  return name.split(' ')[0]
}

export { calculateDaysBetween, calculateItemValueOnDate, stringToHslColor, getFirstName }
