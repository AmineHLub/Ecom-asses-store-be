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

  // add swagger doc here
  /**
   * @swagger
   * /products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: The created product.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       500:
   *         description: Create failed
   */
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

  // add swagger doc here
  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Get a paginated list of products
   *     tags: [Products]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number (default is 1)
   *       - in: query
   *         name: per_page
   *         schema:
   *           type: integer
   *         description: Number of items per page (default is 20, max is 100)
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filter products by category
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search products by title
   */
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

  // add swagger doc here
  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     summary: Get a product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The product ID
   *     responses:
   *       200:
   *         description: The product data.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       404:
   *         description: Product not found
   */
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

  // add swagger doc here
  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     summary: Update a product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: The updated product.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       500:
   *         description: Update failed
   */
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

  // add swagger doc here
  /**
   * @swagger
   * /products/{id}:
   *   patch:
   *     summary: Partially update a product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: The updated product.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       500:
   *         description: Update failed
   */
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

  // add swagger doc here
  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     summary: Delete a product by ID
   *     tags: [Products]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The product ID
   *     responses:
   *       200:
   *         description: Product deleted successfully.
   *       500:
   *         description: Delete failed
   */
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

  // add swagger doc here
  /**
   * @swagger
   * /products/createbunchrandom:
   *   post:
   *     summary: Create a bunch of random educational products
   *     tags: [Products]
   *     responses:
   *       200:
   *         description: Bulk product creation result.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 inserted:
   *                   type: integer
   *                   description: Number of products inserted
   *                 totalGenerated:
   *                   type: integer
   *                   description: Total number of products generated
   *       500:
   *         description: Bulk product creation failed
   */
})

// add swagger doc tags here
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for products in the store
 */


export default router
