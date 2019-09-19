import { Component, OnInit } from '@angular/core';

const CAROUSEL_IMG = [
  { id: 1, src: '../../assets/images/steak.png'},
  { id: 2, src: '../../assets/images/pasta.png'},
  { id: 3, src: '../../assets/images/ramen.png'},
  { id: 4, src: '../../assets/images/pizza.png'},
  // { id: 5, src: '../../assets/images/steak.png'}
];

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public images = [];
  public displayImg = [];

  constructor() { }

  ngOnInit() {
    this.getImages();
  }

  private getImages() {
    this.images = [...CAROUSEL_IMG];
    this.displayImg[0] = this.images[0];

    for (let i = 0; i < this.images.length; i++) {
      let item = this.images[i];
      setInterval(() => {
        this.displayImg.push(item);
        this.displayImg.splice(item - 1, 1);
      }, 5000 * (i + 1));
    }
  }
}
