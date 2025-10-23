import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpRequestService } from '../../services/help-request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-help-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./help-requests.css'],
  template: `
    <div class="page">
      <div *ngIf="isResident()" class="help-card">
        <h2 class="help-title">Request Help</h2>
        <p class="help-sub">Need assistance even if there is no active alert? Submit your request here.</p>

        <label class="field-label">Address</label>
        <input class="field-input" placeholder="Your address (optional)" [(ngModel)]="newRequest.address" />

        <label class="field-label">Notes</label>
        <textarea class="field-textarea" placeholder="Describe the assistance you need" rows="5" [(ngModel)]="newRequest.notes"></textarea>

        <!-- Optional small alert id field (hidden by default in styling) -->
        <input class="field-input alert-id" placeholder="Alert ID (optional)" [(ngModel)]="newRequest.alertId" />

        <div style="margin-top:16px">
          <button class="submit-btn" (click)="submitNewRequest()">Submit Help Request</button>
        </div>

        <div *ngIf="formError" class="form-error">{{ formError }}</div>
        <div *ngIf="formSuccess" class="form-success">{{ formSuccess }}</div>
      </div>

      <div *ngIf="requests.length === 0" class="card" style="margin-top:16px">No requests yet.</div>
      <div *ngFor="let r of requests; trackBy: trackById" class="card" style="margin-top:12px">
        <div style="display:flex; justify-content: space-between; gap:8px; flex-wrap: wrap; align-items:center;">
          <div>
            <div><strong>Status:</strong> {{ r.status }}</div>
            <div><strong>Address:</strong> {{ r.address || 'N/A' }}</div>
            <div><strong>Resident:</strong> {{ r.resident?.name || 'N/A' }}</div>
            <div *ngIf="r.alert"><strong>Tied to Alert:</strong> {{ r.alert }}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button *ngIf="canAccept(r)" (click)="accept(r)">Accept</button>
            <button *ngIf="canUpdate(r)" (click)="setStatus(r, 'completed')">Mark Completed</button>
            <button *ngIf="canUpdate(r)" (click)="setStatus(r, 'cancelled')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HelpRequestsComponent implements OnInit {
  requests: any[] = [];
  newRequest: any = { address: '', notes: '', alertId: '' };
  formError = '';
  formSuccess = '';

  constructor(private service: HelpRequestService, public auth: AuthService) {}

  isResident(): boolean {
    return this.auth.getUser()?.role === 'resident';
  }

  trackById(index: number, item: any) { return item?._id || index; }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.list().subscribe({ 
      next: (data) => {
        // Filter out completed and cancelled requests
        this.requests = data.filter(r => r.status === 'pending' || r.status === 'accepted');
      }
    });
  }

  submitNewRequest() {
    this.formError = '';
    this.formSuccess = '';
    const payload: any = {
      address: this.newRequest.address || undefined,
      notes: this.newRequest.notes || undefined
    };
    if (this.newRequest.alertId && this.newRequest.alertId.trim()) payload.alertId = this.newRequest.alertId.trim();

    this.service.create(payload).subscribe({
      next: (res) => {
        this.formSuccess = (res as any)?.message || 'Help request submitted';
        this.resetForm();
        this.load();
      },
      error: (err) => {
        console.error('Failed to submit help request', err);
        this.formError = err?.error?.message || 'Failed to submit help request.';
      }
    });
  }

  resetForm() {
    this.newRequest = { address: '', notes: '', alertId: '' };
    this.formError = '';
    this.formSuccess = '';
  }

  canAccept(r: any): boolean {
    const role = this.auth.getUser()?.role;
    // Only volunteers can accept, only if status is pending and not already accepted by anyone
    return role === 'volunteer' && r.status === 'pending' && !r.acceptedBy;
  }

  accept(r: any) {
    this.service.accept(r._id).subscribe({ next: () => this.load() });
  }

  canUpdate(r: any): boolean {
    const role = this.auth.getUser()?.role;
    if (role === 'admin') return true;
    if (role === 'volunteer' && r.acceptedBy && r.acceptedBy._id) {
      return r.acceptedBy._id === this.auth.getUser()?.id;
    }
    return false;
  }

  setStatus(r: any, status: string) {
    this.service.updateStatus(r._id, status).subscribe({ next: () => this.load() });
  }
}
