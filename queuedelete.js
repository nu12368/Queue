var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');

var _arr = new Array();
var _arrInfo = new Array();
var n = 0;
var n_info = 0;
var _i_loop = 0;

var _arr_qloop = new Array()
var _arr_queue_add = new Array()
var _i_loop_newdate = 0;
var _n_loop = 1;

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
                }
            });
        });
    });
}
function showCanceldeletequeue(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}
function showSuccessdeletequeue(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            location.href = "queuedelete.html";
        }
    });
}

const view_datatable = async (responsedataview) => {
    if (responsedataview.data.message.values.length != 0) {
        for (i = 0; i < responsedataview.data.message.values.length; i++) {
            _arr_qloop[_i_loop] = {
                num: _n_loop,
                category: responsedataview.data.message.values[i].category,
                cue: responsedataview.data.message.values[i].cue,
                serviceChannel: responsedataview.data.message.values[i].serviceChannel,
                name: responsedataview.data.message.values[i].name,
                tel: responsedataview.data.message.values[i].tel,
                timeAdd: responsedataview.data.message.values[i].timeAdd,
                _id: responsedataview.data.message.values[i]._id
            }
            _i_loop = _i_loop + 1
            _n_loop = _n_loop + 1

        }
    }

    //console.log(_arr_qloop)
    $(document).ready(function () {
        $('#table1').DataTable().destroy();
        var table = $('#table1').DataTable({
            "lengthMenu": [[25, 50, 100], [25, 50, 100]],
            "pageLength": 25,
            'data': [..._arr_qloop],
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "_id" },
                // { data: "num" },
                { data: "cue" },
                { data: "category" },
                // { data: "serviceChannel" ,'visible':false},
                { data: "name" },
                { data: "tel" },
                {
                    data: "timeAdd",
                    render: function (data) {
                        let date = new Date(data);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                            return '-';
                        }
                        return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                    }
                }
            ],

            'columnDefs': [{
                'targets': 0,
                'searchable': false,
                'orderable': false,
                'className': 'dt-body-center',
                'render': function (data, type, full, meta) {
                    // console.log(data)
                    return '<input type="checkbox" id="' + data + '" name="' + data + '" value="' + $('<div/>').text(data).html() + '"> <label for="' + data + '"></label>';
                }
            }],

            'order': [[1, 'asc']]
            // dom: 'lBfrtip',
            // buttons: [
            //     {
            //         title: 'คิวค้าง',
            //         text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
            //         extend: 'excel',
            //     }
            // ],
        });

        $('#All').on('click', function () {
            var rows = table.rows({ 'search': 'applied' }).nodes();
            $('input[type="checkbox"]', rows).prop('checked', this.checked);

        });

        $('#table1 tbody').on('change', 'input[type="checkbox"]', function () {
            // If checkbox is not checked
            if (!this.checked) {
                var el = $('#example-select-all').get(0);
                // If "Select all" control is checked and has 'indeterminate' property
                if (el && el.checked && ('indeterminate' in el)) {
                    // Set visual state of "Select all" control
                    // as 'indeterminate'
                    el.indeterminate = true;
                }
            }
        });
        // .on("dt-body-center", function () {
        //     console.log('sdsdsdsdsdsds')
        //     ("Some selection or deselection going on")
        //     if (example.rows({
        //         selected: true
        //     }).count() !== example.rows().count()) {
        //         $('input[type="checkbox"]').removeClass("selected");
        //     } else {
        //         $('input[type="checkbox"]').addClass("selected");
        //     }
        // });


    });

}
async function getqaddloop(refresh_token, _page, q) {
    //return new Promise(resolve => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?_page=' + _page + '&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            if (response.data.message.values.length != 0) {
                view_datatable(response, q)
            }

        }).catch(function (res) {
            const { response } = res
        });
    });
    //});
}

async function getqadd(refresh_token) { ////// คิวที่รอทั้งหมด
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qadd/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function (response) {
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 100)
                var _page = 1;
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        getqaddloop(refresh_token, _page, 'qadd/');
                        _page = _page + 1
                    }
                    resolve(_arr_queue_add)
                } else {
                    for (i = 0; i < response.data.message.values.length; i++) {
                        _arr_queue_add[_i_loop_newdate] = {
                            num: _n_loop,
                            _id: response.data.message.values[i]._id,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            name: response.data.message.values[i].name,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd
                        }
                        _i_loop_newdate = _i_loop_newdate + 1
                        _n_loop = _n_loop + 1
                    }
                    resolve(_arr_queue_add);
                }
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}
$(async function () {
    const result = await acctoken();
    const q_add = await getqadd(result)

    $('#deletequeue').on('click', function (e) {
        var table = $('#table1').DataTable();
        var chk = '';
        table.$('input[type="checkbox"]').each(function () {
            if (this.checked) {
                chk = 'true'
            }
        });
        console.log(chk)
        if (chk != '') {
            showConfirmMessagequeue()
        }else{
            showCanceldeletequeue('กรุณาเลือกรายการที่จะลบ','')
        }

        // e.preventDefault();
        // var table = $('#table1').DataTable();
        // $.getScript("ip.js", function (data, textStatus, jqxhr) {
        //     var urlipaddress = data.substring(1, data.length - 1);
        //     var strtxt = '';
        //     table.$('input[type="checkbox"]').each(function () {
        //         if (this.checked) {
        //             axios({
        //                 url: urlipaddress + 'queue/' + _objectId,
        //                 method: 'delete',
        //                 data: {
        //                     _id: this.id
        //                 },
        //                 headers: { 'Authorization': result }
        //             }).then(function (response) {
        //                 //console.log(response.data.message)
        //                 if (response.data.message == "delete completed") {
        //                    // strtxt = 'delete completed'
        //                    showSuccessdeletequeue('ลบข้อมูลสำเร็จ')
        //                 }
        //             }).catch(function (res) {
        //                 const { response } = res
        //                 console.log(response.data.message)
        //                 showCanceldeletequeue(response.data.message, '')
        //             });
        //         }
        //     });
        // });
    });

});

async function showConfirmMessagequeue() {
    swal({
        title: "คุณต้องการลบข้อมูล ใช่หรือไม่?",
        text: "",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ยืนยันการลบ",
        closeOnConfirm: false
    }, async function () {
        const result = await acctoken();
        var table = $('#table1').DataTable();
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var strtxt = '';
            table.$('input[type="checkbox"]').each(function () {
                if (this.checked) {
                    axios({
                        url: urlipaddress + 'queue/' + _objectId,
                        method: 'delete',
                        data: {
                            _id: this.id
                        },
                        headers: { 'Authorization': result }
                    }).then(function (response) {
                        //console.log(response.data.message)
                        if (response.data.message == "delete completed") {
                            // strtxt = 'delete completed'
                            // showSuccessdeletequeue('ลบข้อมูลสำเร็จ')
                        }
                    }).catch(function (res) {
                        const { response } = res
                        console.log(response.data.message)
                        showCanceldeletequeue(response.data.message, '')
                    });
                }
            });
        });
        swal({
            title: "ลบข้อมูลสำเร็จ",
            text: 'คุณทำรายการสำเร็จแล้ว',
            type: "success",
        }, function (isConfirm) {
            if (isConfirm) {
                location.href = "queuedelete.html";
            }
        });
        // swal("ลบข้อมูลสำเร็จ", "คุณทำรายการสำเร็จแล้ว", "success");
    });
}