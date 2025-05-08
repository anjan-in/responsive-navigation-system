import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    // Load saved credentials if available
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUsername && savedPassword) {
      this.username = savedUsername;
      this.password = savedPassword;
      this.rememberMe = true;
    }
  }

  onLogin() {
    console.log('Attempting login with:', this.username, this.password);

    if (this.authService.login(this.username, this.password)) {
      // Store credentials if Remember Me is checked
      if (this.rememberMe) {
        localStorage.setItem('savedUsername', this.username);
        localStorage.setItem('savedPassword', this.password);
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
      }

      this.router.navigate(['/home']);
    } else {
      alert('Invalid credentials');
    }
  }

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
