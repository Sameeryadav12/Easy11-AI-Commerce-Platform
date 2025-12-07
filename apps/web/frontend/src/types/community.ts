export type ModerationStatus = 'approved' | 'pending' | 'rejected' | 'flagged';

export interface ReviewMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt: string;
  thumbnailUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  author: {
    name: string;
    avatar?: string;
    isCreator?: boolean;
    tier?: 'Silver' | 'Gold' | 'Platinum';
  };
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  photos?: ReviewMedia[];
  status: ModerationStatus;
  tags?: string[];
}

export interface ReviewSummary {
  averageRating: number;
  totalCount: number;
  distribution: Array<{
    stars: 1 | 2 | 3 | 4 | 5;
    count: number;
  }>;
  aiSummary: {
    positiveHighlights: string[];
    considerations: string[];
    sentimentScore: number;
  };
  lastUpdated: string;
}

export interface Question {
  id: string;
  productId: string;
  title: string;
  body: string;
  createdAt: string;
  status: ModerationStatus;
  asker: {
    name: string;
    avatar?: string;
  };
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  body: string;
  createdAt: string;
  responder: {
    name: string;
    avatar?: string;
    role: 'customer' | 'seller' | 'staff';
  };
  isAccepted: boolean;
  upvotes: number;
  status: ModerationStatus;
}

export interface UGCLookProduct {
  productId: string;
  name: string;
  price: number;
  url: string;
  badge?: string;
}

export interface UGCLook {
  id: string;
  title: string;
  description: string;
  media: {
    url: string;
    alt: string;
    type: 'image' | 'video';
  };
  author: {
    name: string;
    avatar?: string;
    handle?: string;
  };
  stats: {
    favorites: number;
    comments: number;
    conversions: number;
  };
  taggedProducts: UGCLookProduct[];
  createdAt: string;
  featured?: boolean;
  status: ModerationStatus;
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  bio: string;
  socialLinks: {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'pinterest' | 'blog';
    url: string;
  }[];
  disclosures: string[];
  metrics: {
    reach: number;
    conversions: number;
    earnings: number;
  };
}

export interface CommunityFeedSection {
  id: string;
  title: string;
  subtitle: string;
  looks: UGCLook[];
}

export interface CommunityHubPayload {
  heroLook: UGCLook | null;
  featuredSections: CommunityFeedSection[];
  trendingCreators: CreatorProfile[];
  stats: {
    totalReviews: number;
    totalLooks: number;
    featuredCampaign: string;
  };
}

export interface Contribution {
  id: string;
  type: 'review' | 'answer' | 'ugc';
  title: string;
  productName: string;
  createdAt: string;
  status: ModerationStatus;
  rewardPoints?: number;
  link: string;
}


