import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// Importing themes
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

// Importing translations
import am4lang_lt_LT from "@amcharts/amcharts4/lang/lt_LT";

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-painel-controle',
  templateUrl: './painel-controle.component.html',
  styleUrls: ['./painel-controle.component.css']
})
export class PainelControleComponent implements OnInit {

  

  constructor() { }

  ngOnInit(): void {

    let chart = am4core.create("chartdiv", am4charts.GaugeChart);

    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>()); 
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    let range = axis.axisRanges.create();
    range.value = 0;
    range.endValue = 70;
    range.axisFill.fillOpacity = 1;
    range.axisFill.fill = am4core.color("#88AB75");
    range.axisFill.zIndex = -1;
    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.value = 65;


    let atendidas = am4core.create("chartAtendidas", am4charts.XYChart);
    atendidas.data = [{
        "dia": "seg",
        "qtd": 501
      }, {
        "dia": "ter",
        "qtd": 301
      }, {
        "dia": "qua",
        "qtd": 201
      }, {
        "dia": "qui",
        "qtd": 165
      }, {
        "dia": "sex",
        "qtd": 139
      }, {
        "dia": "sab",
        "qtd": 128
      }, {
        "dia": "dom",
        "qtd": 99
      }];

      let categoryAxis = atendidas.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "dia";
      let valueAxis = atendidas.yAxes.push(new am4charts.ValueAxis());
      let series = atendidas.series.push(new am4charts.ColumnSeries3D());
          series.name = "Ligações Atendidas";
          series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
          series.columns.template.fill = am4core.color("#104547"); // fill
          series.dataFields.valueY = "qtd";
          series.dataFields.categoryX = "dia";


      let transferidas = am4core.create("chartTransferidas", am4charts.XYChart);
      transferidas.data = [{
          "data": "seg",
          "quantidade": 501
        }, {
          "data": "ter",
          "quantidade": 301
        }, {
          "data": "qua",
          "quantidade": 201
        }, {
          "data": "qui",
          "quantidade": 165
        }, {
          "data": "sex",
          "quantidade": 139
        }, {
          "data": "sab",
          "quantidade": 128
        }, {
          "data": "dom",
          "quantidade": 99
        }];

        let transfCAtegoryAxis = transferidas.xAxes.push(new am4charts.CategoryAxis());
        transfCAtegoryAxis.dataFields.category = 'data'
        let transfValueAxis = transferidas.yAxes.push(new am4charts.ValueAxis());
        let transfSeries = transferidas.series.push(new am4charts.ColumnSeries3D())
        transfSeries.name = "Ligações Transferidas";
        transfSeries.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
        transfSeries.columns.template.fill = am4core.color("#E56607"); // fill
        transfSeries.dataFields.valueY = "quantidade";
        transfSeries.dataFields.categoryX = "data";

  }

}
