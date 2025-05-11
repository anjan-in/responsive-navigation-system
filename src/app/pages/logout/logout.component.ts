import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  loggingOut: boolean = false;
  logoutMessage: string = 'Logging you out...';
  countdownValue: number = 3;
  private countdownInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initiateLogout();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  initiateLogout(): void {
    this.loggingOut = true;
    
    // Start countdown animation
    this.countdownInterval = setInterval(() => {
      this.countdownValue--;
      
      if (this.countdownValue <= 0) {
        clearInterval(this.countdownInterval);
        this.performLogout();
      }
    }, 1000);
  }

  performLogout(): void {
    // Log the user out
    this.authService.logout();
    
    // Navigate to login page after brief delay
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }

  // Allow immediate logout without waiting for countdown
  logoutNow(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.performLogout();
  }

  // Allow cancellation of logout
  cancelLogout(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.router.navigate(['/home']);
  }
}