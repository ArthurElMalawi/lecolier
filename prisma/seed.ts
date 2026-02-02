
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, CoverType, Format, Ruling, Prisma } from '../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: `${process.env.DATABASE_URL}` })
const prisma = new PrismaClient({ adapter })

// 12 produits réalistes selon les spécifications
const products: Prisma.ProductCreateInput[] = [
  // 90g polypro piqué
  {
    nameFr: 'Cahier 90g Polypro piqué 17x22 48p Seyès',
    nameEn: 'Notebook 90gsm Polypro stitched 17x22 48p Seyes',
    slug: 'cahier-90g-polypro-pique-17x22-48p-seyes',
    grammageGsm: 90,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F17x22,
    ruling: Ruling.SEYES,
    pages: 48,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 90g Polypro piqué 17x22 96p Ligne',
    nameEn: 'Notebook 90gsm Polypro stitched 17x22 96p Lined',
    slug: 'cahier-90g-polypro-pique-17x22-96p-ligne',
    grammageGsm: 90,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F17x22,
    ruling: Ruling.LIGNE,
    pages: 96,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 90g Polypro piqué 21x29,7 48p Seyès',
    nameEn: 'Notebook 90gsm Polypro stitched 21x29.7 48p Seyes',
    slug: 'cahier-90g-polypro-pique-21x29_7-48p-seyes',
    grammageGsm: 90,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F21x29_7,
    ruling: Ruling.SEYES,
    pages: 48,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 90g Polypro piqué 21x29,7 96p Quadri',
    nameEn: 'Notebook 90gsm Polypro stitched 21x29.7 96p Quad',
    slug: 'cahier-90g-polypro-pique-21x29_7-96p-quadri',
    grammageGsm: 90,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F21x29_7,
    ruling: Ruling.QUADRI,
    pages: 96,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 90g Polypro piqué 24x32 48p Seyès',
    nameEn: 'Notebook 90gsm Polypro stitched 24x32 48p Seyes',
    slug: 'cahier-90g-polypro-pique-24x32-48p-seyes',
    grammageGsm: 90,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F24x32,
    ruling: Ruling.SEYES,
    pages: 48,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 90g Polypro piqué 24x32 96p Ligne',
    nameEn: 'Notebook 90gsm Polypro stitched 24x32 96p Lined',
    slug: 'cahier-90g-polypro-pique-24x32-96p-ligne',
    grammageGsm: 90,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F24x32,
    ruling: Ruling.LIGNE,
    pages: 96,
    imageUrl: '/file.svg',
  },

  // 70g polypro piqué
  {
    nameFr: 'Cahier 70g Polypro piqué 17x22 96p Seyès',
    nameEn: 'Notebook 70gsm Polypro stitched 17x22 96p Seyes',
    slug: 'cahier-70g-polypro-pique-17x22-96p-seyes',
    grammageGsm: 70,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F17x22,
    ruling: Ruling.SEYES,
    pages: 96,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 70g Polypro piqué 17x22 144p Ligne',
    nameEn: 'Notebook 70gsm Polypro stitched 17x22 144p Lined',
    slug: 'cahier-70g-polypro-pique-17x22-144p-ligne',
    grammageGsm: 70,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F17x22,
    ruling: Ruling.LIGNE,
    pages: 144,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 70g Polypro piqué 21x29,7 96p Seyès',
    nameEn: 'Notebook 70gsm Polypro stitched 21x29.7 96p Seyes',
    slug: 'cahier-70g-polypro-pique-21x29_7-96p-seyes',
    grammageGsm: 70,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F21x29_7,
    ruling: Ruling.SEYES,
    pages: 96,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 70g Polypro piqué 21x29,7 144p Quadri',
    nameEn: 'Notebook 70gsm Polypro stitched 21x29.7 144p Quad',
    slug: 'cahier-70g-polypro-pique-21x29_7-144p-quadri',
    grammageGsm: 70,
    coverType: CoverType.POLYPRO_PIQUE,
    format: Format.F21x29_7,
    ruling: Ruling.QUADRI,
    pages: 144,
    imageUrl: '/file.svg',
  },

  // 58g cartonné
  {
    nameFr: 'Cahier 58g Cartonné 17x22 96p Blanc',
    nameEn: 'Notebook 58gsm Hard cover 17x22 96p Plain',
    slug: 'cahier-58g-cartonne-17x22-96p-blanc',
    grammageGsm: 58,
    coverType: CoverType.CARTONNE,
    format: Format.F17x22,
    ruling: Ruling.BLANC,
    pages: 96,
    imageUrl: '/file.svg',
  },
  {
    nameFr: 'Cahier 58g Cartonné 17x22 192p Ligne',
    nameEn: 'Notebook 58gsm Hard cover 17x22 192p Lined',
    slug: 'cahier-58g-cartonne-17x22-192p-ligne',
    grammageGsm: 58,
    coverType: CoverType.CARTONNE,
    format: Format.F17x22,
    ruling: Ruling.LIGNE,
    pages: 192,
    imageUrl: '/file.svg',
  },
]

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }
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
