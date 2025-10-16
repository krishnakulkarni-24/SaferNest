import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AlertsComponent } from './components/alerts/alerts';
import { TrainingComponent } from './components/training/training';
import { ContactComponent } from './components/contact/contact';
import { ProfileComponent } from './components/profile/profile';
import { CreateAlertComponent } from './components/create-alert/create-alert';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard';
import { VolunteerDashboardComponent } from './components/dashboard/volunteer-dashboard';
import { ResidentDashboardComponent } from './components/dashboard/resident-dashboard';
import { HelpRequestsComponent } from './components/help-requests/help-requests';
import { ContactManagementComponent } from './components/contact-management/contact-management';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'help-requests', component: HelpRequestsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['volunteer','admin','resident'] } },
  { path: 'contact-management', component: ContactManagementComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'create-alert', component: CreateAlertComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'volunteer-dashboard', component: VolunteerDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['volunteer'] } },
  { path: 'resident-dashboard', component: ResidentDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['resident'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];
