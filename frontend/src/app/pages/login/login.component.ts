import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
    imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],

})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('/api/Login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Invalid username or password';
        console.error(err);
      }
    });
  }
}
