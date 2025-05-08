import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Permission } from 'src/app/models/permission.model';
import { Role } from 'src/app/models/role.model';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.scss']
})
export class PermissionManagementComponent implements OnInit {
  permissions: Permission[] = [];
  roles: Role[] = [];
  selectedRole: Role | null = null;
  
  permissionsByCategory: { [category: string]: Permission[] } = {};
  
  roleForm: FormGroup;
  
  loading = false;
  saving = false;
  editMode = false;
  
  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    this.permissionService.getPermissions().subscribe(
      permissions => {
        this.permissions = permissions;
        this.groupPermissionsByCategory();
        
        this.permissionService.getRoles().subscribe(
          roles => {
            this.roles = roles;
            this.loading = false;
          },
          error => {
            console.error('Error loading roles', error);
            this.loading = false;
          }
        );
      },
      error => {
        console.error('Error loading permissions', error);
        this.loading = false;
      }
    );
  }

  groupPermissionsByCategory(): void {
    this.permissionsByCategory = {};
    
    this.permissions.forEach(permission => {
      if (!this.permissionsByCategory[permission.category]) {
        this.permissionsByCategory[permission.category] = [];
      }
      this.permissionsByCategory[permission.category].push(permission);
    });
  }

  selectRole(role: Role): void {
    this.selectedRole = {...role};
    this.roleForm.patchValue({
      name: role.name,
      description: role.description
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.selectedRole) {
      // Reset form when canceling edit
      this.roleForm.patchValue({
        name: this.selectedRole.name,
        description: this.selectedRole.description
      });
    }
  }

  saveRole(): void {
    if (this.roleForm.invalid || !this.selectedRole) {
      this.roleForm.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    const roleData = {
      ...this.roleForm.value,
      permissions: this.selectedRole.permissions
    };
    
    this.permissionService.updateRole(this.selectedRole.id, roleData).subscribe(
      updatedRole => {
        const index = this.roles.findIndex(r => r.id === updatedRole.id);
        if (index >= 0) {
          this.roles[index] = updatedRole;
        }
        this.selectedRole = updatedRole;
        this.editMode = false;
        this.saving = false;
      },
      error => {
        console.error('Error updating role', error);
        this.saving = false;
      }
    );
  }

  createNewRole(): void {
    this.selectedRole = {
      id: 0, // Temporary ID
      name: '',
      description: '',
      permissions: []
    };
    
    this.roleForm.reset();
    this.editMode = true;
  }

  togglePermission(permissionId: number): void {
    if (!this.selectedRole || !this.editMode) return;
    
    const index = this.selectedRole.permissions.indexOf(permissionId);
    if (index >= 0) {
      this.selectedRole.permissions.splice(index, 1);
    } else {
      this.selectedRole.permissions.push(permissionId);
    }
  }

  hasPermission(permissionId: number): boolean {
    return this.selectedRole?.permissions.includes(permissionId) || false;
  }
}
