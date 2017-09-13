import { NgModule } from '@angular/core';
import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';
import { UserDetailEdit } from './user-detail-edit.component';
import { RouterModule } from '@angular/router';
import { UserGuardService } from './user-guard.service';
import { UserService } from './user.service';
import { SharedModule } from './../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    RouterModule.forChild([
        { path: 'users', component: UserListComponent },
        { path: 'users/:id/edit', component: UserDetailEdit},
        { path: 'users/:id',
          canActivate: [ UserGuardService ],
          component: UserDetailComponent }
    ]),
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserDetailEdit
  ],
  providers: [
    UserService,
    UserGuardService
  ]
})
export class UserModule { }
