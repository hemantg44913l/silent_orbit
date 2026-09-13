/**
 * Loomora AI Assistant Service
 * Integrates external free AI API with intelligent fallback domain engine.
 */

/**
 * Knowledge Base & Intent Classifier for Local AI Response Engine
 */
const DOMAIN_KNOWLEDGE = [
  {
    keywords: ['price', 'rate', 'payout', 'cost', 'money', 'earn', 'sell', 'vendor', 'valuable'],
    response: `### 💰 Loomora Vendor Buyback Rates & Pricing

Loomora matches your textile waste with top certified fiber recycling vendors based on material purity and market demand:

* **100% Pure Cotton**: Up to **$1.85 / kg** (Highest demand for mechanically recycled yarn).
* **Denim & Heavy Canvas**: Up to **$1.60 / kg** (Great for insulation & fiber blending).
* **Linen & Natural Blends**: Up to **$1.45 / kg** (Used in eco-home textiles).
* **Wool & Cashmere**: Up to **$2.10 / kg** (Premium carding & garnetting material).
* **Polyester & Synthetics**: Up to **$0.95 / kg** (Thermal pelletizing & R-PET chips).
* **Blended / Mixed Scrap**: Up to **$0.70 / kg** (Shredded for industrial wipers & padding).

> **Tip**: Monofiber garments with >95% purity fetch 30% higher buyback prices! You can start by clicking **"Find the Best Path"** on the home page.`
  },
  {
    keywords: ['how it works', 'process', 'step', 'flow', 'start', 'begin', 'help', 'guide'],
    response: `### 🔄 How Loomora Works in 5 Easy Steps

1. **Provide Image**: Upload a photo or take a live camera shot of your textile waste batch.
2. **Choose Pathway**: Select whether you want to **Sell to Vendor**, **Reuse / DIY Upcycle**, or **Zero-Landfill Disposal**.
3. **Specify Details**: Enter material type, weight (kg), condition, and search your pickup address using Google Places.
4. **Review & Confirm**: Double-check your specifications before initiating real-time database matching.
5. **Smart Recommendation & Route**: View top ranked vendors, estimated payouts, and OpenStreetMap 3D route previews!`
  },
  {
    keywords: ['track', 'order', 'status', 'consignment', 'id', 'where is'],
    response: `### 🚚 Order & Consignment Tracking

You can track any active textile pickup consignment anytime:

1. Click **Track Order** in the top navigation header.
2. Enter your **Order ID** (e.g. \`TXL-8940\` or \`ORD-10001\`).
3. View real-time status updates:
   * **Scheduled**: Logistics pickup confirmed.
   * **In Transit**: Driver en-route via OSRM optimized navigation.
   * **Processing**: Batch received at recycling hub & weighted.
   * **Completed**: Payout transferred to your account!`
  },
  {
    keywords: ['material', 'fabric', 'cotton', 'polyester', 'denim', 'wool', 'linen', 'blend', 'accept'],
    response: `### 🧵 Accepted Textile Materials

Loomora accepts a wide spectrum of post-consumer garments and post-industrial scrap:

* **Natural Fibers**: Cotton, Linen, Wool, Silk, Hemp.
* **Synthetic Fibers**: Polyester (PET), Nylon, Acrylic, Spandex/Elastane.
* **Cellulosic & Semi-Synthetic**: Rayon, Viscose, Modal, Lyocell (Tencel).
* **Scrap & Offcuts**: Garment factory offcuts, deadstock rolls, damaged home textiles.

> 🚫 **Not Accepted**: Wet/moldy rags, hazardous chemical-stained industrial waste, or medical bio-contaminated linens.`
  },
  {
    keywords: ['diy', 'reuse', 'upcycle', 'craft', 'ideas', 'pattern', 'project'],
    response: `### ✂️ DIY & Upcycling Ideas

If you select the **Reuse / DIY** pathway, Loomora generates step-by-step upcycling ideas based on your material:

* **T-Shirt Yarn Rugs**: Cut worn cotton shirts into continuous strips for crochet bath mats.
* **Denim Tote Bags**: Upcycle old jeans into durable shopping totes with zero sewing required.
* **Patchwork Quilts**: Transform mixed fabric scraps into cozy memory blankets.
* **Draft Stoppers**: Fill denim legs with scrap cutoffs to block door drafts and save energy!`
  },
  {
    keywords: ['location', 'pickup', 'address', 'map', 'route', 'austin', 'city'],
    response: `### 📍 Pickup Location & Navigation

Loomora integrates **Google Places Search** and **OpenStreetMap (CARTO Voyager)** 3D maps:

* Enter any city, street, or landmark address.
* Our system automatically calculates latitude and longitude coordinates.
* OSRM (Open Source Routing Machine) plots the shortest zero-emission pickup route between your location and the recycling facility!`
  },
  {
    keywords: ['contact', 'support', 'email', 'phone', 'team', 'feedback', 'bug'],
    response: `### 📧 Contact & Support

Our sustainability team is here to assist you:

* **Email**: support@loomora.org
* **Logistics Hub**: 100 Circular Way, Austin, TX 78701
* **In-App Inquiries**: Click **Contact Us** or **Feedback** in the top navigation bar to send a message directly to our dispatchers!`
  }
];

/**
 * Generate AI Response
 */
export async function generateAIResponse(userMessage, conversationHistory = []) {
  if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return {
      reply: "Hello! I am **Loomora AI Assistant**. How can I help you with textile recycling, vendor pricing, or pickup tracking today?"
    };
  }

  const query = userMessage.toLowerCase().trim();

  // 1. Try external AI API if key or endpoint is available
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `You are Loomora AI Assistant, an expert advisor on textile waste recycling, vendor payouts, circular fashion, and eco-logistics. User question: ${userMessage}` }]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { reply: text, source: 'gemini-ai' };
        }
      }
    } catch (err) {
      console.warn('[AI Service] External API call error, falling back to local AI engine:', err.message);
    }
  }

  // 2. Intelligent Domain AI Engine (Instant, 100% Free, Guaranteed 24/7 Availability)
  for (const item of DOMAIN_KNOWLEDGE) {
    if (item.keywords.some(kw => query.includes(kw))) {
      return {
        reply: item.response,
        source: 'loomora-domain-ai'
      };
    }
  }

  // Default AI Assistant Response
  return {
    reply: `### 🌿 Loomora Circular AI Assistant

Thank you for your question about **"${userMessage}"**!

Loomora is an end-to-end digital platform designed to eliminate textile waste:

* 📊 **Automated Matching**: Connects garment waste batches with high-payout fiber recyclers.
* 🚚 **Smart Logistics**: Uses OSRM route telematics for optimal zero-landfill pickup.
* ♻️ **Circular Pathways**: Choose between **Vendor Sale**, **DIY Upcycling**, or **Recycling Hub Drop-offs**.

You can ask me questions about:
1. Vendor buyback rates for cotton, denim, or synthetics.
2. How to track your active pickup consignment.
3. Accepted vs rejected fabric materials.
4. DIY upcycling tutorials & ideas!`,
    source: 'loomora-domain-ai'
  };
}
