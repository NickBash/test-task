import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {dia, shapes} from 'jointjs';
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
  private theme: boolean = false

  constructor(
    public dataService: DataService,
    public dialog: MatDialog,
    public themeService: ThemeService
  ) {
  }

  public ngOnInit(): void {
    this.createGraph()
    this.subscribeTheme()
  }

  subscribeTheme() {
    this.themeService.isTheme$.subscribe(val => {
      this.theme = val
      val ? this.paper.drawBackground({color: '#000000'}) : this.paper.drawBackground({color: '#ffffff'})

      this.graph.getCells().forEach(v => {
          v.attr('body/stroke', val ? '#ffffff' : '#000000')
          v.findView(this.paper)
        }
      )

      this.graph.getLinks().forEach(v => {
          v.attr('line/stroke', val ? '#ffffff' : '#000000')
          v.findView(this.paper)
        }
      )
    })
  }

  createGraph(theme: boolean = false) {
    const graph = this.graph = new dia.Graph({}, {cellNamespace: shapes});

    const paper = this.paper = new dia.Paper({
      model: graph,
      gridSize: 5,
      width: '100%',
      height: '100vh',
      background: {
        color: theme ? '#000000' : '#ffffff'
      },
      frozen: true,
      async: true,
      cellViewNamespace: shapes
    });

    this.dataService.getDataElements().subscribe(data => {
      this.renderElements(data, theme)
    })

    this.dataService.getDataLines().subscribe(data => {
      this.renderLines(data, theme)
    })

    paper.render()

    paper.on('element:pointerclick', (cellView) => {
      if (cellView.model.isElement()) {
        this.dialog.open(DialogComponent, {
          panelClass: this.theme ? 'darkMode' : '',
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
    if (this.paper && this.graph) {
      canvas.nativeElement.appendChild(this.paper.el);
      paper.unfreeze();
    }
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
      this.templateLine(item.from, item.to, theme)
    }
  }

  templateLine(from: number, to: number, theme: boolean): void {
    if (this.cells.length > 0) {
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
}
