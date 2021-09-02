var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');

var _arr = new Array();
var _arrInfo = new Array();
var n = 0;
var n_info = 0;
console.log(obj)
var ar = new Array()
var num = 0;

function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'permit', {}, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function(response) {
                resolve(response.data.message.access_token);
            }).catch(function(res) {
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
    }, function(isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}

function showSuccessMessageregisteruser(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function(isConfirm) {
        if (isConfirm) {
            location.href = "queueadvancebooking.html";
        }
    });
}

async function getProp(refresh_token) {
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'getProp/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data.message.result)
            $('#table1').DataTable().destroy();
            $('#table1').DataTable({
                "lengthMenu": [
                    [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1],
                    [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]
                ],
                "pageLength": 50,
                'data': response.data.message.result,
                "responsive": true,
                "autoWidth": false,
                "order": [],
                "paging": true,
                "ordering": true,
                "searching": true,
                "info": true,
                columns: [
                    { data: "category" },
                    { data: "description" },
                    {
                        data: "timestamp",
                        render: function(data) {
                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                                return '-';
                            }
                            return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                        }
                    },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="settime" style="font-size:14px;color:blue; cursor: pointer;">เพิ่ม-แก้ไข จำนวนคิว</i> / <i href="" class="del" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                    },
                    // {
                    //     data: null,
                    //     className: "center",
                    //     defaultContent: '<i href="" class="del" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                    // },
                    { data: "intervalDifference", 'visible': false },
                    { data: "timePropId", 'visible': false },
                ],
            });


        }).catch(function(res) {
            const { response } = res
        });
    });
}


function timeLimit(refresh_token, category, datainterDiff) {
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'timeLimit/' + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function(response) {
                console.log(response.data.message.result)
                for (const i in response.data.message.result) {
                    if (response.data.message.result[i].category == category) {
                        const interDiff = response.data.message.result[i].interDiff
                        for (let f in interDiff) {
                            if (f == datainterDiff) {
                                // console.log(interDiff[f].limit)
                                resolve(interDiff[f].limit)
                                    // ar[num] = {
                                    //     'limit': interDiff[f].limit
                                    // }
                                    // num = num + 1
                            }
                        }
                    } else {}
                }
                resolve(0)
                    //   console.log(ar)
            });
        });
    });
}


$(async function() {
    const result = await acctoken();
    getProp(result);



    ////////////////////  บันทึกรายการ จอง มี ช่วงเวลา
    $('#submitlist').on('click', async function(e) {
        const result = await acctoken();
        var category = document.getElementById('postlist').value
        var hr = document.getElementById('starthours').value
        var mi = document.getElementById('startminutes').value
        if (category == '') {
            showCancelMessageregisteruser('กรุณาระบุรายการจอง', '')
            return
        }
        if (hr == '00' && mi == '00') {
            showCancelMessageregisteruser('กรุณาเลือกช่วงเวลา', '')
            return
        }
        var t_hr = hr / 60
        var t_mi = mi / 60
        var hms;
        if (t_hr == 0) {
            hms = t_mi
            hms = hms.toFixed(2)
        } else {
            console.log(t_mi)
            if (t_mi == 0) { /////:00
                hms = parseInt(hr)
            } else {
                hms = parseInt(hr) + t_mi
                hms = hms.toFixed(2)
            }
        }

        console.log(hms.toString())

        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'setProp';
            let formData = new FormData();
            console.log(_objectId)
                // if (arr.length == 0) {
            formData.append('userId', _objectId);
            formData.append('category', category);
            formData.append('intervalDifference', hms.toString());
            formData.append('setFormat', '0');
            formData.append('description', document.getElementById("categorydescription").value);
            //} else {
            // formData.append('userId', userId);
            // formData.append('category', category);
            // formData.append('intervalDifference', hms.toString());
            // formData.append('setFormat', '0');
            // formData.append('description', document.getElementById("categorydescription").value);
            // for (var i = 0; i < arr.length; i++) {
            //     if (arr[i] != " ") {
            // formData.append('imageProp', []);
            //     }
            // }
            //}
            axios.post(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message)
                showSuccessMessageregisteruser('บันทึกสำเร็จ')



            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
                if (response.data.message == 'category already exists.') {
                    showCancelMessageregisteruser('มีรายนี้อยู่ในระบบแล้ว', '')
                }

            });
        });
    });



    var data;
    $('#table1').on('click', 'i.settime', async function(e) {
        const result = await acctoken();
        ar = new Array()
        num = 0
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        data = _ro.data();
        if (data == undefined) {
            data = table.row(this).data();
        }
        $('#category_list').text('รายการ : ' + data.category)
        $('#addagendar').modal();
        var _arrtime = new Array();
        console.log(data.intervalDifference)
        for (const i in data.intervalDifference) {
            var limit = await timeLimit(result, data.category, data.intervalDifference[i])
            console.log(limit)
                // if (limit. == 0) {
                //     _arrtime[i] = {
                //         time: data.intervalDifference[i],
                //         category: data.category,
                //         limit: '0'
                //     }
                // } else {
            _arrtime[i] = {
                    time: data.intervalDifference[i],
                    category: data.category,
                    limit: limit
                }
                //}
        }
        console.log(_arrtime)
        $('#table1_time').DataTable().destroy();
        var table = $('#table1_time').DataTable({
            "pageLength": 25,
            'data': [..._arrtime],
            "responsive": false,
            stateSave: false,
            "bFilter": false,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": false,
            "bAutoWidth": false,
            "processing": false,
            "serverSide": false,
            "jQueryUI": false,
            "ordering": false,
            "searching": false,
            "order": [],
            columns: [
                { data: "time" },
                { data: "category" },

            ],
            'columnDefs': [{
                'targets': 1,
                'searchable': false,
                'orderable': false,
                'className': 'dt-body-center',
                'render': function(data, type, full, meta) {

                    return '<input type="text"  class="timesetlimit form-control" id=' + full.time + ' value=' + full.limit + ' autocomplete="off" />';
                }
            }],

        });
    });



    $('#submitsettime').on('click', async function(e) {
        var date = new Date()
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);

        var daypost = date.getFullYear() + mnth + day
        const result = await acctoken();
        var table = $('#table1_time').DataTable();
        var data_ = table
            .rows()
            .data();
        table.$('input[type="text"]').each(function(i) {
            var rows = data_[i];
            if (rows.category != undefined) {
                var limit = this.value
                $.getScript("ip.js", function(data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    var datasetlimittime = {
                        'userId': _objectId,
                        'category': data_[0].category,
                        'dayOfBooking': daypost,
                        'timeOfBooking': [rows.time],
                        'limit': limit
                    }
                    console.log(datasetlimittime)

                    axios.post(urlipaddress + 'setTimeLimit/', datasetlimittime, {
                        headers: {
                            'Authorization': result
                        }
                    }).then(function(response) {
                        console.log(response.data.message)
                        showSuccessMessageregisteruser('บันทึกข้อมูลสำเร็จ')
                    }).catch(function(res) {
                        const { response } = res
                        console.log(response.data.message)
                        if (response.data.message == 'fail.') {
                            showSuccessMessageregisteruser('ข้อมูลถูกอัพเดทแล้ว')
                        }
                    });
                });
            }
        });




    });

    $('#table1').on('click', 'i.del', function(e) {

        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        var data_id = _ro.data();
        if (data_id == undefined) {
            data_id = table.row(this).data();
        }
        console.log(data_id.timePropId)

        console.log(_objectId)

        swal({
            title: "คุณต้องการลบข้อมูล ใช่หรือไม่?",
            text: "",
            type: "warning",
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "ยืนยันการลบ",
            closeOnConfirm: false
        }, async function() {
            $.getScript("ip.js", function(data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                axios({
                    url: urlipaddress + 'delProp',
                    method: 'delete',
                    data: {
                        userId: _objectId,
                        timePropId: data_id.timePropId
                    },
                    headers: { 'Authorization': result }
                }).then(function(response) {
                    console.log(response.data.message)

                }).catch(function(res) {
                    const { response } = res
                    console.log(response.data.message)

                });
            });
            swal({
                title: "ลบข้อมูลสำเร็จ",
                text: 'คุณทำรายการสำเร็จแล้ว',
                type: "success",
            }, function(isConfirm) {
                if (isConfirm) {
                    location.href = 'queueadvancebooking.html'
                }
            });
        });
    });





});