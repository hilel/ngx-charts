import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
export class CircleComponent {
    constructor() {
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
    }
    onClick() {
        this.select.emit(this.data);
    }
    onMouseEnter() {
        this.activate.emit(this.data);
    }
    onMouseLeave() {
        this.deactivate.emit(this.data);
    }
    ngOnChanges(changes) {
        this.classNames = Array.isArray(this.classNames) ? this.classNames.join(' ') : '';
        this.classNames += 'circle';
    }
}
CircleComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-circle]',
                template: `
    <svg:circle
    title="hidden"
      *ngIf="!hidden"
      [attr.cx]="cx"
      [attr.cy]="cy"
      [attr.r]="r"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      [attr.opacity]="circleOpacity"
      [attr.class]="classNames"
      [attr.pointer-events]="pointerEvents"
    />
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
CircleComponent.propDecorators = {
    cx: [{ type: Input }],
    cy: [{ type: Input }],
    r: [{ type: Input }],
    fill: [{ type: Input }],
    stroke: [{ type: Input }],
    data: [{ type: Input }],
    classNames: [{ type: Input }],
    circleOpacity: [{ type: Input }],
    pointerEvents: [{ type: Input }],
    hidden: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click',] }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vY2lyY2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCxNQUFNLEVBQ04sWUFBWSxFQUVaLHVCQUF1QixFQUN2QixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFvQnZCLE1BQU0sT0FBTyxlQUFlO0lBbEI1QjtRQThCWSxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQXFCNUMsQ0FBQztJQWxCQyxPQUFPO1FBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRixJQUFJLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztJQUM5QixDQUFDOzs7WUFwREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7OztHQWFUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7aUJBRUUsS0FBSztpQkFDTCxLQUFLO2dCQUNMLEtBQUs7bUJBQ0wsS0FBSztxQkFDTCxLQUFLO21CQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzRCQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFFTCxNQUFNO3VCQUNOLE1BQU07eUJBQ04sTUFBTTtzQkFFTixZQUFZLFNBQUMsT0FBTzsyQkFLcEIsWUFBWSxTQUFDLFlBQVk7MkJBS3pCLFlBQVksU0FBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBIb3N0TGlzdGVuZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLWNpcmNsZV0nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmNpcmNsZVxyXG4gICAgdGl0bGU9XCJoaWRkZW5cIlxyXG4gICAgICAqbmdJZj1cIiFoaWRkZW5cIlxyXG4gICAgICBbYXR0ci5jeF09XCJjeFwiXHJcbiAgICAgIFthdHRyLmN5XT1cImN5XCJcclxuICAgICAgW2F0dHIucl09XCJyXCJcclxuICAgICAgW2F0dHIuZmlsbF09XCJmaWxsXCJcclxuICAgICAgW2F0dHIuc3Ryb2tlXT1cInN0cm9rZVwiXHJcbiAgICAgIFthdHRyLm9wYWNpdHldPVwiY2lyY2xlT3BhY2l0eVwiXHJcbiAgICAgIFthdHRyLmNsYXNzXT1cImNsYXNzTmFtZXNcIlxyXG4gICAgICBbYXR0ci5wb2ludGVyLWV2ZW50c109XCJwb2ludGVyRXZlbnRzXCJcclxuICAgIC8+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2lyY2xlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBjeDtcclxuICBASW5wdXQoKSBjeTtcclxuICBASW5wdXQoKSByO1xyXG4gIEBJbnB1dCgpIGZpbGw7XHJcbiAgQElucHV0KCkgc3Ryb2tlO1xyXG4gIEBJbnB1dCgpIGRhdGE7XHJcbiAgQElucHV0KCkgY2xhc3NOYW1lcztcclxuICBASW5wdXQoKSBjaXJjbGVPcGFjaXR5O1xyXG4gIEBJbnB1dCgpIHBvaW50ZXJFdmVudHM7XHJcbiAgQElucHV0KCkgaGlkZGVuOiBib29sZWFuO1xyXG5cclxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxyXG4gIG9uQ2xpY2soKSB7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KHRoaXMuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcclxuICBvbk1vdXNlRW50ZXIoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQodGhpcy5kYXRhKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxyXG4gIG9uTW91c2VMZWF2ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHRoaXMuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLmNsYXNzTmFtZXMgPSBBcnJheS5pc0FycmF5KHRoaXMuY2xhc3NOYW1lcykgPyB0aGlzLmNsYXNzTmFtZXMuam9pbignICcpIDogJyc7XHJcbiAgICB0aGlzLmNsYXNzTmFtZXMgKz0gJ2NpcmNsZSc7XHJcbiAgfVxyXG59XHJcbiJdfQ==