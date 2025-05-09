import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Role } from '../models/role.model';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private mockPermissions: Permission[] = [
    { id: 1, name: 'users.view', description: 'View users', category: 'Users' },
    { id: 2, name: 'users.create', description: 'Create users', category: 'Users' },
    { id: 3, name: 'users.edit', description: 'Edit users', category: 'Users' },
    { id: 4, name: 'users.delete', description: 'Delete users', category: 'Users' },
    { id: 5, name: 'roles.view', description: 'View roles', category: 'Roles' },
    { id: 6, name: 'roles.create', description: 'Create roles', category: 'Roles' },
    { id: 7, name: 'roles.edit', description: 'Edit roles', category: 'Roles' },
    { id: 8, name: 'roles.delete', description: 'Delete roles', category: 'Roles' }
  ];

  private mockRoles: Role[] = [
    { id: 1, name: 'Admin', description: 'Full access', permissions: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 2, name: 'Editor', description: 'Can edit content', permissions: [1, 3, 5] },
    { id: 3, name: 'Viewer', description: 'View only access', permissions: [1, 5] }
  ];

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return of(this.mockPermissions).pipe(delay(300));
  }

  getRoles(): Observable<Role[]> {
    return of(this.mockRoles).pipe(delay(300));
  }

  getRoleById(id: number): Observable<Role | undefined> {
    const role = this.mockRoles.find(r => r.id === id);
    return of(role).pipe(delay(300));
  }

  createRole(role: Omit<Role, 'id'>): Observable<Role> {
    const newRole = {
      ...role,
      id: this.mockRoles.length + 1
    };
    this.mockRoles.push(newRole as Role);
    return of(newRole as Role).pipe(delay(300));
  }

  updateRole(id: number, roleData: Partial<Role>): Observable<Role> {
    const index = this.mockRoles.findIndex(r => r.id === id);
    if (index >= 0) {
      this.mockRoles[index] = { ...this.mockRoles[index], ...roleData };
      return of(this.mockRoles[index]).pipe(delay(300));
    }
    throw new Error('Role not found');
  }

  deleteRole(id: number): Observable<boolean> {
    const index = this.mockRoles.findIndex(r => r.id === id);
    if (index >= 0) {
      this.mockRoles.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
