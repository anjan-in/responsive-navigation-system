import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { PermissionManagementComponent } from 'src/app/components/permission-management/permission-management.component';
import { UserService } from 'src/app/services/user.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { UserFilterComponent } from 'src/app/components/user-filter/user-filter.component';


@NgModule({
  declarations: [
    UserManagementComponent,
    UserListComponent,
    UserProfileComponent,
    PermissionManagementComponent,
    UserFormComponent,
    UserFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    UserManagementRoutingModule
  ],
  providers: [
    UserService,
    PermissionService
  ],
  exports: [
    UserListComponent,
    UserProfileComponent,
    PermissionManagementComponent
  ]
})
export class UserManagementModule { }
