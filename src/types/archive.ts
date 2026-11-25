export type PageRoute = 'home' | 'collections' | 'discover' | 'pdp' | 'checkout';

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'EUR';

export type SareeMapCategoryId =
  | 'banarasi'
  | 'bhagalpuri'
  | 'moirang-phee'
  | 'pochampally'
  | 'chanderi-maheshwari'
  | 'jamdani-kantha'
  | 'kani-ari'
  | 'ajrakh'
  | 'bandhej'
  | 'chikankari'
  | 'muga-cotton'
  | 'mangalgiri';

export interface SareeMapHotspot {
  id: SareeMapCategoryId;
  state: string;
  sareeName: string;
  corridorId: 'east' | 'north' | 'west' | 'south' | 'northeast';
  corridorLabel: string;
  coordinates: string;
  primaryFiber: string;
  loomMechanism: string;
  description: string;
  hotspotBox: { left: string; top: string; width: string; height: string };
  pinPos: { left: string; top: string };
}

export type ProductCategoryId =
  | 'sarees'
  | 'designer-sarees'
  | 'mens-punjabi'
  | 'kids-wear'
  | 'blouses'
  | 'womens-sets';

export type WardrobeSegment = 'her' | 'his' | 'little';

export type TextileArtworkId =
  | 'empress-varanasi'
  | 'empress-kadhwa-macro'
  | 'empress-reverse-weave'
  | 'empress-pit-loom'
  | 'shikargah-jangla'
  | 'emerald-gopuram'
  | 'nari-kunjar-patola'
  | 'darbar-sozni'
  | 'chanderi-angrakha'
  | 'ivory-sozni-jacket'
  | 'rajputi-poshak'
  | 'dhakai-jamdani'
  | 'bandhgala-sherwani'
  | 'assam-muga'
  | 'sambalpuri-bomkai'
  | 'sualkuchi-muga'
  | 'banarasi-jangla'
  | 'lucknowi-mukaish'
  | 'rajputana-bandhej'
  | 'yeola-paithani'
  | 'dhamadka-ajrakh'
  | 'balaramapuram-kasavu'
  | 'srikalahasti-kalamkari'
  | 'meitei-wangkhei'
  | 'chakhesang-naga'
  | 'khasi-ryndia'
  | 'mayur-emerald'
  | 'kashi-sonachuri'
  | 'shikargah-blue'
  | 'lilac-tanchoi'
  | 'kundan-choker'
  | 'zardozi-potli'
  | 'silhouette-sarees'
  | 'silhouette-bridal'
  | 'silhouette-bandhgala'
  | 'silhouette-pashmina'
  | 'silhouette-kurtas'
  | 'lookbook-bengal'
  | 'lookbook-rajasthan'
  | 'loom-pitloom'
  | 'loom-indigo'
  | 'loom-kalamkari';

export interface ProductColorway {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategoryId;
  categoryLabel: string;
  wardrobe: WardrobeSegment;
  regionId: 'east' | 'north' | 'west' | 'south' | 'northeast';
  regionLabel: string;
  guildLabel: string;
  weaveType: string;
  fiberTag: 'SILK' | 'TUSSAR' | 'COTTON' | 'MUGA' | 'KANI' | 'GEORGETTE';
  mapCategory?: SareeMapCategoryId;
  originBadge: string;
  secondaryBadge?: string;
  certificationText: string;
  priceINR: number;
  originalPriceINR?: number;
  statusText: string;
  readiness: 'ready' | 'active' | 'bespoke';
  craftHours: number;
  heritageRating: number;
  reviewCount: number;
  archiveRef: string;
  batchLabel: string;
  giNumber: string;
  loomOrigin: string;
  coordinates: string;
  loomMechanism: string;
  fiberComposition: string;
  weavingDuration: string;
  masterCraftsman: string;
  craftsmanBio: string;
  warpDensity: string;
  weftDensity: string;
  availableSizes: string[];
  sizeNote: string;
  careInstructions: string;
  artworkId: TextileArtworkId;
  galleryArtworks?: { label: string; artworkId: TextileArtworkId }[];
  colorways: ProductColorway[];
  giMarks: string[];
  featuredOnHome?: boolean;
  varanasiTreasure?: boolean;
}

export interface CorridorPin {
  id: string;
  name: string;
  craft: string;
  x: number;
  y: number;
  coordinates: string;
  guildTitle: string;
  guildCode: string;
  hours: string;
  ends: string;
  silverPurity: string;
  giCode: string;
  loomLabel: string;
  cadenceBpm: number;
}

export interface CorridorRegion {
  id: 'east' | 'north' | 'west' | 'south' | 'northeast';
  tabLabel: string;
  corridorGuideNumber: string;
  corridorTag: string;
  established: string;
  title: string;
  description: string;
  primaryFiber: string;
  loomMechanism: string;
  signatureWeave: string;
  coordinates: string;
  ctaLabel: string;
  pins: { name: string; sub: string; x: number; y: number }[];
  routePoints: [number, number][];
}

export interface BagItem {
  key: string;
  product: Product;
  selectedSize: string;
  colorway: string;
  pleatArchitecture: 'traditional' | 'pre-pleated';
  fallPico: boolean;
  blouseTailoring: boolean;
  quantity: number;
  unitPriceINR: number;
}

export interface FilterState {
  category: 'all' | ProductCategoryId;
  wardrobe: 'all' | WardrobeSegment;
  mapCategory: SareeMapCategoryId | null;
  regions: string[];
  weaves: string[];
  fibers: string[];
  giMarks: string[];
  maxPriceINR: number;
  readiness: 'all' | 'ready' | 'active' | 'bespoke';
  sortBy: 'curator' | 'price-asc' | 'price-desc' | 'hours';
  searchQuery: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  city?: string;
  memberTier: string;
  wishlistIds: string[];
  createdAt: string;
}

export type ShippingMethodId = 'india-courier' | 'worldwide-courier' | 'kolkata-store-pickup';

export type PaymentMethodId = 'card' | 'upi';

export interface OrderShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItemSummary {
  productId: string;
  title: string;
  archiveRef: string;
  originBadge: string;
  artworkId: TextileArtworkId;
  selectedSize: string;
  colorway: string;
  pleatArchitecture: 'traditional' | 'pre-pleated';
  fallPico: boolean;
  blouseTailoring: boolean;
  quantity: number;
  unitPriceINR: number;
  lineTotalINR: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: 'confirmed';
  createdAt: string;
  estimatedDispatch: string;
  currency: CurrencyCode;
  shippingAddress: OrderShippingAddress;
  shippingMethod: ShippingMethodId;
  shippingLabel: string;
  shippingFeeINR: number;
  paymentMethod: PaymentMethodId;
  paymentSummary: string;
  promoCode?: string;
  discountLabel?: string;
  discountAmountINR: number;
  dedicationNote?: string;
  items: OrderItemSummary[];
  subtotalINR: number;
  totalINR: number;
}
