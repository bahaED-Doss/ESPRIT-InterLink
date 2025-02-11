import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    
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
    TablesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
