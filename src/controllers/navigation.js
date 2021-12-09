const CategoryModel = require('../models/categories')

module.exports = async (req, res) => {
  try {
    const dataCategory = await CategoryModel.find().select('name slug')
    const dataCategoryWithProducts = dataCategory.map((item) => ({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      type: 'CATEGORY',
      products: []
    }))
    res.status(200).json({
      status: 'success',
      data: dataCategoryWithProducts
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}