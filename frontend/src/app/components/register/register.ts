import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl('resident')
  });

  error = '';

  constructor(
    private auth: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Read role from query parameters if provided
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.form.patchValue({ role: params['role'] });
      }
    });
  }

  submit() {
    this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
