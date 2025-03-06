import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/Front/login/login.component';
import { RegisterComponent } from './components/Front/register/register.component';
import { HomeComponent } from './components/Front/home/home.component';
import { AsideComponent } from './components/Back/aside/aside.component';
import { BillingComponent } from './components/Back/billing/billing.component';
import { FooterBackComponent } from './components/Back/footer-back/footer-back.component';
import { HomeBackComponent } from './components/Back/home-back/home-back.component';
import { NavBackComponent } from './components/Back/nav-back/nav-back.component';
import { ProfileComponent } from './components/Back/profile/profile.component';
import { RtlComponent } from './components/Back/rtl/rtl.component';
import { SettingsComponent } from './components/Back/settings/settings.component';
import { TablesComponent } from './components/Back/tables/tables.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/Front/navbar/navbar.component';
import { FooterComponent } from './components/Front/footer/footer.component';
import { HomeFrontComponent } from './components/Front/home-front/home-front.component';
import { WelcomeViewComponent } from './components/Front/welcome-view/welcome-view.component';
import { InternshipsComponent } from './components/Front/internships/internships.component';
import { StartProcessComponent } from './components/Front/start-process/start-process.component';
import { SuggestionsHComponent } from './components/Front/suggestions-h/suggestions-h.component';
import { LINKERComponent } from './components/Front/linker/linker.component';
import { TaskService } from './components/Front/TASKSM/Services/task.service';
import { TaskSelectionComponent } from './components/Front/TASKSM/tasksPM/task-selection/task-selection.component';
import { TaskListComponent } from './components/Front/TASKSM/tasksPM/task-list/task-list.component';
import { TaskFormComponent } from './components/Front/TASKSM/tasksPM/task-form/task-form.component';
import { TaskManagementComponent } from './components/Front/TASKSM/tasksPM/task-management/task-management.component';
import { DashboardComponent } from './components/Front/TASKSM/tasksPM/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectService } from './components/Front/TASKSM/Services/projectstatic.service';
import { TaskCardComponent } from './components/Front/TASKSM/tasksPM/task-card/task-card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Student Task Management Components
import { StudentTaskManagementComponent } from './components/Front/TASKSM/tasksST/student-task-management/student-task-management.component';
import { StudentTaskBoardComponent } from './components/Front/TASKSM/tasksST/student-task-board/student-task-board.component';
import { SelectStudentComponent } from './components/Front/TASKSM/tasksST/select-student/select-student.component';
import { TaskCardComponent as StudentTaskCardComponent } from './components/Front/TASKSM/tasksST/student-task-card/student-task-card.component';
import { StudentNavbarComponent } from './components/Front/TASKSM/shared/student-navbar/student-navbar.component';
import { ManagerNavbarComponent } from './components/Front/TASKSM/shared/manager-navbar/manager-navbar.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'tasks', component: TaskManagementComponent },
  { path: 'tasks-s', component: StudentTaskManagementComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    HomeFrontComponent,
    WelcomeViewComponent,
    InternshipsComponent,
    StartProcessComponent,
    SuggestionsHComponent,
    LINKERComponent,
    TaskSelectionComponent,
    TaskListComponent,
    TaskFormComponent,
    TaskManagementComponent,
    DashboardComponent,
    TaskCardComponent,
    // Student Task Management Components
    StudentTaskManagementComponent,
    StudentTaskBoardComponent,
    SelectStudentComponent,
    StudentTaskCardComponent,
    StudentNavbarComponent,
    ManagerNavbarComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    AsideComponent,
    BillingComponent,
    FooterBackComponent,
    HomeBackComponent,
    NavBackComponent,
    ProfileComponent,
    RtlComponent,
    SettingsComponent,
    TablesComponent,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    DragDropModule
  ],
  providers: [TaskService, ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
