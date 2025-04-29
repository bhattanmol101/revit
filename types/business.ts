export type BusinessRequest = {
  adminId: string;
  name: string;
  ownerName: string;
  description: string;
  logo?: string;
  location: string;
  contact: string;
  website?: string;
  industry: string;
};

export interface Business {
  id: string;
  adminId: string;
  name: string;
  ownerName: string;
  description: string;
  logo?: string | null;
  location: string;
  contact: string;
  website?: string | null;
  industry: string;
  createdAt: Date;
}

export interface UpdateBusiness {
  name: string;
  ownerName: string;
  description: string;
  logo?: string;
  location: string;
  contact: string;
  website?: string;
  industry: string;
}
