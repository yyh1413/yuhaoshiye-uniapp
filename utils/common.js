/**
 * Common utility functions
 */

/**
 * Format a material's size display
 * @param {String} size - Size string (e.g., "900×1800mm")
 * @returns {String} Formatted size string
 */
export const formatSize = (size) => {
  if (!size) return '';
  return size.replace('mm', ' mm');
};

/**
 * Format a material's thickness display
 * @param {String} thickness - Thickness string (e.g., "9mm")
 * @returns {String} Formatted thickness string
 */
export const formatThickness = (thickness) => {
  if (!thickness) return '';
  return thickness.replace('mm', ' mm');
};

/**
 * Navigate to a page
 * @param {String} url - Page URL
 * @param {Object} params - Parameters to pass to the page
 */
export const navigateTo = (url, params = {}) => {
  let queryString = '';
  
  if (Object.keys(params).length > 0) {
    queryString = '?' + Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
  
  uni.navigateTo({
    url: url + queryString
  });
};

/**
 * Show toast message
 * @param {String} title - Toast message
 * @param {String} icon - Toast icon
 */
export const showToast = (title, icon = 'none') => {
  uni.showToast({
    title,
    icon
  });
};

/**
 * Generate a unique ID
 * @returns {String} Unique ID
 */
export const generateId = () => {
  return 'id_' + Math.random().toString(36).substr(2, 9);
};

export default {
  formatSize,
  formatThickness,
  navigateTo,
  showToast,
  generateId
}; 