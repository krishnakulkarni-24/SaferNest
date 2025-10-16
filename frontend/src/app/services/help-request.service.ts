import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HelpRequestService {
  private base = `${environment.apiUrl}/help-requests`;
  constructor(private http: HttpClient) {}

  create(payload: any) { return this.http.post(this.base, payload); }
  list(params?: any) { return this.http.get<any[]>(this.base, { params }); }
  accept(id: string) { return this.http.post(`${this.base}/${id}/accept`, {}); }
  updateStatus(id: string, status: string) { return this.http.put(`${this.base}/${id}/status`, { status }); }
}


