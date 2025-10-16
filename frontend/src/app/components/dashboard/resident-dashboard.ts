import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resident-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="card">
        <h2 style="margin-top:0">Resident Dashboard</h2>
        <p style="color: var(--muted); margin-top: 4px;">Welcome {{ auth.getUser()?.name || 'Resident' }}, you can view official alerts and follow awareness & precautions.</p>
        <div class="section">
          <div class="nav">
            <a routerLink="/alerts">View Alerts</a>
            <a routerLink="/training">Awareness & Precautions</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ResidentDashboardComponent {
  constructor(public auth: AuthService) {}
}


