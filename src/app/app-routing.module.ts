import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkDetailsComponent } from './user-info/work-details/work-details.component';
import { WorkListComponent } from './user-info/work-list/work-list.component';
import { LoginFormComponent } from './login/login-form/login-form.component';

const routes: Routes = [
  { path: 'home', component: WorkListComponent },
  {
    path: 'details',
    loadChildren: () =>
      import('./user-info/user-info.module').then((m) => m.UserInfoModule),
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then((m) => m.HelpModule),
  },
  { path: '', component: LoginFormComponent },
  { path: '**', component: WorkListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
