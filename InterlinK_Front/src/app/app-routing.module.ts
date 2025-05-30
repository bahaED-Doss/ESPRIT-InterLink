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
  { path: 'startProcess', component: StartProcessComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
