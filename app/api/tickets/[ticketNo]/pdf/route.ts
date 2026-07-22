import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { generatePdfBuffer } from '@/app/lib/pdfGenerator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketNo: string }> }
) {
  try {
    const { ticketNo } = await params

    if (!ticketNo) {
      return new NextResponse('Ticket number is required', { status: 400 })
    }

    const ticket = await prisma.returnTicket.findUnique({
      where: { ticket_no: ticketNo },
      include: {
        company: true,
        contact: true,
        product: true,
        primaryStaff: true
      }
    })

    if (!ticket) {
      return new NextResponse('Ticket not found', { status: 404 })
    }

    const pdfBuffer = await generatePdfBuffer({
      receiveDate: new Date(ticket.receive_date).toLocaleDateString('th-TH'),
      statusDate: new Date(ticket.status_date || ticket.createdAt).toLocaleDateString('th-TH'),
      companyName: ticket.company.name,
      contactName: `${ticket.contact.name} (${ticket.contact.phone})`,
      productName: `${ticket.product.brand} - ${ticket.product.model}`,
      serialNo: ticket.serial_no || '',
      problemSymptom: ticket.problem_symptom || '',
      includedAccessories: ticket.included_accessories || '',
      remark: ticket.remark || '',
      staffName: ticket.primaryStaff.name,
      coStaffNames: ticket.co_staff_names || ''
    })

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${ticketNo}.pdf"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error: unknown) {
    console.error("Dynamic PDF Generation Error:", error)
    return new NextResponse('Internal Server Error generating PDF', { status: 500 })
  }
}
