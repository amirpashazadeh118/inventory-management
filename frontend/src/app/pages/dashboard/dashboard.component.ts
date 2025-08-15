import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpParams } from '@angular/common/http'; // <-- Import HttpParams

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Order {
  OrderID: number;
  Description: string;
  pname: string;
  uname: string;
  State: number;
  TotalCost: number;
  CreateAt: string;
  Count: number
}

export interface InventoryVoucher {
  InventoryVoucherID: number;
  Description: string;
  pname: string;
  uname: string;
  Number: number;
  CreateAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sells: Order[] = [];
  buys: InventoryVoucher[] = [];
  private apiUrl = 'api//inventory';
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getSells();
    this.getBuys();
  }

  getSells(): void {
    const params = new HttpParams().set('state', '2');

  // Add the params object to your http.get call
  this.http.get<Order[]>(`${this.apiUrl}/Order`, { params: params }).subscribe({
    next: (data) => { this.sells = data },
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