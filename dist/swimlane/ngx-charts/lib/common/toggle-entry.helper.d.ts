/**
 * Adds an entry to hidden entries if not exists, or removes it from hidden entries if exists
 *
 * @export
 *
 * @param item
 * @param hiddenEntries
 *
 * @returns {Object} Returns back object containing the hiddenEntries and hidden properties
 */
export declare function toggleEntry(item: any, hiddenEntries: any[]): {
    hidden: boolean;
    hiddenEntries: any[];
};
