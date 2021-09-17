import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {dia, shapes} from '@clientio/rappid/index';
import {DataService} from '../../services/data.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {DataLine, DataRectangle} from '../../interfaces/content.interface';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  private graph: dia.Graph;
  private paper: dia.Paper;

  private cells: any[] = []
  private prevEl?: any

  constructor(
    public dataService: DataService,
    public dialog: MatDialog,
    public themeService: ThemeService
  ) {
  }

  public ngOnInit(): void {
    this.createGraph()
    this.themeService.isTheme$.subscribe(val => {
      console.log(val)
      this.createGraph(val)
      this.addPaper()
    })
  }

  createGraph(theme: boolean = false) {
    const graph = this.graph = new dia.Graph({}, {cellNamespace: shapes});

    const paper = this.paper = new dia.Paper({
      model: graph,
      gridSize: 5,
      width: 1000,
      height: 800,
      drawGrid: true,
      background: {
        color: theme ? '#000000' : '#ffffff'
      },
      frozen: true,
      async: true,
      cellViewNamespace: shapes
    });

    paper.render()

    this.dataService.getDataElements().subscribe(data => {
      this.renderElements(data, theme)
    })

    this.dataService.getDataLines().subscribe(data => {
      this.renderLines(data, theme)
    })

    paper.on('element:pointerclick', (cellView) => {
      if (cellView.model.isElement()) {
        this.dialog.open(DialogComponent, {
          width: '800px',
          data: {
            name: cellView.model.attributes.attrs.label.text,
          },
        })
      }
    });
  }

  public ngAfterViewInit(): void {
    const {paper, canvas} = this;
    this.prevEl = this.paper.el
    canvas.nativeElement.appendChild(this.paper.el);
    paper.unfreeze();
  }

  addPaper() {
    const {paper, canvas} = this;
    canvas.nativeElement.removeChild(this.prevEl)
    this.prevEl = this.paper.el
    canvas.nativeElement.appendChild(this.paper.el);
    paper.unfreeze();
  }

  renderElements(data: DataRectangle[], theme: boolean = false): void {
    for (let item of data) {
      const rect = new shapes.standard.Rectangle({
        id: item.id,
        position: {x: item.position.x, y: item.position.y},
        size: {width: item.size.width, height: 50},
        attrs: {
          body: {
            stroke: theme ? '#ffffff' : '#000000',
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

  renderLines(data: DataLine[], theme: boolean = false): void {
    for (let item of data) {
      if (typeof item.to !== 'number') {
        item.to.forEach((i: number) => {
          this.templateLine(item.from, i, theme)
        })
      }
      if (typeof item.from !== 'number') {
        {
          item.from.forEach((i: number) => {
            this.templateLine(i, item.to, theme)
          })
        }
      }
    }
  }

  templateLine(from: any, to: any, theme: boolean): void {
    const link = new shapes.standard.Link({
      source: this.cells.filter(v => v.id === from)[0],
      target: this.cells.filter(v => v.id === to)[0],
      attrs: {
        line: {
          stroke: theme ? '#ffffff' : '#000000'
        }
      }
    });
    this.graph.addCell(link)
  }
}
