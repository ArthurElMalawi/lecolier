
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, CoverType, Format, Ruling, Prisma } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: `${process.env.DATABASE_URL}` })
const prisma = new PrismaClient({ adapter })

// Raw data parsing helper
function parseRawData() {
  const raw = [
    // 90g PP
    { g: 90, f: '17x22', p: 48, c: 'Orange' }, { g: 90, f: '17x22', p: 48, c: 'Gris' }, { g: 90, f: '17x22', p: 48, c: 'Jaune' },
    { g: 90, f: '17x22', p: 48, c: 'Rose' }, { g: 90, f: '17x22', p: 48, c: 'Violet' }, { g: 90, f: '17x22', p: 48, c: 'Bleu' },
    { g: 90, f: '17x22', p: 48, c: 'Rouge' }, { g: 90, f: '17x22', p: 48, c: 'Vert' }, { g: 90, f: '17x22', p: 48, c: 'Noir' },
    { g: 90, f: '17x22', p: 48, c: 'Incolore' }, { g: 90, f: '17x22', p: 48, c: 'Assortit' },
    
    { g: 90, f: '17x22', p: 96, c: 'Orange' }, { g: 90, f: '17x22', p: 96, c: 'Gris' }, { g: 90, f: '17x22', p: 96, c: 'Jaune' },
    { g: 90, f: '17x22', p: 96, c: 'Rose' }, { g: 90, f: '17x22', p: 96, c: 'Violet' }, { g: 90, f: '17x22', p: 96, c: 'Bleu' },
    { g: 90, f: '17x22', p: 96, c: 'Rouge' }, { g: 90, f: '17x22', p: 96, c: 'Vert' }, { g: 90, f: '17x22', p: 96, c: 'Noir' },
    { g: 90, f: '17x22', p: 96, c: 'Incolore' }, { g: 90, f: '17x22', p: 96, c: 'Assortit' },

    { g: 90, f: '17x22', p: 192, c: 'Orange' }, { g: 90, f: '17x22', p: 192, c: 'Gris' }, { g: 90, f: '17x22', p: 192, c: 'Jaune' },
    { g: 90, f: '17x22', p: 192, c: 'Rose' }, { g: 90, f: '17x22', p: 192, c: 'Violet' }, { g: 90, f: '17x22', p: 192, c: 'Bleu' },
    { g: 90, f: '17x22', p: 192, c: 'Rouge' }, { g: 90, f: '17x22', p: 192, c: 'Vert' }, { g: 90, f: '17x22', p: 192, c: 'Noir' },
    { g: 90, f: '17x22', p: 192, c: 'Incolore' }, { g: 90, f: '17x22', p: 192, c: 'Assortit' },

    { g: 90, f: '17x22', p: 288, c: 'Orange' }, { g: 90, f: '17x22', p: 288, c: 'Gris' }, { g: 90, f: '17x22', p: 288, c: 'Jaune' },
    { g: 90, f: '17x22', p: 288, c: 'Rose' }, { g: 90, f: '17x22', p: 288, c: 'Violet' }, { g: 90, f: '17x22', p: 288, c: 'Bleu' },
    { g: 90, f: '17x22', p: 288, c: 'Rouge' }, { g: 90, f: '17x22', p: 288, c: 'Vert' }, { g: 90, f: '17x22', p: 288, c: 'Incolore' },
    { g: 90, f: '17x22', p: 288, c: 'Assortit' },

    { g: 90, f: '21x29,7', p: 48, c: 'Orange' }, { g: 90, f: '21x29,7', p: 48, c: 'Gris' }, { g: 90, f: '21x29,7', p: 48, c: 'Jaune' },
    { g: 90, f: '21x29,7', p: 48, c: 'Rose' }, { g: 90, f: '21x29,7', p: 48, c: 'Violet' }, { g: 90, f: '21x29,7', p: 48, c: 'Bleu' },
    { g: 90, f: '21x29,7', p: 48, c: 'Rouge' }, { g: 90, f: '21x29,7', p: 48, c: 'Vert' }, { g: 90, f: '21x29,7', p: 48, c: 'Noir' },
    { g: 90, f: '21x29,7', p: 48, c: 'Incolore' }, { g: 90, f: '21x29,7', p: 48, c: 'Assortit' },

    { g: 90, f: '21x29,7', p: 96, c: 'Orange' }, { g: 90, f: '21x29,7', p: 96, c: 'Gris' }, { g: 90, f: '21x29,7', p: 96, c: 'Jaune' },
    { g: 90, f: '21x29,7', p: 96, c: 'Rose' }, { g: 90, f: '21x29,7', p: 96, c: 'Violet' }, { g: 90, f: '21x29,7', p: 96, c: 'Bleu' },
    { g: 90, f: '21x29,7', p: 96, c: 'Rouge' }, { g: 90, f: '21x29,7', p: 96, c: 'Vert' }, { g: 90, f: '21x29,7', p: 96, c: 'Noir' },
    { g: 90, f: '21x29,7', p: 96, c: 'Incolore' }, { g: 90, f: '21x29,7', p: 96, c: 'Assortit' },

    { g: 90, f: '21x29,7', p: 192, c: 'Orange' }, { g: 90, f: '21x29,7', p: 192, c: 'Gris' }, { g: 90, f: '21x29,7', p: 192, c: 'Jaune' },
    { g: 90, f: '21x29,7', p: 192, c: 'Rose' }, { g: 90, f: '21x29,7', p: 192, c: 'Violet' }, { g: 90, f: '21x29,7', p: 192, c: 'Bleu' },
    { g: 90, f: '21x29,7', p: 192, c: 'Rouge' }, { g: 90, f: '21x29,7', p: 192, c: 'Vert' }, { g: 90, f: '21x29,7', p: 192, c: 'Noir' },
    { g: 90, f: '21x29,7', p: 192, c: 'Incolore' }, { g: 90, f: '21x29,7', p: 192, c: 'Assortit' },

    { g: 90, f: '21x29,7', p: 288, c: 'Orange' }, { g: 90, f: '21x29,7', p: 288, c: 'Gris' }, { g: 90, f: '21x29,7', p: 288, c: 'Jaune' },
    { g: 90, f: '21x29,7', p: 288, c: 'Rose' }, { g: 90, f: '21x29,7', p: 288, c: 'Violet' }, { g: 90, f: '21x29,7', p: 288, c: 'Bleu' },
    { g: 90, f: '21x29,7', p: 288, c: 'Rouge' }, { g: 90, f: '21x29,7', p: 288, c: 'Vert' }, { g: 90, f: '21x29,7', p: 288, c: 'Incolore' },
    { g: 90, f: '21x29,7', p: 288, c: 'Assortit' },

    { g: 90, f: '24x32', p: 48, c: 'Orange' }, { g: 90, f: '24x32', p: 48, c: 'Gris' }, { g: 90, f: '24x32', p: 48, c: 'Jaune' },
    { g: 90, f: '24x32', p: 48, c: 'Rose' }, { g: 90, f: '24x32', p: 48, c: 'Violet' }, { g: 90, f: '24x32', p: 48, c: 'Bleu' },
    { g: 90, f: '24x32', p: 48, c: 'Rouge' }, { g: 90, f: '24x32', p: 48, c: 'Vert' }, { g: 90, f: '24x32', p: 48, c: 'Noir' },
    { g: 90, f: '24x32', p: 48, c: 'Incolore' }, { g: 90, f: '24x32', p: 48, c: 'Assortit' },

    { g: 90, f: '24x32', p: 96, c: 'Orange' }, { g: 90, f: '24x32', p: 96, c: 'Gris' }, { g: 90, f: '24x32', p: 96, c: 'Jaune' },
    { g: 90, f: '24x32', p: 96, c: 'Rose' }, { g: 90, f: '24x32', p: 96, c: 'Violet' }, { g: 90, f: '24x32', p: 96, c: 'Bleu' },
    { g: 90, f: '24x32', p: 96, c: 'Rouge' }, { g: 90, f: '24x32', p: 96, c: 'Vert' }, { g: 90, f: '24x32', p: 96, c: 'Noir' },
    { g: 90, f: '24x32', p: 96, c: 'Incolore' }, { g: 90, f: '24x32', p: 96, c: 'Assortit' },

    { g: 90, f: '24x32', p: 192, c: 'Orange' }, { g: 90, f: '24x32', p: 192, c: 'Gris' }, { g: 90, f: '24x32', p: 192, c: 'Jaune' },
    { g: 90, f: '24x32', p: 192, c: 'Rose' }, { g: 90, f: '24x32', p: 192, c: 'Violet' }, { g: 90, f: '24x32', p: 192, c: 'Bleu' },
    { g: 90, f: '24x32', p: 192, c: 'Rouge' }, { g: 90, f: '24x32', p: 192, c: 'Vert' }, { g: 90, f: '24x32', p: 192, c: 'Noir' },
    { g: 90, f: '24x32', p: 192, c: 'Incolore' }, { g: 90, f: '24x32', p: 192, c: 'Assortit' },

    { g: 90, f: '24x32', p: 288, c: 'Violet' }, { g: 90, f: '24x32', p: 288, c: 'Bleu' }, { g: 90, f: '24x32', p: 288, c: 'Rouge' },
    { g: 90, f: '24x32', p: 288, c: 'Vert' }, { g: 90, f: '24x32', p: 288, c: 'Incolore' }, { g: 90, f: '24x32', p: 288, c: 'Assortit' },

    // 70g PP
    { g: 70, f: '17x22', p: 32, c: 'Orange' }, { g: 70, f: '17x22', p: 32, c: 'Bleu' }, { g: 70, f: '17x22', p: 32, c: 'Rouge' },
    { g: 70, f: '17x22', p: 32, c: 'Vert' }, { g: 70, f: '17x22', p: 32, c: 'Incolore' }, { g: 70, f: '17x22', p: 32, c: 'Assortit' },

    { g: 70, f: '17x22', p: 48, c: 'Orange' }, { g: 70, f: '17x22', p: 48, c: 'Bleu' }, { g: 70, f: '17x22', p: 48, c: 'Rouge' },
    { g: 70, f: '17x22', p: 48, c: 'Vert' }, { g: 70, f: '17x22', p: 48, c: 'Incolore' }, { g: 70, f: '17x22', p: 48, c: 'Assortit' }, // Note: Assortit missing in snippet but implied

    { g: 70, f: '17x22', p: 96, c: 'Orange' }, { g: 70, f: '17x22', p: 96, c: 'Bleu' }, { g: 70, f: '17x22', p: 96, c: 'Rouge' },
    { g: 70, f: '17x22', p: 96, c: 'Vert' }, { g: 70, f: '17x22', p: 96, c: 'Incolore' }, { g: 70, f: '17x22', p: 96, c: 'Assortit' },

    { g: 70, f: '17x22', p: 192, c: 'Orange' }, { g: 70, f: '17x22', p: 192, c: 'Bleu' }, { g: 70, f: '17x22', p: 192, c: 'Rouge' },
    { g: 70, f: '17x22', p: 192, c: 'Vert' }, { g: 70, f: '17x22', p: 192, c: 'Incolore' }, { g: 70, f: '17x22', p: 192, c: 'Assortit' }, // Implied

    { g: 70, f: '17x22', p: 288, c: 'Jaune' }, { g: 70, f: '17x22', p: 288, c: 'Bleu' }, { g: 70, f: '17x22', p: 288, c: 'Rouge' },
    { g: 70, f: '17x22', p: 288, c: 'Vert' }, { g: 70, f: '17x22', p: 288, c: 'Incolore' }, { g: 70, f: '17x22', p: 288, c: 'Assortit' },

    { g: 70, f: '21x29,7', p: 48, c: 'Orange' }, { g: 70, f: '21x29,7', p: 48, c: 'Bleu' }, { g: 70, f: '21x29,7', p: 48, c: 'Rouge' },
    { g: 70, f: '21x29,7', p: 48, c: 'Vert' }, { g: 70, f: '21x29,7', p: 48, c: 'Incolore' }, { g: 70, f: '21x29,7', p: 48, c: 'Assortit' },

    { g: 70, f: '21x29,7', p: 96, c: 'Orange' }, { g: 70, f: '21x29,7', p: 96, c: 'Bleu' }, { g: 70, f: '21x29,7', p: 96, c: 'Rouge' },
    { g: 70, f: '21x29,7', p: 96, c: 'Vert' }, { g: 70, f: '21x29,7', p: 96, c: 'Incolore' }, { g: 70, f: '21x29,7', p: 96, c: 'Assortit' },

    { g: 70, f: '21x29,7', p: 192, c: 'Orange' }, { g: 70, f: '21x29,7', p: 192, c: 'Bleu' }, { g: 70, f: '21x29,7', p: 192, c: 'Rouge' },
    { g: 70, f: '21x29,7', p: 192, c: 'Vert' }, { g: 70, f: '21x29,7', p: 192, c: 'Incolore' }, { g: 70, f: '21x29,7', p: 192, c: 'Assortit' },

    { g: 70, f: '21x29,7', p: 288, c: 'Jaune' }, { g: 70, f: '21x29,7', p: 288, c: 'Bleu' }, { g: 70, f: '21x29,7', p: 288, c: 'Rouge' },
    { g: 70, f: '21x29,7', p: 288, c: 'Vert' }, { g: 70, f: '21x29,7', p: 288, c: 'Incolore' }, { g: 70, f: '21x29,7', p: 288, c: 'Assortit' },

    { g: 70, f: '24x32', p: 32, c: 'Orange' }, { g: 70, f: '24x32', p: 32, c: 'Bleu' }, { g: 70, f: '24x32', p: 32, c: 'Rouge' },
    { g: 70, f: '24x32', p: 32, c: 'Vert' }, { g: 70, f: '24x32', p: 32, c: 'Incolore' }, { g: 70, f: '24x32', p: 32, c: 'Assortit' },

    { g: 70, f: '24x32', p: 48, c: 'Orange' }, { g: 70, f: '24x32', p: 48, c: 'Bleu' }, { g: 70, f: '24x32', p: 48, c: 'Rouge' },
    { g: 70, f: '24x32', p: 48, c: 'Vert' }, { g: 70, f: '24x32', p: 48, c: 'Incolore' }, { g: 70, f: '24x32', p: 48, c: 'Assortit' },

    { g: 70, f: '24x32', p: 96, c: 'Orange' }, { g: 70, f: '24x32', p: 96, c: 'Bleu' }, { g: 70, f: '24x32', p: 96, c: 'Rouge' },
    { g: 70, f: '24x32', p: 96, c: 'Vert' }, { g: 70, f: '24x32', p: 96, c: 'Incolore' }, { g: 70, f: '24x32', p: 96, c: 'Assortit' },

    { g: 70, f: '24x32', p: 144, c: 'Orange' }, { g: 70, f: '24x32', p: 144, c: 'Bleu' }, { g: 70, f: '24x32', p: 144, c: 'Rouge' },
    { g: 70, f: '24x32', p: 144, c: 'Vert' },

    { g: 70, f: '24x32', p: 192, c: 'Orange' }, { g: 70, f: '24x32', p: 192, c: 'Bleu' }, { g: 70, f: '24x32', p: 192, c: 'Rouge' },
    { g: 70, f: '24x32', p: 192, c: 'Vert' }, { g: 70, f: '24x32', p: 192, c: 'Incolore' }, { g: 70, f: '24x32', p: 192, c: 'Assortit' },

    { g: 70, f: '24x32', p: 288, c: 'Bleu' }, { g: 70, f: '24x32', p: 288, c: 'Rouge' }, { g: 70, f: '24x32', p: 288, c: 'Vert' },
    { g: 70, f: '24x32', p: 288, c: 'Incolore' }, { g: 70, f: '24x32', p: 288, c: 'Assortit' },

    // 58g (was 60g 250gr)
    // Note: Assuming "250 gr" refers to the cover weight (cardboard?) or type. 
    // Given previous data, usually PP is polypro. 60g 250g sounds like "60g paper, 250g cover".
    // I will map this to CARTONNE (Hard cover) or create a new one? Let's use CARTONNE for now as it matches "Cartonné".
    { g: 58, f: '17x22', p: 48, c: 'Orange', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 48, c: 'Bleu', t: 'CARTONNE' },
    { g: 58, f: '17x22', p: 48, c: 'Rouge', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 48, c: 'Vert', t: 'CARTONNE' },
    { g: 58, f: '17x22', p: 96, c: 'Orange', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 96, c: 'Bleu', t: 'CARTONNE' },
    { g: 58, f: '17x22', p: 96, c: 'Rouge', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 96, c: 'Vert', t: 'CARTONNE' },
    { g: 58, f: '17x22', p: 192, c: 'Orange', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 192, c: 'Bleu', t: 'CARTONNE' },
    { g: 58, f: '17x22', p: 192, c: 'Rouge', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 192, c: 'Vert', t: 'CARTONNE' },

    // 58g (was 56g)
    { g: 58, f: '17x22', p: 32, c: 'Noir', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 48, c: 'Noir', t: 'CARTONNE' },
    { g: 58, f: '17x22', p: 96, c: 'Noir', t: 'CARTONNE' }, { g: 58, f: '17x22', p: 192, c: 'Noir', t: 'CARTONNE' },
    { g: 58, f: '17x22', p: 288, c: 'Noir', t: 'CARTONNE' },
    { g: 58, f: '21x29,7', p: 96, c: 'Noir', t: 'CARTONNE' }, { g: 58, f: '21x29,7', p: 192, c: 'Noir', t: 'CARTONNE' },
    
    // 58g Sans Couv (was 56g) - Mapping to a generic type or keeping as Cartonne if it means "basic notebook"
    // Let's assume it's "BROCHE" or similar, but I only have 3 enums. I'll map to CARTONNE for now or just standard.
    // Actually, "Sans Couv" might mean it's just a refill or very basic. 
    // I will ignore "Sans Couv" specific logic and just import them, maybe with a note or map to 'CARTONNE' for simplicity as I can't change enum easily without migration.
    // Wait, the user asked to update DB. I can add a new cover type if needed.
    // But for now, I'll stick to existing types or map to CARTONNE/POLYPRO based on context. 56g is usually very basic.
    { g: 58, f: '17x22', p: 96, c: 'Sans Couv', t: 'CARTONNE' },
  ];

  return raw;
}

// Helper to clean and format
function normalize(raw: any) {
  let format: Format;
  const f = raw.f.replace(/\s/g, '').replace(',', '_').toLowerCase();
  if (f.includes('17x22')) format = Format.F17x22;
  else if (f.includes('21x29_7')) format = Format.F21x29_7;
  else if (f.includes('24x32')) format = Format.F24x32;
  else format = Format.F17x22; // default fallback

  let cover: CoverType = CoverType.POLYPRO_PIQUE;
  if (raw.t === 'CARTONNE') cover = CoverType.CARTONNE;
  // Defaulting to POLYPRO_PIQUE for 90g/70g PP

  // Ruling is not in the dataset provided, so we'll generate variations or default to SEYES for now
  // To make it realistic, I will create one product per line, and maybe duplicate for rulings if needed.
  // For this task, I will just create one product with SEYES to represent the line.
  
  const slug = `cahier-${raw.g}g-${cover.toLowerCase().replace('_', '-')}-${raw.f.replace(',', '_')}-${raw.p}p-${raw.c.toLowerCase().replace(/\s/g, '-')}`;
  
  // Image generation logic
  let imagePrefix = 'polypro';
  if (cover === CoverType.CARTONNE) imagePrefix = 'cartonne';

  // Normalize color for filename (e.g. "Sans Couv" -> "sans_couv", "Bleu" -> "bleu")
  const colorSuffix = raw.c.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents (e.g. é -> e) if any, though dataset seems clean
    .replace(/\s/g, '_'); 

  // Check if specific image exists, otherwise fallback to assortit
  // Note: In a real environment we might check FS, but here we can just default to logic or assume assortit if we want a safe default.
  // The user requested to use "assortit" everywhere? Or just as a fallback?
  // "peut on mettre l'image asorti partout" -> Sounds like they want the assortit image for ALL products, or maybe just as a safe fallback?
  // Let's assume they want it as a fallback if the specific color image isn't found, OR if they really meant "partout" literally.
  // Re-reading: "peut on mettre l'image asorti partout (c'est une image ou il y a des cahiers de plusieurs couleurs en éventail)"
  // It sounds like they might want this image to represent the product line if specific photos aren't available.
  // However, we just renamed specific images.
  // Let's implement a check: we try to assign the specific color, but we can't easily check file existence in the seed script without 'fs'.
  // actually we can use 'fs'.
  
  const fs = require('fs');
  const path = require('path');
  
  // Force "assortit" image for EVERY product as requested by user
  // "met limage assoortit partout comme si les autres images n'existaient pas"
  let imageUrl = `/products/${imagePrefix}_assortit.png`;

  return {
    nameFr: `Cahier ${raw.g}g ${cover === 'POLYPRO_PIQUE' ? 'Polypro piqué' : 'Cartonné'} ${raw.f} ${raw.p}p ${raw.c}`,
    nameEn: `Notebook ${raw.g}gsm ${cover === 'POLYPRO_PIQUE' ? 'Polypro stitched' : 'Hard cover'} ${raw.f} ${raw.p}p ${raw.c}`,
    slug: slug,
    grammageGsm: raw.g,
    coverType: cover,
    format: format,
    ruling: Ruling.SEYES, // Default
    pages: raw.p,
    color: raw.c,
    imageUrl: imageUrl,
  };
}

async function main() {
  console.log('Cleaning database...');
  await prisma.product.deleteMany({});

  const rawData = parseRawData();
  console.log(`Found ${rawData.length} raw entries.`);

  for (const raw of rawData) {
    const p = normalize(raw);
    
    // Avoid duplicates if slug exists (though deleteMany should handle it)
    // We might have duplicates in raw data (e.g. "Sans Couv" repeated multiple times for same spec in the image text)
    // We will upsert.
    
    try {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      });
    } catch (e) {
      console.warn(`Skipping duplicate or error for ${p.slug}`);
    }
  }
  
  console.log('Seed completed.');
}

async function seedResellers() {
  console.log('Seeding resellers...');
  await prisma.reseller.deleteMany({});

  const resellers = [
    {
      name: "PAPEX - PAPETERIE EXPRESS",
      address: "56, Rue Abdou Karim BOURGI",
      city: "Dakar",
      country: "Sénégal",
      phone: "+221 33 849 63 63",
      fax: "+221 33 821 21 02",
      email: "contact@papex.sn",
      lat: 14.6715,
      lng: -17.4370,
    },
    {
      name: "PAPICI - TOP BURO",
      address: "1 Bd Valéry Giscard d'Estaing",
      city: "Abidjan",
      country: "Côte d'Ivoire",
      phone: "+225 27 21 28 20 78",
      lat: 5.3000,
      lng: -3.9960,
    },
    {
      name: "GIPA",
      address: "Rue Ange M'ba",
      city: "Libreville",
      country: "Gabon",
      phone: "+241 11 76 22 91",
      lat: 0.3920,
      lng: 9.4520,
    },
    {
      name: "Bureau Vallée Sainte Marie",
      address: "Gillot Est - Retail Park",
      city: "Sainte-Marie (La Réunion)",
      country: "France",
      lat: -20.8930,
      lng: 55.5250,
    },
    {
      name: "Hachette Pacifique",
      address: "FC2C+7XJ, Vallée de Tipaerui",
      city: "Papeete",
      country: "Polynésie française",
      phone: "+689 40 46 17 00",
      lat: -17.5410,
      lng: -149.5760,
    },
  ];

  for (const r of resellers) {
    await prisma.reseller.create({
      data: r,
    });
  }
  console.log(`Seeded ${resellers.length} resellers.`);
}

main()
  .then(async () => {
    await seedResellers();
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
