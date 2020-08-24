import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkDetailsComponent } from './work-details/work-details.component';

// const routes: Routes = [
//   {
//     path: '',
//     //component: WorkDetailsComponent,
//     children: [
//       { path: 'work', component: WorkDetailsComponent },
//       { path: 'work/:action/:id', component: WorkDetailsComponent },
//     ],
//   },
// ];

const routes: Routes = [
  { path: '', component: WorkDetailsComponent },
  { path: 'work', component: WorkDetailsComponent },
  { path: 'work/:action/:id', component: WorkDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserInfoRoutingModule {}
