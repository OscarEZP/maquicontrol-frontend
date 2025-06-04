import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Maquicontrol'
  },
  {
    displayName: 'Maquinas',
    route: 'machines',
    children: [
      { displayName: 'Listado', iconName: 'list', route: 'machines' },
      { displayName: 'Crear', iconName: 'plus', route: 'machines/create' }
    ]
  }
];
