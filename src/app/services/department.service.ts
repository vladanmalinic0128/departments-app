import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly baseUrl = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  departmentNameExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check/exists?name=${name}`);
  }
}
