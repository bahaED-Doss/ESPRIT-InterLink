import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './components/Front/login/login.component';
import { TablesComponent } from './components/Back/tables/tables.component';

import { ProfileComponent } from './components/Back/profile/profile.component';

import { HomeBackComponent } from './components/Back/home-back/home-back.component';
import { HrProfileComponent } from './components/Front/hr-profile/hr-profile.component';

import { StudentProfileComponent } from './components/Front/student-profile/student-profile.component';
import { ForgetPasswordComponent } from './components/Front/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/Front/reset-password/reset-password.component';
import { InternshipsBackComponent } from './components/Back/internships-back/internships-back.component';
import { ApplicationsBackComponent } from './components/Back/applications-back/applications-back.component';
import { HomeFrontComponent } from './components/Front/home-front/home-front.component';
import { WelcomeViewComponent } from './components/Front/welcome-view/welcome-view.component';
import { InternshipsComponent } from './components/Front/internships/internships.component';
import { StartProcessComponent } from './components/Front/start-process/start-process.component';
import { HomeHrComponent } from './components/Front/hrDashboard/home-hr/home-hr.component';
import { ProfileHrComponent } from './components/Front/profile-hr/profile-hr.component';
import { ProfileStudentComponent } from './components/Front/profile-student/profile-student.component';
import { InternshipDetailsComponent } from './components/Back/internships-back/internship-details/internship-details.component';



const routes: Routes = [
  {path: '', component: HomeFrontComponent,},
  { path: 'login', component: LoginComponent },
  { path: 'homeFront', component: HomeFrontComponent },
  
  { path: 'welcomeV', component: WelcomeViewComponent },
  { path: 'internships', component: InternshipsComponent },
  { path: 'startProcess', component: StartProcessComponent },
  { path: 'homeBack/:id', component: HomeBackComponent },
  { path: 'HrDashboard', component: HomeHrComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profileHr', component: ProfileHrComponent },
  { path: 'profileStudent', component: ProfileStudentComponent },
  { path: 'internshipsBack', component: InternshipsBackComponent },
  { path: 'applicationsBack', component: ApplicationsBackComponent },
  
  { path: 'tables', component: TablesComponent },
  { path: 'student-profile/:id', component: StudentProfileComponent },
  { path: 'hr-profile/:id', component: HrProfileComponent },
  
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'internships-back', component: InternshipsBackComponent },
  { path: 'internship-details/:id', component: InternshipDetailsComponent },

  { path: '', redirectTo: '/internships-back', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
