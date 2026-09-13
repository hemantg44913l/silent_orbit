/**
 * Calculates the great-circle distance between two geographic coordinates
 * using the Haversine formula.
 * 
 * @param {number} lat1 - Latitude of origin in decimal degrees
 * @param {number} lon1 - Longitude of origin in decimal degrees
 * @param {number} lat2 - Latitude of destination in decimal degrees
 * @param {number} lon2 - Longitude of destination in decimal degrees
 * @param {'km' | 'miles'} unit - Unit of measurement ('km' default or 'miles')
 * @returns {number} Distance rounded to two decimal places
 */
export function calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }

  const R = unit === 'miles' ? 3958.8 : 6371; // Earth's radius
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
