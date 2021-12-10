const CategoryModel = require('../models/categories')

const getNavigations = async (req, res) => {
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

const getNavigation = async (req, res) => {
  try {
    const { type, slug } = req.query
    if (type === 'CATEGORY') {
      const dataCategory = await CategoryModel.findOne({
        slug: slug
      })
      if (!dataCategory) {
        return res.status(404).json({
          status: 'false',
          message: 'Không tìm thấy dữ liệu!'
        })
      }
      res.status(200).json({
        status: 'success',
        data: dataCategory
      })
    } else if (type === 'PRODUCT') {
      res.status(200).json({
        status: 'success'
      })
    }

  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}


module.exports = {
  getNavigations: getNavigations,
  getNavigation: getNavigation
}