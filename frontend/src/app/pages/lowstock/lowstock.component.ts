import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Part {
  PartID: number;
  Name: string;
  Remaining: number;
  Cost: number;
  CreatedAt: string;
  CategoryName: string;
}

export interface Category {
  CategorizationID: number;
  Name: string;
}

@Component({
  selector: 'app-lowstock',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './lowstock.component.html',
  styleUrls: ['./lowstock.component.css']
})
export class LowstockComponent implements OnInit {

  parts: Part[] = [];
  categories: Category[] = [];
  
  // Object to hold the current filter values from the form
  filters = {
    Name: '',
    CategorizationRef: ''
  };

  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.applyFilters(); // Fetch all parts initially
  }

  fetchCategories(): void {
    this.http.get<Category[]>(`${this.apiUrl}/Categorization`).subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  applyFilters(): void {
    let params = new HttpParams();
    if (this.filters.Name) {
      params = params.append('Name', this.filters.Name);
    }
    if (this.filters.CategorizationRef) {
      params = params.append('CategorizationRef', this.filters.CategorizationRef);
    }

    this.http.get<Part[]>(`${this.apiUrl}/PartLow`, { params }).subscribe({
      next: (data) => {
        this.parts = data;
        console.log('Filtered parts loaded:', this.parts);
      },
      error: (err) => {
        console.error('Failed to load parts:', err);
      }
    });
  }
  
  resetFilters(): void {
    this.filters = { Name: '', CategorizationRef: '' };
    this.applyFilters();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}