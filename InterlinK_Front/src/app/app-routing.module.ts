import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/Front/home/home.component';
import { RegisterComponent } from './components/Front/register/register.component';
import { LoginComponent } from './components/Front/login/login.component';
import { TablesComponent } from './components/Back/tables/tables.component';
import { RtlComponent } from './components/Back/rtl/rtl.component';
import { ProfileComponent } from './components/Back/profile/profile.component';
import { BillingComponent } from './components/Back/billing/billing.component';
import { HomeBackComponent } from './components/Back/home-back/home-back.component';
import { HomeFrontComponent } from './components/Front/home-front/home-front.component';
import { WelcomeViewComponent } from './components/Front/welcome-view/welcome-view.component';
import { InternshipsComponent } from './components/Front/internships/internships.component';
import { StartProcessComponent } from './components/Front/start-process/start-process.component';
import { LINKERComponent } from './components/Front/linker/linker.component';
import { TaskFormComponent } from './components/Front/TASKSM/tasksPM/task-form/task-form.component';
import { TaskListComponent } from './components/Front/TASKSM/tasksPM/task-list/task-list.component';
import { TaskManagementComponent } from './components/Front/TASKSM/tasksPM/task-management/task-management.component';
import { TaskSelectionComponent } from './components/Front/TASKSM/tasksPM/task-selection/task-selection.component';
import { StudentTaskManagementComponent } from './components/Front/TASKSM/tasksST/student-task-management/student-task-management.component';

const routes: Routes = [
  {path: '', component: HomeComponent,},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'homeBack', component: HomeBackComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'rtl', component: RtlComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'homeFront', component: HomeFrontComponent },
  { path: 'welcomeV', component: WelcomeViewComponent },
  { path: 'internships', component: InternshipsComponent },
  { path: 'startProcess', component: StartProcessComponent },
  { path: 'link', component: LINKERComponent },
  { path: 'taskForm', component: TaskFormComponent },
  { path: 'taskM', component: TaskManagementComponent },
  { path: 'taskList', component: TaskListComponent },
  { path: 'taskSelect', component: TaskSelectionComponent },
  { path: 'tasks-s', component: StudentTaskManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
