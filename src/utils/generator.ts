import { Product } from '@prisma/client'

export function createEducationalProducts(): Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] {
  const list = []

  const brands = ["EduTech","SchoolPro","LearnX","StudentHub","DevMaster"]
  const categories = ["electronics","home","fashion","sports","books"]

  for (let i = 1; i <= 250; i++) {
    const isZero = i % 11 === 0 || i % 17 === 0

    const stock = isZero ? 0 : Math.floor(Math.random() * 120) + 1
    const cat = categories[i % categories.length]
    const brand = brands[i % brands.length]

    const price = Math.floor(Math.random() * 900) + 10
    const discountPercentage = Math.floor(Math.random() * 30)
    const rating = Number((Math.random() * 5).toFixed(1))

    const img1 = `https://picsum.photos/id/${i + 30}/400/300`
    const img2 = `https://picsum.photos/id/${i + 60}/400/300`

    list.push({
      title: `${brand} product #${i}`,
      description: `Educational demo item number ${i} in category ${cat}`,
      price,
      discountPercentage,
      rating,
      stock,
      brand,
      category: cat,
      thumbnail: img1,
      images: i % 5 === 0 ? [img1] : [img1, img2]
    })
  }

  return list
}