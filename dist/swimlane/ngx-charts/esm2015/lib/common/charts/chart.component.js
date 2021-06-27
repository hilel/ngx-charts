import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { TooltipService } from '../tooltip/tooltip.service';
export class ChartComponent {
    constructor() {
        this.showLegend = false;
        this.animations = true;
        this.legendLabelClick = new EventEmitter();
        this.legendLabelActivate = new EventEmitter();
        this.legendLabelDeactivate = new EventEmitter();
        this.legendLabelToggle = new EventEmitter();
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        let legendColumns = 0;
        if (this.showLegend) {
            this.legendType = this.getLegendType();
            if (!this.legendOptions || this.legendOptions.position === 'right') {
                if (this.legendType === 'scaleLegend') {
                    legendColumns = 1;
                }
                else {
                    legendColumns = 2;
                }
            }
        }
        const chartColumns = 12 - legendColumns;
        this.chartWidth = Math.floor((this.view[0] * chartColumns) / 12.0);
        this.legendWidth =
            !this.legendOptions || this.legendOptions.position === 'right'
                ? Math.floor((this.view[0] * legendColumns) / 12.0)
                : this.chartWidth;
    }
    getLegendType() {
        if (this.legendOptions.scaleType === 'linear') {
            return 'scaleLegend';
        }
        else {
            return 'legend';
        }
    }
}
ChartComponent.decorators = [
    { type: Component, args: [{
                providers: [TooltipService],
                selector: 'ngx-charts-chart',
                template: `
    <div class="ngx-charts-outer" [style.width.px]="view[0]" [@animationState]="'active'" [@.disabled]="!animations">
      <svg class="ngx-charts" [attr.width]="chartWidth" [attr.height]="view[1]">
        <ng-content></ng-content>
      </svg>
      <ngx-charts-scale-legend
        *ngIf="showLegend && legendType === 'scaleLegend'"
        class="chart-legend"
        [horizontal]="legendOptions && legendOptions.position === 'below'"
        [valueRange]="legendOptions.domain"
        [colors]="legendOptions.colors"
        [height]="view[1]"
        [width]="legendWidth"
      >
      </ngx-charts-scale-legend>
      <ngx-charts-legend
        *ngIf="showLegend && legendType === 'legend'"
        class="chart-legend"
        [horizontal]="legendOptions && legendOptions.position === 'below'"
        [data]="legendOptions.domain"
        [title]="legendOptions.title"
        [colors]="legendOptions.colors"
        [height]="view[1]"
        [width]="legendWidth"
        [activeEntries]="activeEntries"
        [hiddenEntries]="hiddenEntries"
        (labelClick)="legendLabelClick.emit($event)"
        (labelActivate)="legendLabelActivate.emit($event)"
        (labelDeactivate)="legendLabelDeactivate.emit($event)"
        (labelDeactivate)="legendLabelDeactivate.emit($event)"
        (labelToggle)="legendLabelToggle.emit($event)"
      >
      </ngx-charts-legend>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition(':enter', [style({ opacity: 0 }), animate('500ms 100ms', style({ opacity: 1 }))])
                    ])
                ]
            },] }
];
ChartComponent.propDecorators = {
    view: [{ type: Input }],
    showLegend: [{ type: Input }],
    legendOptions: [{ type: Input }],
    data: [{ type: Input }],
    legendData: [{ type: Input }],
    legendType: [{ type: Input }],
    colors: [{ type: Input }],
    activeEntries: [{ type: Input }],
    hiddenEntries: [{ type: Input }],
    animations: [{ type: Input }],
    legendLabelClick: [{ type: Output }],
    legendLabelActivate: [{ type: Output }],
    legendLabelDeactivate: [{ type: Output }],
    legendLabelToggle: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2NvbW1vbi9jaGFydHMvY2hhcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUVMLHVCQUF1QixFQUN2QixZQUFZLEVBQ1osTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUErQzVELE1BQU0sT0FBTyxjQUFjO0lBN0MzQjtRQStDVyxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBVW5CLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFMUIscUJBQWdCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDekQsd0JBQW1CLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUQsMEJBQXFCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUQsc0JBQWlCLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUF3Q3RFLENBQUM7SUFsQ0MsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO2dCQUNsRSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssYUFBYSxFQUFFO29CQUNyQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQjtxQkFBTTtvQkFDTCxhQUFhLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQjthQUNGO1NBQ0Y7UUFFRCxNQUFNLFlBQVksR0FBRyxFQUFFLEdBQUcsYUFBYSxDQUFDO1FBRXhDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFdBQVc7WUFDZCxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssT0FBTztnQkFDNUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDeEIsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUM3QyxPQUFPLGFBQWEsQ0FBQztTQUN0QjthQUFNO1lBQ0wsT0FBTyxRQUFRLENBQUM7U0FDakI7SUFDSCxDQUFDOzs7WUFyR0YsU0FBUyxTQUFDO2dCQUNULFNBQVMsRUFBRSxDQUFDLGNBQWMsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0NUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxVQUFVLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLGdCQUFnQixFQUFFO3dCQUN4QixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzdGLENBQUM7aUJBQ0g7YUFDRjs7O21CQUVFLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLO21CQUdMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLO3lCQUNMLEtBQUs7K0JBRUwsTUFBTTtrQ0FDTixNQUFNO29DQUNOLE1BQU07Z0NBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgT3V0cHV0LFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgdHJpZ2dlciwgc3R5bGUsIGFuaW1hdGUsIHRyYW5zaXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgVG9vbHRpcFNlcnZpY2UgfSBmcm9tICcuLi90b29sdGlwL3Rvb2x0aXAuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBwcm92aWRlcnM6IFtUb29sdGlwU2VydmljZV0sXHJcbiAgc2VsZWN0b3I6ICduZ3gtY2hhcnRzLWNoYXJ0JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cIm5neC1jaGFydHMtb3V0ZXJcIiBbc3R5bGUud2lkdGgucHhdPVwidmlld1swXVwiIFtAYW5pbWF0aW9uU3RhdGVdPVwiJ2FjdGl2ZSdcIiBbQC5kaXNhYmxlZF09XCIhYW5pbWF0aW9uc1wiPlxyXG4gICAgICA8c3ZnIGNsYXNzPVwibmd4LWNoYXJ0c1wiIFthdHRyLndpZHRoXT1cImNoYXJ0V2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwidmlld1sxXVwiPlxyXG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICAgICAgPC9zdmc+XHJcbiAgICAgIDxuZ3gtY2hhcnRzLXNjYWxlLWxlZ2VuZFxyXG4gICAgICAgICpuZ0lmPVwic2hvd0xlZ2VuZCAmJiBsZWdlbmRUeXBlID09PSAnc2NhbGVMZWdlbmQnXCJcclxuICAgICAgICBjbGFzcz1cImNoYXJ0LWxlZ2VuZFwiXHJcbiAgICAgICAgW2hvcml6b250YWxdPVwibGVnZW5kT3B0aW9ucyAmJiBsZWdlbmRPcHRpb25zLnBvc2l0aW9uID09PSAnYmVsb3cnXCJcclxuICAgICAgICBbdmFsdWVSYW5nZV09XCJsZWdlbmRPcHRpb25zLmRvbWFpblwiXHJcbiAgICAgICAgW2NvbG9yc109XCJsZWdlbmRPcHRpb25zLmNvbG9yc1wiXHJcbiAgICAgICAgW2hlaWdodF09XCJ2aWV3WzFdXCJcclxuICAgICAgICBbd2lkdGhdPVwibGVnZW5kV2lkdGhcIlxyXG4gICAgICA+XHJcbiAgICAgIDwvbmd4LWNoYXJ0cy1zY2FsZS1sZWdlbmQ+XHJcbiAgICAgIDxuZ3gtY2hhcnRzLWxlZ2VuZFxyXG4gICAgICAgICpuZ0lmPVwic2hvd0xlZ2VuZCAmJiBsZWdlbmRUeXBlID09PSAnbGVnZW5kJ1wiXHJcbiAgICAgICAgY2xhc3M9XCJjaGFydC1sZWdlbmRcIlxyXG4gICAgICAgIFtob3Jpem9udGFsXT1cImxlZ2VuZE9wdGlvbnMgJiYgbGVnZW5kT3B0aW9ucy5wb3NpdGlvbiA9PT0gJ2JlbG93J1wiXHJcbiAgICAgICAgW2RhdGFdPVwibGVnZW5kT3B0aW9ucy5kb21haW5cIlxyXG4gICAgICAgIFt0aXRsZV09XCJsZWdlbmRPcHRpb25zLnRpdGxlXCJcclxuICAgICAgICBbY29sb3JzXT1cImxlZ2VuZE9wdGlvbnMuY29sb3JzXCJcclxuICAgICAgICBbaGVpZ2h0XT1cInZpZXdbMV1cIlxyXG4gICAgICAgIFt3aWR0aF09XCJsZWdlbmRXaWR0aFwiXHJcbiAgICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXHJcbiAgICAgICAgW2hpZGRlbkVudHJpZXNdPVwiaGlkZGVuRW50cmllc1wiXHJcbiAgICAgICAgKGxhYmVsQ2xpY2spPVwibGVnZW5kTGFiZWxDbGljay5lbWl0KCRldmVudClcIlxyXG4gICAgICAgIChsYWJlbEFjdGl2YXRlKT1cImxlZ2VuZExhYmVsQWN0aXZhdGUuZW1pdCgkZXZlbnQpXCJcclxuICAgICAgICAobGFiZWxEZWFjdGl2YXRlKT1cImxlZ2VuZExhYmVsRGVhY3RpdmF0ZS5lbWl0KCRldmVudClcIlxyXG4gICAgICAgIChsYWJlbERlYWN0aXZhdGUpPVwibGVnZW5kTGFiZWxEZWFjdGl2YXRlLmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgICAgKGxhYmVsVG9nZ2xlKT1cImxlZ2VuZExhYmVsVG9nZ2xlLmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgID5cclxuICAgICAgPC9uZ3gtY2hhcnRzLWxlZ2VuZD5cclxuICAgIDwvZGl2PlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgYW5pbWF0aW9uczogW1xyXG4gICAgdHJpZ2dlcignYW5pbWF0aW9uU3RhdGUnLCBbXHJcbiAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIFtzdHlsZSh7IG9wYWNpdHk6IDAgfSksIGFuaW1hdGUoJzUwMG1zIDEwMG1zJywgc3R5bGUoeyBvcGFjaXR5OiAxIH0pKV0pXHJcbiAgICBdKVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIENoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSB2aWV3O1xyXG4gIEBJbnB1dCgpIHNob3dMZWdlbmQgPSBmYWxzZTtcclxuICBASW5wdXQoKSBsZWdlbmRPcHRpb25zOiBhbnk7XHJcblxyXG4gIC8vIHJlbW92ZVxyXG4gIEBJbnB1dCgpIGRhdGE7XHJcbiAgQElucHV0KCkgbGVnZW5kRGF0YTtcclxuICBASW5wdXQoKSBsZWdlbmRUeXBlOiBhbnk7XHJcbiAgQElucHV0KCkgY29sb3JzOiBhbnk7XHJcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W107XHJcbiAgQElucHV0KCkgaGlkZGVuRW50cmllczogYW55W107XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBsZWdlbmRMYWJlbENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgbGVnZW5kTGFiZWxBY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGxlZ2VuZExhYmVsRGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGxlZ2VuZExhYmVsVG9nZ2xlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgY2hhcnRXaWR0aDogYW55O1xyXG4gIHRpdGxlOiBhbnk7XHJcbiAgbGVnZW5kV2lkdGg6IGFueTtcclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIGxldCBsZWdlbmRDb2x1bW5zID0gMDtcclxuICAgIGlmICh0aGlzLnNob3dMZWdlbmQpIHtcclxuICAgICAgdGhpcy5sZWdlbmRUeXBlID0gdGhpcy5nZXRMZWdlbmRUeXBlKCk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMubGVnZW5kT3B0aW9ucyB8fCB0aGlzLmxlZ2VuZE9wdGlvbnMucG9zaXRpb24gPT09ICdyaWdodCcpIHtcclxuICAgICAgICBpZiAodGhpcy5sZWdlbmRUeXBlID09PSAnc2NhbGVMZWdlbmQnKSB7XHJcbiAgICAgICAgICBsZWdlbmRDb2x1bW5zID0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGVnZW5kQ29sdW1ucyA9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2hhcnRDb2x1bW5zID0gMTIgLSBsZWdlbmRDb2x1bW5zO1xyXG5cclxuICAgIHRoaXMuY2hhcnRXaWR0aCA9IE1hdGguZmxvb3IoKHRoaXMudmlld1swXSAqIGNoYXJ0Q29sdW1ucykgLyAxMi4wKTtcclxuICAgIHRoaXMubGVnZW5kV2lkdGggPVxyXG4gICAgICAhdGhpcy5sZWdlbmRPcHRpb25zIHx8IHRoaXMubGVnZW5kT3B0aW9ucy5wb3NpdGlvbiA9PT0gJ3JpZ2h0J1xyXG4gICAgICAgID8gTWF0aC5mbG9vcigodGhpcy52aWV3WzBdICogbGVnZW5kQ29sdW1ucykgLyAxMi4wKVxyXG4gICAgICAgIDogdGhpcy5jaGFydFdpZHRoO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGVnZW5kVHlwZSgpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRoaXMubGVnZW5kT3B0aW9ucy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIHJldHVybiAnc2NhbGVMZWdlbmQnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICdsZWdlbmQnO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=