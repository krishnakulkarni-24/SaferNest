import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HelpRequestService } from '../../services/help-request.service';
import { AuthService } from '../../services/auth.service';

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

      <!-- Embedded Request Help card so residents can submit without navigating -->
      <div class="help-card" style="margin-top:20px">
        <h2 class="help-title">Request Help</h2>
        <p class="help-sub">Need assistance even if there is no active alert? Submit your request here.</p>

        <label class="field-label">Address</label>
        <input class="field-input" placeholder="Your address (optional)" [(ngModel)]="newRequest.address" />

        <label class="field-label">Notes</label>
        <textarea class="field-textarea" placeholder="Describe the assistance you need" rows="4" [(ngModel)]="newRequest.notes"></textarea>

        <div style="margin-top:16px">
          <button class="submit-btn" (click)="submitNewRequest()">Submit Help Request</button>
        </div>

        <div *ngIf="formError" class="form-error">{{ formError }}</div>
        <div *ngIf="formSuccess" class="form-success">{{ formSuccess }}</div>
      </div>
    </div>
  `
})
export class ResidentDashboardComponent {
  newRequest: any = { address: '', notes: '' };
  formError = '';
  formSuccess = '';

  constructor(public auth: AuthService, private helpService: HelpRequestService) {}

  submitNewRequest() {
    this.formError = '';
    this.formSuccess = '';
    const payload: any = {
      address: this.newRequest.address || undefined,
      notes: this.newRequest.notes || undefined
    };
    this.helpService.create(payload).subscribe({
      next: (res) => {
        this.formSuccess = (res as any)?.message || 'Help request submitted';
        this.newRequest = { address: '', notes: '' };
      },
      error: (err) => {
        console.error('Failed to submit help request', err);
        this.formError = err?.error?.message || 'Failed to submit help request.';
      }
    });
  }
}


