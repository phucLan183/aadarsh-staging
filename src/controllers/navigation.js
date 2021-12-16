const CategoryModel = require('../models/categories');
const ProductModel = require('../models/Products');

const getNavigations = async (req, res) => {
  try {
    const dataCategory = await CategoryModel.find().select('name slug')
    const dataProduct = await ProductModel.find().select('name slug categoryId')

    const dataCategoryWithProducts = dataCategory.map((item) => ({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      type: 'CATEGORY',
      products: dataProduct.filter((data) => {
        return data.categoryId.map((category) => {
          return category.toString()
        }).includes(item._id.toString())
      })
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
        active: true,
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
      const dataProduct = await ProductModel.findOne({
        active: true,
        slug: slug
      })
      if (!dataProduct) {
        return res.status(404).json({
          status: 'false',
          message: 'Không tìm thấy dữ liệu!'
        })
      }
      res.status(200).json({
        status: 'success',
        data: dataProduct
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