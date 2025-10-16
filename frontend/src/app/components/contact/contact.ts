import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  contact = { name: '', email: '', message: '' };
  submitted = false;
  submitting = false;
  error = '';

  constructor(private contactService: ContactService) {}

  submit() {
    // Basic validation
    if (!this.contact.name || !this.contact.email || !this.contact.message) {
      this.error = 'Please fill in all fields';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contact.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.submitting = true;
    this.error = '';

    this.contactService.submitContact(this.contact).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
        // Reset form
        this.contact = { name: '', email: '', message: '' };
      },
      error: (err) => {
        this.error = 'Failed to send message. Please try again.';
        this.submitting = false;
        console.error('Contact submission error:', err);
      }
    });
  }
}
