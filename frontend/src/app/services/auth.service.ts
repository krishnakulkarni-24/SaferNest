import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.base}/register`, data);
  }

  login(creds: any): Observable<any> {
    console.log('AuthService: Sending login request to:', `${this.base}/login`);
    return this.http.post(`${this.base}/login`, creds).pipe(
      map((res: any) => {
        console.log('AuthService: Login response received:', res);
        if (res && res.token) {
          localStorage.setItem('safernest_token', res.token);
          localStorage.setItem('safernest_user', JSON.stringify(res.user));
          console.log('AuthService: Token and user data stored in localStorage');
        }
        return res;
      })
    );
  }

  logout() {
    localStorage.removeItem('safernest_token');
    localStorage.removeItem('safernest_user');
    window.location.href = '/';
  }

  getUser() {
    const u = localStorage.getItem('safernest_user');
    return u ? JSON.parse(u) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('safernest_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.base}/me`, data).pipe(
      map((res: any) => {
        if (res && res.user) {
          // Update the user data in localStorage
          const currentUser = this.getUser();
          const updatedUser = { ...currentUser, ...res.user };
          localStorage.setItem('safernest_user', JSON.stringify(updatedUser));
        }
        return res;
      })
    );
  }
}
