import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageDataService } from '../common/storage-data.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuth = false;
  collapsed = true;
  private userSub: Subscription;

  constructor(private storageService: StorageDataService, private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(userExist => {
      this.isAuth = !!userExist;
    });
  }

  onStoreRecipes() {
    this.storageService.storeData();
  }

  onFetchData() {
    this.storageService.fetchData().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
