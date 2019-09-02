import { Component, OnInit } from '@angular/core';
import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'plain-cook';
  public loadedFeature = 'recipe';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
  }
}
