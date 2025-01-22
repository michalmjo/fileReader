import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from './core/file-upload/file-upload.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthComponent } from './core/components/auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './core/components/features/loading-spinner/loading-spinner.component';
import { HomeComponent } from './core/components/home/home.component';
import { AuthInterceptorService } from './core/components/auth/service/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    HeaderComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
