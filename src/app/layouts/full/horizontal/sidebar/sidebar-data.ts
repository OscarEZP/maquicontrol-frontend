import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Inicio',
    iconName: 'home',
    route: 'dashboards/dashboard2',
  },
  {
    displayName: 'Maquinarias',
    iconName: 'truck',
    route: 'dashboard/machines',
    children: [
      {
        displayName: 'Listar maquinas',
        iconName: 'point',
        route: 'dashboard/machines',
      },
      {
        displayName: 'Crear maquinas',
        iconName: 'point',
        route: 'dashboard/machines/create',
      },
    ],
  },
];
