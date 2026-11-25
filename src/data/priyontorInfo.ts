export const BRAND_INFO = {
  name: 'PRIYONTOR',
  tagline: 'Redefining Indian Heritage & Culture to the World, Through Fashion',
  motifsNote: 'Lotus Motif & Benaras Ghat Motif',
  debutMilestone: 'London Mahotsav 2026',
  launchpad: 'Wembley, London',
  birthplace: 'Kolkata, India',
  registeredAddress:
    '10B, Elite Tower 1, Block 1, Unimark Springfield, Newtown, Kol - 700136',
  storeAddress:
    'Astra Tower, Office No.: Ano – 211, North Block, 2nd Floor, 2c/1 Action Area, Newtown, Kol- 700161',
  contactNumbers: ['+91 9831809747', '+91 9875458430', '+91 9875492114'],
  supportNumbers: ['+91 6297451591', '+91 9875492114'],
  whatsappNumbers: ['+91 9831809747', '+91 9875458430'],
  emails: ['aps.vastrya@gmail.com', 'aps.operations26@gmail.com'],
  gstNumber: '19CQVPG9593F2ZV',
  deliveryLocations: 'India & Worldwide',
  paymentMethodsNote: 'UPI & Card Payment Only',
  welcomePromoCode: 'PRIYO5',
  welcomeDiscountPercent: 5,
  bulkThresholdINR: 20000,
  bulkDiscountPercent: 10,
  firstStoreDiscountPercent: 10,
  socialPlatforms: ['Instagram', 'Facebook', 'Pinterest'] as const,
};

export const ABOUT_PRIYONTOR = {
  heading: 'ABOUT PRIYONTOR',
  leadTagline: 'Redefining Indian Heritage & Culture to the World, Through Fashion',
  paragraphs: [
    "India's textile heritage is a tapestry of stories, traditions and craftsmanship passed down through generations. At PRIYONTOR, we celebrate this extraordinary legacy by bringing together the richness of traditional Indian textiles and the elegance of contemporary fashion.",
    'Inspired by the diverse weaving traditions, indigenous crafts and artistic expressions of different regions of India, PRIYONTOR is a celebration of the people, cultures and stories behind every creation.',
    "Marking the beginning of its journey on an international platform, PRIYONTOR made its debut at London Mahotsav 2026, bringing the richness of Indian textile heritage and traditional craftsmanship to a wider audience. This milestone reflects the brand's vision of taking India's diverse cultural and textile legacy beyond geographical boundaries.",
    'From exquisite handloom sarees and timeless ethnic ensembles to thoughtfully curated traditional attire for men and children, our collections honour the beauty of Indian craftsmanship while embracing the sensibilities of modern living.',
    'We believe that every weave carries a story, every motif holds a memory, and every tradition deserves to be celebrated.',
    'PRIYONTOR is not just about what you wear. It is about the heritage you carry.',
  ],
};

export const FOUNDER_STORY = {
  kicker: 'FOUNDER STORY',
  title: 'THE WOMAN BEHIND PRIYONTOR',
  founderName: 'Mrs. Priyanka Ganguly Sabui',
  paragraphs: [
    'Every dream begins with a passion, but it takes courage to turn that passion into reality.',
    'Founded by Mrs. Priyanka Ganguly Sabui, PRIYONTOR is the story of a woman who dared to pursue her dreams alongside the responsibilities of everyday life. After graduating, she began her professional journey as an Administrative Head, working a regular 9-to-5 job while nurturing her love for fashion and modelling. For nearly five years, she pursued modelling alongside her career, keeping her creative aspirations alive.',
    'Life brought new chapters, but her passion never faded. With the constant encouragement of her husband, Mr. Sauvik Sabui, Executive Director of a leading engineering company, and the blessings of her in-laws, Late Mr. Dilip Kumar Sabui and Mrs. Gopa Sabui, she found the confidence to transform her lifelong passion into something of her own.',
    'And so, PRIYONTOR was born.',
    "With the courage to take her dream beyond borders, she chose Wembley, London, as the launchpad for PRIYONTOR. Today, from her birthplace, Kolkata, she is taking the brand's vision from its roots in India to the world.",
  ],
};

export const DISCOUNT_PRIVILEGES = [
  {
    code: 'PRIYO5',
    badge: 'WELCOME OFFER',
    title: '5% Off First Online Order',
    detail: 'Welcome discount on 1st order across all products with code PRIYO5.',
  },
  {
    code: '₹20,000+ PRIVILEGE',
    badge: 'HIGH-VALUE TIER',
    title: '10% Off Orders of ₹20,000 & Above',
    detail: 'Automatically applied in bag and checkout on eligible archive acquisitions.',
  },
  {
    code: 'NEWTOWN STORE',
    badge: 'FIRST VISIT',
    title: '10% Off 1st Physical Store Purchase',
    detail: 'Applicable on your inaugural visit at Astra Tower, Action Area, Newtown, Kolkata.',
  },
];

export const SIZE_CHARTS = [
  {
    category: 'Indian Heritage & Designer Sarees',
    sizeSpec: 'FREE SIZE',
    measurements: 'Saree Length: 5.5 metres · Paired Unstitched Blouse Piece: 0.8 – 0.9 metres',
  },
  {
    category: "Women's Co-Ord Sets & Kurta Sets",
    sizeSpec: '38 TO 44',
    measurements: '38 (Bust 38" · Waist 32") · 40 (Bust 40" · Waist 34") · 42 (Bust 42" · Waist 36") · 44 (Bust 44" · Waist 38")',
  },
  {
    category: 'Blouses for Women',
    sizeSpec: '38 TO 44',
    measurements: 'Structured tailored fit across sizes 38, 40, 42 & 44 (₹800 – ₹2,000)',
  },
  {
    category: "Mens' Ethnic Punjabi (Cotton & Silk)",
    sizeSpec: '38 TO 44',
    measurements: '38 (Chest 40" · Length 41") · 40 (Chest 42" · Length 42") · 42 (Chest 44" · Length 43") · 44 (Chest 46" · Length 44")',
  },
  {
    category: "Kids' Wear — Boys Ethnic Punjabi",
    sizeSpec: '18 TO 36 (1 YEAR TO 15 YEAR)',
    measurements: 'Even sizes 18, 20, 22, 24, 26, 28, 30, 32, 34, 36 spanning ages 1 Year to 15 Years (₹1,900)',
  },
  {
    category: "Kids' Wear — Girls Lehenga Dupatta Set",
    sizeSpec: '1 TO 10 YEARS',
    measurements: 'Age-graded festive tailoring from 1–2 Years up to 9–10 Years (₹2,000)',
  },
];

export interface PolicyEntry {
  id:
    | 'shipping'
    | 'returns'
    | 'refund'
    | 'cancellation'
    | 'privacy'
    | 'terms'
    | 'care';
  title: string;
  summary: string;
  points: string[];
}

export const BUSINESS_POLICIES: PolicyEntry[] = [
  {
    id: 'shipping',
    title: 'Shipping Policy',
    summary: 'Dispatched from our Newtown, Kolkata store across India & Worldwide.',
    points: [
      'Delivery Coverage: We ship across India and Worldwide destinations.',
      'Order Dispatch: Ready-to-ship garments dispatch within 2–3 business days after quality inspection.',
      'Estimated Delivery: 4–7 business days within India; 7–14 business days for international deliveries.',
      'Store Pickup: Complimentary collection available at Astra Tower, Office No.: Ano – 211, North Block, 2nd Floor, 2c/1 Action Area, Newtown, Kol- 700161.',
    ],
  },
  {
    id: 'returns',
    title: 'Return & Exchange Policy',
    summary: 'Transparent exchange and return assistance for eligible unworn garments.',
    points: [
      'Eligibility Window: Raise a return or size-exchange request within 7 days of delivery.',
      'Garment Condition: Items must be unused, unwashed, unaltered, with original Priyontor tags and packaging intact.',
      'Direct Support: Contact Customer Support at +91 6297451591 / +91 9875492114 or WhatsApp +91 9831809747 / +91 9875458430 with your order number.',
    ],
  },
  {
    id: 'refund',
    title: 'Refund Policy',
    summary: 'Timely refunds processed directly to your original UPI or Card account.',
    points: [
      'Verification: Returned parcels undergo quality inspection upon arrival at our Newtown, Kolkata office.',
      'Processing Time: Approved refunds are initiated within 5–7 business days to your original UPI ID or Card payment source.',
      'Tax Compliance: Invoices are issued under GSTIN 19CQVPG9593F2ZV.',
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    summary: 'Flexible order cancellation prior to courier handover.',
    points: [
      'Before Dispatch: Orders may be cancelled within 24 hours of placement or before dispatch confirmation is issued.',
      'Cancellation Support: Email aps.vastrya@gmail.com / aps.operations26@gmail.com or reach us on WhatsApp (+91 9831809747 / +91 9875458430).',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    summary: 'Respectful protection of patron contact, delivery, and settlement records.',
    points: [
      'Data Minimization: Patron names, shipping addresses, email addresses, and phone numbers are collected strictly for order fulfillment and customer support.',
      'Payment Security: Priyontor accepts UPI and Card payments only and never stores raw card numbers or CVV security codes.',
      'No Unauthorized Sharing: Patron records are never sold or shared with unrelated third-party marketers.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    summary: 'Guidelines governing authentic handloom variations, pricing, and store offers.',
    points: [
      'Artisanal Craftsmanship: Subtle weave slubs, hand-dyed tonal variations, and motif irregularities are hallmarks of genuine Indian handloom textiles.',
      'Pricing & Offers: Welcome code PRIYO5 grants 5% off on 1st online orders; orders of ₹20,000+ receive 10% off; 1st physical purchase from our Newtown store receives 10% off.',
      'Governing Entity: PRIYONTOR — Registered at 10B, Elite Tower 1, Block 1, Unimark Springfield, Newtown, Kol - 700136.',
    ],
  },
  {
    id: 'care',
    title: 'Washing & Care Instructions',
    summary: 'Preserve the natural lustre, weave strength, and embroidery of every garment.',
    points: [
      'Silk, Banarasi, Tussar, Kani & Muga Sarees: Dry clean only for first and subsequent cleans; air in shade after wearing and fold wrapped in soft unbleached muslin cloth.',
      'Jamdani, Kantha, Chikankari & Handloom Cotton: Gentle cold hand wash separately with mild neutral detergent; never wring or soak with bleach; dry flat in shade.',
      "Mens' Silk & Cotton Punjabi / Kids' Ethnic Wear: Dry clean silk ensembles; gentle cold wash cotton Punjabis and iron inside-out on medium heat.",
      'Zari & Embroidery Care: Avoid spraying perfume directly onto metallic zari, ari work, or silk threads.',
    ],
  },
];

export const INQUIRY_TOPICS = [
  'Newtown Store Visit (10% First-Visit Offer)',
  'State Saree & Designer Drape Enquiry',
  'Mens Punjabi & Kids Ethnic Wear Sizing',
  'Order Status, Return or Custom Stitching',
  'Worldwide Shipping & Bulk Gifting',
] as const;

export interface PatronTestimonial {
  id: string;
  patronName: string;
  location: string;
  occasion: string;
  segment: 'sarees' | 'family' | 'store-london';
  garmentPurchased: string;
  rating: number;
  quote: string;
}

export const PATRON_TESTIMONIALS: PatronTestimonial[] = [
  {
    id: 'test-london-banarasi',
    patronName: 'Ananya Sengupta',
    location: 'Wembley, London',
    occasion: 'London Mahotsav 2026 Showcase',
    segment: 'store-london',
    garmentPurchased: 'Uttar Pradesh Banarasi Katan Silk Saree',
    rating: 5,
    quote:
      'Discovering Priyontor at London Mahotsav 2026 felt like bringing Kolkata and Varanasi home to Wembley. The crimson Banarasi silk drapes effortlessly, and the Benaras Ghat motif border drew compliments all evening.',
  },
  {
    id: 'test-newtown-jamdani',
    patronName: 'Debolina Mukherjee',
    location: 'Newtown, Kolkata',
    occasion: 'First Visit to Astra Tower Store',
    segment: 'sarees',
    garmentPurchased: 'West Bengal Dhakai Jamdani & Kantha Stitch Saree',
    rating: 5,
    quote:
      'Visited the Astra Tower boutique in Action Area with my mother and enjoyed the 10% first-visit store discount. The Jamdani weave is feather-light in Kolkata humidity yet looks regal for family pujas.',
  },
  {
    id: 'test-family-punjabi',
    patronName: 'Subhajit & Rituja Chatterjee',
    location: 'Salt Lake, Kolkata',
    occasion: 'Anniversary & Festive Family Wardrobe',
    segment: 'family',
    garmentPurchased: "Mens' Silk Punjabi (Size 42) & Girls Lehenga Dupatta Set",
    rating: 5,
    quote:
      'We dressed our whole family from Priyontor—an ivory silk Punjabi for me, a Lucknow Chikankari saree for my wife, and the girls lehenga dupatta set for our daughter. Every size from 38–44 and kids age chart fit true on the first try.',
  },
  {
    id: 'test-mumbai-designer',
    patronName: 'Kavita Deshmukh',
    location: 'Mumbai, Maharashtra',
    occasion: 'Wedding Reception Trousseau',
    segment: 'sarees',
    garmentPurchased: 'Priyontor Lotus Motif Silk Designer Saree',
    rating: 5,
    quote:
      'The ₹20,000+ 10% privilege made curating two designer sarees and a matching zari blouse effortless. Packaging arrived in crisp muslin within five days, with clear washing and dry-clean care instructions inside.',
  },
  {
    id: 'test-bengaluru-coord',
    patronName: 'Nandini Rao',
    location: 'Bengaluru, Karnataka',
    occasion: 'Work-to-Festive Breathable Edit',
    segment: 'family',
    garmentPurchased: "Women's Breathable Handloom Co-Ord Set (Size 40)",
    rating: 5,
    quote:
      'Used the PRIYO5 welcome offer on my first online order via UPI. The breathable cotton-linen co-ord set holds its tailored shape from morning meetings through evening dinners without feeling heavy.',
  },
  {
    id: 'test-uk-pochampally',
    patronName: 'Meera Krishnan',
    location: 'Birmingham, UK',
    occasion: 'Worldwide Courier Delivery',
    segment: 'store-london',
    garmentPurchased: 'Telangana Pochampally Ikat & Assamese Muga Cotton Saree',
    rating: 5,
    quote:
      'Having authentic Indian state-wise weaves shipped straight to the UK with WhatsApp sizing guidance saved me weeks of searching. Both sarees carry remarkable handloom texture and crisp fall.',
  },
];

