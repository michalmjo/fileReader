import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SoloLeveling';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.initializeTheme(); // Inicjalizacja motywu przy starcie
  }

  // Zmiana motywu
  changeTheme(theme: string): void {
    this.themeService.changeTheme(theme);
  }
}
