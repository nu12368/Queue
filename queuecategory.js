var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
var arrayProp = new Array()

var num = 1;
var _arr = new Array();
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
                    return;
                }

            });
        });
    });
}
async function getProp(refresh_token, category) {
    var arrar_null = new Array()
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'getProp/' + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function (response) {
                console.log(response.data.message.result)
                for (const i in response.data.message.result) {
                    if (response.data.message.result[i].category == category) {
                        arrar_null = response.data.message.result[i]

                    }
                }
                resolve(arrar_null)
                console.log(arrayProp)
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}
async function getcategoryview(refresh_token) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'category/' + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function (response) {
                console.log(response.data.message.category)
                var cnt = response.data.message.category.length;
                var category = response.data.message.category


                for (i = 0; i < category.length; i++) {
                    var prop = await getProp(refresh_token, response.data.message.category[i].category)

                    if (prop.intervalDifference != undefined) {
                        console.log(prop)
                        _arr[n] = {
                            _num: num,
                            DPTCODE: response.data.message.category[i].DPTCODE,
                            category: response.data.message.category[i].category,
                            intervalDifference: prop.intervalDifference,
                            timePropId: prop.timePropId
                        }
                        num++
                        n = n + 1
                    } else {
                        _arr[n] = {
                            _num: num,
                            DPTCODE: response.data.message.category[i].DPTCODE,
                            category: response.data.message.category[i].category,
                            intervalDifference: '',
                            timePropId: ''
                        }
                        num++
                        n = n + 1
                    }
                }





                console.log(_arr)
                $('#table1').DataTable().destroy();
                $('#table1').DataTable({
                    "lengthMenu": [
                        [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1],
                        [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]
                    ],
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
                            defaultContent: '<i href="" class="editcategory" style="font-size:14px;color:blue; cursor: pointer;">แก้ไขแผนก</i>/<i href="" class="removecategory" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                        },
                        // {
                        //     data: null,
                        //     className: "center",
                        //     defaultContent: '<i href="" class="settime" style="font-size:14px;color:blue; cursor: pointer;">เพิ่ม-แก้ไขจำนวนคิว </i>'
                        // }

                        {
                            data: "timePropId",
                            render: function (data) {
                                console.log(data)
                                if (data != '') {
                                    return '<i href="" class="settime" style="font-size:14px;color:blue; cursor: pointer;">แก้ไขจำนวนคิว </i>'
                                } else {
                                    return '<p style="font-size:14px;color:orange;">ยังไม่ได้กำหนดช่วงเวลา</p>'
                                }

                            }
                        }
                        ,
                        {
                            data: "intervalDifference",
                            render: function (data) {
                                console.log(data)
                                if (data != '') {
                                    return '<p style="font-size:14px;color:green;">กำหนดช่วงเวลาแล้ว</p>'
                                } else {
                                    return '<i href="" class="setprop" style="font-size:14px;color:blue; cursor: pointer;">กำหนดช่วงเวลา </i>'
                                }
                                // let date = new Date(data);
                                // let options = { hour12: false };
                                // var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                // if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                //     return '-';
                                // }
                                // return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                            }
                        },
                        // {
                        //     data: null,
                        //     className: "center",
                        //     defaultContent: '<i href="" class="setprop" style="font-size:14px;color:blue; cursor: pointer;">เพิ่มช่วงเวลา </i>'
                        // }
                    ],
                });

                var $select = $('#category');
                $select.find('option').remove();
                $select.append('<option value=' + '0' + '>' + '-- เลือกแผนก --' + '</option>');
                $.each(response.data.message.category, function (key, value) {
                    $select.append('<option value=' + value.category + '>' + value.category + '</option>');
                });
                resolve(response.data.message.category.length);


            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}


$(async function () {
    const result = await acctoken();
    await getcategoryview(result);

    /////////////////////////////////// ลบแผนก
    var datauser;
    $('#table1').on('click', 'i.removecategory', function (e) {
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        datauser = _ro.data();
        if (datauser == undefined) {
            datauser = table.row(this).data();
        }
        $("#myModaldelete").modal();
        $("#lbl_completed").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

    });

    //แก้ไข
    $('#table1').on('click', 'i.editcategory', function (e) {
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        datauser = _ro.data();
        if (datauser == undefined) {
            datauser = table.row(this).data();
        }
        $("#myModaledit").modal();
        console.log(datauser)
        $("#DPTCODE_edit").val(datauser.DPTCODE);
        $("#category_old").val(datauser.category);

    });
    //////////////กำหนดช่วงเวลา
    var data;
    $('#table1').on('click', 'i.settime', async function (e) {
        const result = await acctoken();
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        data = _ro.data();
        if (data == undefined) {
            data = table.row(this).data();
        }
        console.log(data.category)
        var prop = await getProp(result, data.category)
        console.log(prop.intervalDifference)

        if (prop.intervalDifference == undefined) {
            showCancelMessagecategory('แผนกนี้ยังไม่ได้กำหนดช่วงเวลา', '')
            // $('#addtime').modal();
            return
        }
        $('#category_list').text('แผนก : ' + data.category)
        $('#addagendar').modal();
        var _arrtime = new Array();
        for (const i in prop.intervalDifference) {
            var limit = await timeLimit(result, data.category, prop.intervalDifference[i])
            console.log(limit)
            _arrtime[i] = {
                time: prop.intervalDifference[i],
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
                'render': function (data, type, full, meta) {

                    return '<input type="text"  class="timesetlimit form-control" id=' + full.time + ' value=' + full.limit + ' autocomplete="off" />';
                }
            }],

        });
    });

    /////////////// กำหนดช่วงเวลา เพิ่ม
    $('#table1').on('click', 'i.setprop', async function (e) {
        $('#addtime').modal();
        const result = await acctoken();
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        data = _ro.data();
        if (data == undefined) {
            data = table.row(this).data();
        }
        console.log(data.category)
        document.getElementById('category_list_update').innerText = 'แผนก : ' + data.category
        // var hr = document.getElementById('starthours').value
        // var mi = document.getElementById('startminutes').value
        // console.log(hr, mi)
        // if (hr != '00' || mi != '00') {
        //     await SetProp(result, hr, mi, data.category)
        // }
    });

    $('#submitsettime_Update').on('click', async function (e) {
        console.log(data.category)
        var hr = document.getElementById('starthours_edit').value
        var mi = document.getElementById('startminutes_edit').value
        console.log(hr, mi)


        if (hr != '00' || mi != '00') {
            await SetProp(result, hr, mi, data.category)
            showSuccessMessagecategory('บันทึกสำเร็จ')

        } else {
            showCancelMessagecategory('กรุณาเลือกช่วงเวลา', '')
        }
    });
    function timeLimit(refresh_token, category, datainterDiff) {
        return new Promise(resolve => {
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                axios.get(urlipaddress + 'timeLimit/' + _objectId, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (response) {
                    console.log(response.data.message.result)
                    for (const i in response.data.message.result) {
                        if (response.data.message.result[i].category == category) {
                            const interDiff = response.data.message.result[i].interDiff
                            for (let f in interDiff) {
                                if (f == datainterDiff) {
                                    // console.log(interDiff[f].limit)
                                    resolve(interDiff[f].limit)

                                }
                            }
                        } else { }
                    }
                    resolve(0)
                    //   console.log(ar)
                });
            });
        });
    }



    ////////////////////////// กำหนดจำนวนคิว
    $('#submitsettime').on('click', async function (e) {
        var date = new Date()
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);

        var daypost = date.getFullYear() + mnth + day
        const result = await acctoken();
        var table = $('#table1_time').DataTable();
        var data_ = table
            .rows()
            .data();
        table.$('input[type="text"]').each(function (i) {
            var rows = data_[i];
            if (rows.category != undefined) {
                var limit = this.value
                $.getScript("ip.js", function (data, textStatus, jqxhr) {
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
                    }).then(function (response) {
                        console.log(response.data.message)
                        showSuccessMessagecategory('บันทึกข้อมูลสำเร็จ')
                    }).catch(function (res) {
                        const { response } = res
                        console.log(response.data.message)
                        if (response.data.message == 'fail.') {
                            showSuccessMessagecategory('ข้อมูลถูกอัพเดทแล้ว')
                        }
                    });
                });
            }
        });




    });

    ///////////// อัพเดทแผนก
    $('#UPDATE_Category').on('click', async function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const datacategory = {
                userId: _objectId,
                find: document.getElementById("category_old").value,
                editTo: document.getElementById("category_edit").value,

            }
            axios.put(urlipaddress + 'category', datacategory, {
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                console.log(response.data.message)
                if (response.data.message == "edit complete") {
                    $("#myModaledit").empty();

                    if (datauser.timePropId != '') {
                        axios({
                            url: urlipaddress + 'delProp',
                            method: 'delete',
                            data: {
                                userId: _objectId,
                                timePropId: datauser.timePropId 
                            },
                            headers: { 'Authorization': result }
                        }).then(function (response) {
                            console.log(response.data.message)
                            showSuccessMessagecategory('อัพเดทข้อมูลสำเร็จ')
                        }).catch(function (res) {
                            const { response } = res
                            console.log(response.data.message)

                        });
                    }else{
                        showSuccessMessagecategory('อัพเดทข้อมูลสำเร็จ')
                    }
                  
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessagecategory(response.data.message, '')
            });
        });
    });

    /////////////////////ลบ
    $('#deletecategory').on('click', async function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios({
                url: urlipaddress + 'category',
                method: 'delete',
                data: {
                    userId: _objectId,
                    category: datauser.category
                },
                headers: { 'Authorization': result }
            }).then(function (response) {
                console.log(response.data.message)
                if (response.data.message == "delete complete") {
                    $("#myModaldelete").empty();
///////////////////////
                    if (datauser.timePropId != '') {
                        axios({
                            url: urlipaddress + 'delProp',
                            method: 'delete',
                            data: {
                                userId: _objectId,
                                timePropId: datauser.timePropId 
                            },
                            headers: { 'Authorization': result }
                        }).then(function (response) {
                            console.log(response.data.message)
                            showSuccessMessagecategory('ลบข้อมูลสำเร็จ')
                        }).catch(function (res) {
                            const { response } = res
                            console.log(response.data.message)

                        });
                    }else{
                        showSuccessMessagecategory('ลบข้อมูลสำเร็จ')
                    }

                 
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessagecategory(response.data.message, '')
            });
        });
    });

    /////////////////////////////////// สร้างแผนก
    $('#submitcategory').on('click', async function (e) {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const datacategory = {
                userId: _objectId,
                category: document.getElementById("namecategory").value,
                DPTCODE: document.getElementById("DPTCODE").value,
            }
            console.log(datacategory)
            axios.post(urlipaddress + 'category', datacategory, {
                headers: {
                    'Authorization': result
                }
            }).then(async function (response) {
                var hr = document.getElementById('starthours').value
                var mi = document.getElementById('startminutes').value
                console.log(hr, mi)
                if (hr != '00' || mi != '00') {
                    console.log('ggggggggggggggggg')
                    await SetProp(result, hr, mi, document.getElementById("namecategory").value)
                }
                showSuccessMessagecategory('บันทึกสำเร็จ')
                getcategoryview(result);
            }).catch(function (res) {
                const { response } = res
                if (response.data.message == 'update fail,This information is already in the system.') {
                    showCancelMessagecategory('มีข้อมูลในระบบแล้ว', '')
                }
            });
        });
    });

    /////////////////////////////////// สร้างแผนก Excel
    $('#submitcategoryexcelfile').on('click', function (e) {

        ExportToTable();

        // $.getScript("ip.js", function (data, textStatus, jqxhr) {
        //     var urlipaddress = data.substring(1, data.length - 1);
        //     const datacategory = {
        //         userId: _objectId,
        //         category: document.getElementById("namecategory").value,
        //         DPTCODE: document.getElementById("DPTCODE").value,

        //     }
        //     console.log(datacategory)
        //     axios.post(urlipaddress + 'category', datacategory, {
        //         headers: {
        //             'Authorization': result
        //         }
        //     }).then(function (response) {
        //         showSuccessMessagecategory('บันทึกสำเร็จ')
        //         getcategoryview(result);
        //     }).catch(function (res) {
        //         const { response } = res
        //         if (response.data.message == 'This user has already been used.') {
        //             showCancelMessagecategory('มีข้อมูลในระบบแล้ว', '')
        //         }
        //     });
        // });
    });

    function ExportToTable() {
        var fileUpload = $("#excelfile")[0];
        //Validate whether File is valid Excel file.
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        ProcessExcel(e.target.result);
                    };
                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        ProcessExcel(data);
                    };
                    reader.readAsArrayBuffer(fileUpload.files[0]);
                }
                showSuccessMessagecategory('บันทึกสำเร็จ')
            } else {
                // alert("This browser does not support HTML5.");
                showCancelMessagecategory('This browser does not support HTML5.', '')
            }
        } else {
            // alert("Please upload a valid Excel file.");
            showCancelMessagecategory('โปรดอัปโหลดไฟล์ Excel ที่ถูกต้อง !!', '')
        }
    }
    function ProcessExcel(data) {
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

        //Add the data rows from Excel file.
        for (var i = 0; i < excelRows.length; i++) {

            const datacategory = {
                userId: _objectId,
                category: excelRows[i].category,
                DPTCODE: excelRows[i].DPTCODE,
            }
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                axios.post(urlipaddress + 'category', datacategory, {
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    //  showSuccessMessagecategory('บันทึกสำเร็จ')
                    getcategoryview(result);
                }).catch(function (res) {
                    const { response } = res
                    if (response.data.message == 'update fail,This information is already in the system.') {
                        showCancelMessagecategory('มีข้อมูลในระบบแล้ว', '')
                    }
                });
            });
        }

    };

});

async function SetProp(result, hr, mi, category) {
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
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const url = urlipaddress + 'setProp';
        let formData = new FormData();
        console.log(_objectId)
        formData.append('userId', _objectId);
        formData.append('category', category);
        formData.append('intervalDifference', hms.toString());
        formData.append('setFormat', '0');
        formData.append('description', '');

        axios.post(url, formData, {
            headers: {
                'Authorization': result
            }
        }).then(function (response) {
            console.log(response.data.message)

        }).catch(function (res) {
            const { response } = res
            console.log(response.data.message)
            // if (response.data.message == 'category already exists.') {
            // }

        });
    });
}




function showCancelMessagecategory(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}

function showSuccessMessagecategory(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            location.href = "queuecategory.html";
        }
    });
}