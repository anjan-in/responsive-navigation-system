import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  submenu?: MenuItem[];
  logout?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isCollapsed = false;
  activeSubMenu: string | null = null;
  menuItems: MenuItem[] = [];

  constructor(
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.http.get<MenuItem[]>('assets/menu.json').subscribe((data) => {
      this.menuItems = data;
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubMenu(menuLabel: string) {
    this.activeSubMenu = this.activeSubMenu === menuLabel ? null : menuLabel;
  }

  handleClick(item: MenuItem) {
    if (item.logout) {
      console.log("User logged out");
      this.router.navigate(['/login']);
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  // logout() {
  //   console.log("User logged out");
  //   this.router.navigate(['/login']);
  // }

  logout() {
    this.authService.logout();
  }

}
