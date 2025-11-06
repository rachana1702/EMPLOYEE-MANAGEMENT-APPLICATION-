import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogActions,MatDialogContent,MatDialogModule,MatDialogRef } from '@angular/material/dialog';
import { FormBuilder,FormArray,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone:true,
  selector: 'app-employee-edit-popup',
  imports: [CommonModule,ReactiveFormsModule,MatDialogActions,MatDialogContent,MatDialogModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatPaginatorModule,MatOptionModule,MatSelectModule,MatIconModule],
  templateUrl: './employee-edit-popup.html',
  styleUrl: './employee-edit-popup.scss'
})
export class EmployeeEditPopup implements OnInit{

  empForm!:FormGroup;
  locations:string[]=[];

  constructor(
    private fb:FormBuilder,
    private empService:EmployeeService,
    private dialogRef:MatDialogRef<EmployeeEditPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
      this.empForm=this.fb.group({
        id:[null],
        firstName:['',[Validators.required,Validators.maxLength(15),Validators.pattern('^[a-zA-Z]+$')]],
        lastName:['',[Validators.required,Validators.maxLength(15),Validators.pattern('^[a-zA-Z]+$')]],
        email:['',[Validators.required,Validators.email]],
        location:['',Validators.required],
        skills:this.fb.array([]),
        experiences:this.fb.array([])
      });

      this.empService.getLocations().subscribe((res:string[]) =>
      {
        console.log("Locations fetched:",res);
        this.locations = res;
      });

      // Fill base values
      if(this.data){
        this.empForm.patchValue({
          id:this.data.id,
          firstName:this.data.firstName,
          lastName:this.data.lastName,
          email:this.data.email,
          location:this.data.location
        });

        //Fill skills
        this.data.skills.forEach((s: any) =>{
        this.skills.push(this.fb.group({
        id: [s.id],
        skillName:[s.skillName,Validators.required],
        level: [s.level]
        }));
      });

      //Fill experienes
      this.data.experiences.forEach((e: any) => {
        this.experiences.push(this.fb.group({
          id: [e.id],
          companyName: [e.companyName,Validators.required],
          startDate: [e.startDate],
          lastDate: [e.lastDate]
        }));
      });
    }  
  }

  get skills():FormArray{
    return this.empForm.get('skills') as FormArray;
  }

  get experiences():FormArray{
    return this.empForm.get('experiences') as FormArray;
  }

  removeSkill(index:number){
    this.skills.removeAt(index);
  }

  removeExperience(index:number){
    this.experiences.removeAt(index);
  }

  save(){
    if(this.empForm.invalid){
      alert('Please fill all required fields correctly');
      return;
    }

    this.empService.saveEmployee(this.empForm.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => alert('Save failed: ' + (err?.error?.message || err.message || 'Unknown error'))
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
