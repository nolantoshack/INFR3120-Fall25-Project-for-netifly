import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // <-- Required for API calls to Render
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Required for form handling

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// --- Import All Your Components ---
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TrucksComponent } from './trucks/trucks.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// ---------------------------------

@NgModule({
  declarations: [
    AppComponent,
    // --- Declare All Components ---
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    TrucksComponent,
    CreateComponent,
    EditComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    // ---------------------------------
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Enables Angular's HTTP client for API communication
    FormsModule, // For template-driven forms
    ReactiveFormsModule // For model-driven forms
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }