import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { createEducationalProducts } from './utils/generator'

const prisma = new PrismaClient()
const router = Router()

router.post('/products', async (req, res) => {
  try {
    const data = req.body

    const created = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        discountPercentage: data.discountPercentage,
        rating: data.rating,
        stock: data.stock,
        brand: data.brand,
        category: data.category,
        thumbnail: data.thumbnail,
        images: data.images || []
      }
    })

    res.json(created)
  } catch (err) {
    res.status(500).json({ error: 'Create failed', details: String(err) })
  }
})

router.get('/products', async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const perPage = Math.min(
      Math.max(Number(req.query.per_page) || 20, 1),
      100
    )

    const category = typeof req.query.category === 'string'
      ? req.query.category
      : undefined

    const search = typeof req.query.search === 'string'
      ? req.query.search
      : undefined

    const skip = (page - 1) * perPage

    const where = {
      ...(category && { category }),
      ...(search && {
        title: {
          contains: search,
        }
      })
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    const totalPages = Math.ceil(total / perPage)

    res.json({
      data: items,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch products',
      details: String(err)
    })
  }
})


// READ ONE
router.get('/products/:id', async (req, res) => {
  const id = Number(req.params.id)

  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    return res.status(404).json({ error: 'Not found' })
  }

  res.json(product)
})


// UPDATE PUT
router.put('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const data = req.body

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        discountPercentage: data.discountPercentage,
        rating: data.rating,
        stock: data.stock,
        brand: data.brand,
        category: data.category,
        thumbnail: data.thumbnail,
        images: data.images
      }
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: String(err) })
  }
})

// UPDATE PATCH
router.patch('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const data = req.body

    const updated = await prisma.product.update({
      where: { id },
      data: data
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: String(err) })
  }
})


// DELETE
router.delete('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    await prisma.product.delete({
      where: { id }
    })

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: String(err) })
  }
})

router.post('/products/createbunchrandom', async (req, res) => {
  try {
    const products = createEducationalProducts()

    const result = await prisma.product.createMany({
      data: products,
      skipDuplicates: true
    })

    res.json({
      inserted: result.count,
      totalGenerated: products.length
    })
  } catch (err) {
    res.status(500).json({
      error: 'Bulk product creation failed',
      details: String(err)
    })
  }
})


export default router
