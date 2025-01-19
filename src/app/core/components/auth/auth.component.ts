import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserAuthService } from './service/user-auth.service';

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

  constructor(private fb: FormBuilder, private authService: UserAuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  get f(): { [key: string]: any } {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    const { email, password } = this.loginForm.value;
    console.log(email);
    console.log(password);

    if (this.isLoginMode) {
      console.log('Tryb Logowania');
      this.authService.logIn(email, password).subscribe((x) => console.log(x));
    } else {
      console.log('Rejestracja');
      this.authService
        .register(email, password)
        .subscribe((x) => console.log(x));
    }

    if (this.loginForm.invalid) {
      return;
    }

    console.log('Form Data:', this.loginForm.value);
  }

  changeMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
