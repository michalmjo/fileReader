import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { UserAuthService } from '../auth/service/user-auth.service';
import { Subscription } from 'rxjs';
import { appUser } from '../auth/interface/appUser';
import { User } from '../auth/service/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub?: Subscription;
  isAuth: boolean = false;
  constructor(
    private themeService: ThemeService,
    private userAuth: UserAuthService
  ) {}
  theme = this.themeService.getSavedTheme();

  ngOnInit(): void {
    this.themeService.initializeTheme();

    this.userSub = this.userAuth.user.subscribe(
      (user) => (this.isAuth = !!user)
    );
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onLogOut() {
    this.userAuth.logout();
  }

  // Zmiana motywu
  changeTheme(): void {
    const change = (this.theme = this.theme === 'dark' ? 'light' : 'dark');
    console.log(change);
    this.themeService.changeTheme(change);
  }
}
