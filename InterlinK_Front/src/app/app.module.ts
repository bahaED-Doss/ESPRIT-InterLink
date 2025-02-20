import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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

import { NavbarComponent } from './components/Front/navbar/navbar.component';
import { FooterComponent } from './components/Front/footer/footer.component';
import { TasksComponent } from './components/Front/tasks/tasks.component';
import { HomeFrontComponent } from './components/Front/home-front/home-front.component';
import { WelcomeViewComponent } from './components/Front/welcome-view/welcome-view.component';
import { InternshipsComponent } from './components/Front/internships/internships.component';
import { StartProcessComponent } from './components/Front/start-process/start-process.component';
import { SuggestionsHComponent } from './components/Front/suggestions-h/suggestions-h.component';
import { CompanyListComponent } from './components/Front/company-list/company-list.component';
import { CompanyFormComponent } from './components/Front/company-form/company-form.component';
import { ProjectFormComponent } from './components/Front/project-form/project-form.component';
import { ProjectListComponent } from './components/Front/project-list/project-list.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    TasksComponent,
    HomeFrontComponent,
    WelcomeViewComponent,
    InternshipsComponent,
    StartProcessComponent,
    SuggestionsHComponent,
    CompanyListComponent,
    CompanyFormComponent,
    ProjectFormComponent,
    ProjectListComponent
   
    
    
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
