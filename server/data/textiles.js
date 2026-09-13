/**
 * Textile Submissions In-Memory Store - TexLoop / ReTextile
 * 
 * Supports flexible submission model across paths (sell, reuse, disposal).
 */

export const submissions = [
  {
    id: 'sub-demo-001',
    image: '/assets/sustainable_fashion.png',
    selectedPath: 'sell',
    material: 'Cotton',
    weightKg: 15.0,
    condition: 'Good condition',
    contaminationLevel: 'Low (0-5%)',
    location: 'Central Austin, TX',
    latitude: 30.2672,
    longitude: -97.7431,
    notes: 'Surplus organic cotton garments from local boutique sample room.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'sub-demo-002',
    image: '/assets/textile_waste.png',
    selectedPath: 'disposal',
    material: 'Denim',
    weightKg: 45.0,
    condition: 'Poor condition',
    contaminationLevel: 'Moderate (10-15%)',
    location: 'East Austin Hub, TX',
    latitude: 30.2789,
    longitude: -97.6890,
    notes: 'Post-production cutting room scraps and frayed denim selvedge remnants.',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

let counter = 100;

export function createTextileSubmission(data) {
  counter += 1;
  const newSubmission = {
    id: `sub-${Date.now().toString(36)}-${counter}`,
    image: data.image || null,
    selectedPath: data.selectedPath || 'sell',
    material: data.material || 'Cotton',
    weightKg: Number(data.weightKg) || 0,
    condition: data.condition || 'Good condition',
    contaminationLevel: data.contaminationLevel || 'Low (0-5%)',
    location: data.location || 'Austin, TX',
    latitude: data.latitude !== undefined ? Number(data.latitude) : 30.2672,
    longitude: data.longitude !== undefined ? Number(data.longitude) : -97.7431,
    notes: data.notes || '',
    createdAt: new Date().toISOString()
  };

  submissions.unshift(newSubmission);
  return newSubmission;
}

export function getAllSubmissions() {
  return [...submissions];
}

export function getSubmissionById(id) {
  return submissions.find(s => s.id === id) || null;
}
