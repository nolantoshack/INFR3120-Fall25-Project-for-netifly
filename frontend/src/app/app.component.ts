// frontend/src/app/app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root', // This tag is what goes in your main index.html file
  templateUrl: './app.component.html',
  styleUrls: ['./app.css'] // Or just ['./app.component.css'] if it exists
})
export class AppComponent {
  title = 'frontend';
}