import { Component, OnInit } from '@angular/core';

interface Constructor {
  position: number;
  name: string;
  nationality: string;
  points: number;
  wins: number;
}

@Component({
  selector: 'app-constructors-standings',
  template: `
    <div class="standings-card">
      <h2>Constructors Championship</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Constructor</th>
            <th>Nationality</th>
            <th>Points</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let constructor of constructors">
            <td>{{constructor.position}}</td>
            <td>{{constructor.name}}</td>
            <td>{{constructor.nationality}}</td>
            <td>{{constructor.points}}</td>
            <td>{{constructor.wins}}</td>
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
export class ConstructorsStandingsComponent implements OnInit {
  constructors: Constructor[] = [
    {
      position: 1,
      name: 'Red Bull Racing',
      nationality: 'AUT',
      points: 134,
      wins: 4
    },
    {
      position: 2,
      name: 'Ferrari',
      nationality: 'ITA',
      points: 78,
      wins: 0
    },
    {
      position: 3,
      name: 'Mercedes',
      nationality: 'GER',
      points: 60,
      wins: 0
    },
    {
      position: 4,
      name: 'McLaren',
      nationality: 'GBR',
      points: 28,
      wins: 0
    },
    {
      position: 5,
      name: 'Aston Martin',
      nationality: 'GBR',
      points: 25,
      wins: 0
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
