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
import { HttpClientModule } from '@angular/common/http';
import { ForgetPasswordComponent } from './components/Front/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/Front/reset-password/reset-password.component';
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
import { ProfileHrComponent } from './components/Front/profile-hr/profile-hr.component';
import { ProfileStudentComponent } from './components/Front/profile-student/profile-student.component';
import { CommonModule } from '@angular/common';
import { ApplicationFormComponent } from './components/Front/internships/application-form/application-form.component';
import { NgxPaginationModule } from 'ngx-pagination';


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
    ProfileHrComponent,
    ProfileStudentComponent,
    ApplicationFormComponent,

    
    
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    AsideComponent,
    FooterBackComponent,
    HomeBackComponent,
    NavBackComponent,
    ProfileComponent,
   ApplicationsBackComponent,
    SettingsComponent,
    TablesComponent,
    CommonModule,
    NgbModule,
    NgxPaginationModule,

    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
