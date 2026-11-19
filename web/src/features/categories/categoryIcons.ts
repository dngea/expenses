import {
  Baby, Banknote, Beer, Bike, BookOpen, Briefcase, Building, Bus, Car, Coffee, CreditCard,
  Dumbbell, Droplet, Film, Flame, Fuel, Gamepad2, Gift, GraduationCap, HandCoins, Headphones,
  HeartPulse, House, Landmark, Laptop, ParkingMeter, PartyPopper, PawPrint, PiggyBank, Pill,
  Pizza, Plane, Receipt, Repeat, Scissors, Shield, Shirt, ShoppingBag, ShoppingCart, Smartphone,
  Sofa, Sparkles, Stethoscope, Store, Tag, Ticket, TrainFront, TrendingUp, Tv, Utensils, Wallet,
  Wifi, Wine, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icons a category can use. Keys are lucide's own icon names (https://lucide.dev/icons),
 * and the key is what the backend stores (e.g. "shopping-cart"), so keys must stay stable.
 * Order = order shown in the picker, grouped by theme.
 */
export const CATEGORY_ICONS = {
  // Shopping & food
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  store: Store,
  utensils: Utensils,
  pizza: Pizza,
  coffee: Coffee,
  beer: Beer,
  wine: Wine,
  // Home & bills
  house: House,
  building: Building,
  sofa: Sofa,
  wrench: Wrench,
  zap: Zap,
  droplet: Droplet,
  flame: Flame,
  wifi: Wifi,
  smartphone: Smartphone,
  tv: Tv,
  // Transport & travel
  car: Car,
  fuel: Fuel,
  'parking-meter': ParkingMeter,
  bus: Bus,
  'train-front': TrainFront,
  bike: Bike,
  plane: Plane,
  // Health & personal
  'heart-pulse': HeartPulse,
  pill: Pill,
  stethoscope: Stethoscope,
  dumbbell: Dumbbell,
  shirt: Shirt,
  scissors: Scissors,
  sparkles: Sparkles,
  // Leisure
  film: Film,
  headphones: Headphones,
  'gamepad-2': Gamepad2,
  ticket: Ticket,
  'party-popper': PartyPopper,
  gift: Gift,
  // Family & education
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  baby: Baby,
  'paw-print': PawPrint,
  // Money
  repeat: Repeat,
  receipt: Receipt,
  'credit-card': CreditCard,
  landmark: Landmark,
  shield: Shield,
  'piggy-bank': PiggyBank,
  wallet: Wallet,
  banknote: Banknote,
  'hand-coins': HandCoins,
  // Income
  briefcase: Briefcase,
  laptop: Laptop,
  'trending-up': TrendingUp,
  tag: Tag,
} satisfies Record<string, LucideIcon>;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS) as CategoryIconKey[];

export const DEFAULT_CATEGORY_ICON: CategoryIconKey = 'tag';

export function isCategoryIconKey(value: string | null | undefined): value is CategoryIconKey {
  return !!value && value in CATEGORY_ICONS;
}

/** Icon for a stored key; unknown or missing keys get a tag. */
export function getCategoryIcon(key: string | null | undefined): LucideIcon {
  return (key && CATEGORY_ICONS[key as CategoryIconKey]) || Tag;
}
