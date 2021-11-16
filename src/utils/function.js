const comparePermission = (permission1, permission2) => {
  let isEqual = true
  Object.keys(permission1).forEach((key) => {
    const valuePermission1 = permission1[key]
    const valuePermission2 = permission2[key]
    if (valuePermission1 && !valuePermission2) {
      isEqual = false
    } else {
      valuePermission1?.forEach((method1) => {
        if (!valuePermission2.includes(method1)) {
          isEqual = false
        }
      })
    }
  })
  return isEqual
}

module.exports = { comparePermission }