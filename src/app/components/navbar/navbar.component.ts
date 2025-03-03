import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  logout() {
    // Perform logout logic (clear tokens, redirect, etc.)
    console.log("User logged out");
    this.router.navigate(['/login']);
  }

}
