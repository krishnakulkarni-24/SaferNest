import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { HelpRequestService } from '../../services/help-request.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.html',
  styleUrls: ['./alerts.css']
})
export class AlertsComponent implements OnInit {

  constructor(private alertService: AlertService, public auth: AuthService, private helpService: HelpRequestService) {}

  alerts: any[] = [];
  filtered: any[] = [];
  type: string = '';
  severity: string = '';
  editingId: string | null = null;
  editModel: any = {};
  needHelpAlertId: string | null = null;
  help = { address: '' } as any;
  saveError = '';
  helpError = '';

  trackById(index: number, item: any) {
    if (item) {
      return item.id ?? item._id ?? index;
    }
    return index;
  }

  ngOnInit(): void {
    this.loadAlerts();
  }

  // Load alerts depending on user role: admins get all alerts (including deactivated),
  // other users get only active alerts.
  loadAlerts() {
    const isAdmin = this.auth.getUser()?.role === 'admin';
    const params: any = isAdmin ? {} : { active: 'true' };
    this.alertService.getAlerts(params).subscribe({
      next: (data) => { this.alerts = data; this.applyFilter(); },
      error: (err) => console.error('Error loading alerts', err)
    });
  }

  applyFilter() {
    this.filtered = this.alerts.filter(a => {
      const byType = this.type ? (a.type?.toLowerCase?.() === this.type) : true;
      const bySev = this.severity ? (a.severity?.toLowerCase?.() === this.severity) : true;
      // Admins should see deactivated alerts for management; other users see only active alerts
      const isAdmin = this.auth.getUser()?.role === 'admin';
      const byActive = isAdmin ? true : (a.active !== false);
      return byType && bySev && byActive;
    });
  }

  beginEdit(alert: any) {
    this.editingId = alert._id;
    this.editModel = {
      title: alert.title,
      message: alert.message,
      type: alert.type,
      severity: alert.severity,
      task: alert.task || { title: '', description: '' }
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = {};
  }

  saveEdit(alert: any) {
    this.saveError = '';
    const payload: any = {
      title: (this.editModel.title || '').trim(),
      message: (this.editModel.message || '').trim(),
      type: (this.editModel.type || '').toLowerCase(),
      severity: (this.editModel.severity || '').toLowerCase()
    };
    if (this.editModel.task && (this.editModel.task.title || this.editModel.task.description)) {
      payload.task = {
        title: (this.editModel.task.title || '').trim(),
        description: (this.editModel.task.description || '').trim()
      };
    }

    this.alertService.updateAlert(alert._id, payload).subscribe({
      next: (res: any) => {
        const idx = this.alerts.findIndex(a => a._id === alert._id);
        if (idx >= 0) this.alerts[idx] = res.alert;
        this.applyFilter();
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Failed to update alert', err);
        this.saveError = err?.error?.message || 'Failed to update alert.';
      }
    });
  }

  deactivate(alert: any) {
    this.alertService.deactivateAlert(alert._id).subscribe({
      next: (res: any) => {
        try {
          // update the local alert object with server's response (preserves id and other fields)
          const updated = res?.alert || { ...alert, active: false };
          const idx = this.alerts.findIndex(a => a._id === alert._id);
          if (idx >= 0) this.alerts[idx] = updated;
          this.applyFilter();
        } catch (e) {
          console.error('Error applying deactivated alert locally', e);
        }
      },
      error: (err) => console.error('Failed to deactivate', err)
    });
  }

  acceptTask(alert: any) {
    this.alertService.acceptTask(alert._id).subscribe({
      next: () => {
        // Refresh using same rules as initial load (admin vs others)
        this.loadAlerts();
      },
      error: (err) => console.error('Failed to accept task', err)
    });
  }

  isVolunteerAccepted(alert: any): boolean {
    const userId = this.auth.getUser()?.id;
    return !!(alert.volunteersAccepted && alert.volunteersAccepted.some((v: any) => (v._id || v).toString() === userId));
  }

  openHelp(alert: any) {
    this.needHelpAlertId = alert._id;
    this.help = { address: '' };
  }

  cancelHelp() {
    this.needHelpAlertId = null;
    this.help = { address: '' };
  }

  submitHelp(alert: any) {
    this.helpError = '';
    this.helpService.create({ alertId: alert._id, address: this.help.address }).subscribe({
      next: () => { this.cancelHelp(); },
      error: (err) => {
        console.error('Failed to submit help request', err);
        this.helpError = err?.error?.message || 'Failed to submit help request.';
      }
    });
  }

  confirmDelete(target: any) {
    // Debug log to verify handler is called
    console.log('confirmDelete called for', target?._id);
    const ok = confirm(`Are you sure you want to permanently delete alert "${target.title}"? This cannot be undone.`);
    if (!ok) return;
    this.deleteAlert(target);
  }

  deleteAlert(target: any) {
    console.log('deleteAlert: calling API for', target?._id);
    this.alertService.deleteAlert(target._id).subscribe({
      next: (res) => {
        console.log('deleteAlert success', res);
        this.alerts = this.alerts.filter(a => a._id !== target._id);
        this.applyFilter();
        if (this.editingId === target._id) this.cancelEdit();
      },
      error: (err) => {
        console.error('Failed to delete alert', err);
        // use window.alert to avoid shadowing a local variable named `alert`
        window.alert('Failed to delete alert. See console for details.');
      }
    });
  }
}