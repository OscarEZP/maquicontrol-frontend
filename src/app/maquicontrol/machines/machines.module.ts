import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MachinesRoutes } from './machines.routing';
import { MachinesComponent } from './machines.component';
import { CreateMachineComponent } from './create-machine/create-machine.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { UpdateMachineComponent } from './update-machine/update-machine.component';
import { DetailsMachineComponent } from './details-machine/details-machine.component';
import { ButtonsComponent, CreateButtonModalComponent } from './buttons/buttons.component';
import {MatIconModule} from '@angular/material/icon';
import { ButtonFilesComponent } from './buttons/button-files.component';
import { PublicDetailsComponent } from './public-details/public-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    MachinesComponent,
    CreateMachineComponent,
    UpdateMachineComponent,
    DetailsMachineComponent,
    ButtonsComponent,
    CreateButtonModalComponent,
    ButtonFilesComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MachinesRoutes),
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    NgApexchartsModule,
    TablerIconsModule.pick(TablerIcons),
    DragDropModule,
    NgxPaginationModule,
    HttpClientModule,
    AngularEditorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatNativeDateModule,
    NgScrollbarModule,
    MatIconModule,
    FlexLayoutModule
  ],
  exports: [TablerIconsModule],

})
export class MachinesModule { }
