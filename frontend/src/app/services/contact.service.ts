import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ContactSubmission {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
  status?: 'new' | 'read' | 'replied';
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private base = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  // Submit a new contact form
  submitContact(contact: Omit<ContactSubmission, '_id' | 'createdAt' | 'status'>): Observable<any> {
    return this.http.post(`${this.base}/submit`, contact);
  }

  // Get all contact submissions (admin only)
  getContactSubmissions(): Observable<ContactSubmission[]> {
    return this.http.get<ContactSubmission[]>(`${this.base}/submissions`);
  }

  // Update contact submission status (admin only)
  updateContactStatus(id: string, status: 'new' | 'read' | 'replied'): Observable<any> {
    return this.http.put(`${this.base}/submissions/${id}`, { status });
  }

  // Delete contact submission (admin only)
  deleteContactSubmission(id: string): Observable<any> {
    return this.http.delete(`${this.base}/submissions/${id}`);
  }
}
