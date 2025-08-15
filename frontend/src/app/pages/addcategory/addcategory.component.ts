import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent {

  newCategory = {
    Name: ''
  };

  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient, private router: Router) { }

  onAddCategorySubmit(): void {
    if (!this.newCategory.Name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    this.http.post(`${this.apiUrl}/Category`, this.newCategory).subscribe({
      next: (response) => {
        console.log('Category created successfully', response);
        alert('New category added successfully!');
        // Navigate back to the dashboard after success
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Failed to create category:', err);
        alert(`Error: ${err.error || 'Could not add the new category.'}`);
      }
    });
  }

  // Method to navigate back to the dashboard
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}