import { Routes } from '@angular/router';
import { CreateMachineComponent } from './create-machine/create-machine.component';
import { DetailsMachineComponent } from './details-machine/details-machine.component';
import { MachinesComponent } from './machines.component';
import { UpdateMachineComponent } from './update-machine/update-machine.component';
import { ButtonsComponent } from './buttons/buttons.component';


export const MachinesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MachinesComponent,
      },
      {
        path: 'create',
        component: CreateMachineComponent,
      },
      {
        path: 'update/:id',
        component: UpdateMachineComponent,
      },
      {
        path: 'details/:id',
        component: DetailsMachineComponent,
      },
      {
        path: 'buttons/:id',
        component: ButtonsComponent,
      }
    ],
  },
];
