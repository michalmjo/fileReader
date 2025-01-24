import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserAuthService } from './service/user-auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification/services/notification.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  isLoading: boolean = false;
  isLoginMode = true;
  error?: string;

  notifications: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: UserAuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  get f(): { [key: string]: any } {
    return this.loginForm.controls;
  }

  removeNotification(index: any) {
    this.notificationService.removeNotification(index);
  }

  onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    if (this.loginForm.invalid) {
      this.isLoading = false; // Wyłącz ładowanie w przypadku błędu
      return;
    }

    console.log(this.isLoginMode);
    console.log(email, password);

    const authObservable = this.isLoginMode
      ? this.authService.logIn(email, password)
      : this.authService.register(email, password);

    authObservable.subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.error = '';
        console.log('Sukces:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
        console.error('Błąd:', error);
        this.notificationService.addNotification(error);
        this.error = error;
        console.log(this.error);
      },
    });

    console.log('Form Data:', this.loginForm.value);
  }

  changeMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
