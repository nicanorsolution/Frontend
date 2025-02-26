import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
    imports: [ RouterModule, CommonModule,NgxPermissionsModule.forChild() ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ]
})

export class SidebarModule {}
