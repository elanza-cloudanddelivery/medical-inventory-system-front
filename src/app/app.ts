import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Layout } from '@shared/components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
