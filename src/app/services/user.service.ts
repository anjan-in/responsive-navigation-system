import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      avatar: 'https://avatar.iran.liara.run/public/13',
      role: 'Admin',
      status: 'active',
      lastLogin: new Date(2023, 3, 15),
      createdAt: new Date(2022, 1, 10),
      permissions: ['users.view', 'users.create', 'users.edit', 'users.delete']
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      avatar: 'https://avatar.iran.liara.run/public/girl',
      role: 'Editor',
      status: 'active',
      lastLogin: new Date(2023, 4, 2),
      createdAt: new Date(2022, 2, 15),
      permissions: ['users.view', 'users.edit']
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      avatar: 'https://avatar.iran.liara.run/public/15',
      role: 'Viewer',
      status: 'inactive',
      lastLogin: new Date(2023, 1, 20),
      createdAt: new Date(2022, 3, 8),
      permissions: ['users.view']
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      avatar: 'https://avatar.iran.liara.run/public/100',
      role: 'Editor',
      status: 'pending',
      createdAt: new Date(2023, 4, 1),
      permissions: ['users.view', 'users.edit']
    },
    {
      id: 5,
      firstName: 'Michael',
      lastName: 'Wilson',
      email: 'michael.wilson@example.com',
      avatar: 'https://avatar.iran.liara.run/public/17',
      role: 'Admin',
      status: 'active',
      lastLogin: new Date(2023, 4, 5),
      createdAt: new Date(2022, 2, 20),
      permissions: ['users.view', 'users.create', 'users.edit', 'users.delete']
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(filters?: any): Observable<User[]> {
    // Simulate API call with filtering
    let filteredUsers = [...this.mockUsers];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
        );
      }
      
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      
      if (filters.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }
    }
    
    return of(filteredUsers).pipe(delay(300));
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.mockUsers.find(u => u.id === id);
    return of(user).pipe(delay(300));
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser = {
      ...user,
      id: this.mockUsers.length + 1,
      createdAt: new Date()
    };
    this.mockUsers.push(newUser as User);
    return of(newUser as User).pipe(delay(300));
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index >= 0) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...userData };
      return of(this.mockUsers[index]).pipe(delay(300));
    }
    throw new Error('User not found');
  }

  deleteUser(id: number): Observable<boolean> {
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index >= 0) {
      this.mockUsers.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
