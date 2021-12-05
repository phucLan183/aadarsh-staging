const SettingModel = require('../models/Settings');

const settingId = '61ac88a67029db002e57e53e'

const getOneSetting = async (req, res) => {
  try {
    const dataSetting = await SettingModel.findById(settingId)
    res.status(200).json({
      status: 'success',
      data: dataSetting
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}

const updateSetting = async (req, res) => {
  try {
    const body = req.body
    const dataSetting = await SettingModel.findByIdAndUpdate({
      _id: settingId
    }, {
      $set: {
        website: body.website,
        email: body.email,
        hotline: body.hotline,
        address: body.address,
        logo: body.logo,
        favicon: body.favicon,
        facebook: body.facebook,
        twitter: body.twitter
      }
    }, {
      new: true
    })
    res.status(200).json({
      status: 'success',
      data: dataSetting
    })
  } catch (error) {
    res.status(500).json({
      status: 'false',
      message: error.message
    })
  }
}


module.exports = {
  getOneSetting: getOneSetting,
  updateSetting: updateSetting
}