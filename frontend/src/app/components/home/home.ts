import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor(public auth: AuthService, private router: Router) {}

  goDashboard() {
    if (this.auth.getUser()) this.router.navigate(['/dashboard']);
    else this.router.navigate(['/login']);
  }
}
