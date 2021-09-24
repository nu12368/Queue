var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
var Str_profile;
var Str_queue;
var category_profile;
var index;
var _arr_qloop = new Array();
var _n_loop = 1;
var _i_loop = 0;
var _i_loop_newdate = 0;
var _arr_queue_Today = new Array();
var _arr_queue_add = new Array();
var queuecount;
var qcall;
var queueqend;
var qcancel;
var qpause;
var chkvisible = 0;
var q_num_today = 0;
var array_day = new Array();
var chartcategory_queue = new Array();
var chartcategory_queue_call = new Array();
var chartcategory_queue_end = new Array();
var q_num = 0;
var check_table_clack = '';
var _id_q = '';
var day_view = new Array()
var count_queue = 1;

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
const view_datatable = async (responsedataview, q, day, category) => {
    if (category == undefined) {
        category = 'ทั้งหมด'
    }
    $('#tablequeue_listuserqueue').DataTable().destroy();
    if (responsedataview.data.message.values.length != 0) {
        for (i = 0; i < responsedataview.data.message.values.length; i++) {
            var _checkdate;
            if (q == 'getbookingQueue/') {
                _checkdate = await chechdate_Time(responsedataview.data.message.values[i].bookingData.dayOfBooking, day)
            }
           
            if (_checkdate == true) {
                     _arr_qloop[_i_loop] = {
                    num: _n_loop,
                    category: responsedataview.data.message.values[i].category,
                    cue: responsedataview.data.message.values[i].cue,
                    name: responsedataview.data.message.values[i].name,
                    tel: responsedataview.data.message.values[i].tel,
                    timeAdd: responsedataview.data.message.values[i].timeAdd,
                    dayOfBooking: responsedataview.data.message.values[i].bookingData.dayOfBooking,
                    timeOfBooking: responsedataview.data.message.values[i].bookingData.timeOfBooking,
                    _id: responsedataview.data.message.values[i]._id
                }
                _i_loop = _i_loop + 1
                _n_loop = _n_loop + 1
            }
        }
    }
    document.getElementById("h_name_report").innerText = 'คิววันที่  ' + day + ' / ' + ' คิวที่จองล่วงหน้า ' + ' / ' + ' แผนก ' + category + ' ' + '( จำนวน ' + _arr_qloop.length + ' คิว )'
    var table = $('#tablequeue_listuserqueue').DataTable({
        "lengthMenu": [
            [25, 50, 100],
            [25, 50, 100]
        ],
        "pageLength": 25,
        'data': [..._arr_qloop],
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [
            { data: "num" },
            { data: "category" },
            { data: "cue" },
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
            },
            {
                data: "dayOfBooking",
                render: function (data) {
                    if (data != '') {
                        let date = new Date(data);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                            return '-';
                        }
                        return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].substring('0','4');
                    } else { return '-' }
                }
            },
            { data: "timeOfBooking" },
        ],
        dom: 'lBfrtip',
        buttons: [{
            title: document.getElementById('h_name_report').innerText,
            text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
            extend: 'excel',
        }],
    });
    table.buttons().container().appendTo($('#test3'));
}

function getbookingQueueloop(refresh_token, _page, q) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?_page=' + _page + '&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values)
            for (i = 0; i < response.data.message.values.length; i++) {
                _arr_queue_add[_i_loop_newdate] = {
                    _id: response.data.message.values[i]._id,
                    category: response.data.message.values[i].category,
                    cue: response.data.message.values[i].cue,
                    name: response.data.message.values[i].name,
                    serviceChannel: response.data.message.values[i].serviceChannel,
                    tel: response.data.message.values[i].tel,
                    timeAdd: response.data.message.values[i].timeAdd,
                    uId: response.data.message.values[i].uId,
                    dayOfBooking: response.data.message.values[i].bookingData.dayOfBooking,
                    timeOfBooking: response.data.message.values[i].bookingData.timeOfBooking
                }
                _i_loop_newdate = _i_loop_newdate + 1
            }
        }).catch(function (res) {
            const { response } = res
        });
    });
    // });
}
const viewqueuetfootloop = async (refresh_token, _page, q) => {
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
    // });
}

function getbookingQueue(refresh_token) { ////// คิวจองล่วงหน้า
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'getbookingQueue/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {

                _arr_queue_add = new Array()
                _i_loop_newdate = 0;

                /////// ข้อมูลแสดง datatable
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 100)
                var _page = 1;
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        getbookingQueueloop(refresh_token, _page, 'getbookingQueue/');
                        _page = _page + 1
                    }
                    resolve(_arr_queue_add)
                } else {

                    console.log(response.data.message.values)
                    for (i = 0; i < response.data.message.values.length; i++) {
                        _arr_queue_add[_i_loop_newdate] = {
                            _id: response.data.message.values[i]._id,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            name: response.data.message.values[i].name,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd,
                            uId: response.data.message.values[i].uId,
                            dayOfBooking: response.data.message.values[i].bookingData.dayOfBooking,
                            timeOfBooking: response.data.message.values[i].bookingData.timeOfBooking

                        }
                        _i_loop_newdate = _i_loop_newdate + 1
                    }
                    resolve(_arr_queue_add);
                }
            }).catch(function (res) {
                const { response } = res
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
                resolve(response.data.message.category);
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}
const queueloop = async (refresh_token, prm, _page, q, day, categoryqueue) => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var prmget;
        if (categoryqueue == undefined) {
            prmget = urlipaddress + q + _objectId + '?_page=1&_limit=100&_sort=1'
        } else {
            prmget = urlipaddress + q + _objectId + '?' + prm + '_page=1&_limit=100&_sort=1'
        }
        axios.get(prmget, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            if (response.data.message.values.length != 0) {
                view_datatable(response, q, day, categoryqueue)
            }
        });
    });
}
const Getqueueviewcategory = async (categoryqueue, refresh_token, q, day) => {
    var prm =  'category=' + categoryqueue + '&'
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var prmget;
        if (categoryqueue == undefined) {
            prmget = urlipaddress + q + _objectId + '?_page=1&_limit=100&_sort=1'
        } else {
            prmget = urlipaddress + q + _objectId + '?' + prm + '_page=1&_limit=100&_sort=1'
        }
   
        console.log(prmget = urlipaddress + q + _objectId + '?' + prm + '_page=1&_limit=100&_sort=1')
        axios.get(prmget, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values)
            _arr_queue_add = new Array()
            _i_loop_newdate = 0;
            var totle = response.data.message.total
            var looptotle = Math.ceil(totle / 100)
            var _page = 1;
            if (looptotle > 1) { ///// คิวมากกว่า loop 100
                for (i = 0; i < looptotle; i++) {
                    queueloop(refresh_token, prm, _page, q, day, categoryqueue)
                    _page = _page + 1
                }
            } else {
                view_datatable(response, q, day, categoryqueue)
            }
        }).catch(function (res) {
            const { response } = res
            console.log(response)
        });
    });
}
var arr_datesearch = new Array()

function convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("/");
}
async function dateSearch() {

    var _sp = $("#daterange").val().replace(' ', '').replace(' ', '').split('-')
    var Startvaldate_sp = _sp[0].split('/')
    var Endvaldate_sp = _sp[1].split('/')
    var d_gmt = new Date(Startvaldate_sp[2] + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[1] + " GMT");

    var lastDayOfMonth = new Date(d_gmt.getFullYear(), d_gmt.getMonth() + 1, 0); /////วันสุดท้ายของเดือน
    var sp_last = convert(lastDayOfMonth).split('/');

    var cnt_betaween = parseInt(Endvaldate_sp[1]) - parseInt(Startvaldate_sp[1]) //วันสิ้นสุด - วันเริ่มต้น 
    var s_d = parseInt(Startvaldate_sp[1]);
    var cnt = 0;
    var loop_month = ''
    if (parseInt(Endvaldate_sp[0]) > parseInt(Startvaldate_sp[0])) { /////เลือก ข้ามเดือน
        cnt_betaween = parseInt(sp_last[2]) + parseInt(Endvaldate_sp[1]) ///// วันสุดท้ายของเดือน + กับวัน ของเดือนถัดไป
        for (i = 0; i < cnt_betaween + 1; i++) { //// วนลูป จำนวนวันเริ่มต้น - วันสิ้นสุด เดือนเดียวกัน
            if (i == 0) {
                day_view[i] = s_d.toString().padStart(2, '0') + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[2]
                cnt = parseInt(s_d)
            } else {
                if (cnt > sp_last[2]) {
                    cnt = 1;
                    loop_month = 'newmonth'
                    day_view[i] = cnt.toString().padStart(2, '0') + '/' + Endvaldate_sp[0] + '/' + Startvaldate_sp[2]
                } else {
                    if (loop_month == '') {
                        day_view[i] = cnt.toString().padStart(2, '0') + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[2]
                    } else {
                        if (parseInt(Endvaldate_sp[1]) == cnt) {
                            day_view[i] = cnt.toString().padStart(2, '0') + '/' + Endvaldate_sp[0] + '/' + Startvaldate_sp[2]
                            break
                        }
                        day_view[i] = cnt.toString().padStart(2, '0') + '/' + Endvaldate_sp[0] + '/' + Startvaldate_sp[2]
                    }
                }
            }
            cnt = cnt + 1
        }
    } else {
        for (i = 0; i < cnt_betaween + 1; i++) { //// วนลูป จำนวนวันเริ่มต้น - วันสิ้นสุด เดือนเดียวกัน
            if (i == 0) {
                day_view[i] = s_d.toString().padStart(2, '0') + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[2]
                cnt = parseInt(s_d)
            } else {

                if (cnt == sp_last[2]) {
                    cnt = 1;

                } else {
                    day_view[i] = cnt.toString().padStart(2, '0') + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[2]
                }
            }
            cnt = cnt + 1
        }
    }

    arr_datesearch[0] = Startvaldate_sp[2] + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[1] + ' ' + '00:00' + ':00'
    arr_datesearch[1] = Endvaldate_sp[2] + '/' + Endvaldate_sp[0] + '/' + Endvaldate_sp[1] + ' ' + '23:59' + ':59'

    console.log(day_view)
    console.log(arr_datesearch)
    return arr_datesearch
}
$(async function () {
    const result = await acctoken();
    console.log(result)
    $(document).ready(function () {
        $('input[name="daterange"]').change(function () {
            $(this).val();
        });
        $('#submitqueueReportDatetime').on('click', async function (e) {
            document.getElementById('div_preloader').style.display = 'block'
            $('#tablequeue').DataTable().destroy();
            day_view = new Array()
            await dateSearch()

            await v_socketio();
            document.getElementById('div_preloader').style.display = 'none'
        });
        $('#btn_cancel').on('click', async function (e) {
            check_table_clack = 'true';
            arr_datesearch = new Array()
            _arr_qloop = new Array();
            _n_loop = 1;
            _i_loop = 0;
            document.getElementById('startdate').value = '';
            document.getElementById('enddate').value = '';
            document.getElementById("btn_cancel").style.display = 'none'
            await v_socketio();
        });
        $('#a_back').on('click', async function (e) {
            check_table_clack = ''
            document.getElementById("div_qall").style.display = 'block'
            document.getElementById("div_qdisplay").style.display = 'none'
            document.getElementById("did_search").style.display = 'block'
        });
        $('#a_back2').on('click', async function (e) {
            document.getElementById("a_back2").style.display = 'none'
            document.getElementById("a_back").style.display = 'block'
            document.getElementById("div_qall").style.display = 'none'
            document.getElementById("div_table_listuserqueue").style.display = 'none'
            document.getElementById("table_category").style.display = 'block'
            document.getElementById("h_name_report").innerText = 'จำนวนคิวแยกตามแผนกของวันที่  ' + data._day
        });
        $(document).ready(function () {
            $('#tablequeue').on('click', 'a._day', async function (e) { /////กดวันที่
                document.getElementById("table_category").style.display = 'none'
                document.getElementById("div_preloadercategory").style.display = 'block'
                check_table_clack = 'true';
                var table = $('#tablequeue').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }

                _arr_qloop = new Array();
                _n_loop = 1;
                _i_loop = 0;
                document.getElementById("h_name_report").innerText = 'จำนวนคิวแยกตามแผนกของวันที่  ' + data._day
                document.getElementById("div_qall").style.display = 'none'
                document.getElementById("div_qdisplay").style.display = 'block'
                document.getElementById("did_search").style.display = 'none'
                await view_day_category(data._day)
                document.getElementById("div_preloadercategory").style.display = 'none'
                document.getElementById("table_category").style.display = 'block'
            });
            $('#table1_category_list').on('click', 'a.queue', async function (e) { /////ผู้รอรับบริการ แผนก
                document.getElementById("table_category").style.display = 'none'
                document.getElementById("div_preloaderuserqueue").style.display = 'block'
                const result = await acctoken();
                document.getElementById("a_back2").style.display = 'block'
                document.getElementById("a_back").style.display = 'none'

                check_table_clack = 'true';
                var table = $('#table1_category_list').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data_click = _ro.data();
                if (data_click == undefined) {
                    data_click = table.row(this).data();
                }
                _arr_qloop = new Array();
                _n_loop = 1;
                _i_loop = 0;
                document.getElementById("div_qall").style.display = 'none'
                document.getElementById("div_table_listuserqueue").style.display = 'block'
                await Getqueueviewcategory(data_click.category, result, 'getbookingQueue/', data._day)
                document.getElementById("div_preloaderuserqueue").style.display = 'none'


            });
            
            $('#table1_category_list').on('click', 'tfoot th', async function () { /////ผู้รอรับบริการ ทั้งหมด
                const result = await acctoken();
                check_table_clack = 'true';
                var table = $('#table1_category_list').DataTable();
                index = table.column($(this).index() + ':visible').index();
                // console.log(data._day)
                // console.log(index)

                switch (index) {
                    case 2:
                        document.getElementById("table_category").style.display = 'none'
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'

                        await Getqueueviewcategory(undefined, result, 'qadd/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 3:


                        document.getElementById("table_category").style.display = 'none'
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'

                        await Getqueueviewcategory(undefined, result, 'qcall/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'


                        break;
                    case 4:
                        document.getElementById("table_category").style.display = 'none'
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'

                        await Getqueueviewcategory(undefined, result, 'qend/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 5:
                        document.getElementById("table_category").style.display = 'none'
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'

                        await Getqueueviewcategory(undefined, result, 'qcancel/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 6:
                        document.getElementById("table_category").style.display = 'none'
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'

                        await Getqueueviewcategory(undefined, result, 'qpause/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 7:
                        document.getElementById("table_category").style.display = 'none'
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'

                        await Getqueueviewcategory(undefined, result, 'qend/', data._day)
                        await Getqueueviewcategory(undefined, result, 'qadd/', data._day)
                        await Getqueueviewcategory(undefined, result, 'qcall/', data._day)
                        await Getqueueviewcategory(undefined, result, 'qcancel/', data._day)
                        await Getqueueviewcategory(undefined, result, 'qpause/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    default:
                }
            });
        });
    });
});

function showCancelMessagesearch(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}

function showSuccessMessage(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            //  location.href = "queuedashboard.html";
        }
    });
}
var num_day = 0;
async function chechdate_Time(datadatetime, day_view) {
    let date = new Date(datadatetime);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var s_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    var time = s_date.split(' ')
    s_date = time[0].split('/')
    var _date = s_date[2] + '/' + s_date[0] + '/' + s_date[1]
    var _checkdate;
    var day_sp = day_view.split('/')
    _checkdate = dayjs(day_sp[2] + '/' + day_sp[1] + '/' + day_sp[0]).isSame(_date)
    if (_checkdate == true) {
        num_day = num_day + 1;
        return _checkdate
    }
    return _checkdate;
}
async function view_day_category(datetime) {
    const result = await acctoken();
    const categoryview = await getcategoryview(result);
    const bookingQueue = await getbookingQueue(result); ////คิวรอรับบริการ
  
    var count_q = 0;
    var view_qadd = 0;
    var view_qcall = 0;
    var view_qend = 0;
    var view_qcancel = 0;
    var view_qpausel = 0;
    var _arrdataqueue = new Array();
    var num_category = 1;
    for (let i in categoryview) {
        for (let i_qadd in bookingQueue) {
            var _checkdate = await chechdate_Time(bookingQueue[i_qadd].dayOfBooking, datetime)
            if (_checkdate == true) {
                if (categoryview[i].category == bookingQueue[i_qadd].category) {
                    count_q = count_q + 1
                }
            }
        }
        view_qadd = count_q
        count_q = 0;
        
        _arrdataqueue[i] = {
            num: num_category,
            category: categoryview[i].category,
            qadd: view_qadd,
        }
        num_category = num_category + 1
    }
    view_queue = 0;
    view_qcall = 0;
    count_q = 0;
    var header = [];
    header.push("ลำดับที่");
    header.push("แผนก");
    header.push("จำนวนคิวจองล่วงหน้า");
  
    $('#table1_category_list').DataTable().destroy();
    var table = $('#table1_category_list').DataTable({
        "pageLength": 20,
        "bPaginate": false,
        "bLengthChange": false,
        "bInfo": false,
        "bAutoWidth": false,
        "searching": false,
        'data': [..._arrdataqueue],
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [{
            data: 'num',
        },
        { data: 'category' },
        {
            data: 'qadd',
            render: function (data) {
                if (data != 0) {
                    return '<a class="queue" style="color:blue; cursor: pointer;">' + data + '</a>';
                } else {
                    return data = '0'
                }
            }
        }
        ],
        dom: 'lBfrtip',
        buttons: [{
            title: 'queueexport',
            text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
            extend: 'excel',
            footer: true,
            exportOptions: {
                format: {
                    header: function (data, column, row) {
                        return header[column]; //header is the array I used to store header texts
                    }
                },
                columns: [0, 1, 2]
            }
        }],
        // "footerCallback": function (row, data, start, end, display) {
        //     var api = this.api(),
        //         data;
        //     //console.log(api)
        //     // Remove the formatting to get integer data for summation
        //     var intVal = function (i) {
        //         return typeof i === 'string' ?
        //             i.replace(/[\$,]/g, '') * 1 :
        //             typeof i === 'number' ?
        //                 i : 0;
        //     };
        //     // Total over all pages
        //     for (i = 2; i < 8; i++) {
        //         total = api
        //             .column(i)
        //             .data()
        //             .reduce(function (a, b) {
        //                 return intVal(a) + intVal(b);
        //             }, 0);

        //         // Total over this page
        //         pageTotal = api
        //             .column(i, {
        //                 page: 'current'
        //             })
        //             .data()
        //             .reduce(function (a, b) {
        //                 return intVal(a) + intVal(b);
        //             }, 0);
        //         // Update footer
        //         $(api.column(i).footer()).html(
        //             '<a class="foot" style="font-size:14px;color:blue; cursor: pointer;">' + total + '</a>'
        //         );
        //         $(api.column(i).footer()).html(
        //             '<a class="foot" style="font-size:14px;color:blue; cursor: pointer;">' + pageTotal + '</a>'
        //         );
        //         // $('#total').text('£' + Number(pageTotal).toFixed(i));
        //     }
        // }
    });
    table.buttons().container().appendTo($('#test2'));
}

async function v_socketio() {
    const result = await acctoken();
    var _arrdataqueue = new Array();
    // const fileview = await getprofileview(result);
    // const categoryview = await getcategoryview(result);
    //////ตาราง
    const bookingQueue = await getbookingQueue(result); ////คิวรอรับบริการ


    var view_qadd = 0;
    var view_qcall = 0;
    var view_qend = 0;
    var view_qcancel = 0;
    var view_qpause = 0;

    for (let i in day_view) {
        /////// คิวผู้รอรับบริการ
        for (let i_qadd in bookingQueue) {
            console.log(bookingQueue[i_qadd].timeAdd)
            console.log(bookingQueue[i_qadd].dayOfBooking)
            var _checkdate = await chechdate_Time(bookingQueue[i_qadd].dayOfBooking, day_view[i])
            if (_checkdate == true) {
                view_qadd = num_day
            }
        }

        _arrdataqueue[i] = {
            _day: day_view[i],
            queue: view_qadd,
        }
        num_day = 0;
        view_qcall = 0
        view_qadd = 0
        view_qend = 0
        count_qadd = 0
        count_qcall = 0
        count_qend = 0
        count_qcancel = 0
        count_qpause = 0
        q_num = 0;
        view_qcancel = 0
        view_qpause = 0
    }
    console.log(_arrdataqueue)
    var header = [];
    header.push("วันที่");
    header.push("จำนวนคิวจองล่วงหน้า");
    document.getElementById('div_table').style.display = 'block'
    $('#tablequeue').DataTable().destroy();
    var table = $('#tablequeue').DataTable({
        "pageLength": 20,
        "bPaginate": false,
        "bLengthChange": false,
        "bInfo": false,
        "bAutoWidth": false,
        "searching": false,
        'data': [..._arrdataqueue],
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [{
            data: '_day',
            render: function (data) {
                if (data != 0) {
                    return '<a class="_day" style="color:#2196F3;  cursor: pointer;">' + data + '</a>';
                } else {
                    return data = '0'
                }
            }
        },
        {
            data: 'queue',
            render: function (data) {
                if (data != 0) {
                    // return '<a class="queue">' + data + '</a>';
                    return data;
                } else {
                    return data = '0'
                }
            }
        },
        ],
        dom: 'lBfrtip',
        buttons: [{
            title: 'queueexport',
            text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
            extend: 'excel',
            footer: true,
            exportOptions: {
                format: {
                    header: function (data, column, row) {
                        return header[column]; //header is the array I used to store header texts
                    }
                },
                columns: [0, 1]
            }
        }

        ],
        // "footerCallback": function(row, data, start, end, display) {
        //     var api = this.api(),
        //         data;
        //     //console.log(api)
        //     // Remove the formatting to get integer data for summation
        //     var intVal = function(i) {
        //         return typeof i === 'string' ?
        //             i.replace(/[\$,]/g, '') * 1 :
        //             typeof i === 'number' ?
        //             i : 0;
        //     };
        //     // Total over all pages
        //     for (i = 1; i < 7; i++) {
        //         total = api
        //             .column(i)
        //             .data()
        //             .reduce(function(a, b) {
        //                 return intVal(a) + intVal(b);
        //             }, 0);

        //         // Total over this page
        //         pageTotal = api
        //             .column(i, {
        //                 page: 'current'
        //             })
        //             .data()
        //             .reduce(function(a, b) {
        //                 return intVal(a) + intVal(b);
        //             }, 0);

        //         // Update footer
        //         $(api.column(i).footer()).html(
        //             '<b><a class="foot" style="14px;color:#000000; ">' + total + '</a></b>'
        //         );
        //         $(api.column(i).footer()).html(
        //             '<b><a class="foot" style="14px;color:#000000;">' + pageTotal + '</a></b>'
        //         );
        //         // $('#total').text('£' + Number(pageTotal).toFixed(i));
        //     }
        // }
    });
    table.buttons().container().appendTo($('#test'));
}