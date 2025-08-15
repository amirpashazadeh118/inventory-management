import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Order {
  OrderID: number;
  Description: string;
  pname: string;
  uname: string;
  State: number;
  TotalCost: number;
  Count: number;
  PartID: number;
}

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.css']
})
export class AllordersComponent implements OnInit {

  pendingOrders: Order[] = [];
  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getPendingOrders();
  }

  getPendingOrders(): void {
    const params = new HttpParams().set('state', '1');
    this.http.get<Order[]>(`${this.apiUrl}/Order`, { params }).subscribe({
      next: (data) => {
        this.pendingOrders = data;
      },
      error: (err) => console.error('Failed to load pending orders:', err)
    });
  }

  // This function handles the entire update process ---
  onStatusChange(order: Order, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newState = Number(selectElement.value);
    const actionText = newState === 2 ? 'Accept' : 'Reject';

    // Show a confirmation dialog to the user
    const confirmed = confirm(`Are you sure you want to ${actionText} order #${order.OrderID}?`);

    if (confirmed) {
      const body = {
        orderID: order.OrderID,
        partID: order.PartID,
        partName: order.pname,
        count: order.Count,
        state: newState
      };

      // Send the update request to the server immediately
      this.http.put(`${this.apiUrl}/Order`, body).subscribe({
        next: () => {
          alert(`Order #${order.OrderID} has been updated.`);
          this.getPendingOrders(); // Refresh the list to remove the updated order
        },
        error: (err) => {
          alert(`An error occurred: ${err.error || 'Could not update the order.'}`);
          // Reset the dropdown to its original "Pending" state on failure
          selectElement.value = '1';
        }
      });
    } else {
      // If the user cancels, reset the dropdown back to "Pending"
      selectElement.value = '1';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}