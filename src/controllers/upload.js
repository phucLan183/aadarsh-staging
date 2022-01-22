const ImageModel = require('../models/Uploads');
const cloudinary = require('../utils/cloudinary');

const getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skipPage = page * pageSize - pageSize
    const folder = req.query.folder
    const dataImage = await ImageModel.find({
      folder: folder
    }).sort({
      "_id": -1
    }).select('-updatedAt').skip(skipPage).limit(pageSize).lean()
    const totalImage = await ImageModel.countDocuments({
      folder: folder
    })
    res.status(200).json({
      status: 'success',
      data: dataImage,
      total: totalImage
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const createImage = async (req, res) => {
  try {
    const file = req.file.path
    const folder = req.query.folder
    const type = req.query.type
    let uploadToCloud
    if (type === 'image') {
      uploadToCloud = await cloudinary.uploader.upload(file, {
        folder: folder
      })
    } else if (type === 'video') {
      uploadToCloud = await cloudinary.uploader.upload(file, {
        resource_type: "video",
        folder: folder
      })
    }
    const dataImage = new ImageModel({
      urlImage: uploadToCloud.secure_url,
      publicIdImage: uploadToCloud.public_id,
      folder: folder
    })
    const saveData = await dataImage.save()
    res.status(200).json({
      url: saveData.urlImage
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const getOneImage = async (req, res) => {
  try {
    const imageId = req.params.id
    const dataImage = await ImageModel.findById({
      _id: imageId
    }).select('urlImage').lean()
    if (!dataImage) {
      return res.status(400).json({
        status: 'false',
        message: 'Could not find data image'
      })
    }
    res.status(200).json({
      status: 'success',
      data: {
        url: dataImage.urlImage
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateImage = async (req, res) => {
  try {
    const imageId = req.params.id
    const currentImage = req.file.path
    const checkDataImage = await ImageModel.findById(imageId).lean()
    if (!checkDataImage) {
      return res.status(404).json({
        status: 'false',
        message: 'Could not find data image'
      })
    }

    const updateImageIntoCloud = await cloudinary.uploader.upload(currentImage, {
      public_id: checkDataImage.publicIdImage,
      overwrite: true,
      invalidate: true
    })

    const updateDataImage = await ImageModel.findByIdAndUpdate({
      _id: imageId
    }, {
      $set: {
        urlImage: updateImageIntoCloud.secure_url,
        publicIdImage: updateImageIntoCloud.public_id
      }
    }, { new: true })
    res.status(200).json({
      status: 'success',
      data: {
        url: updateDataImage.urlImage
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id
    const type = req.query.type
    const checkDataImageAndDelete = await ImageModel.findByIdAndDelete({
      _id: imageId
    }, { new: true })
    let deleteFileInCloud
    if (type === 'image') {
      deleteFileInCloud = await cloudinary.uploader.destroy(checkDataImageAndDelete.publicIdImage)
    } else if (type === 'video') {
      deleteFileInCloud = await cloudinary.uploader.destroy(checkDataImageAndDelete.publicIdImage, {
        resource_type: 'video'
      })
    }
    if (!checkDataImageAndDelete || !deleteFileInCloud) {
      return res.status(400).json({
        status: 'false',
        message: 'Could not find data image'
      })
    }
    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

module.exports = {
  getAllImages: getAllImages,
  createImage: createImage,
  getOneImage: getOneImage,
  deleteImage: deleteImage
}