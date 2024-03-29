var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var dataUser = userId
var arr = new Array();
if (dataUser != undefined) {
    dataUser = JSON.parse(dataUser)
}

function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'permit', {}, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.access_token);
            }).catch(function (res) {
                const { response } = res
                if (response.data.message == "Unauthorized") {
                    location.href = "index.html";
                }
            });
        });
    });
}

var strlogo
const getlogocompanysetting = async (refresh_token) => {
    console.log(refresh_token)
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        console.log(urlipaddress + 'logo/' + _objectId)
        axios.get(urlipaddress + 'logo/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message)
            for (let index = 0; index < response.data.message.length; index++) {
                console.log(index)
                if (response.data.message[index].usedFor == 'web') {
                    document.getElementById('txtnamecompyny').value = response.data.message[index].name
                    document.getElementById('logoId').value = response.data.message[index].logoId
                    viewlogosetting(refresh_token, response.data.message[index].imageLogo[0], index)
                }
                if (response.data.message[index].usedFor == 'slip') {
                    document.getElementById('logoIdslip').value = response.data.message[index].logoId
                    viewlogosettingslip(refresh_token, response.data.message[index].imageLogo[0], index)
                }
            }
        }).catch(function (res) {
            const { response } = res
        });
    });
}

function viewlogosetting(refresh_token, idlogo, index) {
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId
        axios.get(urlipaddress + "files/logo/" + idlogo, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (responseview) {
            console.log(responseview.data)
            var arrayBuffer = responseview.data; // Note: not oReq.responseText
            var u8 = new Uint8Array(arrayBuffer);
            var b64encoded = btoa(String.fromCharCode.apply(null, u8));
            var mimetype = "image/png"; // or whatever your image mime type is
            $('#LOGOVIEW').attr('src', "data:" + mimetype + ";base64," + b64encoded);
            arr[index] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, 'web.jpg');
            console.log(arr)
        });
    });
}

function viewlogosettingslip(refresh_token, idlogo, index) {
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId
        axios.get(urlipaddress + "files/logo/" + idlogo, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (responseview) {
            console.log(responseview.data)
            var arrayBuffer = responseview.data; // Note: not oReq.responseText
            var u8 = new Uint8Array(arrayBuffer);
            var b64encoded = btoa(String.fromCharCode.apply(null, u8));
            var mimetype = "image/png"; // or whatever your image mime type is
            $('#LOGOVIEWslip').attr('src', "data:" + mimetype + ";base64," + b64encoded);
            arr[index] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, 'slip.jpg');
            console.log(arr)
        });
    });
}

$(document).ready(async function () {
    console.log(dataUser)
    if (dataUser.rule == 'root') {
        document.getElementById("userlogin").innerText = 'ผู้ใช้งาน : ' + dataUser.username + ' | สิทธิ์ผู้ใช้งาน : ' + dataUser.rule
        $("#queueview").addClass('intronone');
    }
    const result = await acctoken();
    await getlogocompanysetting(result)
    $('#submitcompany').on('click', async function (e) {
        const result = await acctoken();
        if (document.getElementById("txtnamecompyny").value == '') {
            showCancelMessageregisteruser('กรอกข้อมูลให้ครบ', '')
            return;
        }
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            console.log(document.getElementById('logoId').value)
            if (document.getElementById('logoId').value != '') {
                const datanew = {
                    mId: _objectId,
                    logoId: document.getElementById('logoId').value
                }
                axios({
                    url: urlipaddress + 'logo',
                    method: 'delete',
                    data: datanew,
                    headers: { 'Authorization': result }
                }).then(async function (responsedelete) {
                    var formData = new FormData();
                    formData.append('mId', _objectId);
                    var file_data = $('#fileilogo').prop('files')[0];
                    if (file_data != undefined) {
                        formData.append('imageLogo', file_data);
                    } else {
                        for (let index = 0; index < arr.length; index++) {
                            console.log(arr[index].name)
                            if(arr[index].name == 'web.jpg'){
                                formData.append('imageLogo', arr[index]);
                            }
                        }
                    }
                    const url = urlipaddress + 'logo';
                    formData.append('name', document.getElementById("txtnamecompyny").value);
                    formData.append('usedFor', 'web');
                    axios.post(url, formData, {
                        headers: {
                            'Authorization': result,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    ).then(function (response) {
                        console.log(response.data.message)
                        if (response.data.message == "Successfully save logo completed.") {
                            showSuccessMessageregisteruser('บันทึกสำเร็จ', '')
                        }
                    }).catch(function (res) {
                        const { response } = res
                        showCancelMessageregisteruser(res.data.message, '')
                    });
                });
            } else {
                var formData = new FormData();
                formData.append('mId', _objectId);
                var file_data = $('#fileilogo').prop('files')[0];
                if (file_data != undefined) {
                    formData.append('imageLogo', file_data);
                } else {
                    formData.append('imageLogo', '');
                }
                const url = urlipaddress + 'logo';
                formData.append('name', document.getElementById("txtnamecompyny").value);
                formData.append('usedFor', 'web');
                axios.post(url, formData, {
                    headers: {
                        'Authorization': result,
                        'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(function (response) {
                    console.log(response.data.message)
                    if (response.data.message == "Successfully save logo completed.") {
                        showSuccessMessageregisteruser('บันทึกสำเร็จ', '')
                    }
                }).catch(function (res) {
                    const { response } = res
                    showCancelMessageregisteruser(res.data.message, '')
                });
            }
        });
    });


    ////////////////////////////    slip
    $('#submitcompanyslip').on('click', async function (e) {
        const result = await acctoken();

        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            console.log(document.getElementById('logoIdslip').value)
            if (document.getElementById('logoIdslip').value != '') {
                const datanew = {
                    mId: _objectId,
                    logoId: document.getElementById('logoIdslip').value
                }
                axios({
                    url: urlipaddress + 'logo',
                    method: 'delete',
                    data: datanew,
                    headers: { 'Authorization': result }
                }).then(async function (responsedelete) {
                    var formData = new FormData();
                    formData.append('mId', _objectId);
                    var file_data = $('#fileilogoslip').prop('files')[0];
                    if (file_data != undefined) {
                        formData.append('imageLogo', file_data);
                    } else {
                        for (let index = 0; index < arr.length; index++) {
                            if(arr[index].name == 'slip.jpg'){
                                formData.append('imageLogo', arr[index]);
                            }
                        }
                    }
                    const url = urlipaddress + 'logo';
                    formData.append('usedFor', 'slip');
                    axios.post(url, formData, {
                        headers: {
                            'Authorization': result,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    ).then(function (response) {
                        console.log(response.data.message)
                        if (response.data.message == "Successfully save logo completed.") {
                            showSuccessMessageregisteruser('บันทึกสำเร็จ', '')
                        }
                    }).catch(function (res) {
                        const { response } = res
                        showCancelMessageregisteruser(res.data.message, '')
                    });
                });
            } else {
                var formData = new FormData();
                formData.append('mId', _objectId);
                var file_data = $('#fileilogoslip').prop('files')[0];
                if (file_data != undefined) {
                    formData.append('imageLogo', file_data);
                } else {
                    formData.append('imageLogo', '');
                }
                const url = urlipaddress + 'logo';
                formData.append('usedFor', 'slip');
                axios.post(url, formData, {
                    headers: {
                        'Authorization': result,
                        'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(function (response) {
                    console.log(response.data.message)
                    if (response.data.message == "Successfully save logo completed.") {
                        showSuccessMessageregisteruser('บันทึกสำเร็จ', '')
                    }
                }).catch(function (res) {
                    const { response } = res
                    showCancelMessageregisteruser(res.data.message, '')
                });
            }
        });
    });
});

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
            location.href = "company.html";
        }
    });
}

function dataURLtoFileEdit(dataurl, filename) {
    var arr_1 = dataurl.split(','),
        mime = arr_1[0].match(/:(.*?);/)[1],
        bstr = atob(arr_1[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}