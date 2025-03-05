import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { GeneralSettingsComponent } from './pages/settings/general-settings/general-settings.component';
import { SecuritySettingsComponent } from './pages/settings/security-settings/security-settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent,},
  // { path: 'dashboard', component: DashboardComponent,},
  // { path: 'settings', component: SettingsComponent,},
  // { 
  //   path: 'settings', children: [
  //     { path: 'general', component: GeneralSettingsComponent },
  //     { path: 'security', component: SecuritySettingsComponent }
  //   ]
  // },
  { path: 'profile', component: ProfileComponent },
  { path: 'dashbaord', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }  // Default route to home page if no other routes match
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
