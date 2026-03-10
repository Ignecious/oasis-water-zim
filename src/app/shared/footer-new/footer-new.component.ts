import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './footer-new.component.html',
  styleUrl: './footer-new.component.scss'
})
export class FooterNewComponent {

}
