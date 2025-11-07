import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private base = `${environment.apiUrl}/alerts`;
  constructor(private http: HttpClient) {}

  getAlerts(params?: any) { return this.http.get<any[]>(this.base, { params }); }
  createAlert(alert: any) { return this.http.post(this.base, alert); }
  updateAlert(id: string, update: any) { return this.http.put(`${this.base}/${id}`, update); }
  deactivateAlert(id: string) { return this.http.put(`${this.base}/${id}/deactivate`, {}); }
  acceptTask(id: string) { return this.http.post(`${this.base}/${id}/accept`, {}); }
  deleteAlert(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
