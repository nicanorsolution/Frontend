import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { SharedModule } from '../../helpers/share.module';

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    UsersComponent
  ]
})
export class UsersModule { }
