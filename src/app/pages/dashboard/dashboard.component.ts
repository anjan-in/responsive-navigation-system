import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, finalize, takeUntil } from 'rxjs';

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
  type: 'create' | 'update' | 'delete' | 'login' | 'other';
}

interface Project {
  name: string;
  team: string;
  deadline: string;
  progress: number;
}

interface SystemMetric {
  cpu: number;
  memory: number;
  disk: number;
}

interface Notification {
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  userName = 'Anjan Sen';
  stats: StatCard[] = [];
  activities: Activity[] = [];
  projects: Project[] = [];
  systemMetrics: SystemMetric = { cpu: 0, memory: 0, disk: 0 };
  notifications: Notification[] = [];
  
  isLoading = false;
  isRefreshing = false;

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
    this.loadInitialData();
    
    // Set default date range for last month
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    
    this.startDate = this.formatDate(lastMonth);
    this.endDate = this.formatDate(today);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderChart();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadInitialData(): void {
    this.isLoading = true;
    
    // Simulate API calls
    setTimeout(() => {
      // Stats data
      this.stats = [
        { title: "Total Users", icon: "bi-people-fill", value: "1,245", color: "#3f51b5" },
        { title: "Revenue", icon: "bi-currency-dollar", value: "$32,450", color: "#4caf50" },
        { title: "Orders", icon: "bi-cart-fill", value: "764", color: "#9c27b0" },
        { title: "Support Tickets", icon: "bi-ticket-fill", value: "98", color: "#f44336" }
      ];

      // Activities data
      this.activities = [
        { user: "John Doe", action: "placed an order #45623", time: "5 mins ago", type: "create" },
        { user: "Alice Smith", action: "updated their profile", time: "20 mins ago", type: "update" },
        { user: "Bob Johnson", action: "requested support for issue #5421", time: "1 hour ago", type: "other" },
        { user: "Maria Garcia", action: "completed project milestone", time: "3 hours ago", type: "update" },
        { user: "David Lee", action: "logged in from new device", time: "4 hours ago", type: "login" }
      ];
      
      // Projects data
      this.projects = [
        { name: "Website Redesign", team: "Design Team", deadline: "May 22, 2025", progress: 75 },
        { name: "Mobile App Development", team: "Dev Team", deadline: "June 15, 2025", progress: 45 },
        { name: "Marketing Campaign", team: "Marketing", deadline: "May 30, 2025", progress: 90 },
        { name: "Database Migration", team: "Backend Team", deadline: "July 10, 2025", progress: 30 }
      ];
      
      // SystemMetrics
      this.systemMetrics = {
        cpu: 45,
        memory: 68,
        disk: 32
      };
      
      // Notifications
      this.notifications = [
        { message: "Your account password was changed", time: "Just now", read: false, type: "info" },
        { message: "New user registered: Emma Wilson", time: "1 hour ago", read: false, type: "success" },
        { message: "Server maintenance scheduled for 10:00 PM", time: "3 hours ago", read: true, type: "warning" },
        { message: "Failed login attempt detected", time: "Yesterday", read: true, type: "error" }
      ];
      
      this.isLoading = false;
    }, 1500);
  }

  refreshData(): void {
    this.isRefreshing = true;
    
    setTimeout(() => {
      // Simulate refreshing data with slight changes
      this.stats = [
        { title: "Total Users", icon: "bi-people-fill", value: "1,247", color: "#3f51b5" },
        { title: "Revenue", icon: "bi-currency-dollar", value: "$32,580", color: "#4caf50" },
        { title: "Orders", icon: "bi-cart-fill", value: "769", color: "#9c27b0" },
        { title: "Support Tickets", icon: "bi-ticket-fill", value: "103", color: "#f44336" }
      ];
      
      // Add a new activity at the beginning
      this.activities.unshift({
        user: "Sarah Johnson",
        action: "uploaded new files to Project X",
        time: "Just now",
        type: "create"
      });
      
      this.isRefreshing = false;
      
      // Update chart
      this.updateChart();
    }, 1000);
  }

  renderChart() {
    const ctx = document.getElementById('dashboardChart') as HTMLCanvasElement;
    if (!ctx) return;
    
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
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63, 81, 181, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#3f51b5',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  updateChart() {
    // Simulate API call to update chart data based on filters
    this.isLoading = true;
    
    setTimeout(() => {
      // Randomly adjust data to simulate filtering
      const randomFactor = Math.random() * 0.3 + 0.85; // Between 0.85 and 1.15
      
      // Apply random variation to the data
      this.chartData = {
        performance: this.chartData.performance.map(val => Math.round(val * randomFactor)),
        revenue: this.chartData.revenue.map(val => Math.round(val * randomFactor)),
        users: this.chartData.users.map(val => Math.round(val * randomFactor))
      };
      
      this.renderChart();
      this.isLoading = false;
    }, 800);
  }

  loadMoreActivities(): void {
    this.isLoading = true;
    
    // Simulate loading more activities
    setTimeout(() => {
      const moreActivities: Activity[] = [
        { user: "Michael Brown", action: "deleted old documents", time: "Yesterday", type: "delete" },
        { user: "Jennifer White", action: "approved expense report", time: "Yesterday", type: "update" },
        { user: "Ryan Clark", action: "created new project", time: "2 days ago", type: "create" }
      ];
      
      this.activities = [...this.activities, ...moreActivities];
      this.isLoading = false;
    }, 800);
  }

  downloadChart(format: 'pdf' | 'png'): void {
    // Simulate download
    alert(`Chart downloaded as ${format.toUpperCase()}`);
  }

  getActivityIconClass(type: Activity['type']): string {
    const baseClass = 'activity-icon ';
    switch (type) {
      case 'create': return baseClass + 'create-icon';
      case 'update': return baseClass + 'update-icon';
      case 'delete': return baseClass + 'delete-icon';
      case 'login': return baseClass + 'login-icon';
      default: return baseClass + 'other-icon';
    }
  }

  getProgressColorClass(progress: number): string {
    if (progress < 40) return 'bg-danger';
    if (progress < 70) return 'bg-warning';
    return 'bg-success';
  }

  getNotificationIconClass(type: Notification['type']): string {
    switch (type) {
      case 'info': return 'notification-info';
      case 'warning': return 'notification-warning';
      case 'success': return 'notification-success';
      case 'error': return 'notification-error';
      default: return '';
    }
  }

  getNotificationIconName(type: Notification['type']): string {
    switch (type) {
      case 'info': return 'bi-info-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-x-circle-fill';
      default: return 'bi-bell-fill';
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
