import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var AOS: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeDevice: 'desktop' | 'tablet' | 'mobile' = 'desktop';

  ngOnInit() {
    // Automatically cycle through device views
    this.startDeviceCycle();
  }
  
  ngAfterViewInit() {
    // Initialize AOS (Animate On Scroll) library after view is initialized
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: false
      });
    }
  }

  // Method to set active device
  setActiveDevice(device: 'desktop' | 'tablet' | 'mobile') {
    this.activeDevice = device;
  }

  // Method to scroll to section
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Automatic device cycle for demo effect
  private startDeviceCycle() {
    const devices: ('desktop' | 'tablet' | 'mobile')[] = ['desktop', 'tablet', 'mobile'];
    let currentIndex = 0;
    
    setInterval(() => {
      if (!document.hidden) { // Only change when page is visible
        currentIndex = (currentIndex + 1) % devices.length;
        this.activeDevice = devices[currentIndex];
      }
    }, 4000); // Change every 4 seconds
  }

}

