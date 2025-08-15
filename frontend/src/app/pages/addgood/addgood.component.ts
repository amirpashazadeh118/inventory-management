import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Category {
  CategorizationID: number;
  Name: string;
}

@Component({
  selector: 'app-addgood',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './addgood.component.html',
  styleUrls: ['./addgood.component.css']
})
export class AddgoodComponent implements OnInit {

  categories: Category[] = [];
  newPart = {
    Name: '',
    Cost: null,
    CategorizationRef: '',
    Count: null // This will hold the initial stock count
  };

  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
  }

  onAddPartSubmit(): void {
    // Added validation for the new 'Count' field
    if (!this.newPart.Name || !this.newPart.Cost || !this.newPart.CategorizationRef || this.newPart.Count === null) {
      alert('Please fill out all fields.');
      return;
    }

    this.http.post(`${this.apiUrl}/Part`, this.newPart).subscribe({
      next: (response) => {
        console.log('Part created successfully', response);
        alert('New good added successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Failed to create part:', err);
        alert(`Error: ${err.error || 'Could not add the new good.'}`);
      }
    });
  }

  getCategories(): void {
    this.http.get<Category[]>(`${this.apiUrl}/Categorization`).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
