import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { DepartmentViewComponent } from './components/department-view/department-view';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'departments/:id', component: DepartmentViewComponent }
];
