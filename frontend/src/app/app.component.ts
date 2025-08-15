import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // ✅ import HttpClient
import { HttpClientModule } from '@angular/common/http'; // ⬅️ این رو اضافه کن

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true, // ⬅️ اگر هنوز نذاشتی، standalone بودن رو مشخص کن
})
export class AppComponent {
  title = 'myapp';

  constructor(private http: HttpClient) {} // ✅ inject HttpClient

  cc() {
    this.http
      .post('/api/Login', {
        username: 'amir',
        password: '1234',
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
