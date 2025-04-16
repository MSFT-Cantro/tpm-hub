import { Component, OnInit } from '@angular/core';

interface Driver {
  position: number;
  name: string;
  points: number;
  team: string;
}

interface Constructor {
  position: number;
  name: string;
  points: number;
}

@Component({
  selector: 'app-standings',
  template: `
    <div class="standings-container">
      <div class="drivers-championship">
        <h2>Drivers Championship</h2>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Driver</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let driver of drivers">
              <td>{{driver.position}}</td>
              <td>{{driver.name}}</td>
              <td>{{driver.team}}</td>
              <td>{{driver.points}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="constructors-championship">
        <h2>Constructors Championship</h2>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Constructor</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let constructor of constructors">
              <td>{{constructor.position}}</td>
              <td>{{constructor.name}}</td>
              <td>{{constructor.points}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .standings-container {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 1rem;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    .drivers-championship, .constructors-championship {
      flex: 1;
      min-width: 300px;
    }
  `]
})
export class StandingsComponent implements OnInit {
  drivers: Driver[] = [
    { position: 1, name: 'Max Verstappen', team: 'Red Bull Racing', points: 69 },
    { position: 2, name: 'Sergio Perez', team: 'Red Bull Racing', points: 54 },
    { position: 3, name: 'Charles Leclerc', team: 'Ferrari', points: 37 },
  ];

  constructors: Constructor[] = [
    { position: 1, name: 'Red Bull Racing', points: 123 },
    { position: 2, name: 'Ferrari', points: 65 },
    { position: 3, name: 'Mercedes', points: 56 },
  ];

  constructor() {}

  ngOnInit(): void {}
}
