
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

function getmessage(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        axios.get(urlipaddress + 'message/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            var cnt = response.data.message.values.length;
            var n = 0;
            var _arr = new Array();
            console.log(response.data.message.values.message)
            if (cnt != 0) {
                $("#txt_message").text(response.data.message.values.message);
                _arr[n] = {
                    message: response.data.message.values.message,
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
                        {
                            data: "message",

                        },
                    ],
                });
            }


        }).catch(function (res) {
            const { response } = res
        });
    });
}

$(async function () {
    const result = await acctoken();
    await getmessage(result);



    /////////////////////////////////// สร้างข้อความหน้าจอ
    $('#submitmessage').on('click', function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {


            var urlipaddress = data.substring(1, data.length - 1);
            const socket = io(urlipaddress);
            socket.emit('sentMessage', document.getElementById("txtmessage").value);

            const datamessage = {
                'values': {
                    message: document.getElementById("txtmessage").value,
                }
            }


            axios.post(urlipaddress + 'message/' + _objectId, datamessage, {
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

$.getScript("ip.js", async function (data, textStatus, jqxhr) {
    var urlipaddress = data.substring(1, data.length - 1);
    const socket = io(urlipaddress);
    const result = await acctoken();
    console.log(socket)
    socket.on('sentMessage', async function (data) {
        getmessage(result);
    });

});


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
            location.href = "queuemessage.html";
        }
    });
}