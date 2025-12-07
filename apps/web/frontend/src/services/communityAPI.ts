import api from './api';
import type {
  Review,
  ReviewSummary,
  Question,
  CommunityHubPayload,
  UGCLook,
  Contribution,
} from '../types/community';

export interface ProductCommunityResponse {
  reviews: Review[];
  reviewSummary: ReviewSummary;
  questions: Question[];
  gallery: UGCLook[];
  contributions?: Contribution[];
}

const fallbackProductCommunity = (productId: string): ProductCommunityResponse => {
  const now = new Date();
  const toIso = (offsetDays: number) => new Date(now.getTime() - offsetDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    reviewSummary: {
      averageRating: 4.7,
      totalCount: 482,
      distribution: [
        { stars: 5, count: 360 },
        { stars: 4, count: 92 },
        { stars: 3, count: 18 },
        { stars: 2, count: 8 },
        { stars: 1, count: 4 },
      ],
      aiSummary: {
        positiveHighlights: [
          'Customers love the balanced sound profile and deep bass.',
          'Battery life consistently exceeds expectations (35-40h).',
          'Comfortable for extended wear, even with glasses.',
        ],
        considerations: [
          'Carrying case is bulkier than some competitors.',
          'ANC slightly reduces ambient awareness in commute mode.',
        ],
        sentimentScore: 0.91,
      },
      lastUpdated: now.toISOString(),
    },
    reviews: [
      {
        id: 'rev-1001',
        productId,
        userId: 'user-42',
        author: {
          name: 'Sydney Park',
          avatar: 'https://i.pravatar.cc/80?img=12',
          tier: 'Platinum',
        },
        rating: 5,
        title: 'Studio-grade sound with wild battery life',
        body: 'I produce music and these hold up to my studio monitors. Bass is rich without overpowering mids, and the spatial audio mode actually works. Took them on a 10h flight and still had 60% battery left.',
        createdAt: toIso(2),
        verifiedPurchase: true,
        helpfulCount: 128,
        notHelpfulCount: 4,
        photos: [
          {
            id: 'media-1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
            alt: 'Headphones on a desk with laptop',
          },
        ],
        status: 'approved',
        tags: ['Sound quality', 'Battery', 'Studio'],
      },
      {
        id: 'rev-1002',
        productId,
        userId: 'user-13',
        author: {
          name: 'Alex Johnson',
          avatar: 'https://i.pravatar.cc/80?img=47',
          tier: 'Gold',
        },
        rating: 4,
        title: 'Comfy but case is massive',
        body: 'ANC is stellar and they feel great even after hours. Only gripe is the case – wish it was slimmer for backpacks.',
        createdAt: toIso(6),
        verifiedPurchase: true,
        helpfulCount: 76,
        notHelpfulCount: 12,
        status: 'approved',
        tags: ['Comfort', 'Travel'],
      },
      {
        id: 'rev-1003',
        productId,
        userId: 'user-88',
        author: {
          name: 'Marisol Vega',
          avatar: 'https://i.pravatar.cc/80?img=20',
          tier: 'Silver',
        },
        rating: 5,
        title: 'Soundstage is chef\'s kiss',
        body: 'If you care about natural vocals and crisp highs, these blow the competition away. Using them for nightly listening sessions and the multi-device pairing is seamless.',
        createdAt: toIso(10),
        verifiedPurchase: true,
        helpfulCount: 44,
        notHelpfulCount: 1,
        status: 'approved',
      },
    ],
    questions: [
      {
        id: 'q-9001',
        productId,
        title: 'Do these work well for running or working out?',
        body: 'Wondering if they stay in place when jogging or if sweat is an issue.',
        createdAt: toIso(8),
        status: 'approved',
        asker: {
          name: 'Carmen',
          avatar: 'https://i.pravatar.cc/80?img=9',
        },
        answers: [
          {
            id: 'ans-1',
            questionId: 'q-9001',
            body: 'They stay on for light workouts but I would not sprint with them. Sweat-resistant ear cushions handle gym sessions just fine.',
            createdAt: toIso(7),
            responder: {
              name: 'Daniel (Verified Buyer)',
              avatar: 'https://i.pravatar.cc/80?img=18',
              role: 'customer',
            },
            isAccepted: true,
            upvotes: 24,
            status: 'approved',
          },
          {
            id: 'ans-2',
            questionId: 'q-9001',
            body: 'We recommend our FitPro buds for intense workouts. These are engineered for commute & studio use.',
            createdAt: toIso(7),
            responder: {
              name: 'Easy11 Gear Team',
              role: 'staff',
            },
            isAccepted: false,
            upvotes: 12,
            status: 'approved',
          },
        ],
      },
      {
        id: 'q-9002',
        productId,
        title: 'Can I pair with two devices simultaneously?',
        body: 'Switching between my laptop and phone a lot for calls.',
        createdAt: toIso(4),
        status: 'approved',
        asker: {
          name: 'Liam',
        },
        answers: [
          {
            id: 'ans-3',
            questionId: 'q-9002',
            body: 'Yes! Multipoint pairing works with up to 3 devices. I seamlessly hop between MacBook, iPad, and Pixel.',
            createdAt: toIso(3),
            responder: {
              name: 'Jess',
              avatar: 'https://i.pravatar.cc/80?img=33',
              role: 'customer',
            },
            isAccepted: true,
            upvotes: 41,
            status: 'approved',
          },
        ],
      },
    ],
    gallery: [
      {
        id: 'look-101',
        title: 'Studio Session Essentials',
        description: 'My desk setup for editing podcasts with these cans + Easy11 mic.',
        media: {
          url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=900&q=80',
          alt: 'Podcast editing desk setup',
          type: 'image',
        },
        author: {
          name: 'SoundByMila',
          handle: '@soundbymila',
          avatar: 'https://i.pravatar.cc/80?img=45',
        },
        stats: {
          favorites: 212,
          comments: 18,
          conversions: 34,
        },
        taggedProducts: [
          {
            productId,
            name: 'Wireless Headphones Pro Max',
            price: 299.99,
            url: `/products/${productId}`,
            badge: 'In your cart',
          },
          {
            productId: 'pod-mic-22',
            name: 'Creator Mic Kit',
            price: 149,
            url: '/products/pod-mic-22',
          },
        ],
        createdAt: toIso(5),
        featured: true,
        status: 'approved',
      },
      {
        id: 'look-102',
        title: 'Coffee shop playlists all day',
        description: 'ANC + lofi beats + oat latte = focus unlocked.',
        media: {
          url: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=900&q=80',
          alt: 'Person working at coffee shop with laptop and headphones',
          type: 'image',
        },
        author: {
          name: 'FocusFlow',
          avatar: 'https://i.pravatar.cc/80?img=54',
        },
        stats: {
          favorites: 156,
          comments: 9,
          conversions: 21,
        },
        taggedProducts: [
          {
            productId,
            name: 'Wireless Headphones Pro Max',
            price: 299.99,
            url: `/products/${productId}`,
          },
        ],
        createdAt: toIso(9),
        status: 'approved',
      },
    ],
    contributions: [
      {
        id: 'contrib-1',
        type: 'review',
        title: 'Studio-grade sound review',
        productName: 'Wireless Headphones Pro Max',
        createdAt: toIso(2),
        status: 'approved',
        rewardPoints: 20,
        link: `/products/${productId}#reviews`,
      },
      {
        id: 'contrib-2',
        type: 'answer',
        title: 'Multipoint pairing answer',
        productName: 'Wireless Headphones Pro Max',
        createdAt: toIso(3),
        status: 'approved',
        rewardPoints: 15,
        link: `/products/${productId}#qa`,
      },
      {
        id: 'contrib-3',
        type: 'ugc',
        title: 'Studio Session Essentials look',
        productName: 'Wireless Headphones Pro Max',
        createdAt: toIso(5),
        status: 'approved',
        rewardPoints: 30,
        link: `/community/looks/look-101`,
      },
    ],
  };
};

const fallbackCommunityHub = (): CommunityHubPayload => {
  const productId = '1';
  const productData = fallbackProductCommunity(productId);
  return {
    heroLook: productData.gallery[0] ?? null,
    featuredSections: [
      {
        id: 'section-trending',
        title: 'Trending looks',
        subtitle: 'Shop the fits creators are loving right now.',
        looks: productData.gallery,
      },
      {
        id: 'section-staff',
        title: 'Staff picks',
        subtitle: 'Curated by the Easy11 gear lab.',
        looks: productData.gallery.map((look) => ({ ...look, featured: true })),
      },
    ],
    trendingCreators: [
      {
        id: 'creator-1',
        name: 'Mila Ortiz',
        handle: '@soundbymila',
        avatar: 'https://i.pravatar.cc/80?img=45',
        bio: 'Audio engineer & lo-fi playlist curator.',
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/soundbymila' },
          { platform: 'tiktok', url: 'https://tiktok.com/@soundbymila' },
        ],
        disclosures: ['#gifted', '#creator'],
        metrics: {
          reach: 182000,
          conversions: 320,
          earnings: 2450,
        },
      },
      {
        id: 'creator-2',
        name: 'Jay Patel',
        handle: '@jaymakes',
        avatar: 'https://i.pravatar.cc/80?img=28',
        bio: 'Product reviewer focused on smart home + audio.',
        socialLinks: [
          { platform: 'youtube', url: 'https://youtube.com/jaymakes' },
          { platform: 'blog', url: 'https://jaymakes.blog' },
        ],
        disclosures: ['#ad'],
        metrics: {
          reach: 95000,
          conversions: 210,
          earnings: 1780,
        },
      },
    ],
    stats: {
      totalReviews: 18640,
      totalLooks: 482,
      featuredCampaign: 'Creator drop: Sound & Vision Week',
    },
  };
};

export const fetchProductCommunity = async (productId: string): Promise<ProductCommunityResponse> => {
  try {
    const response = await api.get<ProductCommunityResponse>(`/community/products/${productId}`);
    return response.data;
  } catch (error) {
    console.warn('[CommunityAPI] Falling back to seeded community data', error);
    return fallbackProductCommunity(productId);
  }
};

export const fetchCommunityHub = async (): Promise<CommunityHubPayload> => {
  try {
    const response = await api.get<CommunityHubPayload>('/community');
    return response.data;
  } catch (error) {
    console.warn('[CommunityAPI] Using fallback community hub payload', error);
    return fallbackCommunityHub();
  }
};


