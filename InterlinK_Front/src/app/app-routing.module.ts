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
import { CompanyListComponent } from './components/Front/company-list/company-list.component';
import { CompanyFormComponent } from './components/Front/company-form/company-form.component';
import { ProjectFormComponent } from './components/Front/project-form/project-form.component';
import { ProjectListComponent } from './components/Front/project-list/project-list.component';
import { ProjectDetailsComponent } from './components/Front/project-details/project-details.component';
import { CompanyDetailsComponent } from './components/Front/company-details/company-details.component';
import { CompanyListBackComponent } from './components/Back/company-list-back/company-list-back.component';
import { ProjectListBackComponent } from './components/Back/project-list-back/project-list-back.component';




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
  { path: 'companyForm', component: CompanyFormComponent },
  { path: 'companyList', component: CompanyListComponent },
  { path: 'projectForm', component: ProjectFormComponent },
  { path: 'projectList', component: ProjectListComponent },
  { path: 'projectDetails/:id', component: ProjectDetailsComponent },
  { path: 'editProject/:id', component: ProjectFormComponent }, // ✅ For Editing
  { path: 'company-details/:id', component: CompanyDetailsComponent } ,// ✅ New Route
  { path: 'companyListBack', component:   CompanyListBackComponent} ,// ✅ New Route
  { path: 'projectListBack', component: ProjectListBackComponent }

  




  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
