import { EventEmitter, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
export declare class LegendComponent implements OnChanges {
    private cd;
    data: any;
    title: any;
    colors: any;
    height: any;
    width: any;
    activeEntries: any;
    hiddenEntries: any;
    horizontal: boolean;
    labelClick: EventEmitter<any>;
    labelActivate: EventEmitter<any>;
    labelDeactivate: EventEmitter<any>;
    labelToggle: EventEmitter<any>;
    legendEntries: any[];
    constructor(cd: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    update(): void;
    getLegendEntries(): any[];
    isActive(entry: any): boolean;
    isHidden(entry: any): boolean;
    activate(item: any): void;
    deactivate(item: any): void;
    toggle(item: any): void;
    trackBy(index: any, item: any): string;
}
