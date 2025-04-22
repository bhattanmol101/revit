export interface BusinessRequest {
  adminId: string;
  name: string;
  ownerName: string;
  description: string;
  logo?: string;
  location: string;
  contact: string;
  website?: string;
  industry: string;
}

export interface Business {
  id: string;
  adminId: string;
  name: string;
  ownerName: string;
  description: string;
  logo?: string;
  location: string;
  contact: string;
  website?: string;
  industry: string;
  createdAt: Date;
}
