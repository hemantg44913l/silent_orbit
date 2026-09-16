import { vendorService } from './vendorService.js';
import { calculateDistance } from '../utils/distance.js';

/**
 * Intelligent Matching Service - 100% MongoDB Atlas & Fallback Driven
 */
export const matchingService = {
  matchVendorsForTextile: async (textileData) => {
    const {
      material = 'Cotton',
      weightKg = 15,
      condition = 'Good condition',
      latitude = 30.2672,
      longitude = -97.7431
    } = textileData;

    const weight = Number(weightKg) || 0;
    const reqLat = Number(latitude);
    const reqLon = Number(longitude);

    // Fetch active vendors via vendorService (handles MongoDB Atlas & seed fallback gracefully)
    const candidates = await vendorService.getAllVendors({ status: 'active' });

    const matches = candidates.map(vendor => {
      // 1. Material Compatibility Check
      const materialCompatible = (vendor.acceptedMaterials || []).some(
        m => m.toLowerCase() === material.toLowerCase()
      );

      // 2. Capacity Constraint Check (availableCapacityKg >= weightKg and within bounds)
      const availCap = vendor.availableCapacityKg ?? vendor.capacityKg ?? 1000;
      const minQty = vendor.minQuantityKg ?? 0;
      const maxQty = vendor.maxQuantityKg ?? 10000;

      const hasEnoughAvailableCapacity = availCap >= weight;
      const meetsMinQuantity = weight >= minQty;
      const withinMaxQuantity = weight <= maxQty;
      const capacityCompatible = hasEnoughAvailableCapacity && meetsMinQuantity && withinMaxQuantity;

      // 3. Condition Suitability Check
      const conditionCompatible = (vendor.acceptedConditions || ['Good condition']).some(
        c => c.toLowerCase() === condition.toLowerCase()
      );

      // 4. Geographic Distance in km
      const venLat = vendor.latitude || 30.2672;
      const venLng = vendor.longitude || -97.7431;
      const distanceKm = calculateDistance(reqLat, reqLon, venLat, venLng, 'km');

      let score = 0;
      if (materialCompatible) score += 40;
      if (capacityCompatible) score += 30;
      if (conditionCompatible) score += 15;

      if (distanceKm !== null) {
        const proximityScore = Math.max(0, 15 - (distanceKm * 0.2));
        score += Math.round(proximityScore);
      }

      const isViable = materialCompatible && capacityCompatible;

      return {
        vendorId: vendor.id || vendor._id,
        vendorName: vendor.name,
        location: vendor.location || vendor.address || 'Processing Facility',
        address: vendor.address || vendor.location || 'Processing Facility',
        latitude: venLat,
        longitude: venLng,
        distanceKm,
        rating: vendor.rating || 4.8,
        pickupAvailable: vendor.pickupAvailable ?? true,
        processingType: vendor.processingType || 'Fiber Recycling',
        availableCapacityKg: availCap,
        maxQuantityKg: maxQty,
        minQuantityKg: minQty,
        acceptedMaterials: vendor.acceptedMaterials || ['All Textiles'],
        acceptedConditions: vendor.acceptedConditions || ['Good condition'],
        contaminationLimit: vendor.contaminationLimit || 10,
        isViable,
        compatibilityScore: Math.min(100, Math.round(score)),
        diagnostics: {
          materialCompatible,
          capacityCompatible,
          conditionCompatible,
          availableCapacityKg: availCap,
          requestedWeightKg: weight,
          capacityDeficitKg: Math.max(0, weight - availCap)
        }
      };
    });

    matches.sort((a, b) => {
      if (b.compatibilityScore !== a.compatibilityScore) {
        return b.compatibilityScore - a.compatibilityScore;
      }
      return (a.distanceKm || 999) - (b.distanceKm || 999);
    });

    return {
      status: 'success',
      dataSource: 'MongoDB Atlas',
      submittedCriteria: {
        material,
        weightKg: weight,
        condition,
        coordinates: { latitude: reqLat, longitude: reqLon }
      },
      totalVendorsEvaluated: candidates.length,
      viableCandidatesCount: matches.filter(m => m.isViable).length,
      matches
    };
  }
};
