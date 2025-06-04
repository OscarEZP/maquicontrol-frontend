import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { PublicDetailsComponent } from './maquicontrol/machines/public-details/public-details.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/machines', pathMatch: 'full' },
      {
        path: 'machines',
        loadChildren: () => import('./maquicontrol/machines/machines.module').then(m => m.MachinesModule)
      }
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: 'public-details/:id', component: PublicDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
