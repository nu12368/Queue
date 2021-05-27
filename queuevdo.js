
var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'token', data, {
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



function getvdo(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        axios.get(urlipaddress + 'videoUrl/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values.videoUrl)

            var cnt = response.data.message.values.length;

            var n = 0;
            var _arr = new Array();
            _arr[n] = {
                videoUrl: response.data.message.values.videoUrl,
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
                            data: "videoUrl",
                            render: function (data, type, row, meta) {
                                if (type === 'display') {
                                    data = '<a href="' + data + '">' + data + '</a>';
                                }
                                return data;
                            }
                        },
                        {
                            data: "videoUrl",
                            render: function (data, type, row, meta) {
                                if (type === 'display') {

                                    const url = data;
                                    const v = new URL(url).searchParams.get('v');
                                    data = `<div >
                                    <iframe
                                    width="100%" height="270"  
                                    src="https://www.youtube.com/embed/${v}?feature=oembed"
                                    allowfullscreen></iframe>
                                          </div>`
                                }
                                return data;
                            }
                        },
                    ],
                });
           
        }).catch(function (res) {
            const { response } = res
        });
    });
}

$(async function () {
    const result = await acctoken();
    await getvdo(result);

    /////////////////////////////////// สร้างวีดีโอ
    $('#submitvdo').on('click', function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);

            const socket = io(urlipaddress);
            socket.emit('sentVideoUrl', document.getElementById("linkvdourl").value);


            const datavdo = {
                'values': {
                    videoUrl: document.getElementById("linkvdourl").value,
                }
            }
            axios.post(urlipaddress + 'videoUrl/' + _objectId, datavdo, {
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                showSuccessMessagevdo('บันทึกสำเร็จ')

            }).catch(function (res) {
                const { response } = res
                if (response.data.message == 'This user has already been used.') {
                    showCancelMessagevdo('มีข้อมูลในระบบแล้ว', '')
                }
            });
        });
    });

});

function showCancelMessagevdoe(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}
function showSuccessMessagevdo(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            location.href = "queuevdo.html";
        }
    });
}