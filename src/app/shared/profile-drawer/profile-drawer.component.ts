import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-drawer.component.html',
  styleUrl: './profile-drawer.component.scss'
})
export class ProfileDrawerComponent {
  @Input() isOpen = false;
  @Output() closeDrawer = new EventEmitter<void>();

  constructor(private router: Router) {}

  onClose(): void {
    this.closeDrawer.emit();
  }

  onBackdropClick(): void {
    this.onClose();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.onClose();
  }

  // Placeholder for sign in/sign up functionality
  onSignIn(): void {
    console.log('Sign in clicked');
    // TODO: Implement sign in logic
    this.onClose();
  }
}
