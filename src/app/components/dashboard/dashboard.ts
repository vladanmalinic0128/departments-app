import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import { CreateDepartmentFormComponent } from '../create-department-form/create-department-form';
import { Department } from '../../models/department';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CreateDepartmentFormComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  departments = signal<Department[]>([]);
  searchQuery = signal('');
  searchResults = signal<Employee[]>([]);
  showSearchResults = signal(false);
  showNewDepartmentModal = signal(false);

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
      },
      error: (err) => console.error('Error loading departments:', err)
    });
  }

  onSearchChange(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.employeeService.searchEmployeesByName(query).subscribe({
        next: (employees) => {
          this.searchResults.set(employees);
          this.showSearchResults.set(true);
        },
        error: (err) => console.error('Error searching employees:', err)
      });
    } else {
      this.showSearchResults.set(false);
      this.searchResults.set([]);
    }
  }

  selectDepartment(department: Department): void {
    this.router.navigate(['/departments', department.id ?? 'null']);
  }

  selectEmployeeFromSearch(employee: Employee): void {
    this.router.navigate(['/departments', employee.departmentId ?? 'null']);
  }

  openNewDepartmentModal(): void {
    this.showNewDepartmentModal.set(true);
  }

  closeNewDepartmentModal(): void {
    this.showNewDepartmentModal.set(false);
  }

  onDepartmentCreated(data: { name: string }): void {
    this.departmentService.createDepartment({ name: data.name.trim() }).subscribe({
      next: () => {
        this.loadDepartments();
        this.closeNewDepartmentModal();
      },
      error: (err) => console.error('Error creating department:', err)
    });
  }

  onCreateFormCancelled(): void {
    this.closeNewDepartmentModal();
  }

  deleteDepartment(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (err) => console.error('Error deleting department:', err)
      });
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.showSearchResults.set(false);
    this.searchResults.set([]);
  }
}
