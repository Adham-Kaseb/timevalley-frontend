import apiClient from '@/lib/axios';

export interface CertificateMetadata {
  recipientName?: string;
  studentEmail?: string;
  studentId?: string;
  issuedBy?: string;
  completionHours?: number;
  trackName?: string;
  [key: string]: any;
}

export interface VerificationResponse {
  verified: boolean;
  code: string;
  title: string;
  type: string;
  courseId: string;
  issueDate: string;
  credentialUrl?: string;
  metadata?: CertificateMetadata;
  recipient: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    studentId?: string;
    companyName?: string;
    targetSector?: string;
  };
  issuer: {
    organization: string;
    founder: string;
    title: string;
    seal: string;
  };
}

export interface CertificateItem {
  id: string;
  title: string;
  type: string;
  courseId: string;
  code: string;
  issueDate: string;
  credentialUrl?: string;
  pdfUrl?: string;
  metadata?: CertificateMetadata;
  userId: string;
}

/**
 * PUBLIC: Verify a certificate by serial code or ID
 */
export async function verifyCertificate(code: string): Promise<VerificationResponse> {
  const res = await apiClient.get<VerificationResponse>(`/certificates/verify/${encodeURIComponent(code)}`);
  return res.data;
}

/**
 * AUTHENTICATED: Fetch all certificates belonging to current user
 */
export async function getMyCertificates(): Promise<CertificateItem[]> {
  const res = await apiClient.get<CertificateItem[]>('/certificates/my');
  return res.data;
}

/**
 * AUTHENTICATED: Check eligibility & auto-issue if course finished
 */
export async function checkCertificateEligibility(courseId: string = 'venture-architect-diploma'): Promise<CertificateItem | null> {
  try {
    const res = await apiClient.post<CertificateItem>('/certificates/check-eligibility', { courseId });
    return res.data;
  } catch (e) {
    return null;
  }
}

/**
 * AUTHENTICATED: Claim & Extract Certificate directly
 */
export async function claimCertificate(courseId: string = 'venture-architect-diploma'): Promise<CertificateItem | null> {
  return checkCertificateEligibility(courseId);
}

/**
 * ADMIN: Manually issue certificate to a user
 */
export async function adminIssueCertificate(dto: { userId: string; courseId?: string; title?: string; type?: string }) {
  const res = await apiClient.post<CertificateItem>('/certificates/admin/issue', dto);
  return res.data;
}

/**
 * ADMIN: Resend certificate email notification
 */
export async function adminResendCertificateEmail(certId: string) {
  const res = await apiClient.post(`/certificates/admin/resend-email/${certId}`);
  return res.data;
}
