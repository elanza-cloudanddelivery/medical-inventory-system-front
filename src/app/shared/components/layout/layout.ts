import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '@shared/components/header/header';


@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  currentYear = new Date().getFullYear();

}
