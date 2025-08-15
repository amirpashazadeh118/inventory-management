import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Part {
  PartID: any;
  Name: string;
  Remaining: number;
  Cost: number;
}

@Component({
  selector: 'app-addorder',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.css']
})
export class AddorderComponent implements OnInit {

  availableParts: Part[] = [];
  selectedPart: Part | null = null;
  
  newOrder = {
    PartID: '',
    Count: 0,
    Description: ''
  };

  totalCost = 0;
  private debounceTimer: any; // For the smooth update delay

  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getAvailableParts();
  }

  getAvailableParts(): void {
    this.http.get<Part[]>(`${this.apiUrl}/Part`).subscribe({
      next: (data) => {
        this.availableParts = data;
      },
      error: (err) => console.error('Failed to load parts:', err)
    });
  }

  onPartSelectionChange(): void {
    this.selectedPart = this.availableParts.find(p => p.PartID == this.newOrder.PartID) || null;
    this.updateTotalCost();
  }

  updateTotalCost(): void {
    // Clear the previous timer to reset the delay
    clearTimeout(this.debounceTimer);

    // Set a new timer to run the check after 500ms
    this.debounceTimer = setTimeout(() => {
      if (this.selectedPart && this.newOrder.Count) {
        // Auto-correct the quantity if it exceeds available stock
        if (this.newOrder.Count > this.selectedPart.Remaining) {
          this.newOrder.Count = this.selectedPart.Remaining;
        }

        if (this.newOrder.Count > 0) {
          this.totalCost = this.selectedPart.Cost * this.newOrder.Count;
        } else {
          this.totalCost = 0;
        }
      } else {
        this.totalCost = 0;
      }
    }, 500); // 500ms delay
  }

  onAddOrderSubmit(): void {
    if (!this.selectedPart || !this.newOrder.Count || !this.newOrder.Description) {
      alert('Please fill out all fields.');
      return;
    }

    // The check for Count > Remaining is no longer needed here because
    // updateTotalCost() already prevents it.

    this.http.post(`${this.apiUrl}/Order`, this.newOrder).subscribe({
      next: (response) => {
        alert('Order created successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert(`Error: ${err.error || 'Could not create the order.'}`);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}