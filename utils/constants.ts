export const PROFILE_BUCKET = "profile-bucket";
export const POST_BUCKET = "post-bucket";

export const POST_BUCKET_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-bucket/`;

export const POST_LIMIT = 5;

export const QR_CODE_GEN_URL = "http://api.qrserver.com/v1/create-qr-code";

export const INDUSTRIES = [
  { key: "fnb", label: "Food & Beverage" },
  { key: "hospitality", label: "Hospitality" },
  { key: "it", label: "Information Technoloy" },
  { key: "travel", label: "Tour & Travel" },
  { key: "influencer", label: "Influencer" },
  { key: "jewelry", label: "Jewelry" },
  { key: "logistic", label: "Logistics & Supply Chain" },
  { key: "pharma", label: "Pharmaceutical" },
  { key: "social", label: "Social Media" },
  { key: "news", label: "News" },
  { key: "realestate", label: "Real Estate" },
  { key: "art", label: "Arts & Carft" },
  { key: "music", label: "Music" },
  { key: "sports", label: "Sports & Fitness" },
];
