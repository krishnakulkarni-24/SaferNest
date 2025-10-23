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
    this.alertService.getAlerts({ active: 'true' }).subscribe({
      next: (data) => { this.alerts = data; this.applyFilter(); },
      error: (err) => console.error('Error loading alerts', err)
    });
  }

  applyFilter() {
    this.filtered = this.alerts.filter(a => {
      const byType = this.type ? (a.type?.toLowerCase?.() === this.type) : true;
      const bySev = this.severity ? (a.severity?.toLowerCase?.() === this.severity) : true;
      const byActive = a.active !== false; // default show active
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
      next: () => {
        // Refetch active alerts to ensure UI updates immediately
        this.alertService.getAlerts({ active: 'true' }).subscribe({
          next: (data) => { this.alerts = data; this.applyFilter(); }
        });
      },
      error: (err) => console.error('Failed to deactivate', err)
    });
  }

  acceptTask(alert: any) {
    this.alertService.acceptTask(alert._id).subscribe({
      next: () => {
        this.alertService.getAlerts({ active: 'true' }).subscribe({
          next: (data) => { this.alerts = data; this.applyFilter(); }
        });
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
}