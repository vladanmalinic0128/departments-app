import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import { Department } from '../../models/department';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-department-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './department-view.html',
  styleUrl: './department-view.scss'
})
export class DepartmentViewComponent implements OnInit {
  department = signal<Department | null>(null);
  employees = signal<Employee[]>([]);
  filteredEmployees = signal<Employee[]>([]);
  searchQuery = signal('');
  showNewEmployeeModal = signal(false);
  employeeForm!: FormGroup;

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.employeeForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const deptId = params['id'] === 'null' ? null : +params['id'];
      this.loadDepartment(deptId);
      this.loadEmployees(deptId);
    });
  }

  loadDepartment(id: number | null): void {
    if (id === null) {
      this.department.set({ id: undefined, name: 'Unassigned', employeeCount: 0 });
      return;
    }
    this.departmentService.getDepartmentById(id).subscribe({
      next: (dept) => {
        this.department.set(dept);
      },
      error: (err) => console.error('Error loading department:', err)
    });
  }

  loadEmployees(departmentId: number | null): void {
    if (departmentId === null) {
      this.employeeService.getUnassignedEmployees().subscribe({
        next: (employees) => {
          this.employees.set(employees);
          this.filteredEmployees.set(employees);
        },
        error: (err) => console.error('Error loading employees:', err)
      });
    } else {
      this.employeeService.getEmployeesByDepartment(departmentId).subscribe({
        next: (employees) => {
          this.employees.set(employees);
          this.filteredEmployees.set(employees);
        },
        error: (err) => console.error('Error loading employees:', err)
      });
    }
  }

  onSearchChange(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      const filtered = this.employees().filter((emp) =>
        emp.fullName.toLowerCase().includes(query.toLowerCase())
      );
      this.filteredEmployees.set(filtered);
    } else {
      this.filteredEmployees.set(this.employees());
    }
  }

  selectEmployee(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  openNewEmployeeModal(): void {
    this.employeeForm.reset();
    this.showNewEmployeeModal.set(true);
  }

  closeNewEmployeeModal(): void {
    this.showNewEmployeeModal.set(false);
    this.employeeForm.reset();
  }

  createEmployee(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const dept = this.department();
    if (dept) {
      const employee: Employee = {
        ...this.employeeForm.value,
        departmentId: dept.id || null
      };

      this.employeeService.createEmployee(employee).subscribe({
        next: () => {
          this.loadEmployees(dept.id || null);
          this.closeNewEmployeeModal();
        },
        error: (err) => console.error('Error creating employee:', err)
      });
    }
  }

  deleteEmployee(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          const dept = this.department();
          if (dept) {
            this.loadEmployees(dept.id || null);
          }
        },
        error: (err) => console.error('Error deleting employee:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.filteredEmployees.set(this.employees());
  }
}
