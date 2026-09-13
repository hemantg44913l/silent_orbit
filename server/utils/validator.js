/**
 * Input validation helpers for ReTextile / TexLoop API
 */

export function validateTextileSubmission(body) {
  const errors = [];

  if (!body) {
    return { isValid: false, errors: ['Request body is required'] };
  }

  // Material validation
  if (!body.material || typeof body.material !== 'string' || body.material.trim() === '') {
    errors.push('Material is required and must be a non-empty string');
  }

  // Weight validation (must be positive number)
  if (body.weightKg === undefined || body.weightKg === null) {
    errors.push('Weight in kg (weightKg) is required');
  } else {
    const weight = Number(body.weightKg);
    if (isNaN(weight) || weight <= 0) {
      errors.push('Weight must be a positive number greater than 0 kg');
    } else if (weight > 100000) {
      errors.push('Weight exceeds maximum allowable single batch limit (100,000 kg)');
    }
  }

  // Path validation if provided
  const validPaths = ['sell', 'reuse', 'disposal'];
  if (body.selectedPath && !validPaths.includes(body.selectedPath.toLowerCase())) {
    errors.push(`Invalid selectedPath. Must be one of: ${validPaths.join(', ')}`);
  }

  // Condition validation if provided
  const validConditions = ['Excellent condition', 'Good condition', 'Fair condition', 'Poor condition', 'Severely Damaged / Shredded'];
  if (body.condition && typeof body.condition !== 'string') {
    errors.push('Condition must be a string description');
  }

  // Coordinates validation if provided
  if (body.latitude !== undefined && body.latitude !== null) {
    const lat = Number(body.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a valid number between -90 and 90');
    }
  }

  if (body.longitude !== undefined && body.longitude !== null) {
    const lon = Number(body.longitude);
    if (isNaN(lon) || lon < -180 || lon > 180) {
      errors.push('Longitude must be a valid number between -180 and 180');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
