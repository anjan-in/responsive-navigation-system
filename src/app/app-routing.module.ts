import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { routes } from './app-routes';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'user-management', 
    loadChildren: () => import('./pages/user-management/user-management.module').then(m => m.UserManagementModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'settings', 
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },
  // { 
  //   path: 'admin', 
  //   loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  //   canActivate: [AuthGuard],
  //   data: { roles: ['admin'] }
  // },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
