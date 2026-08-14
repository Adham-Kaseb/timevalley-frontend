export * from './auth';

export interface VentureTrack {
  id: string;
  title: string;
  desc: string;
  icon: string;
  badge: string;
  status: string;
}

export interface PortfolioStartup {
  name: string;
  category: string;
  desc: string;
  raised: string;
  valuation: string;
  logo: string;
}

export interface TeamCard {
  id: string;
  name: string;
  sector: string;
  founder: string;
  openRoles: string[];
  equity: string;
  desc: string;
  status: string;
}

export interface EcosystemMember {
  name: string;
  role: string;
  location: string;
  expertise: string[];
  avatar: string;
  badge: string;
}

export interface Testimonial {
  name: string;
  role: string;
  img: string;
  quote: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface PlatformStats {
  venturesBuilt: number;
  capitalRaised: string;
  foundersNetwork: string;
  diplomaHours: string;
}
