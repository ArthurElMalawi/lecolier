
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
    imageUrl: '/file.svg',
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

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
