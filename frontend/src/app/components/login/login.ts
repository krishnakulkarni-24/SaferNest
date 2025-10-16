import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    console.log('Attempting login with:', this.form.value);
    
    this.auth.login(this.form.value).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        const role = this.auth.getUser()?.role;
        if (role === 'admin') this.router.navigate(['/admin-dashboard']);
        else if (role === 'volunteer') this.router.navigate(['/volunteer-dashboard']);
        else this.router.navigate(['/resident-dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || err.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
