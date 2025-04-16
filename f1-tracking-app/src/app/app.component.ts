import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="f1-container">
      <h1>Formula 1 Championship Tracker</h1>
      <div class="standings-container">
        <app-drivers-standings></app-drivers-standings>
        <app-constructors-standings></app-constructors-standings>
      </div>
    </div>
  `,
  styles: [`
    .f1-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: var(--text-primary);
      margin-bottom: 2rem;
    }

    .standings-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'F1 Championship Tracker';
}
