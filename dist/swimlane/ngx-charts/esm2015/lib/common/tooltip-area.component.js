import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { createMouseEvent } from '../events';
export class TooltipArea {
    constructor() {
        this.anchorOpacity = 0;
        this.anchorPos = -1;
        this.anchorValues = [];
        this.showPercentage = false;
        this.tooltipDisabled = false;
        this.hover = new EventEmitter();
    }
    getValues(xVal) {
        const results = [];
        for (const group of this.results) {
            if (this.isHidden({ name: group.name })) {
                continue;
            }
            const item = group.series.find(d => d.name.toString() === xVal.toString());
            let groupName = group.name;
            if (groupName instanceof Date) {
                groupName = groupName.toLocaleDateString();
            }
            if (item) {
                const label = item.name;
                let val = item.value;
                if (this.showPercentage) {
                    val = (item.d1 - item.d0).toFixed(2) + '%';
                }
                let color;
                if (this.colors.scaleType === 'linear') {
                    let v = val;
                    if (item.d1) {
                        v = item.d1;
                    }
                    color = this.colors.getColor(v);
                }
                else {
                    color = this.colors.getColor(group.name);
                }
                const data = Object.assign({}, item, {
                    value: val,
                    name: label,
                    series: groupName,
                    min: item.min,
                    max: item.max,
                    color
                });
                results.push(data);
            }
        }
        return results;
    }
    mouseMove(event) {
        const xPos = event.pageX - event.target.getBoundingClientRect().left;
        const closestIndex = this.findClosestPointIndex(xPos);
        const closestPoint = this.xSet[closestIndex];
        this.anchorPos = this.xScale(closestPoint);
        this.anchorPos = Math.max(0, this.anchorPos);
        this.anchorPos = Math.min(this.dims.width, this.anchorPos);
        this.anchorValues = this.getValues(closestPoint);
        if (this.anchorPos !== this.lastAnchorPos) {
            const ev = createMouseEvent('mouseleave');
            this.tooltipAnchor.nativeElement.dispatchEvent(ev);
            this.anchorOpacity = 0.7;
            this.hover.emit({
                value: closestPoint
            });
            this.showTooltip();
            this.lastAnchorPos = this.anchorPos;
        }
    }
    findClosestPointIndex(xPos) {
        let minIndex = 0;
        let maxIndex = this.xSet.length - 1;
        let minDiff = Number.MAX_VALUE;
        let closestIndex = 0;
        while (minIndex <= maxIndex) {
            const currentIndex = ((minIndex + maxIndex) / 2) | 0;
            const currentElement = this.xScale(this.xSet[currentIndex]);
            const curDiff = Math.abs(currentElement - xPos);
            if (curDiff < minDiff) {
                minDiff = curDiff;
                closestIndex = currentIndex;
            }
            if (currentElement < xPos) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > xPos) {
                maxIndex = currentIndex - 1;
            }
            else {
                minDiff = 0;
                closestIndex = currentIndex;
                break;
            }
        }
        return closestIndex;
    }
    showTooltip() {
        const event = createMouseEvent('mouseenter');
        this.tooltipAnchor.nativeElement.dispatchEvent(event);
    }
    hideTooltip() {
        const event = createMouseEvent('mouseleave');
        this.tooltipAnchor.nativeElement.dispatchEvent(event);
        this.anchorOpacity = 0;
        this.lastAnchorPos = -1;
    }
    getToolTipText(tooltipItem) {
        let result = '';
        if (tooltipItem.series !== undefined) {
            result += tooltipItem.series;
        }
        else {
            result += '???';
        }
        result += ': ';
        if (tooltipItem.value !== undefined) {
            result += tooltipItem.value.toLocaleString();
        }
        if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
            result += ' (';
            if (tooltipItem.min !== undefined) {
                if (tooltipItem.max === undefined) {
                    result += '≥';
                }
                result += tooltipItem.min.toLocaleString();
                if (tooltipItem.max !== undefined) {
                    result += ' - ';
                }
            }
            else if (tooltipItem.max !== undefined) {
                result += '≤';
            }
            if (tooltipItem.max !== undefined) {
                result += tooltipItem.max.toLocaleString();
            }
            result += ')';
        }
        return result;
    }
    isHidden(tooltipItem) {
        if (!this.hiddenEntries)
            return false;
        const item = this.hiddenEntries.find(d => {
            return tooltipItem.series === d.name;
        });
        return item !== undefined;
    }
}
TooltipArea.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-tooltip-area]',
                template: `
    <svg:g>
      <svg:rect
        class="tooltip-area"
        [attr.x]="0"
        y="0"
        [attr.width]="dims.width"
        [attr.height]="dims.height"
        style="opacity: 0; cursor: 'auto';"
        (mousemove)="mouseMove($event)"
        (mouseleave)="hideTooltip()"
      />
      <ng-template #defaultTooltipTemplate let-model="model">
        <xhtml:div class="area-tooltip-container">
          <ng-container *ngFor="let tooltipItem of model">
            <xhtml:div *ngIf="!isHidden(tooltipItem)" class="tooltip-item">
              <xhtml:span class="tooltip-item-color" [style.background-color]="tooltipItem.color"></xhtml:span>
              {{ getToolTipText(tooltipItem) }}
            </xhtml:div>
          </ng-container>
        </xhtml:div>
      </ng-template>
      <svg:rect
        #tooltipAnchor
        [@animationState]="anchorOpacity !== 0 ? 'active' : 'inactive'"
        class="tooltip-anchor"
        [attr.x]="anchorPos"
        y="0"
        [attr.width]="1"
        [attr.height]="dims.height"
        [style.opacity]="anchorOpacity"
        [style.pointer-events]="'none'"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="'right'"
        [tooltipType]="'tooltip'"
        [tooltipSpacing]="15"
        [tooltipTemplate]="tooltipTemplate ? tooltipTemplate : defaultTooltipTemplate"
        [tooltipContext]="anchorValues"
        [tooltipImmediateExit]="true"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition('inactive => active', [
                            style({
                                opacity: 0
                            }),
                            animate(250, style({ opacity: 0.7 }))
                        ]),
                        transition('active => inactive', [
                            style({
                                opacity: 0.7
                            }),
                            animate(250, style({ opacity: 0 }))
                        ])
                    ])
                ]
            },] }
];
TooltipArea.propDecorators = {
    dims: [{ type: Input }],
    xSet: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    results: [{ type: Input }],
    colors: [{ type: Input }],
    showPercentage: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    hiddenEntries: [{ type: Input }],
    hover: [{ type: Output }],
    tooltipAnchor: [{ type: ViewChild, args: ['tooltipAnchor', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1hcmVhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vdG9vbHRpcC1hcmVhLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBZSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBaUU3QyxNQUFNLE9BQU8sV0FBVztJQS9EeEI7UUFnRUUsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsY0FBUyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQVUsRUFBRSxDQUFDO1FBU2hCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBSWhDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBMkp2QyxDQUFDO0lBdkpDLFNBQVMsQ0FBQyxJQUFJO1FBQ1osTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRW5CLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQyxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7Z0JBQ3RDLFNBQVM7YUFDVjtZQUNELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVB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dEMsQ0FBQzt3QkFDRixVQUFVLENBQUMsb0JBQW9CLEVBQUU7NEJBQy9CLEtBQUssQ0FBQztnQ0FDSixPQUFPLEVBQUUsR0FBRzs2QkFDYixDQUFDOzRCQUNGLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7eUJBQ3BDLENBQUM7cUJBQ0gsQ0FBQztpQkFDSDthQUNGOzs7bUJBT0UsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSztzQkFDTCxLQUFLO3FCQUNMLEtBQUs7NkJBQ0wsS0FBSzs4QkFDTCxLQUFLOzhCQUNMLEtBQUs7NEJBQ0wsS0FBSztvQkFFTCxNQUFNOzRCQUVOLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHRyaWdnZXIsIHN0eWxlLCBhbmltYXRlLCB0cmFuc2l0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7IGNyZWF0ZU1vdXNlRXZlbnQgfSBmcm9tICcuLi9ldmVudHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtdG9vbHRpcC1hcmVhXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6Zz5cclxuICAgICAgPHN2ZzpyZWN0XHJcbiAgICAgICAgY2xhc3M9XCJ0b29sdGlwLWFyZWFcIlxyXG4gICAgICAgIFthdHRyLnhdPVwiMFwiXHJcbiAgICAgICAgeT1cIjBcIlxyXG4gICAgICAgIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGhcIlxyXG4gICAgICAgIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodFwiXHJcbiAgICAgICAgc3R5bGU9XCJvcGFjaXR5OiAwOyBjdXJzb3I6ICdhdXRvJztcIlxyXG4gICAgICAgIChtb3VzZW1vdmUpPVwibW91c2VNb3ZlKCRldmVudClcIlxyXG4gICAgICAgIChtb3VzZWxlYXZlKT1cImhpZGVUb29sdGlwKClcIlxyXG4gICAgICAvPlxyXG4gICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUb29sdGlwVGVtcGxhdGUgbGV0LW1vZGVsPVwibW9kZWxcIj5cclxuICAgICAgICA8eGh0bWw6ZGl2IGNsYXNzPVwiYXJlYS10b29sdGlwLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgdG9vbHRpcEl0ZW0gb2YgbW9kZWxcIj5cclxuICAgICAgICAgICAgPHhodG1sOmRpdiAqbmdJZj1cIiFpc0hpZGRlbih0b29sdGlwSXRlbSlcIiBjbGFzcz1cInRvb2x0aXAtaXRlbVwiPlxyXG4gICAgICAgICAgICAgIDx4aHRtbDpzcGFuIGNsYXNzPVwidG9vbHRpcC1pdGVtLWNvbG9yXCIgW3N0eWxlLmJhY2tncm91bmQtY29sb3JdPVwidG9vbHRpcEl0ZW0uY29sb3JcIj48L3hodG1sOnNwYW4+XHJcbiAgICAgICAgICAgICAge3sgZ2V0VG9vbFRpcFRleHQodG9vbHRpcEl0ZW0pIH19XHJcbiAgICAgICAgICAgIDwveGh0bWw6ZGl2PlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgPC94aHRtbDpkaXY+XHJcbiAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxzdmc6cmVjdFxyXG4gICAgICAgICN0b29sdGlwQW5jaG9yXHJcbiAgICAgICAgW0BhbmltYXRpb25TdGF0ZV09XCJhbmNob3JPcGFjaXR5ICE9PSAwID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnXCJcclxuICAgICAgICBjbGFzcz1cInRvb2x0aXAtYW5jaG9yXCJcclxuICAgICAgICBbYXR0ci54XT1cImFuY2hvclBvc1wiXHJcbiAgICAgICAgeT1cIjBcIlxyXG4gICAgICAgIFthdHRyLndpZHRoXT1cIjFcIlxyXG4gICAgICAgIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodFwiXHJcbiAgICAgICAgW3N0eWxlLm9wYWNpdHldPVwiYW5jaG9yT3BhY2l0eVwiXHJcbiAgICAgICAgW3N0eWxlLnBvaW50ZXItZXZlbnRzXT1cIidub25lJ1wiXHJcbiAgICAgICAgbmd4LXRvb2x0aXBcclxuICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXHJcbiAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwiJ3JpZ2h0J1wiXHJcbiAgICAgICAgW3Rvb2x0aXBUeXBlXT1cIid0b29sdGlwJ1wiXHJcbiAgICAgICAgW3Rvb2x0aXBTcGFjaW5nXT1cIjE1XCJcclxuICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZSA/IHRvb2x0aXBUZW1wbGF0ZSA6IGRlZmF1bHRUb29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICAgIFt0b29sdGlwQ29udGV4dF09XCJhbmNob3JWYWx1ZXNcIlxyXG4gICAgICAgIFt0b29sdGlwSW1tZWRpYXRlRXhpdF09XCJ0cnVlXCJcclxuICAgICAgLz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBhbmltYXRpb25zOiBbXHJcbiAgICB0cmlnZ2VyKCdhbmltYXRpb25TdGF0ZScsIFtcclxuICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gYWN0aXZlJywgW1xyXG4gICAgICAgIHN0eWxlKHtcclxuICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICB9KSxcclxuICAgICAgICBhbmltYXRlKDI1MCwgc3R5bGUoeyBvcGFjaXR5OiAwLjcgfSkpXHJcbiAgICAgIF0pLFxyXG4gICAgICB0cmFuc2l0aW9uKCdhY3RpdmUgPT4gaW5hY3RpdmUnLCBbXHJcbiAgICAgICAgc3R5bGUoe1xyXG4gICAgICAgICAgb3BhY2l0eTogMC43XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYW5pbWF0ZSgyNTAsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSlcclxuICAgICAgXSlcclxuICAgIF0pXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcEFyZWEge1xyXG4gIGFuY2hvck9wYWNpdHk6IG51bWJlciA9IDA7XHJcbiAgYW5jaG9yUG9zOiBudW1iZXIgPSAtMTtcclxuICBhbmNob3JWYWx1ZXM6IGFueVtdID0gW107XHJcbiAgbGFzdEFuY2hvclBvczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKSBkaW1zO1xyXG4gIEBJbnB1dCgpIHhTZXQ7XHJcbiAgQElucHV0KCkgeFNjYWxlO1xyXG4gIEBJbnB1dCgpIHlTY2FsZTtcclxuICBASW5wdXQoKSByZXN1bHRzO1xyXG4gIEBJbnB1dCgpIGNvbG9ycztcclxuICBASW5wdXQoKSBzaG93UGVyY2VudGFnZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBoaWRkZW5FbnRyaWVzOiBhbnlbXTtcclxuXHJcbiAgQE91dHB1dCgpIGhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAVmlld0NoaWxkKCd0b29sdGlwQW5jaG9yJywgeyBzdGF0aWM6IGZhbHNlIH0pIHRvb2x0aXBBbmNob3I7XHJcblxyXG4gIGdldFZhbHVlcyh4VmFsKTogYW55W10ge1xyXG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgdGhpcy5yZXN1bHRzKSB7XHJcbiAgICAgIGlmKHRoaXMuaXNIaWRkZW4oeyBuYW1lOiBncm91cC5uYW1lIH0pKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaXRlbSA9IGdyb3VwLnNlcmllcy5maW5kKGQgPT4gZC5uYW1lLnRvU3RyaW5nKCkgPT09IHhWYWwudG9TdHJpbmcoKSk7XHJcbiAgICAgIGxldCBncm91cE5hbWUgPSBncm91cC5uYW1lO1xyXG4gICAgICBpZiAoZ3JvdXBOYW1lIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGdyb3VwTmFtZSA9IGdyb3VwTmFtZS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICBjb25zdCBsYWJlbCA9IGl0ZW0ubmFtZTtcclxuICAgICAgICBsZXQgdmFsID0gaXRlbS52YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5zaG93UGVyY2VudGFnZSkge1xyXG4gICAgICAgICAgdmFsID0gKGl0ZW0uZDEgLSBpdGVtLmQwKS50b0ZpeGVkKDIpICsgJyUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY29sb3I7XHJcbiAgICAgICAgaWYgKHRoaXMuY29sb3JzLnNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpIHtcclxuICAgICAgICAgIGxldCB2ID0gdmFsO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZDEpIHtcclxuICAgICAgICAgICAgdiA9IGl0ZW0uZDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKHYpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKGdyb3VwLm5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0sIHtcclxuICAgICAgICAgIHZhbHVlOiB2YWwsXHJcbiAgICAgICAgICBuYW1lOiBsYWJlbCxcclxuICAgICAgICAgIHNlcmllczogZ3JvdXBOYW1lLFxyXG4gICAgICAgICAgbWluOiBpdGVtLm1pbixcclxuICAgICAgICAgIG1heDogaXRlbS5tYXgsXHJcbiAgICAgICAgICBjb2xvclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXN1bHRzLnB1c2goZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxuICB9XHJcblxyXG4gIG1vdXNlTW92ZShldmVudCkge1xyXG4gICAgY29uc3QgeFBvcyA9IGV2ZW50LnBhZ2VYIC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcblxyXG4gICAgY29uc3QgY2xvc2VzdEluZGV4ID0gdGhpcy5maW5kQ2xvc2VzdFBvaW50SW5kZXgoeFBvcyk7XHJcbiAgICBjb25zdCBjbG9zZXN0UG9pbnQgPSB0aGlzLnhTZXRbY2xvc2VzdEluZGV4XTtcclxuICAgIHRoaXMuYW5jaG9yUG9zID0gdGhpcy54U2NhbGUoY2xvc2VzdFBvaW50KTtcclxuICAgIHRoaXMuYW5jaG9yUG9zID0gTWF0aC5tYXgoMCwgdGhpcy5hbmNob3JQb3MpO1xyXG4gICAgdGhpcy5hbmNob3JQb3MgPSBNYXRoLm1pbih0aGlzLmRpbXMud2lkdGgsIHRoaXMuYW5jaG9yUG9zKTtcclxuXHJcbiAgICB0aGlzLmFuY2hvclZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKGNsb3Nlc3RQb2ludCk7XHJcbiAgICBpZiAodGhpcy5hbmNob3JQb3MgIT09IHRoaXMubGFzdEFuY2hvclBvcykge1xyXG4gICAgICBjb25zdCBldiA9IGNyZWF0ZU1vdXNlRXZlbnQoJ21vdXNlbGVhdmUnKTtcclxuICAgICAgdGhpcy50b29sdGlwQW5jaG9yLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldik7XHJcbiAgICAgIHRoaXMuYW5jaG9yT3BhY2l0eSA9IDAuNztcclxuICAgICAgdGhpcy5ob3Zlci5lbWl0KHtcclxuICAgICAgICB2YWx1ZTogY2xvc2VzdFBvaW50XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnNob3dUb29sdGlwKCk7XHJcblxyXG4gICAgICB0aGlzLmxhc3RBbmNob3JQb3MgPSB0aGlzLmFuY2hvclBvcztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZpbmRDbG9zZXN0UG9pbnRJbmRleCh4UG9zKSB7XHJcbiAgICBsZXQgbWluSW5kZXggPSAwO1xyXG4gICAgbGV0IG1heEluZGV4ID0gdGhpcy54U2V0Lmxlbmd0aCAtIDE7XHJcbiAgICBsZXQgbWluRGlmZiA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICBsZXQgY2xvc2VzdEluZGV4ID0gMDtcclxuXHJcbiAgICB3aGlsZSAobWluSW5kZXggPD0gbWF4SW5kZXgpIHtcclxuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gKChtaW5JbmRleCArIG1heEluZGV4KSAvIDIpIHwgMDtcclxuICAgICAgY29uc3QgY3VycmVudEVsZW1lbnQgPSB0aGlzLnhTY2FsZSh0aGlzLnhTZXRbY3VycmVudEluZGV4XSk7XHJcblxyXG4gICAgICBjb25zdCBjdXJEaWZmID0gTWF0aC5hYnMoY3VycmVudEVsZW1lbnQgLSB4UG9zKTtcclxuXHJcbiAgICAgIGlmIChjdXJEaWZmIDwgbWluRGlmZikge1xyXG4gICAgICAgIG1pbkRpZmYgPSBjdXJEaWZmO1xyXG4gICAgICAgIGNsb3Nlc3RJbmRleCA9IGN1cnJlbnRJbmRleDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnRFbGVtZW50IDwgeFBvcykge1xyXG4gICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMTtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50RWxlbWVudCA+IHhQb3MpIHtcclxuICAgICAgICBtYXhJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbWluRGlmZiA9IDA7XHJcbiAgICAgICAgY2xvc2VzdEluZGV4ID0gY3VycmVudEluZGV4O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNsb3Nlc3RJbmRleDtcclxuICB9XHJcblxyXG4gIHNob3dUb29sdGlwKCk6IHZvaWQge1xyXG4gICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb3VzZUV2ZW50KCdtb3VzZWVudGVyJyk7XHJcbiAgICB0aGlzLnRvb2x0aXBBbmNob3IubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIGhpZGVUb29sdGlwKCk6IHZvaWQge1xyXG4gICAgY29uc3QgZXZlbnQgPSBjcmVhdGVNb3VzZUV2ZW50KCdtb3VzZWxlYXZlJyk7XHJcbiAgICB0aGlzLnRvb2x0aXBBbmNob3IubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIHRoaXMuYW5jaG9yT3BhY2l0eSA9IDA7XHJcbiAgICB0aGlzLmxhc3RBbmNob3JQb3MgPSAtMTtcclxuICB9XHJcblxyXG4gIGdldFRvb2xUaXBUZXh0KHRvb2x0aXBJdGVtOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgbGV0IHJlc3VsdDogc3RyaW5nID0gJyc7XHJcbiAgICBpZiAodG9vbHRpcEl0ZW0uc2VyaWVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmVzdWx0ICs9IHRvb2x0aXBJdGVtLnNlcmllcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCArPSAnPz8/JztcclxuICAgIH1cclxuICAgIHJlc3VsdCArPSAnOiAnO1xyXG4gICAgaWYgKHRvb2x0aXBJdGVtLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmVzdWx0ICs9IHRvb2x0aXBJdGVtLnZhbHVlLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodG9vbHRpcEl0ZW0ubWluICE9PSB1bmRlZmluZWQgfHwgdG9vbHRpcEl0ZW0ubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmVzdWx0ICs9ICcgKCc7XHJcbiAgICAgIGlmICh0b29sdGlwSXRlbS5taW4gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICh0b29sdGlwSXRlbS5tYXggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcmVzdWx0ICs9ICfiiaUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHQgKz0gdG9vbHRpcEl0ZW0ubWluLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKHRvb2x0aXBJdGVtLm1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICByZXN1bHQgKz0gJyAtICc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRvb2x0aXBJdGVtLm1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9ICfiiaQnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0b29sdGlwSXRlbS5tYXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJlc3VsdCArPSB0b29sdGlwSXRlbS5tYXgudG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgKz0gJyknO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIGlzSGlkZGVuKHRvb2x0aXBJdGVtKSB7XHJcbiAgICBpZiAoIXRoaXMuaGlkZGVuRW50cmllcykgcmV0dXJuIGZhbHNlO1xyXG4gICAgY29uc3QgaXRlbSA9IHRoaXMuaGlkZGVuRW50cmllcy5maW5kKGQgPT4ge1xyXG4gICAgICByZXR1cm4gdG9vbHRpcEl0ZW0uc2VyaWVzID09PSBkLm5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpdGVtICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==