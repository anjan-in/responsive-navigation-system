import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: string;
  role: string;
  name: string;
  avatar?: string;
  email?: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly AUTH_PROVIDER_KEY = 'auth_provider';
  
  // private validUsername = 'admin';
  // private validPassword = 'admin';
  // private validCredentials = { username: 'admin', password: 'admin' };

  // private isAuthenticated = false;

  // Demo credentials - in a real app, this would be handled by backend authentication
  private validCredentials = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'user', password: 'password', role: 'user' }
  ];

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check token expiration on service initialization
    this.checkTokenExpiration();
  }

  /**
   * Authenticate a user with username and password
   * @param username The username or email
   * @param password The password
   * @returns Promise that resolves to true if login successful
   */
  login(username: string, password: string): Promise<boolean> {
    // Simulate API call with delay
    return new Promise((resolve) => {
      // For demo purposes - in real app, this would be an API call
      const foundUser = this.validCredentials.find(
        cred => (cred.username === username.trim()) && (cred.password === password.trim())
      );
      
      if (foundUser) {
        // Generate mock token and user object
        const token = this.generateMockToken();
        const user: User = {
          id: this.generateRandomId(),
          username: foundUser.username,
          email: `${foundUser.username}@example.com`,
          role: foundUser.role,
          name: 'Anjan',
          // firstName: 'Demo',
          // lastName: 'User'
        };

        // Store auth data
        this.setAuthData(token, user, 'credentials');
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Authenticate with social provider
   * @param provider The social provider (google, facebook, apple)
   * @returns Promise that resolves to true if login successful
   */
  socialSignIn(provider: string): Promise<boolean> {
    // This would integrate with actual OAuth providers in a real app
    return new Promise((resolve) => {
      // Simulate successful social login after delay
      setTimeout(() => {
        // Mock user data that would come from social provider
        const mockSocialUser: User = {
          id: this.generateRandomId(),
          username: `user_${Math.floor(Math.random() * 10000)}`,
          email: `user${Math.floor(Math.random() * 10000)}@${provider}.com`,
          role: 'user',
          name: 'Social',
          // firstName: 'Social',
          // lastName: 'User',
          // avatar: '/assets/images/avatar.png'
        };

        const token = this.generateMockToken();
        this.setAuthData(token, mockSocialUser, provider);
        resolve(true);
      }, 1500);
    });
  }

  /**
   * Log out the current user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.AUTH_PROVIDER_KEY);
    localStorage.removeItem('isLoggedIn');
    
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current authentication token
   * @returns The token string or null
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get current user
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has required role
   * @param role Required role
   * @returns boolean indicating if user has role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === role;
  }

  /**
   * Get authentication provider
   * @returns Provider name (credentials, google, facebook, apple)
   */
  getAuthProvider(): string | null {
    return localStorage.getItem(this.AUTH_PROVIDER_KEY);
  }

  /**
   * Request password reset (would call API in real app)
   * @param email User's email
   * @returns Observable of the response
   */
  requestPasswordReset(email: string): Observable<{ success: boolean, message: string }> {
    // Simulate API request
    return of({ success: true, message: 'Password reset email sent. Check your inbox.' })
      .pipe(delay(1000));
  }

  // Private helper methods

  /**
   * Set authentication data in storage
   */
  private setAuthData(token: string, user: User, provider: string): void {
    // Store token and user info
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.AUTH_PROVIDER_KEY, provider);
    localStorage.setItem('isLoggedIn', 'true');
    
    // Update current user subject
    this.currentUserSubject.next(user);
  }

  /**
   * Get user from storage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Generate a mock token (in real app, this would come from the server)
   */
  private generateMockToken(): string {
    // Generate random token with 1 hour expiration
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60; // 1 hour
    
    const payload = btoa(JSON.stringify({
      sub: this.generateRandomId(),
      iat: now,
      exp: now + expiresIn
    }));
    
    const signature = btoa(Math.random().toString(36).substring(2));
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Generate random ID (for mock purposes)
   */
  private generateRandomId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Check if token is expired and log out if it is
   */
  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (token) {
      try {
        // Decode token payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        
        if (Date.now() > expiry) {
          // Token expired, log out
          console.log('Token expired, logging out');
          this.logout();
        }
      } catch (e) {
        // Invalid token format, log out
        console.error('Invalid token format', e);
        this.logout();
      }
    }
  }

  // login(username: string, password: string): boolean {
  //   console.log('Entered Username:', username);
  //   console.log('Entered Password:', password);
    
  //   if (username.trim() === this.validCredentials.username && password.trim() === this.validCredentials.password) {
  //     localStorage.setItem('isLoggedIn', 'true');
  //     return true;
  //   }
  //   return false;
  // }

  // logout() {
  //   // localStorage.removeItem('token');
  //   // this.isAuthenticated = false;
  //   // this.router.navigate(['/login']);

  //   localStorage.removeItem('isLoggedIn');
  // }

  // isLoggedIn(): boolean {
  //   // return localStorage.getItem('token') !== null;
  //   return localStorage.getItem('isLoggedIn') === 'true';
  // }
}
