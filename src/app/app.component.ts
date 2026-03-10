import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  template: `
    <app-header *ngIf="!isAdminRoute && !isHomePage"></app-header>
    <router-outlet></router-outlet>
    <app-footer *ngIf="!isAdminRoute && !isHomePage"></app-footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Oasis Water Zimbabwe';
  isAdminRoute = false;
  isHomePage = false;

  constructor(private router: Router) {
    // Check initial route
    this.isAdminRoute = this.router.url.includes('/admin');
    this.isHomePage = this.router.url === '/' || this.router.url === '' || this.router.url.includes('/products') || this.router.url.includes('/cart');
    
    // Check if current route is admin route, home page, products page, or cart page
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAdminRoute = event.url.includes('/admin');
        this.isHomePage = event.url === '/' || event.url === '' || event.url.includes('/products') || event.url.includes('/cart');
      });
  }
}
