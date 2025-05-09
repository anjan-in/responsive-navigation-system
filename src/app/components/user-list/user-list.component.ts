import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';

  searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.searchTermChanged.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchTerm = value;
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error => {
        console.error('Error loading users', error);
        this.loading = false;
      }
    );
  }

  onSearch(event: any): void {
    this.searchTermChanged.next(event.target.value);
  }

  onRoleFilter(role: string): void {
    this.selectedRole = role;
    this.applyFilters();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.filteredUsers = [...this.users];
  }

  applyFilters(): void {
    this.loading = true;
    const filters: any = {};
    
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }
    
    if (this.selectedRole) {
      filters.role = this.selectedRole;
    }
    
    if (this.selectedStatus) {
      filters.status = this.selectedStatus;
    }
    
    this.userService.getUsers(filters).subscribe(
      users => {
        this.filteredUsers = users;
        this.loading = false;
      },
      error => {
        console.error('Error applying filters', error);
        this.loading = false;
      }
    );
  }

  viewUserProfile(userId: number): void {
    this.router.navigate(['/user-management/users/profile', userId]);
  }

  deleteUser(user: User, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.loading = true;
      this.userService.deleteUser(user.id).subscribe(
        success => {
          if (success) {
            this.loadUsers();
          }
        },
        error => {
          console.error('Error deleting user', error);
          this.loading = false;
        }
      );
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'inactive':
        return 'bg-danger';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

}
