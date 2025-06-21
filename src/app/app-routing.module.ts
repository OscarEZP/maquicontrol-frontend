import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AppAccountSettingComponent } from './maquicontrol/account-setting/account-setting.component';
import { PublicDetailsComponent } from './maquicontrol/machines/public-details/public-details.component';

const routes: Routes = [
  // Ruta para usuarios autenticados
  {
    path: 'dashboard',
    component: FullComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboards/dashboard2',
        pathMatch: 'full',
      },
      {
        path: 'machines',
        loadChildren: () =>
          import('../app/maquicontrol/machines/machines.module').then((m) => m.MachinesModule)
      },
      {
        path: 'account-settings',
        component: AppAccountSettingComponent
      },
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
    ],
  },

  // Ruta pública para el landing y otras páginas no autenticadas
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/theme-pages/landingpage/landingpage.module').then(
            (m) => m.LandingPageModule
          ),
      },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
      {
        path: 'public-details/:id',
        component: PublicDetailsComponent
      }
    ],
  },

  // Fallback: si ninguna ruta coincide, redirigir al landing
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
