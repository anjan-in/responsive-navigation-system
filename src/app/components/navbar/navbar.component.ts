import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  isActive?: boolean;
  badge?: string | number;
  children?: MenuItem[];
  expanded?: boolean;
  hovering?: boolean;
}

interface UserData {
  name: string;
  role: string;
  email: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = false;
  menuItems: MenuItem[] = [];
  userData: UserData = {
    name: 'Alex Johnson',
    role: 'Admin',
    email: 'alex@example.com'
  };
  
  // Track window size for responsive behavior
  screenWidth: number = window.innerWidth;
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    // Auto-collapse on small screens
    this.isCollapsed = this.screenWidth < 992;
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Auto-collapse on mobile devices
    this.isCollapsed = this.screenWidth < 992;
    
    this.initMenuItems();
  }

  initMenuItems(): void {
    this.menuItems = [
      {
        title: 'Dashboard',
        icon: 'bi-grid-1x2-fill',
        route: '/dashboard',
        isActive: true
      },
      {
        title: 'Analytics',
        icon: 'bi-bar-chart-fill',
        route: '/analytics'
      },
      {
        title: 'User Management',
        icon: 'bi-people-fill',
        children: [
          {
            title: 'User List',
            route: '/users',
            icon: 'bi-person',
          },
          {
            title: 'User Groups',
            route: '/user-groups',
            icon: 'bi-people',
          },
          {
            title: 'Permissions',
            route: '/permissions',
            icon: 'bi-shield-check'
          }
        ]
      },
      {
        title: 'Content',
        icon: 'bi-file-earmark-text-fill',
        children: [
          {
            title: 'Articles',
            route: '/articles',
            icon: 'bi-file-earmark-text',
          },
          {
            title: 'Media',
            route: '/media',
            icon: 'bi-image-fill',
          },
          {
            title: 'Comments',
            route: '/comments',
            badge: 5,
            icon: 'bi-chat-dots-fill'
          }
        ]
      },
      {
        title: 'Products',
        icon: 'bi-box-fill',
        route: '/products'
      },
      {
        title: 'Orders',
        icon: 'bi-cart-fill',
        route: '/orders',
        badge: 'New'
      },
      {
        title: 'Reports',
        icon: 'bi-clipboard-data-fill',
        route: '/reports'
      },
      {
        title: 'Settings',
        icon: 'bi-gear-fill',
        children: [
          {
            title: 'General',
            route: '/settings/general',
            icon: 'bi-sliders',
          },
          {
            title: 'Security',
            route: '/settings/security',
            icon: 'bi-shield-lock-fill'
          },
          {
            title: 'Notifications',
            route: '/settings/notifications',
            icon: 'bi-bell-fill'
          }
        ]
      }
    ];
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubmenu(item: MenuItem): void {
    // Close all other open submenus
    this.menuItems.forEach(menuItem => {
      if (menuItem !== item && menuItem.expanded) {
        menuItem.expanded = false;
      }
    });
    
    // Toggle current submenu
    item.expanded = !item.expanded;
  }

  isHovered(item: MenuItem): boolean {
    return item.hovering === true;
  }

  // Track mouse hover for submenus in collapsed mode
  onMenuItemMouseEnter(item: MenuItem): void {
    item.hovering = true;
  }

  onMenuItemMouseLeave(item: MenuItem): void {
    item.hovering = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
