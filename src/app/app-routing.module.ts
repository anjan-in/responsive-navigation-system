import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent,},
  { path: 'profile', component: ProfileComponent },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }  // Default route to home page if no other routes match
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
