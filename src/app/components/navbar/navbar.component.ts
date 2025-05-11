import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy  {
  isLoginPage = false;
  currentUser: User | null = null;
  isSidebarCollapsed: boolean = false;
  settingsMenuOpen = false;
  isSettingsActive = false;
  mobileSidebarOpen = false;
  mobileUserMenuOpen = false;
  // currentUser = {
  //   name: 'Anjan Sen',
  //   role: 'Administrator',
  //   avatar: '../../../assets/images/Anjan1.jpg'
  // };
  private userSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Load saved sidebar state if available
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      this.isSidebarCollapsed = savedState === 'collapsed';
    }

    // Subscribe to user authentication state
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Set initial login page status
    this.isLoginPage = this.router.url.includes('/login');
    console.log('Initial route:', this.router.url, 'isLoginPage:', this.isLoginPage);
  
    // Listen for route changes
    this.router.events
      .pipe(
        filter((event: NavigationEvent): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage = event.url.includes('/login');
        this.isSettingsActive = event.url.includes('/settings');
        
        // Close mobile menus when route changes
        // this.mobileSidebarOpen = false;
        // this.mobileUserMenuOpen = false;

        this.handleMobileSidebarOnRouteChange();
      });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    // Save state to localStorage
    localStorage.setItem('sidebarState', this.isSidebarCollapsed ? 'collapsed' : 'expanded');

    // Update main content class to match sidebar state
    this.updateMainContentClass();
  }
  private updateMainContentClass(): void {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (this.isSidebarCollapsed) {
        mainContent.classList.add('expanded');
      } else {
        mainContent.classList.remove('expanded');
      }
    }
  }
  handleMobileSidebarOnRouteChange(): void {
    // Close mobile menus when route changes
    this.mobileSidebarOpen = false;
    this.mobileUserMenuOpen = false;
  }
  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
    if (this.mobileSidebarOpen) {
      // Close user menu if sidebar is opened
      this.mobileUserMenuOpen = false;
    }
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }
  onMobileNavClick(): void {
    // Close mobile sidebar when a navigation link is clicked
    if (window.innerWidth <= 768) {
      this.mobileSidebarOpen = false;
    }
  }
  toggleMobileUserMenu(): void {
    this.mobileUserMenuOpen = !this.mobileUserMenuOpen;
    if (this.mobileUserMenuOpen) {
      // Close sidebar if user menu is opened
      this.mobileSidebarOpen = false;
    }
  }
  toggleSettingsMenu(): void {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  get userName(): string {
    return this.currentUser && 'name' in this.currentUser 
      ? (this.currentUser as any).name 
      : 'User';
  }

  get userRole(): string {
    return this.currentUser?.role || 'Guest';
  }

  onLogout(): void {
    this.authService.logout();
    console.log('Logged out successfully');
    this.router.navigate(['/login']);
  }

}
