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

import { ProfileStudentComponent } from './components/Front/studentSettings/profile-student/profile-student.component';

import { ChangepasswordsComponent } from './components/Front/studentSettings/changepasswords/changepasswords.component';
import { SkillssComponent } from './components/Front/studentSettings/skillss/skillss.component';
import { SociallinkssComponent } from './components/Front/studentSettings/sociallinkss/sociallinkss.component';
import { ProfileHrComponent } from './components/Front/hrSettings/profile-hr/profile-hr.component';
import { SociallinkshrComponent } from './components/Front/hrSettings/sociallinkshr/sociallinkshr.component';
import { ChangepasswordhrComponent } from './components/Front/hrSettings/changepasswordhr/changepasswordhr.component';
import { UserStatisticsComponent } from './components/Back/user-statistics/user-statistics.component';
import { authGuard } from './guards/auth.guard';








const routes: Routes = [
  {path: '', component: HomeFrontComponent,},
  { path: 'login', component: LoginComponent },
  { path: 'homeFront', component: HomeFrontComponent },
  { path: 'socialLinksHR/:id', component: SociallinkshrComponent },
  { path: 'changePassHR/:id', component: ChangepasswordhrComponent },
  { path: 'changePassS/:id', component: ChangepasswordsComponent },
  { path: 'skillsS/:id', component: SkillssComponent },
  { path: 'socialLinksS/:id', component: SociallinkssComponent },
  { path: 'welcomeV', component: WelcomeViewComponent },
  { path: 'internships', component: InternshipsComponent },
  { path: 'startProcess', component: StartProcessComponent },
  { path: 'homeBack/:id', component: HomeBackComponent },
  { path: 'HrDashboard', component: HomeHrComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profileHr/:id', component: ProfileHrComponent },
  { path: 'profileStudent/:id', component: ProfileStudentComponent },
  { path: 'internshipsBack', component: InternshipsBackComponent },
  { path: 'applicationsBack', component: ApplicationsBackComponent },
  { path: 'userStats', component: UserStatisticsComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'student-profile/:id', component: StudentProfileComponent },
  { path: 'hr-profile/:id', component: HrProfileComponent, canActivate: [authGuard] },
  
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: '**', redirectTo: 'login' }  // Default redirect
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
