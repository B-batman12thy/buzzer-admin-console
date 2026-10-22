import { IconName } from '../../shared/ui/icon/icon';

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Sidebar navigation — groups as defined in the project documentation. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Match Management',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Sports', path: '/sports', icon: 'sports' },
      { label: 'Verifications', path: '/verifications', icon: 'verified' },
    ],
  },
  {
    label: 'Publishing',
    items: [
      { label: 'Videos', path: '/videos', icon: 'video' },
      { label: 'Athlete Blog Requests', path: '/blog-requests', icon: 'blog' },
      { label: 'Restricted Words', path: '/restricted-words', icon: 'words' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Referrals', path: '/referrals', icon: 'referrals' },
      { label: 'Registrations', path: '/registrations', icon: 'registrations' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Users', path: '/users', icon: 'users' },
      { label: 'Reporting', path: '/reporting', icon: 'reporting' },
      { label: 'Restricted Devices', path: '/restricted-devices', icon: 'devices' },
    ],
  },
];
