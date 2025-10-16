import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-alert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-alert.html',
  styleUrls: ['./create-alert.css']
})
export class CreateAlertComponent {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    type: new FormControl('flood', Validators.required),
    severity: new FormControl('low', Validators.required),
    taskTitle: new FormControl(''),
    taskDescription: new FormControl('')
  });

  message = '';
  error = '';

  constructor(
    private alertService: AlertService,
    private router: Router,
    private auth: AuthService
  ) {
    const user = localStorage.getItem('safernest_user');
    const role = user ? JSON.parse(user).role : null;
    if (role !== 'admin') {
      this.router.navigate(['/dashboard']);
    }
  }

  submit() {
    this.error = '';
    this.message = '';

    const v = this.form.value;
    const payload: any = {
      title: v.title,
      message: v.message,
      type: v.type,
      severity: v.severity,
      // location optional
      task: (v.taskTitle || v.taskDescription) ? { title: v.taskTitle, description: v.taskDescription } : undefined
    };

    this.alertService.createAlert(payload).subscribe({
      next: () => {
        this.message = '✅ Alert created successfully!';
        this.form.reset();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to create alert.';
      }
    });
  }
}
