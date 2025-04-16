import { Component, OnInit } from '@angular/core';

interface Driver {
  position: number;
  name: string;
  nationality: string;
  team: string;
  points: number;
  wins: number;
}

@Component({
  selector: 'app-drivers-standings',
  template: `
    <div class="standings-card">
      <h2>Drivers Championship</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th>Nationality</th>
            <th>Team</th>
            <th>Points</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let driver of drivers">
            <td>{{driver.position}}</td>
            <td>{{driver.name}}</td>
            <td>{{driver.nationality}}</td>
            <td>{{driver.team}}</td>
            <td>{{driver.points}}</td>
            <td>{{driver.wins}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .standings-card {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px var(--shadow-color);
    }

    h2 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      color: var(--text-primary);
      font-weight: bold;
    }

    td {
      color: var(--text-secondary);
    }

    tr:last-child td {
      border-bottom: none;
    }
  `]
})
export class DriversStandingsComponent implements OnInit {
  drivers: Driver[] = [
    {
      position: 1,
      name: 'Max Verstappen',
      nationality: 'NED',
      team: 'Red Bull Racing',
      points: 77,
      wins: 3
    },
    {
      position: 2,
      name: 'Sergio Perez',
      nationality: 'MEX',
      team: 'Red Bull Racing',
      points: 57,
      wins: 1
    },
    {
      position: 3,
      name: 'Charles Leclerc',
      nationality: 'MON',
      team: 'Ferrari',
      points: 40,
      wins: 0
    },
    {
      position: 4,
      name: 'Carlos Sainz',
      nationality: 'ESP',
      team: 'Ferrari',
      points: 38,
      wins: 0
    },
    {
      position: 5,
      name: 'Lewis Hamilton',
      nationality: 'GBR',
      team: 'Mercedes',
      points: 32,
      wins: 0
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
