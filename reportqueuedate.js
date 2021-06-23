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
const view_datatable = async (responsedataview, q, day, category) => {
    if (category == undefined) {
        category = 'ทั้งหมด'
    }
    $('#tablequeue_listuserqueue').DataTable().destroy();
    if (responsedataview.data.message.values.length != 0) {
        for (i = 0; i < responsedataview.data.message.values.length; i++) {
            var _checkdate;
            if (q == 'qadd/') {
                _checkdate = await chechdate_Time(responsedataview.data.message.values[i].timeAdd, day)
            }
            if (q == 'qcall/') {
                _checkdate = await chechdate_Time(responsedataview.data.message.values[i].timeCall, day)
            }
            if (q == 'qend/') {
                _checkdate = await chechdate_Time(responsedataview.data.message.values[i].timeEnd, day)
               
            }
            if (q == 'qcancel/') {
                _checkdate = await chechdate_Time(responsedataview.data.message.values[i].timeCancel, day)
            }
            if (q == 'qpause/') {

                _checkdate = await chechdate_Time(responsedataview.data.message.values[i].timeCall, day)
            }

            if (_checkdate == true) {
                var _timeCall = '';
                var _timesend = '';
                var _timecancel = '';
                var _timespause = '';
                if (responsedataview.data.message.values[i].timeCall == undefined) {
                    _timeCall = ''
                } else {
                    _timeCall = responsedataview.data.message.values[i].timeCall
                }
                if (responsedataview.data.message.values[i].timeEnd == undefined) {
                    _timesend = ''
                } else {
                    _timesend = responsedataview.data.message.values[i].timeEnd
                }
                if (responsedataview.data.message.values[i].timeCancel == undefined) {
                    _timecancel = ''
                } else {
                    _timecancel = responsedataview.data.message.values[i].timeCancel
                }
                if (_timecancel == '') {
                    if (responsedataview.data.message.values[i].timeCall == undefined) {
                        _timespause = ''
                    } else {
                        _timespause = responsedataview.data.message.values[i].timeCall
                    }
                }
//console.log(responsedataview.data.message.values[i].timeEnd)
                _arr_qloop[_i_loop] = {
                    num: _n_loop,
                    category: responsedataview.data.message.values[i].category,
                    cue: responsedataview.data.message.values[i].cue,
                    serviceChannel: responsedataview.data.message.values[i].serviceChannel,
                    name: responsedataview.data.message.values[i].name,
                    tel: responsedataview.data.message.values[i].tel,
                    timeAdd: responsedataview.data.message.values[i].timeAdd,
                    timeCall: _timeCall,
                    timeEnd: _timesend,
                    timecancel: _timecancel,
                    timepause: _timespause,
                    _id: responsedataview.data.message.values[i]._id
                }
                _i_loop = _i_loop + 1
                _n_loop = _n_loop + 1
            }
        }
    }
    document.getElementById("h_name_report").innerText = 'คิววันที่  ' + day + ' | ' + ' ผู้รอรับบริการ ' + ' | ' + ' แผนก ' + category + ' ' + '( จำนวน ' + _arr_qloop.length + ' คิว )'
    var table = $('#tablequeue_listuserqueue').DataTable({
        "lengthMenu": [[25, 50, 100], [25, 50, 100]],
        "pageLength": 25,
        'data': [..._arr_qloop],
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [
            { data: "num" },
            { data: "category" },
            { data: "cue" },
            { data: "serviceChannel" },
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
                data: "timeCall",
                render: function (data) {
                    if (data != '') {
                        let date = new Date(data);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                            return '-';
                        }
                        return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                    } else { return '-' }
                }
            },
            {
                data: "timeEnd",
                render: function (data) {
                    if (data != '') {
                        let date = new Date(data);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                            return '-';
                        }
                        return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                    } else { return '-' }
                }
            },
            {
                data: "timecancel",
                render: function (data) {
                    if (data != '') {
                        let date = new Date(data);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                            return '-';
                        }
                        return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                    } else { return '-' }
                }
            },
            {
                data: "timepause",
                render: function (data) {
                    if (data != '') {
                        let date = new Date(data);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                            return '-';
                        }
                        return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                    } else { return '-' }
                }
            }
        ],
        dom: 'lBfrtip',
        buttons: [
            {
                title: document.getElementById('h_name_report').innerText,
                text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                extend: 'excel',
            }
        ],
    });
    table.buttons().container().appendTo($('#test3'));
}
function getqaddloop(refresh_token, _page, q) {
    //function getqaddloop(refresh_token, _page, q) {
    //return new Promise(resolve => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?_page=' + _page + '&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            for (i = 0; i < response.data.message.values.length; i++) {
                _arr_queue_add[_i_loop_newdate] = {
                    _id: response.data.message.values[i]._id,
                    category: response.data.message.values[i].category,
                    cue: response.data.message.values[i].cue,
                    name: response.data.message.values[i].name,
                    serviceChannel: response.data.message.values[i].serviceChannel,
                    tel: response.data.message.values[i].tel,
                    timeAdd: response.data.message.values[i].timeAdd,
                    timeCall: response.data.message.values[i].timeCall,
                    timeEnd: response.data.message.values[i].timeEnd,
                    timeCancel: response.data.message.values[i].timeCancel
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
function getqadd(refresh_token) { ////// คิวที่รอทั้งหมด
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qadd/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {

                _arr_queue_add = new Array()
                _i_loop_newdate = 0;

                /////// ข้อมูลแสดง datatable
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 10)
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
                            _id: response.data.message.values[i]._id,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            name: response.data.message.values[i].name,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd
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
function getqcall(refresh_token) { ////// คิวที่รอทั้งหมด
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qcall/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                //  console.log(response)
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;


                /////// ข้อมูลแสดง datatable
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 10)
                var _page = 1;
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        getqaddloop(refresh_token, _page, 'qcall/');
                        _page = _page + 1
                    }
                    resolve(_arr_queue_add)
                } else {
                    for (i = 0; i < response.data.message.values.length; i++) {
                        _arr_queue_add[_i_loop_newdate] = {
                            _id: response.data.message.values[i]._id,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            name: response.data.message.values[i].name,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd,
                            timeCall: response.data.message.values[i].timeCall
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
function getqend(refresh_token) { ////// คิวที่เสร็จ
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qend/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;

                /////// ข้อมูลแสดง datatable
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 10)
                var _page = 1;
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        getqaddloop(refresh_token, _page, 'qend/');
                        _page = _page + 1
                    }
                    resolve(_arr_queue_add)
                } else {
                    for (i = 0; i < response.data.message.values.length; i++) {
                        _arr_queue_add[_i_loop_newdate] = {
                            _id: response.data.message.values[i]._id,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            name: response.data.message.values[i].name,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd,
                            timeEnd: response.data.message.values[i].timeEnd
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
function getqcancel(refresh_token) { ////// คิวที่ถูกยกเลิก
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qcancel/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;

                /////// ข้อมูลแสดง datatable
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 10)
                var _page = 1;
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        getqaddloop(refresh_token, _page, 'qcancel/');
                        _page = _page + 1
                    }
                    resolve(_arr_queue_add)
                } else {
                    for (i = 0; i < response.data.message.values.length; i++) {
                        _arr_queue_add[_i_loop_newdate] = {
                            _id: response.data.message.values[i]._id,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            name: response.data.message.values[i].name,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd,
                            timeCancel: response.data.message.values[i].timeCancel
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
function getqpause(refresh_token) { ////// คิวที่ัพก
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qpause/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                // console.log(response)
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;

                /////// ข้อมูลแสดง datatable
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 10)
                var _page = 1;
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        getqaddloop(refresh_token, _page, 'qpause/');
                        _page = _page + 1
                    }
                    resolve(_arr_queue_add)
                } else {
                    for (i = 0; i < response.data.message.values.length; i++) {
                        _arr_queue_add[_i_loop_newdate] = {
                            _id: response.data.message.values[i]._id,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            name: response.data.message.values[i].name,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd,
                            timeCall: response.data.message.values[i].timeCall
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
    var prm = 'category=' + categoryqueue + '&'
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




    var cnt_betaween = parseInt(Endvaldate_sp[1]) - parseInt(Startvaldate_sp[1])

    var s_d = parseInt(Startvaldate_sp[1]);
    var cnt = 0;

    for (i = 0; i < cnt_betaween + 1; i++) {
        if (i == 0) {
            day_view[i] = s_d.toString().padStart(2, '0') + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[2]
            cnt = parseInt(s_d)
        } else {
            day_view[i] = cnt.toString().padStart(2, '0') + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[2]

        }
        cnt = cnt + 1
    }
    // console.log(day_view)


    arr_datesearch[0] = Startvaldate_sp[2] + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[1] + ' ' + '00:00' + ':00'
    arr_datesearch[1] = Endvaldate_sp[2] + '/' + Endvaldate_sp[0] + '/' + Endvaldate_sp[1] + ' ' + '23:59' + ':59'
    // arr_datesearch[2] = cnt_betaween
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
                const result = await acctoken();
                document.getElementById("a_back2").style.display = 'block'
                document.getElementById("a_back").style.display = 'none'
                document.getElementById("div_preloaderuserqueue").style.display = 'block'
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
                document.getElementById("table_category").style.display = 'none'
                await Getqueueviewcategory(data_click.category, result, 'qadd/', data._day)
                document.getElementById("div_preloaderuserqueue").style.display = 'none'


            });
            $('#table1_category_list').on('click', 'a.qcall', async function (e) { /////ผู้กำลังรับบริการ แผนก
                const result = await acctoken();
                document.getElementById("a_back2").style.display = 'block'
                document.getElementById("a_back").style.display = 'none'
                document.getElementById("div_preloaderuserqueue").style.display = 'block'
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
                document.getElementById("table_category").style.display = 'none'
                await Getqueueviewcategory(data_click.category, result, 'qcall/', data._day)
                document.getElementById("div_preloaderuserqueue").style.display = 'none'

            });
            $('#table1_category_list').on('click', 'a.qend', async function (e) { /////ผู้รับบริการแล้ว แผนก
                const result = await acctoken();
                document.getElementById("a_back2").style.display = 'block'
                document.getElementById("a_back").style.display = 'none'

                document.getElementById("div_preloaderuserqueue").style.display = 'block'
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

                document.getElementById("table_category").style.display = 'none'

                await Getqueueviewcategory(data_click.category, result, 'qend/', data._day)
                document.getElementById("div_preloaderuserqueue").style.display = 'none'
            });
            $('#table1_category_list').on('click', 'a.qcancel', async function (e) { /////คิวที่ถูกยกเลิก แผนก
                const result = await acctoken();
                document.getElementById("a_back2").style.display = 'block'
                document.getElementById("a_back").style.display = 'none'

                document.getElementById("div_preloaderuserqueue").style.display = 'block'
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

                document.getElementById("table_category").style.display = 'none'

                await Getqueueviewcategory(data_click.category, result, 'qcancel/', data._day)
                document.getElementById("div_preloaderuserqueue").style.display = 'none'
            });
            $('#table1_category_list').on('click', 'a.qpause', async function (e) { /////คิวที่ถูกพัก แผนก
                const result = await acctoken();
                document.getElementById("a_back2").style.display = 'block'
                document.getElementById("a_back").style.display = 'none'
                document.getElementById("div_preloaderuserqueue").style.display = 'block'
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
                document.getElementById("table_category").style.display = 'none'
                await Getqueueviewcategory(data_click.category, result, 'qpause/', data._day)
                document.getElementById("div_preloaderuserqueue").style.display = 'none'
            });
            $('#table1_category_list').on('click', 'a.sum', async function (e) { /////คิวที่ถูกพัก แผนก
                const result = await acctoken();
                document.getElementById("a_back2").style.display = 'block'
                document.getElementById("a_back").style.display = 'none'
                document.getElementById("div_preloaderuserqueue").style.display = 'block'
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
                document.getElementById("table_category").style.display = 'none'
                await Getqueueviewcategory(data_click.category, result, 'qadd/', data._day)
                await Getqueueviewcategory(data_click.category, result, 'qcall/', data._day)
                await Getqueueviewcategory(data_click.category, result, 'qend/', data._day)
                await Getqueueviewcategory(data_click.category, result, 'qcancel/', data._day)
                await Getqueueviewcategory(data_click.category, result, 'qpause/', data._day)
                document.getElementById("div_preloaderuserqueue").style.display = 'none'
            });
            $('#table1_category_list').on('click', 'tfoot th', async function () {  /////ผู้รอรับบริการ ทั้งหมด
                const result = await acctoken();
                check_table_clack = 'true';
                var table = $('#table1_category_list').DataTable();
                index = table.column($(this).index() + ':visible').index();
                // console.log(data._day)
                // console.log(index)
            
                switch (index) {
                    case 2:
                        
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'
                        document.getElementById("table_category").style.display = 'none'
                        await Getqueueviewcategory(undefined, result, 'qadd/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 3:


                      
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'
                        document.getElementById("table_category").style.display = 'none'
                        await Getqueueviewcategory(undefined, result, 'qcall/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'

                 
                        break;
                    case 4:
                      
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'
                        document.getElementById("table_category").style.display = 'none'
                        await Getqueueviewcategory(undefined, result, 'qend/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 5:
                      
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'
                        document.getElementById("table_category").style.display = 'none'
                        await Getqueueviewcategory(undefined, result, 'qcancel/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 6:
                      
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'
                        document.getElementById("table_category").style.display = 'none'
                        await Getqueueviewcategory(undefined, result, 'qpause/', data._day)
                        document.getElementById("div_preloaderuserqueue").style.display = 'none'
                        break;
                    case 7:
                      
                        document.getElementById("a_back2").style.display = 'block'
                        document.getElementById("a_back").style.display = 'none'
                        document.getElementById("div_preloaderuserqueue").style.display = 'block'

                        _arr_qloop = new Array();
                        _n_loop = 1;
                        _i_loop = 0;
                        document.getElementById("div_qall").style.display = 'none'
                        document.getElementById("div_table_listuserqueue").style.display = 'block'
                        document.getElementById("table_category").style.display = 'none'
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
    const queueadd = await getqadd(result); ////คิวรอรับบริการ
    const queueqend = await getqend(result);   ////คิวรับบริการแล้ว
    const qcall = await getqcall(result); ////คิวกำลังรับบริการ
    const qcancel = await getqcancel(result);   ////คิวที่ถูกยกเลิก
    const qpause = await getqpause(result); ////คิวที่ถูกพัก
    var count_q = 0;
    var view_qadd = 0;
    var view_qcall = 0;
    var view_qend = 0;
    var view_qcancel = 0;
    var view_qpausel = 0;
    var _arrdataqueue = new Array();
    var num_category = 1;
    for (let i in categoryview) {
        for (let i_qadd in queueadd) {
            var _checkdate = await chechdate_Time(queueadd[i_qadd].timeAdd, datetime)
            if (_checkdate == true) {
                if (categoryview[i].category == queueadd[i_qadd].category) {
                    count_q = count_q + 1
                }
            }
        }
        view_qadd = count_q
        count_q = 0;
        for (let i_qcall in qcall) {
            var _checkdate = await chechdate_Time(qcall[i_qcall].timeCall, datetime)
            if (_checkdate == true) {
                if (categoryview[i].category == qcall[i_qcall].category) {
                    count_q = count_q + 1
                }
            }
        }
        view_qcall = count_q;
        count_q = 0;
        for (let i_qend in queueqend) {
            var _checkdate = await chechdate_Time(queueqend[i_qend].timeEnd, datetime)
            if (_checkdate == true) {
                if (categoryview[i].category == queueqend[i_qend].category) {
                    count_q = count_q + 1
                }
            }
        }
        view_qend = count_q;
        count_q = 0;
        for (let i_qcancel in qcancel) {
            var _checkdate = await chechdate_Time(qcancel[i_qcancel].timeCancel, datetime)
            if (_checkdate == true) {
                if (categoryview[i].category == qcancel[i_qcancel].category) {
                    count_q = count_q + 1
                }
            }
        }
        view_qcancel = count_q;
        count_q = 0;
        for (let i_qpausel in qpause) {
            var _checkdate = await chechdate_Time(qpause[i_qpausel].timeCall, datetime)
            if (_checkdate == true) {
                if (categoryview[i].category == qpause[i_qpausel].category) {
                    count_q = count_q + 1
                }
            }
        }
        view_qpausel = count_q;
        count_q = 0;

        _arrdataqueue[i] = {
            num: num_category,
            category: categoryview[i].category,
            qadd: view_qadd,
            qcall: view_qcall,
            qend: view_qend,
            qcancel: view_qcancel,
            qpause: view_qpausel,
            sum: view_qadd + view_qcall + view_qend + view_qcancel + view_qpausel
        }
        num_category = num_category + 1
    }
    view_queue = 0;
    view_qcall = 0;
    count_q = 0;
    var header = [];
    header.push("ลำดับที่");
    header.push("แผนก");
    header.push("ผู้รอรับบริการ");
    header.push("ผู้กำลังรับบริการ");
    header.push("ผู้รับบริการแล้ว");
    header.push("การยกเลิก");
    header.push("คิวที่ถูกพัก");
    header.push("รวม");
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
        columns: [
            {
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
            },
            {
                data: "qcall",
                render: function (data) {
                    if (data != 0) {
                        return '<a class="qcall" style="color:blue; cursor: pointer;">' + data + '</a>';
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qend",
                render: function (data) {
                    if (data != 0) {
                        return '<a class="qend" style="color:blue; cursor: pointer;">' + data + '</a>';

                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qcancel",
                render: function (data) {
                    if (data != 0) {
                        return '<a class="qcancel" style="color:blue; cursor: pointer;">' + data + '</a>';

                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qpause",
                render: function (data) {
                    if (data != 0) {
                        return '<a class="qpause" style="color:blue; cursor: pointer;">' + data + '</a>';

                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: 'sum',
                render: function (data) {
                    if (data != 0) {
                        return '<a class="sum" style="color:blue; cursor: pointer;">' + data + '</a>';
                    } else {
                        return data = '0'
                    }
                }
            }
        ],
        dom: 'lBfrtip',
        buttons: [
            {
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
                }
            }
        ],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(),
                data;
            //console.log(api)
            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            // Total over all pages
            for (i = 2; i < 8; i++) {
                total = api
                    .column(i)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total over this page
                pageTotal = api
                    .column(i, {
                        page: 'current'
                    })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
                // Update footer
                $(api.column(i).footer()).html(
                    '<a class="foot" style="font-size:14px;color:blue; cursor: pointer;">' + total + '</a>'
                );
                $(api.column(i).footer()).html(
                    '<a class="foot" style="font-size:14px;color:blue; cursor: pointer;">' + pageTotal + '</a>'
                );
                // $('#total').text('£' + Number(pageTotal).toFixed(i));
            }
        }
    });
    table.buttons().container().appendTo($('#test2'));
}

async function v_socketio() {
    const result = await acctoken();
    var _arrdataqueue = new Array();
    // const fileview = await getprofileview(result);
    // const categoryview = await getcategoryview(result);
    //////ตาราง
    const queueadd = await getqadd(result); ////คิวรอรับบริการ
    const queueqend = await getqend(result);   ////คิวรับบริการแล้ว
    const qcall = await getqcall(result); ////คิวกำลังรับบริการ
    const qcancel = await getqcancel(result);   ////คิวที่ถูกยกเลิก
    const qpause = await getqpause(result); ////คิวที่ถูกพัก
    var view_qadd = 0;
    var view_qcall = 0;
    var view_qend = 0;
    var view_qcancel = 0;
    var view_qpause = 0;

    for (let i in day_view) {
        /////// คิวผู้รอรับบริการ
        for (let i_qadd in queueadd) {
            var _checkdate = await chechdate_Time(queueadd[i_qadd].timeAdd, day_view[i])
            if (_checkdate == true) {
                view_qadd = num_day
            }
        }
        num_day = 0
        /////// ผู้ที่กำลังรับบริการ
        for (let i_qcall in qcall) {
            var _checkdate = await chechdate_Time(qcall[i_qcall].timeCall, day_view[i])
            if (_checkdate == true) {
                view_qcall = num_day
            }
        }
        num_day = 0
        /////// ผู้ที่รับบริการแล้ว
        for (let i_qend in queueqend) {
         
            var _checkdate = await chechdate_Time(queueqend[i_qend].timeEnd, day_view[i])
            if (_checkdate == true) {
                view_qend = num_day
            }
        }
        num_day = 0
        /////// ผู้ที่ถูกยกเลิก
        for (let i_qcancel in qcancel) {
            var _checkdate = await chechdate_Time(qcancel[i_qcancel].timeCancel, day_view[i])
            if (_checkdate == true) {
                view_qcancel = num_day
            }
        }
        num_day = 0
        /////// ผู้ที่ถูกพัก
        for (let i_qpause in qpause) {
            //  console.log(qpause[i_qpause])
            var _checkdate = await chechdate_Time(qpause[i_qpause].timeCall, day_view[i])
            if (_checkdate == true) {
                view_qpause = num_day
            }
        }
        _arrdataqueue[i] = {
            _day: day_view[i],
            queue: view_qadd,
            qcall: view_qcall,
            qend: view_qend,
            qcancel: view_qcancel,
            qpause: view_qpause,
            sum: view_qadd + view_qcall + view_qend + view_qcancel + view_qpause
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
    // console.log(_arrdataqueue)
    var header = [];
    header.push("วันที่");
    header.push("ผู้รอรับบริการ");
    header.push("ผู้กำลังรับบริการ");
    header.push("ผู้รับบริการแล้ว");
    header.push("การยกเลิก");
    header.push("คิวที่ถูกพัก");
    header.push("รวม");
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
        columns: [
            {
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
            {
                data: "qcall",
                render: function (data) {
                    if (data != 0) {
                        //return '<a class="qcall">' + data + '</a>';
                        return data;
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qend",
                render: function (data) {
                    if (data != 0) {
                        // return '<a class="qend">' + data + '</a>';
                        return data;
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qcancel",
                render: function (data) {
                    if (data != 0) {
                        // return '<a class="qcancel" >' + data + '</a>';
                        return data;
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qpause",
                render: function (data) {
                    if (data != 0) {
                        // return '<a class="qpause">' + data + '</a>';
                        return data;
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: 'sum',
                render: function (data) {
                    if (data != 0) {
                        return '<b><a style="color:#000000; " class="qend">' + data + '</a></b>';
                        //  return  data ;
                    } else {
                        return data = '0'
                    }
                }
            }
        ],
        dom: 'lBfrtip',
        buttons: [
            {
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
                    columns: [0, 1, 2, 3, 4, 5, 6]
                }
            }

        ],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(),
                data;
            //console.log(api)
            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            // Total over all pages
            for (i = 1; i < 7; i++) {
                total = api
                    .column(i)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total over this page
                pageTotal = api
                    .column(i, {
                        page: 'current'
                    })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Update footer
                $(api.column(i).footer()).html(
                    '<b><a class="foot" style="14px;color:#000000; ">' + total + '</a></b>'
                );
                $(api.column(i).footer()).html(
                    '<b><a class="foot" style="14px;color:#000000;">' + pageTotal + '</a></b>'
                );
                // $('#total').text('£' + Number(pageTotal).toFixed(i));
            }
        }
    });
    table.buttons().container().appendTo($('#test'));
}
