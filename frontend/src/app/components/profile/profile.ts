import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  user: any;
  isEditing = false;
  editForm = {
    name: '',
    phone: ''
  };
  message = '';
  error = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.resetForm();
  }

  resetForm() {
    this.editForm = {
      name: this.user?.name || '',
      phone: this.user?.phone || ''
    };
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.resetForm();
      this.message = '';
      this.error = '';
    }
  }

  saveProfile() {
    this.message = '';
    this.error = '';

    this.auth.updateProfile(this.editForm).subscribe({
      next: (res) => {
        this.user = this.auth.getUser();
        this.isEditing = false;
        this.message = 'Profile updated successfully!';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update profile';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.resetForm();
    this.message = '';
    this.error = '';
  }
}
