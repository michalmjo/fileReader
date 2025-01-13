import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'theme'; // Klucz w localStorage
  constructor() {}

  // Zmieniamy motyw i zapisujemy go w localStorage
  changeTheme(theme: string): void {
    // Zapisz motyw w localStorage
    localStorage.setItem(this.themeKey, theme);

    // Zastosuj motyw w document.documentElement
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Pobierz motyw z localStorage
  getSavedTheme(): string | null {
    return localStorage.getItem(this.themeKey);
  }

  // Inicjalizowanie motywu przy starcie aplikacji
  initializeTheme(): void {
    const savedTheme = this.getSavedTheme();

    if (savedTheme) {
      this.changeTheme(savedTheme); // Jeśli jest zapisany motyw, użyj go
    } else {
      this.changeTheme('light'); // Domyślny motyw
    }
  }
}
