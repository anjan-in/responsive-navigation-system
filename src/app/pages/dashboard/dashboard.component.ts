import { Component, OnInit } from '@angular/core';

interface StatCard {
  title: string;
  icon: string;
  value: string;
  color: string;
}
interface Activity {
  user: string;
  action: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: StatCard[] = [];
  activities: Activity[] = [];

  constructor() {}

  ngOnInit() {
    // Simulating API Response
    this.stats = [
      { title: "Total Users", icon: "bi-people", value: "1,245", color: "blue" },
      { title: "Revenue", icon: "bi-cash", value: "$32,450", color: "green" },
      { title: "Orders", icon: "bi-cart", value: "764", color: "purple" },
      { title: "Support Tickets", icon: "bi-chat-dots", value: "98", color: "red" }
    ];

    this.activities = [
      { user: "John Doe", action: "placed an order", time: "5 mins ago" },
      { user: "Alice Smith", action: "updated profile", time: "20 mins ago" },
      { user: "Bob Johnson", action: "requested support", time: "1 hour ago" }
    ];
  }

}
