const yup = require('yup');

const loginSchema = yup.object({
  body: yup.object({
    username: yup.string().required('Tên đăng nhập không được để trống'),
    password: yup.string().required('Mật khẩu không được để chống')
  })
})

const registerSchema = yup.object({
  body: yup.object({
    username: yup.string().required('Tên đăng nhập không được để trống'),
    fullname: yup.string().required(''),
    email: yup.string().required('Email không được để chống'),
    password: yup.string().required('Mật khẩu không được để trống')
  })
})


module.exports = {
  loginSchema,
  registerSchema
}