import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit { 
  isSidebarCollapsed = false;
  settingsMenuOpen = false;
  isSettingsActive = false;
  currentUser = {
    name: 'John Doe',
    role: 'Administrator',
    avatar: '../../../assets/images/Anjan1.jpg'
  };

  constructor(
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      this.isSidebarCollapsed = savedState === 'collapsed';
    }
  
    // this.router.events
    // .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {
    //     this.isSettingsActive = event.url.includes('/settings');
    //     this.handleMobileSidebarOnRouteChange();
    //   });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    // Save state to localStorage
    localStorage.setItem('sidebarState', this.isSidebarCollapsed ? 'collapsed' : 'expanded');

    // Update main content class to match sidebar state - this ensures proper margins
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (this.isSidebarCollapsed) {
        mainContent.classList.add('expanded');
      } else {
        mainContent.classList.remove('expanded');
      }
    }
  }
  toggleSettingsMenu(): void {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }
  onLogout(): void {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: this.authService.logout();
    this.router.navigate(['/login']);
  }
  private handleMobileSidebarOnRouteChange(): void {
    // Close sidebar automatically on mobile when navigating
    if (window.innerWidth <= 768) {
      this.isSidebarCollapsed = true;
    }
  }
}
