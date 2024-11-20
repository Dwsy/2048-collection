import { Component } from '@angular/core';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameComponent],
  template: `
    <app-game></app-game>
  `,
  styles: []
})
export class AppComponent {
  title = '2048-angular';
}