// The export is needed here to generate a valid polyfills.metadata.json file
export function ngxChartsPolyfills() {
    // IE11 fix
    // Ref: https://github.com/swimlane/ngx-charts/issues/386
    if (typeof SVGElement !== 'undefined' && typeof SVGElement.prototype.contains === 'undefined') {
        SVGElement.prototype.contains = HTMLDivElement.prototype.contains;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWZpbGxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL3BvbHlmaWxscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2RUFBNkU7QUFDN0UsTUFBTSxVQUFVLGtCQUFrQjtJQUNoQyxXQUFXO0lBQ1gseURBQXlEO0lBQ3pELElBQUksT0FBTyxVQUFVLEtBQUssV0FBVyxJQUFJLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFO1FBQzdGLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0tBQ25FO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBleHBvcnQgaXMgbmVlZGVkIGhlcmUgdG8gZ2VuZXJhdGUgYSB2YWxpZCBwb2x5ZmlsbHMubWV0YWRhdGEuanNvbiBmaWxlXHJcbmV4cG9ydCBmdW5jdGlvbiBuZ3hDaGFydHNQb2x5ZmlsbHMoKSB7XHJcbiAgLy8gSUUxMSBmaXhcclxuICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zd2ltbGFuZS9uZ3gtY2hhcnRzL2lzc3Vlcy8zODZcclxuICBpZiAodHlwZW9mIFNWR0VsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBTVkdFbGVtZW50LnByb3RvdHlwZS5jb250YWlucyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIFNWR0VsZW1lbnQucHJvdG90eXBlLmNvbnRhaW5zID0gSFRNTERpdkVsZW1lbnQucHJvdG90eXBlLmNvbnRhaW5zO1xyXG4gIH1cclxufVxyXG4iXX0=