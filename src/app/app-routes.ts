import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
// Add other imports here

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: ProfileComponent },
    { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }  // Default route to home page if no other routes match
];
