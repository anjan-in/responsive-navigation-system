import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/role.model';
import { PermissionService } from 'src/app/services/permission.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;
  isNewUser = true;
  roles: Role[] = [];
  loading = false;
  saving = false;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute
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
      if (params['id'] && params['id'] !== 'new') {
        this.userId = +params['id'];
        this.isNewUser = false;
        this.loadUserData();
      }
    });
    
    this.loadRoles();
  }

  loadUserData(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe(
      user => {
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status
          });
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading user', error);
        this.loading = false;
      }
    );
  }

  loadRoles(): void {
    this.permissionService.getRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error loading roles', error);
      }
    );
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    const userData = this.userForm.value;
    
    if (this.isNewUser) {
      this.userService.createUser(userData).subscribe(
        newUser => {
          this.router.navigate(['/users/profile', newUser.id]);
        },
        error => {
          console.error('Error creating user', error);
          this.saving = false;
        }
      );
    } else if (this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe(
        updatedUser => {
          this.router.navigate(['/users/profile', updatedUser.id]);
        },
        error => {
          console.error('Error updating user', error);
          this.saving = false;
        }
      );
    }
  }
}
