var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');

var _arr = new Array();
var _arrInfo = new Array();
var n = 0;
var n_info = 0;
function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'token', data, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.access_token);
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                if (response.data.message == "Unauthorized") {
                    location.href = "index.html";
                    return;
                }

            });
        });
    });
}
function showCancelMessageregisteruser(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}
function showSuccessMessageregisteruser(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            location.href = "queueregisteruser.html";
        }
    });
}
function getUser(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const dataUserID = {
            userId: _objectId
        }
        axios.post(urlipaddress + 'user', dataUserID, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.data)
            var cnt = response.data.message.data.length;

            var n = 0;
            var num = 1;
            var _arr = new Array();
            for (i = 0; i < cnt; i++) {
                var _rule = response.data.message.data[i].rule.toLowerCase()
                if (_rule != "master admin") {
                    _arr[n] = {
                        _num: num,
                        user: response.data.message.data[i].user,
                        rule: response.data.message.data[i].rule.toLowerCase(),
                    }
                    num++
                    n = n + 1
                }
            }
            $('#table1').DataTable().destroy();
            $('#table1').DataTable({
                "lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
                "pageLength": 50,
                'data': _arr,
                "responsive": true,
                "autoWidth": false,
                "order": [],
                "paging": true,
                "ordering": true,
                "searching": true,
                "info": true,
                columns: [
                    { data: "_num" },
                    { data: "user" },
                    { data: "rule" },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="editor" style="font-size:16px;color:green; cursor: pointer;">เปลี่ยนรหัสผ่าน </i> / <i href="" class="remove" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                    }
                ],
                // "createdRow": function (row, data, dataIndex) {
                //     // if (data.rule == "Master Admin") {
                //     //     $(row).addClass('i:read-only');
                //     // } 
                // }
            });
        }).catch(function (res) {
            const { response } = res
        });
    });
}
function validateUsernameUSER() {
    var regexNumber = /\d/; //ตรวจสอบว่าเป็นตัวเลข
    var regexLetter_A = /[a-z]/;  // ตรวจสอบว่า เป็นตัวอักษรภาษาอังกฤษ ทั้งพิมพ์ใหญ่และพิมพ์เล็ก
    var regexLetter_a = /[A-Z]/;
    var regExpStrong = /[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;
    var checkpassadmin = document.getElementById('passuser').value;
    if (regexLetter_A.test(checkpassadmin) && (regexLetter_a.test(checkpassadmin)) && (regexNumber.test(checkpassadmin)) && (regExpStrong.test(checkpassadmin))) {
        return true;
    } else {
        showCancelMessageregisteruser('กำหนดรหัสผ่านใหม่', 'ใช้อักขระ [A-Z,a-z,0-9] และสัญลักษณ์ผสมกัน')
        return false;
    }
}

$(async function () {
    const result = await acctoken();
    getUser(result);
   
    /////////////////////////////////// เพิ่มผู้ใช้งาน
    $('#submitvisitorRegis').on('click', async function (e) {
        const result = await acctoken();
        if(document.getElementById("user").value == '' || document.getElementById("passuser").value ==''){
            showCancelMessageregisteruser('กรอกข้อมูลให้ครบ', '')
            return;
        }
        // var chk_pass = validateUsernameUSER();
        // if (chk_pass == false) {
        //     return;
        // }
        document.getElementById("save").innerText = "";
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);

            const dataUser = {
                userId: _objectId,
                user: document.getElementById("user").value,
                password: document.getElementById("passuser").value,
                rule: document.getElementById("rule").value.toLowerCase()
            }
            console.log(dataUser)
            console.log(result)
            axios.put(urlipaddress + 'addAccount', dataUser, {
                headers: {
                    'Authorization': result,
                }
            }
            ).then(function (response) {
                console.log(response.data.message)
                if (response.data.message == "This user has already been used.") {
                    showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                } else {
                    showSuccessMessageregisteruser('บันทึกสำเร็จ')
                    getUser(result);
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                if (response.data.message == 'This user has already been used.') {
                    showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                }
            });
        });
    });

    /////////////////////////////////// ลบผู้ใช้งาน
    var datauser;
    $('#table1').on('click', 'i.remove', function (e) {
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        datauser = _ro.data();
        if (datauser == undefined) {
            datauser = table.row(this).data();
        }
        $("#myModaldelete").modal();
       console.log(datauser)
        document.getElementById("user_edit").value = datauser.name;
        document.getElementById("passuser_old").value = "";
        document.getElementById("passuser_new").value = "";
        document.getElementById("update").innerText = "";
        $("#lbl_completed").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

    });
    /////////////////////ลบ
    $('#deleteUser').on('click', function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            console.log(datauser.user)
            console.log(_objectId)
            axios({
                url: urlipaddress + 'delPass',
                method: 'delete',
                data: {
                    userId: _objectId,
                    userName: datauser.user
                },
                headers: { 'Authorization': result }
            }).then(function (response) {
                if (response.data.message == "delete completed") {
                  showSuccessMessageregisteruser('ลบข้อมูลสำเร็จ')
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessageregisteruser(response.data.message, '')

            });
        });
    });



    $('#table1').on('click', 'i.editor', function (e) {
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        datauser = _ro.data();
        if (datauser == undefined) {
            datauser = table.row(this).data();
        }
        $("#myModaledit").modal();
        document.getElementById("user_edit").value = datauser.user
    });
    /////////////////////อัพเดท Password
    $('#UPDATE').on('click', function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const dataUser = {
                user: document.getElementById("user_edit").value,
                password: document.getElementById("passuser_old").value,
                newPassword: document.getElementById("passuser_new").value,
            }
            axios.post(urlipaddress + 'changePass', dataUser, {
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                if (response.data.message == "Change password is complete.") {
                    showSuccessMessageregisteruser('อัพเดทข้อมูลสำเร็จ')
                }

            }).catch(function (res) {
                const { response } = res
                if (response.data.message == "update fail.") {
                    showCancelMessageregisteruser('บันทึกข้อมูลไม่สำเร็จ', '')
                }
                if (response.data.message == "Wrong user or password") {

                    showCancelMessageregisteruser('รหัสผ่านเดิมไม่ถูกต้อง', '')
                }

            });
        });
    });



});
