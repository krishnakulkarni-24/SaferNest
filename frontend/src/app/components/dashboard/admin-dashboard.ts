import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <div class="card">
        <h2 style="margin-top:0">Admin Dashboard</h2>
        <p style="color: var(--muted); margin-top: 4px;">Welcome {{ auth.getUser()?.name || 'Admin' }}, you can create, manage, and deactivate disaster alerts.</p>
        <div class="section">
          <div class="nav">
            <a routerLink="/create-alert">Create Alert</a>
          <a routerLink="/alerts">Manage Alerts</a>
          <a routerLink="/help-requests">Help Requests</a>
            <a routerLink="/training">Training & Awareness</a>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="card">
          <h3 style="margin-top:0">Alert Participation Overview</h3>
          <div *ngIf="alerts.length === 0" class="muted">No alerts yet.</div>
          <div *ngFor="let a of alerts; trackBy: trackById" style="display:flex; justify-content: space-between; align-items:center; padding:8px 0; border-top: 1px solid var(--border);">
              <div>
                <div><strong>{{ a.title }}</strong></div>
                <div class="muted">Type: {{ a.type }} • Severity: {{ a.severity }}<span *ngIf="a.task?.title"> • Task: {{ a.task.title }}</span></div>
              </div>
            <div style="display:flex; gap:12px; align-items:center;">
              <div><strong>Accepted:</strong> {{ a.volunteersAccepted?.length || 0 }}</div>
              <button class="btn btn-danger" (click)="confirmDeactivate(a)">Deactivate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  alerts: any[] = [];
  constructor(public auth: AuthService, private alertsService: AlertService) {}

  ngOnInit(): void {
    // Show only active alerts on the admin dashboard overview
    this.alertsService.getAlerts({ active: 'true' }).subscribe({
      next: (data) => this.alerts = data,
      error: (err) => console.error('Error loading admin dashboard alerts', err)
    });
  }

  trackById(index: number, item: any) { return item?._id || index; }

  confirmDeactivate(alert: any) {
    const ok = confirm(`Deactivate alert "${alert.title}"? This will mark it inactive.`);
    if (!ok) return;
    this.deactivateAlert(alert);
  }

  deactivateAlert(alert: any) {
    this.alertsService.deactivateAlert(alert._id).subscribe({
      next: (res: any) => {
        // remove from the local list so UI updates immediately
        this.alerts = this.alerts.filter(a => a._id !== alert._id);
      },
      error: (err) => {
        console.error('Error deactivating alert', err);
        alert('Failed to deactivate alert.');
      }
    });
  }
}


