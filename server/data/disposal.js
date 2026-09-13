/**
 * Prototype Disposal & Recovery Routes Dataset - TexLoop / ReTextile
 * 
 * Modular hierarchical decision pathways for textile end-of-life recovery:
 * Direct Reuse -> Repair -> Fiber-to-Fiber Recycling -> Industrial Downcycling -> Regulated Disposal.
 */

export const disposalOptions = [
  {
    id: 'disp-reuse',
    route: 'Direct Circular Reuse',
    hierarchyLevel: 1,
    priority: 'Highest Environmental Value',
    description: 'Immediate redirection of clean, intact apparel to community donation networks, clothing swaps, and thrift re-commerce.',
    suitableConditions: ['Excellent condition', 'Good condition'],
    maxContaminationPercent: 0,
    carbonImpact: 'Net Carbon Negative (avoids virgin apparel manufacturing footprint)',
    targetFacilities: ['Municipal Drop Boxes', 'Thrift Consignments', 'Charity Redistribution Hubs'],
    recommendedActions: [
      'Inspect garments for intact buttons, functional zippers, and clean seams',
      'Wash thoroughly with eco-detergent before boxing',
      'Deposit in weatherproof municipal textile bins'
    ]
  },
  {
    id: 'disp-repair',
    route: 'Structural Repair & Re-conditioning',
    hierarchyLevel: 2,
    priority: 'High Life-Extension Value',
    description: 'Targeted garment restoration addressing minor cosmetic blemishes, missing fasteners, torn seams, or zipper replacements.',
    suitableConditions: ['Good condition', 'Fair condition'],
    maxContaminationPercent: 5,
    carbonImpact: 'Saves 80-90% embodied energy relative to material replacement',
    targetFacilities: ['Local Tailoring Collectives', 'Maker Studios', 'Brand Repair Hubs'],
    recommendedActions: [
      'Pinpoint tear points or missing closures',
      'Schedule drop-off at community mending workshops',
      'Explore sashiko or visible mending techniques for artisan character'
    ]
  },
  {
    id: 'disp-recycle-mechanical',
    route: 'Mechanical Fiber Shredding & Re-spinning',
    hierarchyLevel: 3,
    priority: 'Industrial Raw Material Recovery',
    description: 'High-speed rotary tearing, carding, and garnetting that deconstructs woven/knitted textiles into individual staple fibers for secondary yarns.',
    suitableConditions: ['Fair condition', 'Poor condition'],
    maxContaminationPercent: 12,
    carbonImpact: 'Diverts 2.1 kg CO2e per kg of natural fiber processed',
    targetFacilities: ['Commercial Garnetting Mills', 'Non-woven Batt Manufacturing Facilities'],
    recommendedActions: [
      'Remove metal hardware (buckles, large brass zippers, rivets where possible)',
      'Bundle batches by color family (reduces post-re-spinning dyeing requirements)',
      'Keep dry to prevent mildew during bulk container transport'
    ]
  },
  {
    id: 'disp-recycle-chemical',
    route: 'Advanced Chemical Depolymerization & Dissolution',
    hierarchyLevel: 3,
    priority: 'High-Tech Closed-Loop Fiber-to-Fiber',
    description: 'Enzymatic or solvent-based separation breaking polymers back into virgin-quality monomers (PET, cellulose pulp) for infinite circular extrusion.',
    suitableConditions: ['Excellent condition', 'Good condition', 'Fair condition'],
    maxContaminationPercent: 8,
    carbonImpact: 'Replaces fossil-fuel derived virgin polyester and wood-pulp viscose',
    targetFacilities: ['CleanTech Polymer Refineries', 'Enzymatic Separation Plants'],
    recommendedActions: [
      'Sort synthetic polyester batches from heavy natural blends',
      'Avoid elastane/spandex concentrations above 10% when possible',
      'Package in moisture-sealed totes for refinery intake'
    ]
  },
  {
    id: 'disp-downcycling',
    route: 'Industrial Downcycling & Insulation Matting',
    hierarchyLevel: 4,
    priority: 'Volume Landfill Diversion',
    description: 'Conversion of heavily contaminated or multi-blend scraps into automotive acoustic panels, carpet padding, and thermal home insulation.',
    suitableConditions: ['Poor condition', 'Severely Damaged / Shredded'],
    maxContaminationPercent: 25,
    carbonImpact: 'Prevents methane emission in landfills; offsets synthetic fiberglass production',
    targetFacilities: ['Insulation Shredding Mills', 'Acoustic Barrier Producers'],
    recommendedActions: [
      'Accepts mixed synthetic and natural scraps regardless of weave integrity',
      'Package in compressed 20-50 kg bales for optimal freight density',
      'Verify absence of hazardous chemical soaking or biohazard contamination'
    ]
  },
  {
    id: 'disp-regulated',
    route: 'Regulated Waste-to-Energy Recovery',
    hierarchyLevel: 5,
    priority: 'Last Resort Thermal Recovery',
    description: 'High-efficiency thermal oxidation in certified municipal energy-from-waste facilities with scrubbers for materials that cannot be safely sorted.',
    suitableConditions: ['Severely Damaged / Shredded'],
    maxContaminationPercent: 100,
    carbonImpact: 'Displaces coal/gas electricity generation; strictly superior to open dumping',
    targetFacilities: ['Municipal Waste-to-Energy (WtE) Thermal Plants'],
    recommendedActions: [
      'Used only when textile is oil-soaked, chemically contaminated, or severely degraded',
      'Confirm acceptance with municipal hazardous and industrial waste schedules'
    ]
  }
];
