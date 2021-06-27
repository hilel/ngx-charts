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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1hcmVhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vdG9vbHRpcC1hcmVhLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBZSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBaUU3QyxNQUFNLE9BQU8sV0FBVztJQS9EeEI7UUFnRUUsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsY0FBUyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQVUsRUFBRSxDQUFDO1FBU2hCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBSWhDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBd0p2QyxDQUFDO0lBcEpDLFNBQVMsQ0FBQyxJQUFJO1FBQ1osTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRW5CLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDM0UsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUMzQixJQUFJLFNB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QUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUNwQyxDQUFDO3FCQUNILENBQUM7aUJBQ0g7YUFDRjs7O21CQU9FLEtBQUs7bUJBQ0wsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7c0JBQ0wsS0FBSztxQkFDTCxLQUFLOzZCQUNMLEtBQUs7OEJBQ0wsS0FBSzs4QkFDTCxLQUFLOzRCQUNMLEtBQUs7b0JBRUwsTUFBTTs0QkFFTixTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyB0cmlnZ2VyLCBzdHlsZSwgYW5pbWF0ZSwgdHJhbnNpdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBjcmVhdGVNb3VzZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnRzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXRvb2x0aXAtYXJlYV0nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmc+XHJcbiAgICAgIDxzdmc6cmVjdFxyXG4gICAgICAgIGNsYXNzPVwidG9vbHRpcC1hcmVhXCJcclxuICAgICAgICBbYXR0ci54XT1cIjBcIlxyXG4gICAgICAgIHk9XCIwXCJcclxuICAgICAgICBbYXR0ci53aWR0aF09XCJkaW1zLndpZHRoXCJcclxuICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHRcIlxyXG4gICAgICAgIHN0eWxlPVwib3BhY2l0eTogMDsgY3Vyc29yOiAnYXV0byc7XCJcclxuICAgICAgICAobW91c2Vtb3ZlKT1cIm1vdXNlTW92ZSgkZXZlbnQpXCJcclxuICAgICAgICAobW91c2VsZWF2ZSk9XCJoaWRlVG9vbHRpcCgpXCJcclxuICAgICAgLz5cclxuICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0VG9vbHRpcFRlbXBsYXRlIGxldC1tb2RlbD1cIm1vZGVsXCI+XHJcbiAgICAgICAgPHhodG1sOmRpdiBjbGFzcz1cImFyZWEtdG9vbHRpcC1jb250YWluZXJcIj5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IHRvb2x0aXBJdGVtIG9mIG1vZGVsXCI+XHJcbiAgICAgICAgICAgIDx4aHRtbDpkaXYgKm5nSWY9XCIhaXNIaWRkZW4odG9vbHRpcEl0ZW0pXCIgY2xhc3M9XCJ0b29sdGlwLWl0ZW1cIj5cclxuICAgICAgICAgICAgICA8eGh0bWw6c3BhbiBjbGFzcz1cInRvb2x0aXAtaXRlbS1jb2xvclwiIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cInRvb2x0aXBJdGVtLmNvbG9yXCI+PC94aHRtbDpzcGFuPlxyXG4gICAgICAgICAgICAgIHt7IGdldFRvb2xUaXBUZXh0KHRvb2x0aXBJdGVtKSB9fVxyXG4gICAgICAgICAgICA8L3hodG1sOmRpdj5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgIDwveGh0bWw6ZGl2PlxyXG4gICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8c3ZnOnJlY3RcclxuICAgICAgICAjdG9vbHRpcEFuY2hvclxyXG4gICAgICAgIFtAYW5pbWF0aW9uU3RhdGVdPVwiYW5jaG9yT3BhY2l0eSAhPT0gMCA/ICdhY3RpdmUnIDogJ2luYWN0aXZlJ1wiXHJcbiAgICAgICAgY2xhc3M9XCJ0b29sdGlwLWFuY2hvclwiXHJcbiAgICAgICAgW2F0dHIueF09XCJhbmNob3JQb3NcIlxyXG4gICAgICAgIHk9XCIwXCJcclxuICAgICAgICBbYXR0ci53aWR0aF09XCIxXCJcclxuICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHRcIlxyXG4gICAgICAgIFtzdHlsZS5vcGFjaXR5XT1cImFuY2hvck9wYWNpdHlcIlxyXG4gICAgICAgIFtzdHlsZS5wb2ludGVyLWV2ZW50c109XCInbm9uZSdcIlxyXG4gICAgICAgIG5neC10b29sdGlwXHJcbiAgICAgICAgW3Rvb2x0aXBEaXNhYmxlZF09XCJ0b29sdGlwRGlzYWJsZWRcIlxyXG4gICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cIidyaWdodCdcIlxyXG4gICAgICAgIFt0b29sdGlwVHlwZV09XCIndG9vbHRpcCdcIlxyXG4gICAgICAgIFt0b29sdGlwU3BhY2luZ109XCIxNVwiXHJcbiAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGUgPyB0b29sdGlwVGVtcGxhdGUgOiBkZWZhdWx0VG9vbHRpcFRlbXBsYXRlXCJcclxuICAgICAgICBbdG9vbHRpcENvbnRleHRdPVwiYW5jaG9yVmFsdWVzXCJcclxuICAgICAgICBbdG9vbHRpcEltbWVkaWF0ZUV4aXRdPVwidHJ1ZVwiXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgYW5pbWF0aW9uczogW1xyXG4gICAgdHJpZ2dlcignYW5pbWF0aW9uU3RhdGUnLCBbXHJcbiAgICAgIHRyYW5zaXRpb24oJ2luYWN0aXZlID0+IGFjdGl2ZScsIFtcclxuICAgICAgICBzdHlsZSh7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYW5pbWF0ZSgyNTAsIHN0eWxlKHsgb3BhY2l0eTogMC43IH0pKVxyXG4gICAgICBdKSxcclxuICAgICAgdHJhbnNpdGlvbignYWN0aXZlID0+IGluYWN0aXZlJywgW1xyXG4gICAgICAgIHN0eWxlKHtcclxuICAgICAgICAgIG9wYWNpdHk6IDAuN1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGFuaW1hdGUoMjUwLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXHJcbiAgICAgIF0pXHJcbiAgICBdKVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFRvb2x0aXBBcmVhIHtcclxuICBhbmNob3JPcGFjaXR5OiBudW1iZXIgPSAwO1xyXG4gIGFuY2hvclBvczogbnVtYmVyID0gLTE7XHJcbiAgYW5jaG9yVmFsdWVzOiBhbnlbXSA9IFtdO1xyXG4gIGxhc3RBbmNob3JQb3M6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KCkgZGltcztcclxuICBASW5wdXQoKSB4U2V0O1xyXG4gIEBJbnB1dCgpIHhTY2FsZTtcclxuICBASW5wdXQoKSB5U2NhbGU7XHJcbiAgQElucHV0KCkgcmVzdWx0cztcclxuICBASW5wdXQoKSBjb2xvcnM7XHJcbiAgQElucHV0KCkgc2hvd1BlcmNlbnRhZ2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSB0b29sdGlwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgaGlkZGVuRW50cmllczogYW55W107XHJcblxyXG4gIEBPdXRwdXQoKSBob3ZlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQFZpZXdDaGlsZCgndG9vbHRpcEFuY2hvcicsIHsgc3RhdGljOiBmYWxzZSB9KSB0b29sdGlwQW5jaG9yO1xyXG5cclxuICBnZXRWYWx1ZXMoeFZhbCk6IGFueVtdIHtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGdyb3VwIG9mIHRoaXMucmVzdWx0cykge1xyXG4gICAgICBjb25zdCBpdGVtID0gZ3JvdXAuc2VyaWVzLmZpbmQoZCA9PiBkLm5hbWUudG9TdHJpbmcoKSA9PT0geFZhbC50b1N0cmluZygpKTtcclxuICAgICAgbGV0IGdyb3VwTmFtZSA9IGdyb3VwLm5hbWU7XHJcbiAgICAgIGlmIChncm91cE5hbWUgaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZ3JvdXBOYW1lID0gZ3JvdXBOYW1lLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IGxhYmVsID0gaXRlbS5uYW1lO1xyXG4gICAgICAgIGxldCB2YWwgPSBpdGVtLnZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dQZXJjZW50YWdlKSB7XHJcbiAgICAgICAgICB2YWwgPSAoaXRlbS5kMSAtIGl0ZW0uZDApLnRvRml4ZWQoMikgKyAnJSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjb2xvcjtcclxuICAgICAgICBpZiAodGhpcy5jb2xvcnMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICAgICAgbGV0IHYgPSB2YWw7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kMSkge1xyXG4gICAgICAgICAgICB2ID0gaXRlbS5kMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvcnMuZ2V0Q29sb3Iodik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbG9yID0gdGhpcy5jb2xvcnMuZ2V0Q29sb3IoZ3JvdXAubmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSwge1xyXG4gICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgIG5hbWU6IGxhYmVsLFxyXG4gICAgICAgICAgc2VyaWVzOiBncm91cE5hbWUsXHJcbiAgICAgICAgICBtaW46IGl0ZW0ubWluLFxyXG4gICAgICAgICAgbWF4OiBpdGVtLm1heCxcclxuICAgICAgICAgIGNvbG9yXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlc3VsdHMucHVzaChkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH1cclxuXHJcbiAgbW91c2VNb3ZlKGV2ZW50KSB7XHJcbiAgICBjb25zdCB4UG9zID0gZXZlbnQucGFnZVggLSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuXHJcbiAgICBjb25zdCBjbG9zZXN0SW5kZXggPSB0aGlzLmZpbmRDbG9zZXN0UG9pbnRJbmRleCh4UG9zKTtcclxuICAgIGNvbnN0IGNsb3Nlc3RQb2ludCA9IHRoaXMueFNldFtjbG9zZXN0SW5kZXhdO1xyXG4gICAgdGhpcy5hbmNob3JQb3MgPSB0aGlzLnhTY2FsZShjbG9zZXN0UG9pbnQpO1xyXG4gICAgdGhpcy5hbmNob3JQb3MgPSBNYXRoLm1heCgwLCB0aGlzLmFuY2hvclBvcyk7XHJcbiAgICB0aGlzLmFuY2hvclBvcyA9IE1hdGgubWluKHRoaXMuZGltcy53aWR0aCwgdGhpcy5hbmNob3JQb3MpO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yVmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoY2xvc2VzdFBvaW50KTtcclxuICAgIGlmICh0aGlzLmFuY2hvclBvcyAhPT0gdGhpcy5sYXN0QW5jaG9yUG9zKSB7XHJcbiAgICAgIGNvbnN0IGV2ID0gY3JlYXRlTW91c2VFdmVudCgnbW91c2VsZWF2ZScpO1xyXG4gICAgICB0aGlzLnRvb2x0aXBBbmNob3IubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2KTtcclxuICAgICAgdGhpcy5hbmNob3JPcGFjaXR5ID0gMC43O1xyXG4gICAgICB0aGlzLmhvdmVyLmVtaXQoe1xyXG4gICAgICAgIHZhbHVlOiBjbG9zZXN0UG9pbnRcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuc2hvd1Rvb2x0aXAoKTtcclxuXHJcbiAgICAgIHRoaXMubGFzdEFuY2hvclBvcyA9IHRoaXMuYW5jaG9yUG9zO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmluZENsb3Nlc3RQb2ludEluZGV4KHhQb3MpIHtcclxuICAgIGxldCBtaW5JbmRleCA9IDA7XHJcbiAgICBsZXQgbWF4SW5kZXggPSB0aGlzLnhTZXQubGVuZ3RoIC0gMTtcclxuICAgIGxldCBtaW5EaWZmID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgIGxldCBjbG9zZXN0SW5kZXggPSAwO1xyXG5cclxuICAgIHdoaWxlIChtaW5JbmRleCA8PSBtYXhJbmRleCkge1xyXG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSAoKG1pbkluZGV4ICsgbWF4SW5kZXgpIC8gMikgfCAwO1xyXG4gICAgICBjb25zdCBjdXJyZW50RWxlbWVudCA9IHRoaXMueFNjYWxlKHRoaXMueFNldFtjdXJyZW50SW5kZXhdKTtcclxuXHJcbiAgICAgIGNvbnN0IGN1ckRpZmYgPSBNYXRoLmFicyhjdXJyZW50RWxlbWVudCAtIHhQb3MpO1xyXG5cclxuICAgICAgaWYgKGN1ckRpZmYgPCBtaW5EaWZmKSB7XHJcbiAgICAgICAgbWluRGlmZiA9IGN1ckRpZmY7XHJcbiAgICAgICAgY2xvc2VzdEluZGV4ID0gY3VycmVudEluZGV4O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VycmVudEVsZW1lbnQgPCB4UG9zKSB7XHJcbiAgICAgICAgbWluSW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnRFbGVtZW50ID4geFBvcykge1xyXG4gICAgICAgIG1heEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtaW5EaWZmID0gMDtcclxuICAgICAgICBjbG9zZXN0SW5kZXggPSBjdXJyZW50SW5kZXg7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2xvc2VzdEluZGV4O1xyXG4gIH1cclxuXHJcbiAgc2hvd1Rvb2x0aXAoKTogdm9pZCB7XHJcbiAgICBjb25zdCBldmVudCA9IGNyZWF0ZU1vdXNlRXZlbnQoJ21vdXNlZW50ZXInKTtcclxuICAgIHRoaXMudG9vbHRpcEFuY2hvci5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgaGlkZVRvb2x0aXAoKTogdm9pZCB7XHJcbiAgICBjb25zdCBldmVudCA9IGNyZWF0ZU1vdXNlRXZlbnQoJ21vdXNlbGVhdmUnKTtcclxuICAgIHRoaXMudG9vbHRpcEFuY2hvci5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgdGhpcy5hbmNob3JPcGFjaXR5ID0gMDtcclxuICAgIHRoaXMubGFzdEFuY2hvclBvcyA9IC0xO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG9vbFRpcFRleHQodG9vbHRpcEl0ZW06IGFueSk6IHN0cmluZyB7XHJcbiAgICBsZXQgcmVzdWx0OiBzdHJpbmcgPSAnJztcclxuICAgIGlmICh0b29sdGlwSXRlbS5zZXJpZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHQgKz0gdG9vbHRpcEl0ZW0uc2VyaWVzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ICs9ICc/Pz8nO1xyXG4gICAgfVxyXG4gICAgcmVzdWx0ICs9ICc6ICc7XHJcbiAgICBpZiAodG9vbHRpcEl0ZW0udmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHQgKz0gdG9vbHRpcEl0ZW0udmFsdWUudG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGlmICh0b29sdGlwSXRlbS5taW4gIT09IHVuZGVmaW5lZCB8fCB0b29sdGlwSXRlbS5tYXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXN1bHQgKz0gJyAoJztcclxuICAgICAgaWYgKHRvb2x0aXBJdGVtLm1pbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKHRvb2x0aXBJdGVtLm1heCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICByZXN1bHQgKz0gJ+KJpSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3VsdCArPSB0b29sdGlwSXRlbS5taW4udG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgICAgICBpZiAodG9vbHRpcEl0ZW0ubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHJlc3VsdCArPSAnIC0gJztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodG9vbHRpcEl0ZW0ubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXN1bHQgKz0gJ+KJpCc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRvb2x0aXBJdGVtLm1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IHRvb2x0aXBJdGVtLm1heC50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdCArPSAnKSc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgaXNIaWRkZW4odG9vbHRpcEl0ZW0pIHtcclxuICAgIGlmICghdGhpcy5oaWRkZW5FbnRyaWVzKSByZXR1cm4gZmFsc2U7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5oaWRkZW5FbnRyaWVzLmZpbmQoZCA9PiB7XHJcbiAgICAgIHJldHVybiB0b29sdGlwSXRlbS5zZXJpZXMgPT09IGQubmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuIl19