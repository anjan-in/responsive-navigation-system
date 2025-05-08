// export class User {
// }
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    lastLogin?: Date;
    createdAt: Date;
    permissions?: string[];
}