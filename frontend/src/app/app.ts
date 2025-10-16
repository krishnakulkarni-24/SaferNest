import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); }
  isDashboard(): boolean {
    const url = this.router.url;
    return url.startsWith('/admin-dashboard') || url.startsWith('/volunteer-dashboard') || url.startsWith('/resident-dashboard');
  }
  isHome(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }
  isAdmin(): boolean {
    return this.auth.getUser()?.role === 'admin';
  }
}
