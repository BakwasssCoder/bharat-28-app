/**
 * Utility functions for smooth scrolling to sections
 */

/**
 * Scroll to a specific section by ID
 * @param sectionId - The ID of the section to scroll to
 * @param offset - Optional offset in pixels (useful for fixed headers)
 */
export const scrollToSection = (sectionId: string, offset: number = 0) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll to a section referenced by a React ref
 * @param elementRef - The ref of the element to scroll to
 * @param offset - Optional offset in pixels (useful for fixed headers)
 */
export const scrollToElementRef = (elementRef: React.RefObject<HTMLDivElement>, offset: number = 0) => {
  if (elementRef.current) {
    const elementPosition = elementRef.current.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Get the offset needed for scrolling (accounts for fixed headers)
 * @returns The height of the fixed header
 */
export const getScrollOffset = (): number => {
  // Assuming the header height is approximately 64px (you can adjust this)
  return 64;
};