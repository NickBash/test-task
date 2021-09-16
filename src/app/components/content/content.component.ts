import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {dia, shapes, ui} from '@clientio/rappid/index';
import {DataService} from '../../services/data.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {DataLine, DataRectangle} from '../../interfaces/content.interface';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  private graph: dia.Graph;
  private paper: dia.Paper;
  private scroller: ui.PaperScroller;

  private cells: any[] = []

  constructor(
    public dataService: DataService,
    public dialog: MatDialog,
  ) {
  }

  public ngOnInit(): void {
    const graph = this.graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = this.paper = new dia.Paper({
      model: graph,
      gridSize: 5,
      width: 600,
      height: 800,
      drawGrid: true,
      background: {
        color: '#F8F9FA',
      },
      frozen: true,
      async: true,
      cellViewNamespace: shapes
    });

    const scroller = this.scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: 'grab'
    });

    scroller.render();

    this.dataService.getDataElements().subscribe(data => {
      this.renderElements(data)
    })

    this.dataService.getDataLines().subscribe(data => {
      this.renderLines(data)
    })

    paper.on('element:pointerclick', (cellView) => {
      if (cellView.model.isElement()) {
        this.dialog.open(DialogComponent, {
          width: '800px',
          data: {
            name: cellView.model.attributes.attrs.label.text,
          }
        })
      }
    });
  }

  public ngAfterViewInit(): void {
    const { scroller, paper, canvas } = this;
    canvas.nativeElement.appendChild(this.scroller.el);
    scroller.center();
    paper.unfreeze();
  }

  renderElements(data: DataRectangle[]): void {
    for (let item of data) {
      const rect = new shapes.standard.Rectangle({
        id: item.id,
        position: { x: item.position.x, y: item.position.y },
        size: {width: item.size.width, height: 50},
        attrs: {
          body: {
            cursor: 'pointer',
            fill: 'blue',
            rx: 5,
            ry: 5,
          },
          label: {
            cursor: 'pointer',
            text: item.label,
            fill: 'white',
          },
        }
      });

      this.graph.addCell(rect);
      this.cells.push(rect);
    }
  }

  renderLines(data: any): void {
    console.log(data)
    for (let item of data) {
      if (typeof item.from === 'number') {
        item.to.forEach((i: number) => {
          this.templateLine(item.from, i)
        })
      } else {
        item.from.forEach((i: number) => {
          this.templateLine(i, item.to)
        })
      }
    }
  }

  templateLine(from: any, to: any): void {
    const link = new shapes.standard.Link({
      source: this.cells.filter(v => v.id === from)[0],
      target: this.cells.filter(v => v.id === to)[0],
    });
    this.graph.addCell(link)
  }
}
