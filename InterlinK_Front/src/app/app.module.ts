import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/Front/login/login.component';


import { AsideComponent } from './components/Back/aside/aside.component';
import { FooterBackComponent } from './components/Back/footer-back/footer-back.component';
import { HomeBackComponent } from './components/Back/home-back/home-back.component';
import { NavBackComponent } from './components/Back/nav-back/nav-back.component';
import { ProfileComponent } from './components/Back/profile/profile.component';
import { SettingsComponent } from './components/Back/settings/settings.component';
import { TablesComponent } from './components/Back/tables/tables.component';
import { StudentProfileComponent } from './components/Front/student-profile/student-profile.component';
import { HrProfileComponent } from './components/Front/hr-profile/hr-profile.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ForgetPasswordComponent } from './components/Front/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/Front/reset-password/reset-password.component';
import { InternshipsBackComponent } from './components/Back/internships-back/internships-back.component';
import { ApplicationsBackComponent } from './components/Back/applications-back/applications-back.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeFrontComponent } from './components/Front/home-front/home-front.component';
import { FooterComponent } from './components/Front/footer/footer.component';
import { InternshipsComponent } from './components/Front/internships/internships.component';
import { NavbarComponent } from './components/Front/navbar/navbar.component';
import { StartProcessComponent } from './components/Front/start-process/start-process.component';
import { SuggestionsHComponent } from './components/Front/suggestions-h/suggestions-h.component';
import { TasksComponent } from './components/Front/tasks/tasks.component';
import { WelcomeViewComponent } from './components/Front/welcome-view/welcome-view.component';
import { ContactComponent } from './components/Front/contact/contact.component';
import { AboutComponent } from './components/Front/about/about.component';
import { NavbarStudentComponent } from './components/Front/navbar-student/navbar-student.component';
import { NavbarHrComponent } from './components/Front/navbar-hr/navbar-hr.component';
import { HomeHrComponent } from './components/Front/hrDashboard/home-hr/home-hr.component';



import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { ProfileStudentComponent } from './components/Front/studentSettings/profile-student/profile-student.component';
import { ChangepasswordsComponent } from './components/Front/studentSettings/changepasswords/changepasswords.component';

import { SociallinkssComponent } from './components/Front/studentSettings/sociallinkss/sociallinkss.component';
import { SkillssComponent } from './components/Front/studentSettings/skillss/skillss.component';
import { ProfileHrComponent } from './components/Front/hrSettings/profile-hr/profile-hr.component';
import { ChangepasswordhrComponent } from './components/Front/hrSettings/changepasswordhr/changepasswordhr.component';
import { SociallinkshrComponent } from './components/Front/hrSettings/sociallinkshr/sociallinkshr.component';
import { UserStatisticsComponent } from './components/Back/user-statistics/user-statistics.component';
import { EducationComponent } from './components/Front/studentSettings/education/education.component';
import { DocumentsComponent } from './components/Front/documents/documents.component';
import { DocumentssSTComponent } from './components/Front/studentSettings/documentss-st/documentss-st.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeFrontComponent,
    StudentProfileComponent,
    HrProfileComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    HomeFrontComponent,
    FooterComponent,
    InternshipsComponent,
    NavbarComponent,
    StartProcessComponent,
    SuggestionsHComponent,
    TasksComponent,
    WelcomeViewComponent,
    TasksComponent,
    ContactComponent,
    AboutComponent,
    NavbarStudentComponent,
    NavbarHrComponent,
    HomeHrComponent,
    
    ProfileStudentComponent,
    ChangepasswordsComponent,
 
    SociallinkssComponent,
    SkillssComponent,
    ProfileHrComponent,
    ChangepasswordhrComponent,
    SociallinkshrComponent,
    UserStatisticsComponent,
    EducationComponent,
    DocumentsComponent,
    DocumentssSTComponent
    
    
    
    
    
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    AsideComponent,
    InternshipsBackComponent,
    FooterBackComponent,
    HomeBackComponent,
    NavBackComponent,
    ProfileComponent,
   ApplicationsBackComponent,
    SettingsComponent,
    TablesComponent,
    NgbModule,
    OAuthModule.forRoot()
    
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
