import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeEditPopup } from '../employee-edit-popup/employee-edit-popup';
import { EmployeeService } from '../../services/employee';

@Component({
  standalone: true,
  selector: 'app-employee-search',
  imports: [CommonModule, ReactiveFormsModule, MatDialogActions, MatDialogContent, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatTableModule, MatSortModule, MatSelectModule, MatOptionModule],
  templateUrl: './employee-search.html',
  styleUrl: './employee-search.scss'
})
export class EmployeeSearch implements OnInit {

  searchForm!: FormGroup;
  employees: any[] = [];
  locations: string[] = [];
  page = 1;
  pageSize = 10;
  totalRecords = 0;

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      firstName: ['', [Validators.maxLength(15), Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.maxLength(15), Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.email]],
      location: ['']
    });

    //load locations for dropdown - API 5
    this.empService.getLocations().subscribe((res: any) => this.locations = res);

    //triggers API-1
    this.search();
  }

  searchAttempted = false;
  search() {
    this.searchAttempted = true;
    if (this.searchForm.invalid) return;
    this.empService.search({...this.searchForm.value,page:this.page,pageSize:this.pageSize})
      .subscribe((res:any) => {
        this.employees = res.employees;
        this.totalRecords = res.totalRecords;
      });
  }

  edit(emp: any) {
    this.loadEmployeeDetails(emp.id); //updated to use parallel API call : API-2
  }

  delete(empId: number) {
    if (confirm('Are you sure to delete?')) {
      this.empService.deleteEmployee(empId).subscribe(() => this.search());
    }
  }

  loadEmployeeDetails(empId: number) {
    this.empService.GetMultipleDetails(empId).subscribe(
      ([employee, locations, employees]) => {
        this.locations = locations;
        this.employees = employees.employees;
        this.totalRecords = employees.totalRecords;

        const dialogRef = this.dialog.open(EmployeeEditPopup, {
          data: employee,
          width: '80vw',
          maxWidth: '900px',
          height: '80vh',
          panelClass: 'edit-popup'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.search();
          }
        });
      },
      error => {
        console.error('Error loading employee details:', error);
      }
    );
  }
}
