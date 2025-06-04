import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { PublicDetailsComponent } from './maquicontrol/machines/public-details/public-details.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'public-details/:id', component: PublicDetailsComponent },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'machines',
        loadChildren: () =>
          import('./maquicontrol/machines/machines.module').then(
            (m) => m.MachinesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
