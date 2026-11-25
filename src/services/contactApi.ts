export interface ContactInquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  visitDate?: string;
  message: string;
}

export interface ContactInquiryReceipt {
  id: string;
  referenceNumber: string;
  topic: string;
  visitDate?: string;
  createdAt: string;
}

export async function submitContactInquiry(
  token: string | null,
  payload: ContactInquiryPayload
): Promise<ContactInquiryReceipt> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'PRIYONTOR',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers,
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });

  let data: { inquiry?: ContactInquiryReceipt; error?: string } | null = null;
  try {
    data = (await res.json()) as { inquiry?: ContactInquiryReceipt; error?: string };
  } catch {
    data = null;
  }

  if (!res.ok || !data?.inquiry) {
    throw new Error(data?.error || 'Unable to submit your enquiry right now. Please try again.');
  }
  return data.inquiry;
}
