import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm;
  username = '';
  firstname = '';
  lastname = '';
  password = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  passwordMismatch = false;
  error: string | null = null;
  success: string | null = null;

  onSubmit() {
    this.error = null;
    this.passwordMismatch = false;

    if (this.registerForm.invalid) {
      this.error = 'Please fill all required fields correctly.';
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      return;
    }


    this.http
      .post('/api/Register', {
        username: this.username,
        password: this.password,
        name: this.firstname + ' ' + this.lastname,
        email: this.email,
      })
      .subscribe({
        next: (res) => {
          console.log('Login success:', res);

          this.success = 'Registration successful! Redirecting to login...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        },
        error: (err) => {
          this.error = err.error.error;
          console.error(err);
        },
      });
  }
}
