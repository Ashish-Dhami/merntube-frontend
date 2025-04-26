import { memo } from 'react';
import { SidebarItem } from './';
import { ShootingStars } from './ui/shooting-stars';
import { StarsBackground } from './ui/stars-background';

function Sidebar() {
  const sidebarItems = [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Liked Videos',
      url: '/liked-videos',
    },
    {
      name: 'History',
      url: '/history',
    },
    {
      name: 'My Content',
      url: '/my-content',
    },
    {
      name: 'Collections',
      url: '/collections',
    },
    {
      name: 'Subscriptions',
      url: '/subscriptions',
    },
  ];

  return (
    <div className="relative h-full bg-gradient-to-b from-white to-neutral-100 pt-6 dark:from-neutral-950 dark:to-neutral-800">
      <StarsBackground />
      <ShootingStars />
      {sidebarItems.map((sidebarItem, i) => (
        <SidebarItem key={i} name={sidebarItem.name} url={sidebarItem.url} />
      ))}
    </div>
  );
}

export default memo(Sidebar);
