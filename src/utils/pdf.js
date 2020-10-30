import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export function generateBreakdown (flatmate, moveOutDate, total, data) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF()

  doc.text(10, 10, flatmate.name)
  doc.text(10, 20, `Move out date: ${moveOutDate}`)
  doc.text(10, 30, `Gets back in total: ${total} CHF`)

  doc.autoTable({
    body: data,
    margin: { top: 40 },
    headStyles: {
      fontSize: 8
    },
    columns: [
      { header: 'Item', dataKey: 'itemName' },
      { header: 'Purchase Date', dataKey: 'itemPurchaseDate' },
      { header: 'Purchase Price', dataKey: 'itemPurchasePrice' },
      { header: 'Shared by', dataKey: 'sharedBy' },
      { header: 'Annual Depreciation Rate', dataKey: 'annualDepreciationRate' },
      { header: 'Gets Back', dataKey: 'share' }
    ]
  })

  // doc.output('pdfobjectnewwindow')
  doc.save(`${flatmate.name.split(' ').join('')}-flatwise-breakdown.pdf`)
}
