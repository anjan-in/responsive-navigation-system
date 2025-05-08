import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-section',
  templateUrl: './demo-section.component.html',
  styleUrls: ['./demo-section.component.scss']
})
export class DemoSectionComponent implements OnInit {
  activeDevice: string = 'desktop';

  constructor() { }

  ngOnInit(): void {
    // Add event listeners for device tabs
    setTimeout(() => {
      const deviceTabs = document.querySelectorAll('.device-tab');
      deviceTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          // Remove active class from all tabs and previews
          deviceTabs.forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.device-preview').forEach(p => p.classList.remove('active'));
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Show corresponding preview
          const device = (tab as HTMLElement).dataset['device'];
          if (device) {
            document.querySelector(`.device-preview.${device}`)?.classList.add('active');
            this.activeDevice = device;
          }
        });
      });
      
      // Menu toggle functionality
      const menuToggle = document.querySelector('.menu-toggle');
      menuToggle?.addEventListener('click', () => {
        document.querySelector('.demo-sidebar')?.classList.toggle('collapsed');
      });
    }, 0);
  }
}
