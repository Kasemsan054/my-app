export async function uploadAttachment(pdfBuffer: Buffer, fileName: string) {
  const apiKey = process.env.TBS_API_KEY
  const apiSecret = process.env.TBS_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('TBS_API_KEY and TBS_API_SECRET must be set in environment variables')
  }

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`

  const formData = new FormData()
  // Append as a Blob/File. Node's fetch supports Blob.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = new Blob([pdfBuffer as any], { type: 'application/pdf' })
  formData.append('file', blob, fileName)

  const response = await fetch('https://email-api.thaibulksms.com/email/v1/email-attachment/media', {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('TBS Upload Attachment Error:', errorData)
    throw new Error(errorData.message || 'Failed to upload attachment to ThaibulkSMS')
  }

  const data = await response.json()
  if (data.success && data.files && data.files.length > 0) {
    return data.files[0].uuid
  }
  
  throw new Error('Invalid response from ThaibulkSMS attachment upload')
}

export async function sendReturnTicketEmail(
  recipientEmail: string,
  subject: string,
  attachmentUuid: string,
  mergeTags: Record<string, string>,
  senderOverride?: { fromEmail: string; fromName?: string }
) {
  const apiKey = process.env.TBS_API_KEY
  const apiSecret = process.env.TBS_API_SECRET
  const templateUuid = process.env.TBS_EMAIL_TEMPLATE_UUID
  const fromEmail = senderOverride?.fromEmail || process.env.TBS_MAIL_FROM_EMAIL
  const fromName = senderOverride?.fromName || process.env.TBS_MAIL_FROM_NAME

  if (!apiKey || !apiSecret || !templateUuid || !fromEmail) {
    throw new Error('TBS credentials/template configuration is missing in environment variables')
  }

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`

  const payload = {
    template_uuid: templateUuid,
    mail_from: {
      email: fromEmail,
      ...(fromName && { name: fromName })
    },
    mail_to: {
      email: recipientEmail
    },
    subject,
    payload: mergeTags,
    attachments: [
      {
        type: 'uuid',
        uuid: attachmentUuid
      }
    ]
  }

  const response = await fetch('https://email-api.thaibulksms.com/email/v1/send_template', {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('TBS Send Email Error:', errorData)
    throw new Error(errorData.message || 'Failed to send email via ThaibulkSMS')
  }

  return response.json()
}
