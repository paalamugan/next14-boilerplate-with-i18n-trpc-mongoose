import type { MessageKeys, RichTranslationValues } from 'next-intl';
import { useTranslations } from 'next-intl';
import type { HTMLAttributeAnchorTarget, ReactNode } from 'react';

import navigationConfig from '@/next-helpers/navigation.config';
import type {
  AuthNavigationKeys,
  FormattedMessage,
  GuestNavigationKeys,
  NavigationEntry,
} from '@/types';

type Context = Record<string, RichTranslationValues>;
type Navigation = Record<string, NavigationEntry>;

interface MappedNavigationEntry {
  items: Array<[string, MappedNavigationEntry]>;
  label: FormattedMessage;
  link: string;
  target?: HTMLAttributeAnchorTarget | undefined;
  icon?: ReactNode;
}

// Provides Context replacement for variables within the Link. This is also something that is not going
// to happen in the future with `nodejs/nodejs.dev` codebase
const replaceLinkWithContext = (link: string, context?: RichTranslationValues) =>
  Object.entries(context || {}).reduce(
    (finalLink, [find, replace]) =>
      finalLink.replace(`{${find}}`, typeof replace === 'string' ? replace : ''),
    link
  );

const useNavigationConfig = () => {
  const t = useTranslations();

  const mapNavigationEntries = (entries: Navigation, context: Context = {}) => {
    const getFormattedMessage = (
      label: MessageKeys<IntlMessages, keyof IntlMessages>,
      key: string
    ) => t.rich(label, context[key] || {});

    return Object.entries(entries).map(
      ([key, { label, link, items, target, icon }]): [string, MappedNavigationEntry] => [
        key,
        {
          target,
          label: label
            ? getFormattedMessage(label as MessageKeys<IntlMessages, keyof IntlMessages>, key)
            : '',
          link: link ? replaceLinkWithContext(link, context[key]) : '',
          items: items ? mapNavigationEntries(items, context) : [],
          icon,
        },
      ]
    );
  };

  const getAuthSideNavigation = (keys: Array<AuthNavigationKeys>, context: Context = {}) => {
    const navigationEntries: Navigation = keys.reduce(
      (acc, key) => ({ ...acc, [key]: navigationConfig.sideNavigation.auth[key] }),
      {}
    );

    return mapNavigationEntries(navigationEntries, context);
  };

  const getGuestSideNavigation = (keys: Array<GuestNavigationKeys>, context: Context = {}) => {
    const navigationEntries: Navigation = keys.reduce(
      (acc, key) => ({ ...acc, [key]: navigationConfig.sideNavigation.root[key] }),
      {}
    );

    return mapNavigationEntries(navigationEntries, context);
  };

  const authNavigationItems = mapNavigationEntries(navigationConfig.topNavigation.auth);
  const guestNavigationItems = mapNavigationEntries(navigationConfig.topNavigation.auth);

  return {
    getAuthSideNavigation,
    getGuestSideNavigation,
    authNavigationItems,
    guestNavigationItems,
  };
};

export default useNavigationConfig;
