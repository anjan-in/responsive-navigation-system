import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';

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
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: StatCard[] = [];
  activities: Activity[] = [];

  selectedFilter: keyof typeof this.chartData = 'performance';
  startDate: string = '';
  endDate: string = '';
  chart: any;

  // Sample Data
  chartData = {
    performance: [12, 19, 8, 17, 23, 30],
    revenue: [5000, 7000, 6000, 8500, 9200, 11000],
    users: [150, 200, 250, 300, 350, 400]
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

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

  ngAfterViewInit(): void {
    this.renderChart();
  }
  renderChart() {
    const ctx = document.getElementById('dashboardChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: this.selectedFilter.charAt(0).toUpperCase() + this.selectedFilter.slice(1),
          data: this.chartData[this.selectedFilter],
          borderColor: '#007bff',
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        }
      }
    });
  }

  updateChart() {
    this.renderChart(); // Re-render chart on filter change
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
