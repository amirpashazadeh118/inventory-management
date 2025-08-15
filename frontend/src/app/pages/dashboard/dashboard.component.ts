import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Interfaces for the data shapes to match your API
export interface Order {
  OrderID: number;
  Description: string;
  pname: string;
  uname: string;
  State: number;
  TotalCost: number;
}

export interface InventoryVoucher {
  InventoryVoucherID: number;
  Description: string;
  pname: string;
  uname: string;
  Number: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // Added standalone flag
  imports: [CommonModule, RouterLink, HttpClientModule], // Added necessary imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Added properties to hold the data for your HTML
  sells: Order[] = [];
  buys: InventoryVoucher[] = [];
  private apiUrl = '/inventory';

  // Injected HttpClient to make API calls
  constructor(private http: HttpClient) { }

  // Added ngOnInit to fetch data when the component loads
  ngOnInit(): void {
    this.getSells();
    this.getBuys();
  }

  getSells(): void {
    this.http.get<Order[]>(`${this.apiUrl}/Order`).subscribe({
      next: (data) => this.sells = data,
      error: (err) => console.error('Failed to load sells:', err)
    });
  }

  getBuys(): void {
    this.http.get<InventoryVoucher[]>(`${this.apiUrl}/InventoryVoucher`).subscribe({
      next: (data) => this.buys = data,
      error: (err) => console.error('Failed to load buys:', err)
    });
  }
}