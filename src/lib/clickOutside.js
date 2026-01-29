/**
 * Click outside directive for Svelte 5
 * @param {HTMLElement} node - The element to detect clicks outside of
 * @param {Function} callback - Function to call when clicking outside
 */
export function clickOutside(node, callback) {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      callback();
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
