import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meme-generator',
  templateUrl: './meme-generator.component.html',
  styleUrls: ['./meme-generator.component.scss']
})
export class MemeGeneratorComponent implements OnInit {
  constructor() { 
    console.log('MemeGeneratorComponent constructed');
  }

  ngOnInit(): void {
    console.log('MemeGeneratorComponent initialized');
  }
}