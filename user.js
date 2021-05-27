var dataUser = Cookies.get('dataUser');
var obj = JSON.parse(Cookies.get('refresh_token'));
var _objectId = Cookies.get('_objectId');
if (dataUser != undefined) {
    dataUser = JSON.parse(dataUser)
}
$(document).ready(function () {
    if (dataUser.rule == 'Master Admin' || dataUser.rule == 'admin') {
        document.getElementById("userlogin").innerText = 'ผู้ใช้งาน : ' + dataUser.user + '\n' + 'สิทธิ์ผู้ใช้งาน : ' + dataUser.rule
        document.getElementById("namecompyny").innerText = dataUser.company

        $("#queueview").addClass('intronone');
    }
    console.log(obj.refresh_token)
    console.log(dataUser)
    console.log(_objectId)
});