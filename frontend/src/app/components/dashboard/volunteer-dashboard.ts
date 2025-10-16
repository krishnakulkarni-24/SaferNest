import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="card">
        <h2 style="margin-top:0">Volunteer Dashboard</h2>
        <p style="color: var(--muted); margin-top: 4px;">Welcome {{ auth.getUser()?.name || 'Volunteer' }}, you can view current alerts and access training to support response operations.</p>
        <div class="section">
          <div class="nav">
            <a routerLink="/alerts">View Alerts</a>
            <a routerLink="/help-requests">View Help Requests</a>
            <a routerLink="/training">Training & Awareness</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VolunteerDashboardComponent {
  constructor(public auth: AuthService) {}
}


