import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = !!localStorage.getItem('user'); // Example authentication check

    if (!isAuthenticated) {
      this.router.navigate(['/home']); // Redirect to home if not logged in
      return false;
    }
    return true;
  }
}
