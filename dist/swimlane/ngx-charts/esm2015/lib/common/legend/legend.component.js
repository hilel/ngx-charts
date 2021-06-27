import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { formatLabel } from '../label.helper';
export class LegendComponent {
    constructor(cd) {
        this.cd = cd;
        this.horizontal = false;
        this.labelClick = new EventEmitter();
        this.labelActivate = new EventEmitter();
        this.labelDeactivate = new EventEmitter();
        this.labelToggle = new EventEmitter();
        this.legendEntries = [];
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.cd.markForCheck();
        this.legendEntries = this.getLegendEntries();
    }
    getLegendEntries() {
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
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.label === d.name;
        });
        return item !== undefined;
    }
    isHidden(entry) {
        if (!this.hiddenEntries)
            return false;
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
        this.labelToggle.emit(item);
    }
    trackBy(index, item) {
        return item.label;
    }
}
LegendComponent.decorators = [
    { type: Component, args: [{
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
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".chart-legend{display:inline-block;padding:0;width:auto!important}.chart-legend .legend-title{font-size:14px;font-weight:700;margin-bottom:5px;margin-left:10px;overflow:hidden;white-space:nowrap}.chart-legend li,.chart-legend ul{list-style:none;margin:0;padding:0}.chart-legend .horizontal-legend li{display:inline-block}.chart-legend .legend-wrap{width:calc(100% - 10px)}.chart-legend .legend-labels{background:rgba(0,0,0,.05);border-radius:3px;float:left;line-height:85%;list-style:none;overflow-x:hidden;overflow-y:auto;text-align:left;white-space:nowrap;width:100%}.chart-legend .legend-label{color:#afb7c8;cursor:pointer;font-size:90%;margin:8px}.chart-legend .legend-label:hover{color:#000;transition:.2s}.chart-legend .legend-label .active .legend-label-text{color:#000}.chart-legend .legend-label-color{border-radius:3px;color:#5b646b;display:inline-block;height:15px;margin-right:5px;width:15px}.chart-legend .legend-label-text{font-size:12px;line-height:15px;vertical-align:top;width:calc(100% - 20px)}.chart-legend .legend-label-text,.chart-legend .legend-title-text{display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chart-legend .legend-title-text{line-height:16px;vertical-align:bottom}"]
            },] }
];
LegendComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
LegendComponent.propDecorators = {
    data: [{ type: Input }],
    title: [{ type: Input }],
    colors: [{ type: Input }],
    height: [{ type: Input }],
    width: [{ type: Input }],
    activeEntries: [{ type: Input }],
    hiddenEntries: [{ type: Input }],
    horizontal: [{ type: Input }],
    labelClick: [{ type: Output }],
    labelActivate: [{ type: Output }],
    labelDeactivate: [{ type: Output }],
    labelToggle: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnZW5kLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vbGVnZW5kL2xlZ2VuZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFDTixZQUFZLEVBR1osaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFnQzlDLE1BQU0sT0FBTyxlQUFlO0lBaUIxQixZQUFvQixFQUFxQjtRQUFyQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVRoQyxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBRWxCLGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuRCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RELG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDeEQsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU5RCxrQkFBYSxHQUFVLEVBQUUsQ0FBQztJQUVrQixDQUFDO0lBRTdDLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVqQixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDN0IsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlCLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxjQUFjLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDZCxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUNULEtBQUs7b0JBQ0wsY0FBYztvQkFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2lCQUNuQyxDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQUs7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QyxPQUFPLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQztJQUM1QixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQUs7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QyxPQUFPLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQztJQUM1QixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQUk7UUFDWCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsVUFBVSxDQUFDLElBQUk7UUFDYixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUk7UUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3QixDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDOzs7WUE5R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1QlQ7Z0JBRUQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7O1lBbENDLGlCQUFpQjs7O21CQW9DaEIsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSztvQkFDTCxLQUFLOzRCQUNMLEtBQUs7NEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUVMLE1BQU07NEJBQ04sTUFBTTs4QkFDTixNQUFNOzBCQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZvcm1hdExhYmVsIH0gZnJvbSAnLi4vbGFiZWwuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1sZWdlbmQnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2IFtzdHlsZS53aWR0aC5weF09XCJ3aWR0aFwiPlxyXG4gICAgICA8aGVhZGVyIGNsYXNzPVwibGVnZW5kLXRpdGxlXCIgKm5nSWY9XCJ0aXRsZT8ubGVuZ3RoID4gMFwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwibGVnZW5kLXRpdGxlLXRleHRcIj57eyB0aXRsZSB9fTwvc3Bhbj5cclxuICAgICAgPC9oZWFkZXI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJsZWdlbmQtd3JhcFwiPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cImxlZ2VuZC1sYWJlbHNcIiBbY2xhc3MuaG9yaXpvbnRhbC1sZWdlbmRdPVwiaG9yaXpvbnRhbFwiIFtzdHlsZS5tYXgtaGVpZ2h0LnB4XT1cImhlaWdodCAtIDQ1XCI+XHJcbiAgICAgICAgICA8bGkgKm5nRm9yPVwibGV0IGVudHJ5IG9mIGxlZ2VuZEVudHJpZXM7IHRyYWNrQnk6IHRyYWNrQnlcIiBjbGFzcz1cImxlZ2VuZC1sYWJlbFwiIFtzdHlsZS5vcGFjaXR5XT1cImlzSGlkZGVuKGVudHJ5KSA/ICcwLjInIDogJydcIj5cclxuICAgICAgICAgICAgPG5neC1jaGFydHMtbGVnZW5kLWVudHJ5XHJcbiAgICAgICAgICAgICAgW2xhYmVsXT1cImVudHJ5LmxhYmVsXCJcclxuICAgICAgICAgICAgICBbZm9ybWF0dGVkTGFiZWxdPVwiZW50cnkuZm9ybWF0dGVkTGFiZWxcIlxyXG4gICAgICAgICAgICAgIFtjb2xvcl09XCJlbnRyeS5jb2xvclwiXHJcbiAgICAgICAgICAgICAgW2lzQWN0aXZlXT1cImlzQWN0aXZlKGVudHJ5KVwiXHJcbiAgICAgICAgICAgICAgKHNlbGVjdCk9XCJsYWJlbENsaWNrLmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAgICAgICAgIChkZWFjdGl2YXRlKT1cImRlYWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgKHRvZ2dsZSk9XCJ0b2dnbGUoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgPC9uZ3gtY2hhcnRzLWxlZ2VuZC1lbnRyeT5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlVXJsczogWycuL2xlZ2VuZC5jb21wb25lbnQuc2NzcyddLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIExlZ2VuZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSB0aXRsZTtcclxuICBASW5wdXQoKSBjb2xvcnM7XHJcbiAgQElucHV0KCkgaGVpZ2h0O1xyXG4gIEBJbnB1dCgpIHdpZHRoO1xyXG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM7XHJcbiAgQElucHV0KCkgaGlkZGVuRW50cmllcztcclxuICBASW5wdXQoKSBob3Jpem9udGFsID0gZmFsc2U7XHJcblxyXG4gIEBPdXRwdXQoKSBsYWJlbENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgbGFiZWxBY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGxhYmVsRGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGxhYmVsVG9nZ2xlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgbGVnZW5kRW50cmllczogYW55W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgdGhpcy5sZWdlbmRFbnRyaWVzID0gdGhpcy5nZXRMZWdlbmRFbnRyaWVzKCk7XHJcbiAgfVxyXG5cclxuICBnZXRMZWdlbmRFbnRyaWVzKCk6IGFueVtdIHtcclxuICAgIGNvbnN0IGl0ZW1zID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCBsYWJlbCBvZiB0aGlzLmRhdGEpIHtcclxuICAgICAgY29uc3QgZm9ybWF0dGVkTGFiZWwgPSBmb3JtYXRMYWJlbChsYWJlbCk7XHJcblxyXG4gICAgICBjb25zdCBpZHggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGkubGFiZWwgPT09IGZvcm1hdHRlZExhYmVsO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChpZHggPT09IC0xKSB7XHJcbiAgICAgICAgaXRlbXMucHVzaCh7XHJcbiAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgIGZvcm1hdHRlZExhYmVsLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3JzLmdldENvbG9yKGxhYmVsKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGl0ZW1zO1xyXG4gIH1cclxuXHJcbiAgaXNBY3RpdmUoZW50cnkpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmVFbnRyaWVzKSByZXR1cm4gZmFsc2U7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmQoZCA9PiB7XHJcbiAgICAgIHJldHVybiBlbnRyeS5sYWJlbCA9PT0gZC5uYW1lO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXRlbSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgaXNIaWRkZW4oZW50cnkpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5oaWRkZW5FbnRyaWVzKSByZXR1cm4gZmFsc2U7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5oaWRkZW5FbnRyaWVzLmZpbmQoZCA9PiB7XHJcbiAgICAgIHJldHVybiBlbnRyeS5sYWJlbCA9PT0gZC5uYW1lO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXRlbSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICBcclxuICBhY3RpdmF0ZShpdGVtKSB7XHJcbiAgICB0aGlzLmxhYmVsQWN0aXZhdGUuZW1pdChpdGVtKTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoaXRlbSkge1xyXG4gICAgdGhpcy5sYWJlbERlYWN0aXZhdGUuZW1pdChpdGVtKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZShpdGVtKSB7XHJcbiAgICB0aGlzLmxhYmVsVG9nZ2xlLmVtaXQoaXRlbSlcclxuICB9XHJcblxyXG4gIHRyYWNrQnkoaW5kZXgsIGl0ZW0pOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGl0ZW0ubGFiZWw7XHJcbiAgfVxyXG59XHJcbiJdfQ==