import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree, 
  Router 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      // Store the attempted URL for redirecting after login
      const returnUrl = state.url;
      
      // Navigate to login page with return URL
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl }
      });
      
      return false;
    }
    
    // Check if route has role restrictions
    if (route.data && route.data['roles']) {
      const requiredRoles: string[] = route.data['roles'];
      const user = this.authService.getCurrentUser();
      
      // Check if user has required role
      if (user && requiredRoles.includes(user.role)) {
        return true;
      } else {
        // User doesn't have required role, redirect to home
        this.router.navigate(['/home']);
        return false;
      }
    }
    
    // User is logged in and no role restrictions or has required role
    return true;
  }

}
