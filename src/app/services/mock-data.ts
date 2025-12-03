import { Department } from '../models/department';
import { Employee } from '../models/employee';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 1,
    fullName: 'John Doe',
    address: '123 Main St',
    phoneNumber: '555-0001',
    email: 'john@example.com',
    departmentId: 1,
    departmentName: 'Engineering'
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    address: '456 Oak Ave',
    phoneNumber: '555-0002',
    email: 'jane@example.com',
    departmentId: 1,
    departmentName: 'Engineering'
  },
  {
    id: 3,
    fullName: 'Bob Johnson',
    address: '789 Pine Rd',
    phoneNumber: '555-0003',
    email: 'bob@example.com',
    departmentId: 1,
    departmentName: 'Engineering'
  },
  {
    id: 4,
    fullName: 'Alice Williams',
    address: '321 Elm St',
    phoneNumber: '555-0004',
    email: 'alice@example.com',
    departmentId: 2,
    departmentName: 'Sales'
  },
  {
    id: 5,
    fullName: 'Charlie Brown',
    address: '654 Maple Dr',
    phoneNumber: '555-0005',
    email: 'charlie@example.com',
    departmentId: 2,
    departmentName: 'Sales'
  },
  {
    id: 6,
    fullName: 'Diana Prince',
    address: '987 Cedar Ln',
    phoneNumber: '555-0006',
    email: 'diana@example.com',
    departmentId: 3,
    departmentName: 'HR'
  },
  {
    id: 7,
    fullName: 'Eve Davis',
    address: '147 Spruce Way',
    phoneNumber: '555-0007',
    email: 'eve@example.com',
    departmentId: undefined,
    departmentName: 'Unassigned'
  },
  {
    id: 8,
    fullName: 'Frank Miller',
    address: '258 Birch Blvd',
    phoneNumber: '555-0008',
    email: 'frank@example.com',
    departmentId: undefined,
    departmentName: 'Unassigned'
  }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: undefined, name: 'Unassigned', employeeCount: 2 },
  { id: 1, name: 'Engineering', employeeCount: 3 },
  { id: 2, name: 'Sales', employeeCount: 2 },
  { id: 3, name: 'HR', employeeCount: 1 }
];
