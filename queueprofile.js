
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
                    'Authorization': obj.refresh_token
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

function getcategory(refresh_token) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'category/' + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                console.log(response.data.message.category)

                var cnt = response.data.message.category.length;

                var n = 0;
                var num = 1;
                var _arr = new Array();
                for (i = 0; i < cnt; i++) {
                    _arr[n] = {
                        _num: num,
                        DPTCODE: response.data.message.category[i].DPTCODE,
                        category: response.data.message.category[i].category,
                    }
                    num++
                    n = n + 1

                }
                console.log(_arr)
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
                        { data: "DPTCODE" },
                        { data: "category" },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="removeprofile" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                        }
                    ],
                });

                var $select = $('#category');
                $select.find('option').remove();
                $select.append('<option value=' + '0' + '>' + '-- เลือกแผนก --' + '</option>');
                $.each(response.data.message.category, function (key, value) {
                    $select.append(`<option>${value.category}</option>`);
                });


                resolve(response.data.message.category.length);

            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}

function getprofile(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        axios.get(urlipaddress + 'profile/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values)

            var cnt = response.data.message.values.length;

            var n = 0;
            var num = 1;
            var _arr = new Array();
            // $("#ul_profile").append(`<li><a style="cursor: pointer;" data-close="true">โปรไฟล์</a>
            // </li>`);
            for (i = 0; i < cnt; i++) {

                _arr[n] = {
                    _num: num,
                    name: response.data.message.values[i].name,
                    category: response.data.message.values[i].category,
                }
                num++
                n = n + 1
                // $("#ul_profile").append(`<li id='${response.data.message.values[i].name}' name='${response.data.message.values[i].category}'><a style="cursor: pointer;" data-close="true">${response.data.message.values[i].name}</a>
                // </li>`);
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
                    { data: "name" },
                    { data: "category" },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="removeprofile" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                    }
                ],
            });
        }).catch(function (res) {
            const { response } = res
        });
    });
}

$(async function () {
    const result = await acctoken();
    await getcategory(result);
    await getprofile(result);
    /////////////////////////////////// ลบโปรไฟล์
    var datauser;
    $('#table1').on('click', 'i.removeprofile', function (e) {
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        datauser = _ro.data();
        if (datauser == undefined) {
            datauser = table.row(this).data();
        }
        $("#myModaldelete").modal();

        console.log(datauser)
        $("#lbl_completed").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

    });
    /////////////////////ลบ
    $('#deleteprofile').on('click', async function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            console.log(datauser.name)
            console.log(_objectId)
            axios({
                url: urlipaddress + 'delProfile',
                method: 'delete',
                data: {
                    userId: _objectId,
                    name: datauser.name
                },
                headers: { 'Authorization': result }
            }).then(function (response) {
                if (response.data.message == "delete completed") {
                    $("#myModaldelete").empty();
                    showSuccessMessageprofile('ลบข้อมูลสำเร็จ')
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessageprofile(response.data.message, '')
            });
        });
    });

    /////////////////////////////////// สร้างโปรไฟล์
    $('#submitprofile').on('click', function (e) {

        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var sp = document.getElementById("input-tags").value.split(',')
            console.log(sp)

            const dataprofile = {
                'values': {
                    name: document.getElementById("nameprofile").value,
                    'category': sp
                }
            }
            console.log(dataprofile)
            axios.post(urlipaddress + 'profile/' + _objectId, dataprofile, {
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                showSuccessMessageprofile('บันทึกสำเร็จ')
                getprofile(result);
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                if (response.data.message == 'That name already exists') {
                    showCancelMessageprofile('มีข้อมูลในระบบแล้ว', '')
                }
            });
        });
    });

   
});

function showCancelMessageprofile(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}
function showSuccessMessageprofile(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            location.href = "queueProfile.html";
        }
    });
}