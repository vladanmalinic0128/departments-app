import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../services/department.service';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-create-department-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-department-form.html',
  styleUrl: './create-department-form.scss'
})
export class CreateDepartmentFormComponent {
  @Output() departmentCreated = new EventEmitter<{ name: string }>();
  @Output() cancelled = new EventEmitter<void>();

  departmentForm: FormGroup;

  constructor(private fb: FormBuilder, private departmentService: DepartmentService) {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)], this.departmentNameAsyncValidator()]
    });
  }

  private departmentNameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.departmentService.departmentNameExists(control.value).pipe(
        debounceTime(300),
        map(exists => (exists ? { departmentNameTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      this.departmentCreated.emit(this.departmentForm.value);
      this.departmentForm.reset();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.departmentForm.reset();
  }

  get nameControl() {
    return this.departmentForm.get('name');
  }

  get isNameInvalid(): boolean {
    const control = this.nameControl;
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get nameError(): string {
    const control = this.nameControl;
    if (control?.hasError('required')) {
      return 'Department name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Department name must be at least 2 characters';
    }
    if (control?.hasError('maxlength')) {
      return 'Department name cannot exceed 100 characters';
    }
    if (control?.hasError('departmentNameTaken')) {
      return 'Department name already exists';
    }
    return '';
  }
}
