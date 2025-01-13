import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './core/file-upload/file-upload.component';
import { AuthComponent } from './core/components/auth/auth.component';

const routes: Routes = [
  { path: 'upload', component: FileUploadComponent },
  {
    path: 'auth',
    component: AuthComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
