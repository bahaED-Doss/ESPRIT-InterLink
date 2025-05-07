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
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectListComponent } from './components/Back/project-list/project-list.component';
import { ProjectListBackComponent } from './components/Back/project-list-back/project-list-back.component';
import { CompanyListBackComponent } from './components/Back/company-list-back/company-list-back.component';
import { CompanyDetailsComponent } from './components/Front/company-details/company-details.component';
import { CompanyFormComponent } from './components/Front/company-form/company-form.component';
import { CompanyListComponent } from './components/Front/company-list/company-list.component';
import { ProjectDetailsComponent } from './components/Front/project-details/project-details.component';
import { ProjectFormComponent } from './components/Front/project-form/project-form.component';
import { AddTestComponent } from './components/Back/TestQuestion/Test/add-test/add-test.component';
import { ListTestComponent } from './components/Back/TestQuestion/Test/list-test/list-test.component';
import { ListQuestionComponent } from './components/Back/TestQuestion/Question/list-question/list-question.component';
import { CheckTestComponent } from './components/Front/interview/check-test/check-test.component';
import { ViewInterviewComponent } from './components/Front/interview/view-interview/view-interview.component';
import { ManagerNavbarComponent } from './components/Front/TASKSM/shared/manager-navbar/manager-navbar.component';
import { NotificationComponent } from './components/Front/TASKSM/shared/notification/notification.component';
import { StudentNavbarComponent } from './components/Front/TASKSM/shared/student-navbar/student-navbar.component';
import { TaskCardComponent } from './components/Front/TASKSM/tasksPM/task-card/task-card.component';
import { TaskFormComponent } from './components/Front/TASKSM/tasksPM/task-form/task-form.component';
import { TaskListComponent } from './components/Front/TASKSM/tasksPM/task-list/task-list.component';
import { TaskManagementComponent } from './components/Front/TASKSM/tasksPM/task-management/task-management.component';
import { TaskSelectionComponent } from './components/Front/TASKSM/tasksPM/task-selection/task-selection.component';
import { FeedbackChartModalComponent } from './components/Front/TASKSM/tasksST/feedback-chart-modal/feedback-chart-modal.component';
import { SelectStudentComponent } from './components/Front/TASKSM/tasksST/select-student/select-student.component';
import { SentimentChartComponent } from './components/Front/TASKSM/tasksST/sentiment-chart/sentiment-chart.component';
import { StudentTaskBoardComponent } from './components/Front/TASKSM/tasksST/student-task-board/student-task-board.component';
import { StudentTaskCardComponent } from './components/Front/TASKSM/tasksST/student-task-card/student-task-card.component';
import { StudentTaskManagementComponent } from './components/Front/TASKSM/tasksST/student-task-management/student-task-management.component';


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
    ProjectListComponent,
    ProjectListBackComponent,
    CompanyListBackComponent,
    CompanyDetailsComponent,
    CompanyFormComponent,
    CompanyListComponent,
    ProjectDetailsComponent,
    ProjectFormComponent,
    AddTestComponent,
    ListTestComponent,
    ListQuestionComponent,
    CheckTestComponent,
    ViewInterviewComponent,
    ManagerNavbarComponent,
    NotificationComponent,
    StudentNavbarComponent,
    TaskCardComponent,
    TaskFormComponent,
    TaskListComponent,
    TaskManagementComponent,
    TaskSelectionComponent,
    FeedbackChartModalComponent,
    SelectStudentComponent,
    SentimentChartComponent,
    StudentTaskBoardComponent,
    StudentTaskCardComponent,
    StudentTaskManagementComponent,

    
    
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
