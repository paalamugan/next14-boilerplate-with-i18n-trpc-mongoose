import type { HTMLAttributeAnchorTarget } from 'react';

export interface FooterConfig {
  text: string;
  link: string;
}

export interface SocialConfig {
  icon: string;
  link: string;
  alt?: string;
}

export type AuthNavigationKeys = 'dashboard' | 'profile';

export type GuestNavigationKeys =
  | 'home'
  | 'guestbook'
  | 'about'
  | 'portfolio'
  | 'signIn'
  | 'signUp';

export interface NavigationEntry {
  label?: string;
  link?: string;
  items?: Record<string, NavigationEntry>;
  target?: HTMLAttributeAnchorTarget | undefined;
}

export type TopNavigationRecord = {
  auth: Record<AuthNavigationKeys, NavigationEntry>;
  root: Record<GuestNavigationKeys, NavigationEntry>;
};

export type TopNavigationKeys = keyof TopNavigationRecord;

export interface SiteNavigationConfig {
  topNavigation: TopNavigationRecord;
  sideNavigation: TopNavigationRecord;
}
