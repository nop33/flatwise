import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export function generateBreakdown (flatmate, moveOutDate, total, data, debt) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF()
  const step = 10
  const x = 10
  let y = step
  doc.text(x, y += step, flatmate.name)
  doc.text(x, y += step, `Move out date: ${moveOutDate}`)
  doc.text(x, y += step, `Gets back in total: ${total} CHF`)
  debt.forEach(debtShare => {
    const roundedShare = Math.floor(debtShare.share * 100) / 100
    doc.text(x, y += step, `${debtShare.flatmate.name} pays ${roundedShare} CHF`)
  })

  doc.autoTable({
    body: data,
    margin: { top: y += step },
    headStyles: {
      fontSize: 8
    },
    columns: [
      { header: 'Item', dataKey: 'itemName' },
      { header: 'Purchase Date', dataKey: 'itemPurchaseDate' },
      { header: 'Annual Depreciation Rate', dataKey: 'annualDepreciationRate' },
      { header: 'Initial share', dataKey: 'initialShare' },
      { header: 'Gets Back', dataKey: 'share' }
    ]
  })

  // doc.output('pdfobjectnewwindow')
  return doc.save(`${flatmate.name.split(' ').join('')}-flatwise-breakdown.pdf`, { returnPromise: true })
}
