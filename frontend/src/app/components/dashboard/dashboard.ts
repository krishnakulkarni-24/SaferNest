import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { RoleGuard } from '../../guards/role.guard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  user: any;
  alerts: any[] = [];

  constructor(
    private auth: AuthService,
    private alertService: AlertService,
    private roleGuard: RoleGuard,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    // fetch only active alerts by default
    this.alertService.getAlerts({ active: 'true' }).subscribe({
      next: (data: any[]) => (this.alerts = data)
    });
  }

  isAdmin() { return this.roleGuard.getRole() === 'admin'; }
  isVolunteer() { return this.roleGuard.getRole() === 'volunteer'; }
  isResident() { return this.roleGuard.getRole() === 'resident'; }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
