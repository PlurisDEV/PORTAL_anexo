import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  imgBanner: string = "../../assets/img/pluris_midia_logo.png"
  constructor() { }

  ngOnInit(): void {
  }

}
