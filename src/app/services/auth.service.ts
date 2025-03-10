import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private validUsername = 'admin';
  // private validPassword = 'admin';
  private validCredentials = { username: 'admin', password: 'admin' };

  // private isAuthenticated = false;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    console.log('Entered Username:', username);
    console.log('Entered Password:', password);
    
    if (username.trim() === this.validCredentials.username && password.trim() === this.validCredentials.password) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout() {
    // localStorage.removeItem('token');
    // this.isAuthenticated = false;
    // this.router.navigate(['/login']);

    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    // return localStorage.getItem('token') !== null;
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
