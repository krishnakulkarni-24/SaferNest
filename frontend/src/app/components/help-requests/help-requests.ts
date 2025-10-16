import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRequestService } from '../../services/help-request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-help-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h2 style="margin: 0 0 12px 0">Help Requests</h2>
      <div *ngIf="requests.length === 0" class="card">No requests yet.</div>
      <div *ngFor="let r of requests; trackBy: trackById" class="card" style="margin-top:12px">
        <div style="display:flex; justify-content: space-between; gap:8px; flex-wrap: wrap; align-items:center;">
          <div>
            <div><strong>Status:</strong> {{ r.status }}</div>
            <div><strong>Address:</strong> {{ r.address || 'N/A' }}</div>
            <div><strong>Resident:</strong> {{ r.resident?.name || 'N/A' }}</div>
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
  constructor(private service: HelpRequestService, public auth: AuthService) {}

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
