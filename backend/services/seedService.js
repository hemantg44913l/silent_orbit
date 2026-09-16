import { Material } from '../models/Material.js';
import { Vendor } from '../models/Vendor.js';
import { ReuseOption } from '../models/ReuseOption.js';
import { DisposalOption } from '../models/DisposalOption.js';
import { Textile } from '../models/Textile.js';
import { CollectionPoint } from '../models/CollectionPoint.js';

import { materials as rawMaterials } from '../data/materials.js';
import { vendors as rawVendors } from '../data/vendors.js';
import { reuseOptions as rawReuse } from '../data/reuse.js';
import { disposalOptions as rawDisposal } from '../data/disposal.js';
import { submissions as rawSubmissions } from '../data/textiles.js';
import { collectionPoints as rawCollectionPoints } from '../data/collectionPoints.js';

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Materials
    const materialCount = await Material.countDocuments();
    if (materialCount === 0) {
      await Material.insertMany(rawMaterials);
      console.log(`🌱 [MongoDB Seed] Inserted ${rawMaterials.length} Materials.`);
    }

    // 2. Vendors
    const vendorCount = await Vendor.countDocuments();
    if (vendorCount === 0) {
      await Vendor.insertMany(rawVendors);
      console.log(`🌱 [MongoDB Seed] Inserted ${rawVendors.length} Vendors.`);
    }

    // 3. Reuse Options
    const reuseCount = await ReuseOption.countDocuments();
    if (reuseCount === 0) {
      await ReuseOption.insertMany(rawReuse);
      console.log(`🌱 [MongoDB Seed] Inserted ${rawReuse.length} Reuse Options.`);
    }

    // 4. Disposal Options
    const disposalCount = await DisposalOption.countDocuments();
    if (disposalCount === 0) {
      await DisposalOption.insertMany(rawDisposal);
      console.log(`🌱 [MongoDB Seed] Inserted ${rawDisposal.length} Disposal Options.`);
    }

    // 5. Textiles
    const textileCount = await Textile.countDocuments();
    if (textileCount === 0) {
      await Textile.insertMany(rawSubmissions);
      console.log(`🌱 [MongoDB Seed] Inserted ${rawSubmissions.length} Initial Textiles.`);
    }

    // 6. Collection Points
    const cpCount = await CollectionPoint.countDocuments();
    if (cpCount === 0) {
      await CollectionPoint.insertMany(rawCollectionPoints);
      console.log(`🌱 [MongoDB Seed] Inserted ${rawCollectionPoints.length} Collection Points.`);
    }

  } catch (err) {
    console.error('⚠️ [MongoDB Seed Error]:', err.message);
  }
}
