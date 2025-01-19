import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private themeService: ThemeService) {}
  theme = this.themeService.getSavedTheme();

  ngOnInit(): void {
    this.themeService.initializeTheme();
  }

  // Zmiana motywu
  changeTheme(): void {
    const change = (this.theme = this.theme === 'dark' ? 'light' : 'dark');
    console.log(change);
    this.themeService.changeTheme(change);
  }
}
