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
export function toggleEntry(item: any, hiddenEntries: any[]): { hidden: boolean, hiddenEntries: any[] } {
  let hidden: boolean;
  const idx = hiddenEntries.findIndex(d => {
    return d.name === item.name && d.value === item.value;
  });
  if(idx > -1) {
    hiddenEntries.splice(idx, 1);
    hidden = false;
  } else {
    hiddenEntries.push(item);
    hidden = true;
  }
  return { hidden, hiddenEntries: [...hiddenEntries] };
}