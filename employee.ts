import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,forkJoin,Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'https://localhost:7267/api/Employee';
  public selectedEmployee = new BehaviorSubject<any>(null);

  constructor(private http:HttpClient){}

  search(params: any):Observable<any>{
    return this.http.get(`${this.baseUrl}/search`,{params});
  }

  getEmployee(id: number):Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveEmployee(employee: any):Observable<any>{
    return this.http.post(`${this.baseUrl}/save`,employee);
  }

  deleteEmployee(id: number){
    return this.http.delete(`https://localhost:7267/api/Employee/${id}`);
  }

  getLocations():Observable<string[]>{
    return this.http.get<string[]>(`https://localhost:7267/api/Employee/locations`);
  }

  //Parallel API example
  GetMultipleDetails(empId:number){
    const employeeDetails=this.getEmployee(empId); // API 2
    const locations=this.getLocations(); // API 5
    const allEmployees=this.search({}); // API 1 with no filters

    return forkJoin([employeeDetails,locations,allEmployees]);
  }
  
}
