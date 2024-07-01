import request from '@/utils/request'


//params:{
//               pin: this.addUserDialogData.value,
//               email: this.addUserDialogData.email,
//               phone: this.addUserDialogData.mobile,
//               username: this.addUserDialogData.realName
//             }
export function saveSupplierUser(pin,email,phone,username) {
  return request({
    url: '/supplier/saveNewUser',
    method: 'post',
    params: {
      pin: pin,
      email: email,
      phone: phone,
      username: username
    }
  })
}

//params:supplierUserId
export function deleteSuppliersUser(pin) {
  return request({
    url: '/user/deleteDeveloper',
    method: 'post',
    data: {pin:pin}
  })
}

//params: pin,yn
export function updateIdaasYnByOther(pin,yn) {
  return request({
    url: '/user/updateIdaasYnByOther',
    method: 'post',
    data: {pin:pin,yn:yn}
  })
}


//params:{ pageSize: 1, pageNumb: 1 }
export function getSupplierUsersByUserPin(params) {
  return request({
    url: '/user/getSupplierUsersByUserPin',
    method: 'get',
    params: params
  })
}

//
export function saveDeveloper(username,phone, email,pin) {
  return request({
    url:"/user/saveDeveloper",
    method:'post',
    params:{
      username:username,
      phone:phone,
      email:email,
      pin:pin,
    }
  })
}
