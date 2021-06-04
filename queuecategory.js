
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

function getcategoryview(refresh_token) {
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
                            defaultContent: '<i href="" class="editcategory" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i>/<i href="" class="removecategory" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                        }
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
                    showSuccessMessagecategory('อัพเดทข้อมูลสำเร็จ')
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
                    showSuccessMessagecategory('ลบข้อมูลสำเร็จ')
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessagecategory(response.data.message, '')
            });
        });
    });


    /////////////////////////////////// สร้างแผนก
    $('#submitcategory').on('click', function (e) {

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
            }).then(function (response) {
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