import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Maquicontrol'
  },
  {
    displayName: 'Maquinas',
    iconName: 'device-desktop',
    route: '/machines',
    children: [
      { displayName: 'Listado', iconName: 'list', route: '/machines' },
      { displayName: 'Crear', iconName: 'plus', route: '/machines/create' }
    ]
  }
];
