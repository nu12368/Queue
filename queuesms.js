
var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'permit', {}, {
                headers: {
                    'Authorization': obj
                }
            }).then(function (response) {
                resolve(response.data.message.access_token);
            }).catch(function (res) {
                const { response } = res
                if (response.data.message == "Unauthorized") {
                    location.href = "index.html";
                    return;
                }
            });
        });
    });
}

$(async function () {
    const result = await acctoken();
    console.log(result)

    await getsms(result);
    /////////////////////////////////// SMS
    $('#submitsms').on('click', async function (e) {
        $.getScript("ip.js", async function (data, textStatus, jqxhr) {
            const result = await acctoken();
            var urlipaddress = data.substring(1, data.length - 1);

            const datasms = {
                mId: _objectId,
                sendSms: document.getElementById("open").checked,
                sendSmsLimit: parseInt(document.getElementById("txtmessage").value)
            }
            console.log(datasms)

            axios.post(urlipaddress + 'conf/', datasms, {
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                console.log(response.data.message)
                showSuccessMessage_('บันทึกสำเร็จ')
            }).catch(function (res) {
                const { response } = res
                if (response.data.message == 'This user has already been used.') {
                    showCancelMessage_('มีข้อมูลในระบบแล้ว', '')
                }
            });
        });
    });

});
function getsms(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        console.log(urlipaddress + 'conf/' + _objectId)
        axios.get(urlipaddress + 'conf/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            document.getElementById("open").checked = response.data.message.data.smsSend
            document.getElementById("txtmessage").value = response.data.message.data.smsLimit
            document.getElementById("smscount").innerText = 'SMS ถูกใช้งานแล้วทั้งหมด ' + response.data.message.data.smsCount + ' ครั้ง '
        
        }).catch(function (res) {
            const { response } = res
        });
    });
}

function showCancelMessage_(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}
function showSuccessMessage_(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            location.href = "queuesms.html";
        }
    });
}