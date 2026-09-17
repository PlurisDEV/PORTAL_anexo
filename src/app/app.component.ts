import {Component, ViewChild, OnInit} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import * as firebase from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pnr';
  @ViewChild(MatAccordion) accordion: MatAccordion;
  showFiller = false;

  ngOnInit(): void{
    var firebaseConfig = {
      apiKey: "AIzaSyCGBDRJN1QXl6qbODi2ni0xsMGjYHphonE",
      authDomain: "mtg-grinder-statistics.firebaseapp.com",
      databaseURL: "https://mtg-grinder-statistics.firebaseio.com",
      projectId: "mtg-grinder-statistics",
      storageBucket: "mtg-grinder-statistics.appspot.com",
      messagingSenderId: "281743106156",
      appId: "1:281743106156:web:dc2ce525648a874670b849",
      measurementId: "G-GLCD13QGQ8"
    };
    firebase.initializeApp(firebaseConfig)
  }
}
