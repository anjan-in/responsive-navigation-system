import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  errorMessage: string = '';
  usernameError: boolean = false;
  passwordError: boolean = false;
  enableSocialLogin: boolean = true; // Toggle this to enable/disable social login section

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }
    
    // Load saved credentials if available
    this.loadSavedCredentials();
    
    // Focus on first empty field
    setTimeout(() => {
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      if (usernameInput && !usernameInput.value) {
        usernameInput.focus();
      } else {
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (passwordInput) passwordInput.focus();
      }
    }, 100);
  }

  loadSavedCredentials() {
    try {
      const savedUsername = localStorage.getItem('savedUsername');
      // For security, we don't actually store the password in plain text
      // Just check if the username exists and set rememberMe
      if (savedUsername) {
        this.username = savedUsername;
        this.rememberMe = true;
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  socialLogin(provider: string) {
    this.isLoading = true;
    
    // Here you would integrate with your social login providers
    this.authService.socialSignIn(provider)
      .then(success => {
        if (success) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = `Unable to sign in with ${provider}. Please try again.`;
        }
        this.isLoading = false;
      })
      .catch(error => {
        console.error(`${provider} login error:`, error);
        this.errorMessage = `An error occurred during ${provider} login. Please try again.`;
        this.isLoading = false;
      });
  }

  onLogin() {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.usernameError = !this.username.trim();
    this.passwordError = !this.password.trim();
    
    // Validate form
    if (this.usernameError || this.passwordError) {
      return;
    }
    
    this.isLoading = true;
    
    // Attempt login with a slight delay for better UX feedback
    setTimeout(() => {
      this.authService.login(this.username, this.password)
        .then(success => {
          if (success) {
            // Store username if Remember Me is checked
            if (this.rememberMe) {
              localStorage.setItem('savedUsername', this.username);
              // Note: We're not storing the actual password for security reasons
            } else {
              localStorage.removeItem('savedUsername');
            }
            
            const user = this.authService.getCurrentUser();
            console.log('Login successful. Welcome, ' + (user?.firstName || user?.username));
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid username or password. Please try again.';
            this.passwordError = true;
          }
          this.isLoading = false;
        })
        .catch(error => {
          console.error('Login error:', error);
          this.errorMessage = 'An error occurred during login. Please try again.';
          this.isLoading = false;
        });
    }, 800); // Adds a slight delay for better UX
  }
}