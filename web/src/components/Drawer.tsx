import { NavLink } from 'react-router';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Categories' },
  { to: '/account', label: 'Account' },
];

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <nav
        className={`absolute inset-y-0 left-0 w-64 bg-white p-4 pt-[max(1rem,env(safe-area-inset-top))] shadow-xl transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main menu"
      >
        <p className="mb-4 px-3 text-lg font-semibold text-teal-700">Expenses</p>
        <ul className="space-y-1">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 ${isActive ? 'bg-teal-50 font-medium text-teal-700' : 'hover:bg-slate-100'}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
