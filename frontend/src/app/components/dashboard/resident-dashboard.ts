import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HelpRequestService } from '../../services/help-request.service';

@Component({
  selector: 'app-resident-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

      <div class="section">
        <div class="card">
          <h3 style="margin-top:0">Request Help</h3>
          <p class="muted">Need assistance even if there is no active alert? Submit your request here.</p>
          <form (ngSubmit)="submitHelp()" #helpForm="ngForm" style="display:grid; gap:8px; max-width:520px;">
            <label>
              <div>Address</div>
              <input name="address" [(ngModel)]="help.address" placeholder="Your address (optional)" />
            </label>
            <label>
              <div>Notes</div>
              <textarea name="notes" [(ngModel)]="help.notes" rows="3" placeholder="Describe the assistance you need"></textarea>
            </label>
            <div style="display:flex; gap:8px; align-items:center;">
              <button type="submit">Submit Help Request</button>
              <span class="muted" *ngIf="success">Submitted.</span>
              <span style="color: var(--danger);" *ngIf="error">{{ error }}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ResidentDashboardComponent {
  help: any = { address: '', notes: '' };
  success = false;
  error = '';
  constructor(public auth: AuthService, private helpService: HelpRequestService) {}

  submitHelp() {
    this.success = false;
    this.error = '';
    const payload: any = {};
    if ((this.help.address || '').trim()) payload.address = (this.help.address || '').trim();
    if ((this.help.notes || '').trim()) payload.notes = (this.help.notes || '').trim();

    this.helpService.create(payload).subscribe({
      next: () => {
        this.success = true;
        this.help = { address: '', notes: '' };
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to submit help request';
      }
    });
  }
}


