import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/service/theme.service';
import { UserAuthService } from './core/components/auth/service/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SoloLeveling';

  constructor(
    private themeService: ThemeService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.themeService.initializeTheme(); // Inicjalizacja motywu przy starcie
    this.userAuthService.autoLogin();
  }

  // Zmiana motywu
  changeTheme(theme: string): void {
    this.themeService.changeTheme(theme);
  }
}
