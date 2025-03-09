import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private validUsername = 'admin';
  private validPassword = 'admin';

  // private isAuthenticated = false;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === this.validUsername && password === this.validPassword) {
      localStorage.setItem('token', 'valid-token');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    // this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
