import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// eslint-disable-next-line new-cap
const doc = new jsPDF()
const step = 10
const x = 10

export function generateMoveOutReport(flatmate, moveOutDate, total, data, debt) {
  let y = step
  doc.text(x, (y += step), flatmate.name)
  doc.text(x, (y += step), `Move out date: ${moveOutDate}`)
  doc.text(x, (y += step), `Gets back in total: ${total} CHF`)
  debt.forEach((debtShare) => {
    const roundedShare = Math.floor(debtShare.share * 100) / 100
    doc.text(x, (y += step), `${debtShare.flatmate.name} pays ${roundedShare} CHF`)
  })

  doc.autoTable({
    body: data,
    margin: { top: (y += step) },
    headStyles: {
      fontSize: 8
    },
    columns: [
      { header: 'Item', dataKey: 'itemName' },
      { header: 'Purchase Date', dataKey: 'itemPurchaseDate' },
      { header: 'Annual Depreciation Rate', dataKey: 'annualDepreciationRate' },
      { header: 'Initial Share', dataKey: 'initialShare' },
      { header: 'Gets Back', dataKey: 'share' }
    ]
  })

  // doc.output('pdfobjectnewwindow')
  const filename = `${flatmate.name.split(' ').join('-').toLowerCase()}-move-out-flatwise-breakdown.pdf`
  return doc.save(filename, { returnPromise: true })
}

export function generateMoveInReport(flatmate, total, data, debt) {
  let y = step
  doc.text(x, (y += step), flatmate.name)
  doc.text(x, (y += step), `Move in date: ${flatmate.startDate}`)
  doc.text(x, (y += step), `Need to pay in total: ${total} CHF`)
  debt.forEach((debtShare) => {
    const roundedShare = Math.floor(debtShare.share * 100) / 100
    doc.text(x, (y += step), `${debtShare.flatmate.name} gets ${roundedShare} CHF`)
  })

  doc.autoTable({
    body: data,
    margin: { top: (y += step) },
    headStyles: {
      fontSize: 8
    },
    columns: [
      { header: 'Item', dataKey: 'itemName' },
      { header: 'Purchase Date', dataKey: 'itemPurchaseDate' },
      { header: 'Annual Depreciation Rate', dataKey: 'annualDepreciationRate' },
      { header: 'Initial Price', dataKey: 'initialPrice' },
      { header: 'Share To Pay', dataKey: 'share' }
    ]
  })

  // doc.output('pdfobjectnewwindow')
  const filename = `${flatmate.name.split(' ').join('-').toLowerCase()}-move-in-flatwise-breakdown.pdf`
  return doc.save(filename, { returnPromise: true })
}
