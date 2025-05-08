import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/models/permission.model';
import { Role } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userId: number = 0;
  user: User | null = null;
  userForm: FormGroup;
  permissions: Permission[] = [];
  roles: Role[] = [];
  loading = false;
  saving = false;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private permissionService: PermissionService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.loadUserData();
      }
    });
    
    this.loadPermissionsAndRoles();
  }

  loadUserData(): void {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe(
      user => {
        if (user) {
          this.user = user;
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status
          });
        } else {
          this.router.navigate(['/users']);
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading user', error);
        this.loading = false;
        this.router.navigate(['/users']);
      }
    );
  }

  loadPermissionsAndRoles(): void {
    this.permissionService.getPermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => {
        console.error('Error loading permissions', error);
      }
    );
    
    this.permissionService.getRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error loading roles', error);
      }
    );
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.user) {
      // Reset form when canceling edit
      this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        role: this.user.role,
        status: this.user.status
      });
    }
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    const userData = this.userForm.value;
    
    this.userService.updateUser(this.userId, userData).subscribe(
      updatedUser => {
        this.user = updatedUser;
        this.editMode = false;
        this.saving = false;
      },
      error => {
        console.error('Error updating user', error);
        this.saving = false;
      }
    );
  }

  hasPermission(permissionName: string): boolean {
    return this.user?.permissions?.includes(permissionName) || false;
  }

  getUserRolePermissions(): Permission[] {
    if (!this.user || !this.user.role) return [];
    
    const userRole = this.roles.find(role => role.name === this.user?.role);
    if (!userRole) return [];
    
    return this.permissions.filter(permission => 
      userRole.permissions.includes(permission.id)
    );
  }

}
