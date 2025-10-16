import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowed: string[] | undefined = route.data && route.data['roles'];
    const role = this.getRole();
    if (!allowed || allowed.length === 0) {
      return true;
    }
    if (role && allowed.includes(role)) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

  getRole(): string | null {
    const user = localStorage.getItem('safernest_user');
    if (!user) return null;
    try {
      const role = JSON.parse(user).role;
      return typeof role === 'string' ? role.toLowerCase() : null;
    } catch {
      return null;
    }
  }
}
