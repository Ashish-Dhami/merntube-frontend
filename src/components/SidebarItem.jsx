import { NavLink } from 'react-router-dom';

export default function SidebarItem({ name, url }) {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `relative mx-auto mb-4 block w-[92%] border border-solid border-[#475569] p-2 shadow-lg shadow-red-600/50 select-none hover:bg-[#a855f7] ${isActive ? 'bg-[#a855f7bb]' : ''}`
      }
    >
      {name}
    </NavLink>
  );
}
