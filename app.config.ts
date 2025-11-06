import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const routes:Routes=[
  {
    path:'employees',
    loadChildren:() =>
      import('./employee/employee-routing-module').then(m =>
        m.EmployeeRoutingModule)
  },
  {
    path:'',redirectTo:'employees',pathMatch:'full'
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
