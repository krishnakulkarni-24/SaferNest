import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService, ContactSubmission } from '../../services/contact.service';

@Component({
  selector: 'app-contact-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="card">
        <h2>Contact Submissions</h2>
        <p class="text-muted">Manage user contact messages and inquiries</p>
        
        <div *ngIf="loading" class="loading">
          <p>Loading contact submissions...</p>
        </div>
        
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
        
        <div *ngIf="!loading && !error" class="contact-list">
          <div *ngIf="contacts.length === 0" class="no-contacts">
            <p>No contact submissions yet.</p>
          </div>
          
          <div *ngFor="let contact of contacts" class="contact-item" [class.new]="contact.status === 'new'">
            <div class="contact-header">
              <div class="contact-info">
                <h3>{{ contact.name }}</h3>
                <p class="contact-email">{{ contact.email }}</p>
                <p class="contact-date">{{ contact.createdAt | date:'medium' }}</p>
              </div>
              <div class="contact-actions">
                <select 
                  [value]="contact.status" 
                  (change)="updateStatus(contact._id!, $event)"
                  class="status-select">
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
                <button 
                  (click)="deleteContact(contact._id!)" 
                  class="delete-btn"
                  title="Delete submission">
                  🗑️
                </button>
              </div>
            </div>
            <div class="contact-message">
              <p>{{ contact.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading {
      text-align: center;
      padding: var(--space-8);
      color: var(--text-secondary);
    }
    
    .error-message {
      color: var(--danger);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-4);
    }
    
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .no-contacts {
      text-align: center;
      padding: var(--space-8);
      color: var(--text-secondary);
    }
    
    .contact-item {
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      transition: all var(--transition-normal);
    }
    
    .contact-item.new {
      border-left: 4px solid var(--primary);
      background: rgba(102, 126, 234, 0.05);
    }
    
    .contact-item:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    
    .contact-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }
    
    .contact-info h3 {
      margin: 0 0 var(--space-1) 0;
      color: var(--text-primary);
    }
    
    .contact-email {
      color: var(--primary);
      font-weight: 500;
      margin: 0 0 var(--space-1) 0;
    }
    
    .contact-date {
      color: var(--text-muted);
      font-size: 12px;
      margin: 0;
    }
    
    .contact-actions {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .status-select {
      padding: var(--space-2);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    
    .delete-btn {
      background: var(--danger);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      padding: var(--space-2);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .delete-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }
    
    .contact-message {
      background: var(--bg-secondary);
      padding: var(--space-4);
      border-radius: var(--radius-md);
      border-left: 3px solid var(--primary);
    }
    
    .contact-message p {
      margin: 0;
      line-height: 1.6;
      color: var(--text-primary);
    }
  `]
})
export class ContactManagementComponent implements OnInit {
  contacts: ContactSubmission[] = [];
  loading = true;
  error = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading = true;
    this.error = '';
    
    this.contactService.getContactSubmissions().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load contact submissions';
        this.loading = false;
        console.error('Error loading contacts:', err);
      }
    });
  }

  updateStatus(id: string, event: any) {
    const status = event.target.value as 'new' | 'read' | 'replied';
    
    this.contactService.updateContactStatus(id, status).subscribe({
      next: () => {
        // Update local state
        const contact = this.contacts.find(c => c._id === id);
        if (contact) {
          contact.status = status;
        }
      },
      error: (err) => {
        this.error = 'Failed to update status';
        console.error('Error updating status:', err);
      }
    });
  }

  deleteContact(id: string) {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      this.contactService.deleteContactSubmission(id).subscribe({
        next: () => {
          this.contacts = this.contacts.filter(c => c._id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete submission';
          console.error('Error deleting contact:', err);
        }
      });
    }
  }
}
