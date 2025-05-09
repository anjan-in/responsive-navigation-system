import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionManagementComponent } from 'src/app/components/permission-management/permission-management.component';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'users',
    children: [
      { path: '', component: UserListComponent },
      { path: 'profile/:id', component: UserProfileComponent },
      // { path: 'permissions', component: PermissionManagementComponent },
      { path: 'newUser', component: UserFormComponent}
    ],
  },
  { path: 'permissions', component: PermissionManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
