/**
 * Prototype Material Dataset - TexLoop / ReTextile
 * 
 * Standard and specialty textile fibers with technical characteristics 
 * structured for future multi-objective matching engines.
 */

export const materials = [
  {
    id: 'mat_cotton',
    name: 'Cotton',
    category: 'Natural Fiber',
    fiberType: 'Cellulosic',
    recyclabilityClass: 'High',
    preferredProcess: 'Mechanical / Chemical Pulping',
    typicalValueGrade: 'A',
    contaminationTolerance: 'Medium',
    biodegradable: true,
    description: 'Soft, breathable natural cellulose staple fiber widely suited for spinning, upcycling, or conversion into rag paper and insulation.'
  },
  {
    id: 'mat_linen',
    name: 'Linen',
    category: 'Natural Fiber',
    fiberType: 'Bast Fiber',
    recyclabilityClass: 'High',
    preferredProcess: 'Mechanical Shredding / Composting',
    typicalValueGrade: 'A+',
    contaminationTolerance: 'Low',
    biodegradable: true,
    description: 'High-tensile flax fiber with excellent durability, valuable for artisanal blending, composite reinforcement, and eco-linens.'
  },
  {
    id: 'mat_denim',
    name: 'Denim',
    category: 'Woven Cotton',
    fiberType: 'Heavy Cellulosic Twill',
    recyclabilityClass: 'Very High',
    preferredProcess: 'Garnetting / De-fibering / Upcycling',
    typicalValueGrade: 'A',
    contaminationTolerance: 'High',
    biodegradable: true,
    description: 'Heavyweight cotton twill ideal for industrial thermal insulation batts, acoustic panels, and direct artisan upcycling.'
  },
  {
    id: 'mat_wool',
    name: 'Wool',
    category: 'Animal Fiber',
    fiberType: 'Proteinaceous (Keratin)',
    recyclabilityClass: 'High',
    preferredProcess: 'Shoddy Shredding / Non-woven Felting',
    typicalValueGrade: 'A+',
    contaminationTolerance: 'Low',
    biodegradable: true,
    description: 'Naturally insulating, flame-resistant protein fiber premium for thermal mulches, acoustic felts, and regenerated wool yarns.'
  },
  {
    id: 'mat_silk',
    name: 'Silk',
    category: 'Animal Fiber',
    fiberType: 'Proteinaceous (Fibroin)',
    recyclabilityClass: 'Medium',
    preferredProcess: 'Artisanal Reclamation / Hydrolysis',
    typicalValueGrade: 'A+',
    contaminationTolerance: 'Very Low',
    biodegradable: true,
    description: 'Luxury natural filament fiber requiring delicate mechanical recovery or chemical regeneration for specialty medical and luxury craft streams.'
  },
  {
    id: 'mat_polyester',
    name: 'Polyester',
    category: 'Synthetic Fiber',
    fiberType: 'Polyethylene Terephthalate (PET)',
    recyclabilityClass: 'Very High',
    preferredProcess: 'Chemical Depolymerization / Thermal Pelletizing',
    typicalValueGrade: 'B+',
    contaminationTolerance: 'Medium',
    biodegradable: false,
    description: 'Most common synthetic polymer fabric, ideal for melt extrusion, mechanical re-spinning, and circular closed-loop bottle-to-fiber cycles.'
  },
  {
    id: 'mat_nylon',
    name: 'Nylon',
    category: 'Synthetic Fiber',
    fiberType: 'Polyamide (PA6 / PA66)',
    recyclabilityClass: 'High',
    preferredProcess: 'Depolymerization into Caprolactam',
    typicalValueGrade: 'A',
    contaminationTolerance: 'Medium',
    biodegradable: false,
    description: 'High abrasion-resistance synthetic material commonly recovered from activewear, technical garments, and industrial nets for closed-loop regeneration.'
  },
  {
    id: 'mat_rayon',
    name: 'Rayon',
    category: 'Regenerated Cellulose',
    fiberType: 'Viscose / Modal / Lyocell',
    recyclabilityClass: 'Moderate',
    preferredProcess: 'Chemical Dissolution / Shredding',
    typicalValueGrade: 'B',
    contaminationTolerance: 'Low',
    biodegradable: true,
    description: 'Man-made cellulosic filament sourced from wood pulp, suitable for soft industrial waddings and next-gen circular cellulosic recycling.'
  },
  {
    id: 'mat_acrylic',
    name: 'Acrylic',
    category: 'Synthetic Fiber',
    fiberType: 'Polyacrylonitrile (PAN)',
    recyclabilityClass: 'Moderate',
    preferredProcess: 'Thermal Re-granulation / Thermal Downcycling',
    typicalValueGrade: 'C+',
    contaminationTolerance: 'Medium',
    biodegradable: false,
    description: 'Synthetic wool-substitute fiber frequently recycled into commercial carpet backing, geo-textiles, and non-woven industrial wipes.'
  },
  {
    id: 'mat_blended_fabric',
    name: 'Blended Fabric',
    category: 'Composite Blend',
    fiberType: 'Poly-Cotton / Multi-component Mix',
    recyclabilityClass: 'Moderate',
    preferredProcess: 'Thermo-mechanical Shredding / Downcycling',
    typicalValueGrade: 'B-',
    contaminationTolerance: 'High',
    biodegradable: false,
    description: 'Complex composite weaves (e.g., 60/40 poly-cotton) typically targeted for acoustic insulation, automotive trunk liners, or advanced enzymatic separation.'
  },
  {
    id: 'mat_other',
    name: 'Other',
    category: 'Miscellaneous / Unsorted',
    fiberType: 'Mixed Technical / Unknown',
    recyclabilityClass: 'Low to Medium',
    preferredProcess: 'Sorting & Energy Recovery Screening',
    typicalValueGrade: 'C',
    contaminationTolerance: 'High',
    biodegradable: false,
    description: 'Non-classified, composite, or multi-laminate materials evaluated individually for specialized secondary material recovery routes.'
  }
];
