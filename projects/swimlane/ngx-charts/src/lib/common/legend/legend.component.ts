import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { formatLabel } from '../label.helper';

@Component({
  selector: 'ngx-charts-legend',
  template: `
    <div [style.width.px]="width">
      <header class="legend-title" *ngIf="title?.length > 0">
        <span class="legend-title-text">{{ title }}</span>
      </header>
      <div class="legend-wrap">
        <ul class="legend-labels" [class.horizontal-legend]="horizontal" [style.max-height.px]="height - 45">
          <li *ngFor="let entry of legendEntries; trackBy: trackBy" class="legend-label" [style.opacity]="isHidden(entry) ? '0.2' : ''">
            <ngx-charts-legend-entry
              [label]="entry.label"
              [formattedLabel]="entry.formattedLabel"
              [color]="entry.color"
              [isActive]="isActive(entry)"
              (select)="labelClick.emit($event)"
              (activate)="activate($event)"
              (deactivate)="deactivate($event)"
              (toggle)="toggle($event)"
            >
            </ngx-charts-legend-entry>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./legend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent implements OnChanges {
  @Input() data;
  @Input() title;
  @Input() colors;
  @Input() height;
  @Input() width;
  @Input() activeEntries;
  @Input() hiddenEntries;
  @Input() horizontal = false;

  @Output() labelClick: EventEmitter<any> = new EventEmitter();
  @Output() labelActivate: EventEmitter<any> = new EventEmitter();
  @Output() labelDeactivate: EventEmitter<any> = new EventEmitter();
  @Output() labelToggle: EventEmitter<any> = new EventEmitter();

  legendEntries: any[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.cd.markForCheck();
    this.legendEntries = this.getLegendEntries();
  }

  getLegendEntries(): any[] {
    const items = [];

    for (const label of this.data) {
      const formattedLabel = formatLabel(label);

      const idx = items.findIndex(i => {
        return i.label === formattedLabel;
      });

      if (idx === -1) {
        items.push({
          label,
          formattedLabel,
          color: this.colors.getColor(label)
        });
      }
    }

    return items;
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {
      return entry.label === d.name;
    });
    return item !== undefined;
  }

  isHidden(entry): boolean {
    if (!this.hiddenEntries) return false;
    const item = this.hiddenEntries.find(d => {
      return entry.label === d.name;
    });
    return item !== undefined;
  }
  
  activate(item) {
    this.labelActivate.emit(item);
  }

  deactivate(item) {
    this.labelDeactivate.emit(item);
  }

  toggle(item) {
    this.labelToggle.emit(item)
  }

  trackBy(index, item): string {
    return item.label;
  }
}
