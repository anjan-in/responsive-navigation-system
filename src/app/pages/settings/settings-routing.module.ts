import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';

const routes: Routes = [
  // { path: '', component: SettingsComponent }
  { 
    path: 'settings', 
    children: [
      { path: 'general', component: GeneralSettingsComponent },
      { path: 'security', component: SecuritySettingsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
