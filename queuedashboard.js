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
var chartcategory = new Array();
var chartcategory_queue = new Array();
var chartcategory_queue_call = new Array();
var chartcategory_queue_end = new Array();
var q_num = 0;
var check_table_clack = '';
var _id_q = '';
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
const view_datatable = async (responsedataview, q) => {
    var datenew = await datenewToday();
    $('#tablequeue_view').DataTable().destroy();
    if (responsedataview.data.message.values.length != 0) {
        for (i = 0; i < responsedataview.data.message.values.length; i++) {
            var _checkdate = await chechdate_Time(responsedataview.data.message.values[i].timeAdd, datenew)
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
                
                if(_timecancel == ''){
                    if (responsedataview.data.message.values[i].timeCall == undefined) {
                        _timespause = ''
                    } else {
                        _timespause = responsedataview.data.message.values[i].timeCall
                    }
                }
                
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
    var table = $('#tablequeue_view').DataTable({
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
            }
            ,
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
    table.buttons().container().appendTo($('#test1'));
}
//const getqaddloop = async (refresh_token, _page, q) => {
function getqaddloop(refresh_token, _page, q) {
    //function getqaddloop(refresh_token, _page, q) {
    //return new Promise(resolve => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?_page=' + _page + '&_limit=10&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log('hhhhhhhhhhhh')
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
        }).catch(function (res) {
            const { response } = res
        });
    });
    // });
}
const viewqueuetfootloop = async (refresh_token, _page, q) => {
    //return new Promise(resolve => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?_page=' + _page + '&_limit=10&_sort=1', {
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
            axios.get(urlipaddress + 'qadd/' + _objectId + '?_page=1&_limit=10&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;
                if (index != undefined) {
                    _arr_qloop = new Array();
                    _n_loop = 1;
                    _i_loop = 0;
                    console.log(index)
                    var totle = response.data.message.total
                    var looptotle = Math.ceil(totle / 10)
                    console.log(looptotle)
                    if (looptotle > 1) { ///// คิวมากกว่า loop 100
                        var _page = 1;
                        for (i = 0; i < looptotle; i++) {
                            viewqueuetfootloop(refresh_token, _page, 'qadd/')
                            _page = _page + 1
                        }
                    } else {
                        view_datatable(response, 'qadd/')
                        resolve(response.data.message);
                    }
                    return;
                }
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
            axios.get(urlipaddress + 'qcall/' + _objectId + '?_page=1&_limit=10&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;

                if (index != undefined) {
                    var totle = response.data.message.total
                    var looptotle = Math.ceil(totle / 10)
                    if (looptotle > 1) { ///// คิวมากกว่า loop 100
                        var _page = 1;
                        for (i = 0; i < looptotle; i++) {
                            viewqueuetfootloop(refresh_token, _page, 'qcall/')
                            _page = _page + 1
                        }
                    } else {
                        console.log(response)
                        view_datatable(response, 'qcall/')
                        resolve(response.data.message);
                    }
                    return;
                }
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
function getqend(refresh_token) { ////// คิวที่เสร็จ
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qend/' + _objectId + '?_page=1&_limit=10&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;
                if (index != undefined) {
                    var totle = response.data.message.total
                    var looptotle = Math.ceil(totle / 10)
                    if (looptotle > 1) { ///// คิวมากกว่า loop 100
                        var _page = 1;
                        for (i = 0; i < looptotle; i++) {
                            viewqueuetfootloop(refresh_token, _page, 'qend/')
                            _page = _page + 1
                        }
                    } else {
                        view_datatable(response, 'qend/')
                        resolve(response.data.message);
                    }
                    return;
                }
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
function getqcancel(refresh_token) { ////// คิวที่ถูกยกเลิก
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qcancel/' + _objectId + '?_page=1&_limit=10&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;
                if (index != undefined) {
                    var totle = response.data.message.total
                    var looptotle = Math.ceil(totle / 10)
                    if (looptotle > 1) { ///// คิวมากกว่า loop 100
                        var _page = 1;
                        for (i = 0; i < looptotle; i++) {
                            viewqueuetfootloop(refresh_token, _page, 'qcancel/')
                            _page = _page + 1
                        }
                    } else {
                        view_datatable(response, 'qcancel/')
                        resolve(response.data.message);
                    }
                    return;
                }
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
function getqpause(refresh_token) { ////// คิวที่ัพก
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'qpause/' + _objectId + '?_page=1&_limit=10&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                _arr_queue_add = new Array()
                _i_loop_newdate = 0;
                if (index != undefined) {
                    var totle = response.data.message.total
                    var looptotle = Math.ceil(totle / 10)
                    if (looptotle > 1) { ///// คิวมากกว่า loop 100
                        var _page = 1;
                        for (i = 0; i < looptotle; i++) {
                            viewqueuetfootloop(refresh_token, _page, 'qpause/')
                            _page = _page + 1
                        }
                    } else {
                        view_datatable(response, 'qpause/')
                        resolve(response.data.message);
                    }
                    return;
                }
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
function getprofileview(refresh_token) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'profile/' + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.values);

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
const queueloop = async (refresh_token, prm, _page, q) => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?' + prm + '_page=' + _page + '&_limit=10&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            if (response.data.message.values.length != 0) {
                view_datatable(response, q)
            }
        });
    });
}
const Getqueueviewcategory = async (categoryqueue, refresh_token, q) => {
    var prm = 'category=' + categoryqueue + '&'
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?' + prm + '_page=1&_limit=10&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            _arr_queue_add = new Array()
            _i_loop_newdate = 0;
            if (index != undefined) {
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 10)
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    var _page = 1;
                    for (i = 0; i < looptotle; i++) {
                        console.log(_page)
                        queueloop(refresh_token, prm, _page, q)
                        _page = _page + 1
                    }
                } else {
                    view_datatable(response, q)
                }
                return;
            }
            /////// ข้อมูลแสดง datatable
            var totle = response.data.message.total
            var looptotle = Math.ceil(totle / 10)
            var _page = 1;
            if (looptotle > 1) { ///// คิวมากกว่า loop 100
                for (i = 0; i < looptotle; i++) {
                    console.log(_page)
                    queueloop(refresh_token, prm, _page, q)
                    _page = _page + 1
                }
            } else {
                view_datatable(response, q)
            }
        }).catch(function (res) {
            const { response } = res
        });
    });
}
$.getScript("ip.js", async function (data, textStatus, jqxhr) {
    var urlipaddress = data.substring(1, data.length - 1);
    const socket = io(urlipaddress);
    const result = await acctoken();
    socket.on('sentServiceChannel', async function (data) {
        if (check_table_clack == '') {
            console.log(data)
            await v_socketio();
        }
    });
    socket.on('sentEndQueue', async function (data) {
        if (check_table_clack == '') {
            console.log(data)
            await v_socketio();
        }
    });
});

async function datenewToday() {
    var today = new Date();
    var n_date = today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    chk_date = chk_date[0].split('/')
    var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]
    return datenew;
}
var arr_datesearch = new Array()
async function dateSearch() {
    var timeStart = document.getElementById('startdate').value.split('/');
    var timeStop = document.getElementById('enddate').value.split('/');
    var s_time = document.getElementById('txttimestart').value;
    var e_time = document.getElementById('txttimestop').value;
    //////// ปี/เดือน/วัน
    if (timeStart[0] == '' || timeStop[0] == '') {
        showCancelMessagesearch('กรุณาเลือกวันที่', 'เลือกวันที่เริ่มต้น เวลาเริ่มต้น และ วันที่สิ้นสุด เวลาสิ้นสุด')
        return;
    }
    var StartisoDate = (`${timeStart[2] + '/' + timeStart[1] + '/' + timeStart[0] + ' ' + s_time + ':00'}`)
    var StopisoDate = (`${timeStop[2] + '/' + timeStop[1] + '/' + timeStop[0] + ' ' + e_time + ':59'}`)
    arr_datesearch[0] = StartisoDate
    arr_datesearch[1] = StopisoDate
    $('#tablequeue_view').DataTable().destroy();
    return arr_datesearch
}

$(async function () {
    const result = await acctoken();
    await v_socketio();
    $(document).ready(function () {
        $('#submitqueueReport').on('click', async function (e) {
            check_table_clack = 'true';
            _arr_qloop = new Array();
            console.log(_arr_qloop)
            _n_loop = 1;
            _i_loop = 0;
            document.getElementById("btn_cancel").style.display = 'block'
            _arr_queue_add = new Array();
            _i_loop_newdate = 0;
            await dateSearch()
            await v_socketio();
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
        $(document).ready(function () {
            var data;
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                $('#tablequeue').on('click', 'a.queue', function (e) { /////ผู้รอรับบริการ แผนก
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
                    document.getElementById("h_name_report").innerText = 'ผู้รอรับบริการ ' + data.category
                    document.getElementById("div_qall").style.display = 'none'
                    document.getElementById("div_qdisplay").style.display = 'block'
                    document.getElementById("did_search").style.display = 'none'
                    console.log('tableclick')
                    Getqueueviewcategory(data.category, result, 'qadd/')
                });
                $('#tablequeue').on('click', 'a.qcall', function (e) { /////ผู้กำลังรับบริการ แผนก
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
                    document.getElementById("h_name_report").innerText = 'ผู้กำลังรับบริการ ' + data.category
                    document.getElementById("div_qall").style.display = 'none'
                    document.getElementById("div_qdisplay").style.display = 'block'
                    document.getElementById("did_search").style.display = 'none'
                    Getqueueviewcategory(data.category, result, 'qcall/')
                });
                $('#tablequeue').on('click', 'a.qend', function (e) { /////ผู้รับบริการแล้ว แผนก
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
                    document.getElementById("h_name_report").innerText = 'ผู้รับบริการแล้ว ' + data.category
                    document.getElementById("div_qall").style.display = 'none'
                    document.getElementById("div_qdisplay").style.display = 'block'
                    document.getElementById("did_search").style.display = 'none'
                    Getqueueviewcategory(data.category, result, 'qend/')
                });
                $('#tablequeue').on('click', 'a.qcancel', function (e) { /////คิวที่ถูกยกเลิก แผนก
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
                    document.getElementById("h_name_report").innerText = 'คิวที่ถูกยกเลิก ' + data.category
                    document.getElementById("div_qall").style.display = 'none'
                    document.getElementById("div_qdisplay").style.display = 'block'
                    document.getElementById("did_search").style.display = 'none'
                    Getqueueviewcategory(data.category, result, 'qcancel/')
                });
                $('#tablequeue').on('click', 'a.qpause', function (e) { /////คิวที่ถูกพัก แผนก
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
                    document.getElementById("h_name_report").innerText = 'คิวที่ถูกพัก ' + data.category
                    document.getElementById("div_qall").style.display = 'none'
                    document.getElementById("div_qdisplay").style.display = 'block'
                    document.getElementById("did_search").style.display = 'none'
                    Getqueueviewcategory(data.category, result, 'qpause/')
                });
                $('#tablequeue').on('click', 'tfoot th', function () {  /////ผู้รอรับบริการ ทั้งหมด
                    check_table_clack = 'true';
                    var table = $('#tablequeue').DataTable();
                    index = table.column($(this).index() + ':visible').index();
                    // console.log(index)
                    switch (index) {
                        case 1:
                            _arr_qloop = new Array();
                            _arr_queue_add = new Array();
                            _n_loop = 1;
                            _i_loop = 0;
                            getqadd(result)
                            document.getElementById("h_name_report").innerText = 'ผู้รอรับบริการทั้งหมด'
                            document.getElementById("div_qall").style.display = 'none'
                            document.getElementById("div_qdisplay").style.display = 'block'
                            document.getElementById("did_search").style.display = 'none'
                            break;
                        case 2:
                            _arr_qloop = new Array();
                            _arr_queue_add = new Array();
                            _n_loop = 1;
                            _i_loop = 0;
                            console.log('call')
                            getqcall(result)
                            document.getElementById("h_name_report").innerText = 'ผู้กำลังรับบริการทั้งหมด'
                            document.getElementById("div_qall").style.display = 'none'
                            document.getElementById("div_qdisplay").style.display = 'block'
                            document.getElementById("did_search").style.display = 'none'
                            break;
                        case 3:
                            console.log('end')
                            _arr_qloop = new Array();
                            _arr_queue_add = new Array();
                            _n_loop = 1;
                            _i_loop = 0;
                            getqend(result)
                            document.getElementById("h_name_report").innerText = 'ผู้รับบริการทั้งหมด'
                            document.getElementById("div_qall").style.display = 'none'
                            document.getElementById("div_qdisplay").style.display = 'block'
                            document.getElementById("did_search").style.display = 'none'
                            break;
                        case 4:
                            console.log('cancel')
                            _arr_qloop = new Array();
                            _arr_queue_add = new Array();
                            _n_loop = 1;
                            _i_loop = 0;
                            getqcancel(result)
                            document.getElementById("h_name_report").innerText = 'คิวที่ถูกยกเลิกทั้งหมด'
                            document.getElementById("div_qall").style.display = 'none'
                            document.getElementById("div_qdisplay").style.display = 'block'
                            document.getElementById("did_search").style.display = 'none'
                            break;
                        case 5:
                            console.log('pause')
                            _arr_qloop = new Array();
                            _arr_queue_add = new Array();
                            _n_loop = 1;
                            _i_loop = 0;
                            getqpause(result)
                            document.getElementById("h_name_report").innerText = 'คิวที่ถูกพักทั้งหมด'
                            document.getElementById("div_qall").style.display = 'none'
                            document.getElementById("div_qdisplay").style.display = 'block'
                            document.getElementById("did_search").style.display = 'none'
                            break;
                        case 6:
                            break;
                        default:
                    }
                });
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

async function chechdate_Time(datadatetime, datenew) {
    let date = new Date(datadatetime);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var s_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    var time = s_date.split(' ')
    s_date = time[0].split('/')
    var _date = s_date[2] + '/' + s_date[0] + '/' + s_date[1] + ' ' + time[1]
    var _dateToday = s_date[2] + '/' + s_date[0] + '/' + s_date[1]
    var _checkdate;
    if (arr_datesearch.length != 0) {
        const isBetween = window.dayjs_plugin_isBetween;
        dayjs.extend(isBetween);
        _checkdate = dayjs(_date).isBetween(arr_datesearch[0], arr_datesearch[1], undefined, '[]');
    } else {
        _checkdate = dayjs(datenew).isSame(_dateToday)
    }
    return _checkdate;
}


//const v_socketio = async () => {
async function v_socketio() {
    const result = await acctoken();
    var _arrdataqueue = new Array();
    var _n = 0
    const fileview = await getprofileview(result);
    const categoryview = await getcategoryview(result);
    //////ตาราง
    const queuecount = await getqadd(result); ////คิวรอรับบริการ
    const queueqend = await getqend(result);   ////คิวรับบริการแล้ว
    const qcall = await getqcall(result); ////คิวกำลังรับบริการ
    const qcancel = await getqcancel(result);   ////คิวที่ถูกยกเลิก
    const qpause = await getqpause(result); ////คิวที่ถูกพัก
    var datenew = await datenewToday();
    var view_queue = 0;
    var view_qcall = 0;
    var view_qend = 0;
    var view_qcancel = 0;
    var view_qpause = 0;
    var count_qadd = 0;
    var btn_q_add = 0;
    var btn_q_call = 0;
    var btn_q_end = 0;
    var btn_q_cancel = 0;
    var btn_q_pause = 0;
    var count_qcall = 0;
    var count_qend = 0;
    var count_qcancel = 0;
    var count_qpause = 0;
    for (let i_category in categoryview) {
        chartcategory[i_category] = categoryview[i_category].category
        /////// คิวผู้รอรับบริการ
        for (let i_qadd in queuecount) {
            var _checkdate = await chechdate_Time(queuecount[i_qadd].timeAdd, datenew)
            if (_checkdate == true) {
                if (categoryview[i_category].category == queuecount[i_qadd].category) {
                    count_qadd = count_qadd + 1
                    ////// กราฟ
                    q_num = q_num + 1;
                    chartcategory_queue[i_category] = q_num
                } else {
                    if (q_num == 0) {  ////// กราฟ
                        chartcategory_queue[i_category] = 0
                    }
                }
            }
        }
        view_queue = count_qadd
        btn_q_add = btn_q_add + count_qadd
        /////// ผู้กำลังรับบริการ
        q_num = 0;
        for (let i_qcall in qcall) {
            var _checkdate = await chechdate_Time(qcall[i_qcall].timeAdd, datenew)
            if (_checkdate == true) {
                if (categoryview[i_category].category == qcall[i_qcall].category) {
                    count_qcall = count_qcall + 1
                    $("#qcall").text((count_qadd) + " คิว");
                    ////// กราฟ
                    q_num = q_num + 1;
                    chartcategory_queue_call[i_category] = q_num
                } else {
                    if (q_num == 0) {  ////// กราฟ
                        chartcategory_queue_call[i_category] = 0
                    }
                }
            }
        }
        view_qcall = count_qcall
        btn_q_call = btn_q_call + view_qcall
        q_num = 0;
        /////// ผู้รับบริการแล้ว
        for (let i_qend in queueqend) {
            var _checkdate = await chechdate_Time(queueqend[i_qend].timeAdd, datenew)
            if (_checkdate == true) {
                if (categoryview[i_category].category == queueqend[i_qend].category) {
                    count_qend = count_qend + 1
                    $("#qend").text((count_qadd) + " คิว");
                    ////// กราฟ
                    q_num = q_num + 1;
                    chartcategory_queue_end[i_category] = q_num
                } else {
                    if (q_num == 0) {  ////// กราฟ
                        chartcategory_queue_end[i_category] = 0
                    }
                }
            }
        }
        view_qend = count_qend
        btn_q_end = btn_q_end + view_qend
        q_num = 0;
        /////// คิวที่ถูกยกเลิก
        for (let i_qend in qcancel) {
            var _checkdate = await chechdate_Time(qcancel[i_qend].timeAdd, datenew)
            if (_checkdate == true) {
                if (categoryview[i_category].category == qcancel[i_qend].category) {
                    count_qcancel = count_qcancel + 1
                    $("#qcancel").text((count_qcancel) + " คิว");
                    ////// กราฟ
                    q_num = q_num + 1;
                    chartcategory_queue_end[i_category] = q_num
                } else {
                    if (q_num == 0) {  ////// กราฟ
                        chartcategory_queue_end[i_category] = 0
                    }
                }
            }
        }
        view_qcancel = count_qcancel
        btn_q_cancel = btn_q_cancel + view_qcancel
        q_num = 0;
        /////// คิวที่ถูกพัก
        for (let i_qend in qpause) {
            var _checkdate = await chechdate_Time(qpause[i_qend].timeAdd, datenew)
            if (_checkdate == true) {
                if (categoryview[i_category].category == qpause[i_qend].category) {
                    count_qpause = count_qpause + 1
                    $("#qpause").text((count_qpause) + " คิว");
                    ////// กราฟ
                    q_num = q_num + 1;
                    chartcategory_queue_end[i_category] = q_num
                } else {
                    if (q_num == 0) {  ////// กราฟ
                        chartcategory_queue_end[i_category] = 0
                    }
                }
            }
        }
        view_qpause = count_qpause
        btn_q_pause = btn_q_pause + view_qpause
        q_num = 0;

        _arrdataqueue[i_category] = {
            category: categoryview[i_category].category,
            queue: view_queue,
            qcall: view_qcall,
            qend: view_qend,
            qcancel: view_qcancel,
            qpause: view_qpause
        }

        view_qcall = 0
        view_queue = 0
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

    $("#qadd").text((btn_q_add) + " คิว");
    $("#qcall").text((btn_q_call) + " คิว");
    $("#qend").text((btn_q_end) + " คิว");
    $("#queue").text((btn_q_add + btn_q_call + btn_q_end) + " คิว");

    var header = [];
    header.push("แผนก");
    header.push("ผู้รอรับบริการ");
    header.push("ผู้กำลังรับบริการ");
    header.push("ผู้รับบริการแล้ว");
    header.push("การยกเลิก");
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
            { data: "category" },
            {
                data: 'queue',
                render: function (data) {
                    if (data != 0) {
                        return '<u><a class="queue" style="color:blue; cursor: pointer;">' + data + '</a></u>';
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qcall",
                render: function (data) {
                    if (data != 0) {
                        return '<u><a class="qcall" style="color:blue; cursor: pointer;">' + data + '</a></u>';
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qend",
                render: function (data) {
                    if (data != 0) {
                        return '<u><a class="qend" style="color:blue; cursor: pointer;">' + data + '</a></u>';
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qcancel",
                render: function (data) {
                    if (data != 0) {
                        return '<u><a class="qcancel" style="color:blue; cursor: pointer;">' + data + '</a></u>';
                    } else {
                        return data = '0'
                    }
                }
            },
            {
                data: "qpause",
                render: function (data) {
                    if (data != 0) {
                        return '<u><a class="qpause" style="color:blue; cursor: pointer;">' + data + '</a></u>';
                    } else {
                        return data = '0'
                    }
                }
            },
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
                    columns: [0, 1, 2, 3, 4, 5]
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
            for (i = 1; i < 6; i++) {
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
                    '<u><a class="foot" style="font-size:14px;color:blue; cursor: pointer;">' + total + '</a></u>'
                );
                $(api.column(i).footer()).html(
                    '<u><a class="foot" style="font-size:14px;color:blue; cursor: pointer;">' + pageTotal + '</a></u>'
                );
                // $('#total').text('£' + Number(pageTotal).toFixed(i));
            }
        }
    });
    table.buttons().container().appendTo($('#test'));


    q_num = 0;
    var chartprofile = new Array();
    var chartprofile_num = new Array();
    for (i = 0; i < fileview.length; i++) {  /////โปรไฟล์
        chartprofile[i] = fileview[i].name
        chartprofile_num[i] = fileview[i].category.length
    }
    $(function () {

        new Chart(document.getElementById("bar_queuecategory").getContext("2d"), getChartJs('bar'));
        new Chart(document.getElementById("donut_chart_category").getContext("2d"), getChartJs('piecategory'));
        new Chart(document.getElementById("donut_chart_profile").getContext("2d"), getChartJs('pieprofile'));
    });
    function getChartJs(type) {
        if (type === 'line') {
            config = {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],

                    datasets: [{
                        label: "My First dataset",
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: 'rgba(0, 188, 212, 0.75)',
                        backgroundColor: 'rgba(0, 188, 212, 0.3)',
                        pointBorderColor: 'rgba(0, 188, 212, 0)',
                        pointBackgroundColor: 'rgba(0, 188, 212, 0.9)',
                        pointBorderWidth: 1
                    }, {
                        label: "My Second dataset",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        borderColor: 'rgba(233, 30, 99, 0.75)',
                        backgroundColor: 'rgba(233, 30, 99, 0.3)',
                        pointBorderColor: 'rgba(233, 30, 99, 0)',
                        pointBackgroundColor: 'rgba(233, 30, 99, 0.9)',
                        pointBorderWidth: 1
                    }

                    ]
                },
                options: {
                    responsive: true,
                    //legend: true
                    legend: {
                        position: 'right',
                    },
                }
            }
        }
        else if (type === 'bar') {
            if (chartcategory_queue.length == 0) {
                for (i = 0; i < chartcategory.length; i++) {
                    chartcategory_queue[i] = 0
                }
            }
            if (chartcategory_queue_call.length == 0) {
                for (i = 0; i < chartcategory.length; i++) {
                    chartcategory_queue_call[i] = 0
                }
            }
            if (chartcategory_queue_end.length == 0) {
                for (i = 0; i < chartcategory.length; i++) {
                    chartcategory_queue_end[i] = 0
                }
            }
            config = {
                type: 'bar',
                data: {
                    labels: chartcategory,
                    datasets: [{
                        label: 'ผู้รอรับบริการ',
                        data: chartcategory_queue,
                        backgroundColor: 'rgba(139, 195, 74)'
                    }
                        , {
                        label: "ผู้กำลังรับบริการ",
                        data: chartcategory_queue_call,
                        backgroundColor: 'rgba(233, 30, 99, 0.8)'
                    }, {
                        label: "ผู้รับบริการแล้ว",
                        data: chartcategory_queue_end,
                        backgroundColor: 'rgba(0, 188, 212, 0.8)'
                    }
                    ]
                },
                options: {
                    responsive: true,
                    legend: true,
                    legend: {
                        position: 'right',
                    },
                }
            }
        }
        else if (type === 'bar2') {

        }
        else if (type === 'piecategory') {
            var s = 0;
            for (i = 0; i < chartcategory_queue.length; i++) {
                s += parseInt(chartcategory_queue[i]) + parseInt(chartcategory_queue[i])
            }
            if (s != 0) {
                config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: chartcategory_queue,
                            backgroundColor: [
                                "rgb(233, 30, 99)",
                                "rgb(255, 193, 7)",
                                "rgb(0, 188, 212)",
                                "rgb(139, 195, 74)",
                                "rgb(255, 255,0 )",
                                "rgb(255, 102,102)",
                                "rgb(255, 128, 0 )",
                                "rgb(0, 0, 255)",
                                "rgb(127, 0, 255)",
                                "rgb(25,25,112)",
                                "rgb(210,105,30)"
                            ],
                        }],
                        labels: chartcategory,
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: 'right',
                        },

                    },

                }
            }
        }
        else if (type === 'pieprofile') {
            var s = 0;
            for (i = 0; i < chartprofile_num.length; i++) {
                s += parseInt(chartprofile_num[i]) + parseInt(chartprofile_num[i])
            }
            if (s != 0) {
                config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: chartprofile_num,
                            backgroundColor: [
                                "rgb(233, 30, 99)",
                                "rgb(255, 193, 7)",
                                "rgb(0, 188, 212)",
                                "rgb(139, 195, 74)",
                                "rgb(255, 255,0 )",
                                "rgb(255, 102,102)",
                                "rgb(255, 128, 0 )",
                                "rgb(0, 0, 255)",
                                "rgb(127, 0, 255)",
                                "rgb(25,25,112)",
                                "rgb(210,105,30)"
                            ],
                        }],
                        labels: chartprofile,
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: 'right',
                        },
                    },
                }
            }
        }
        return config;
    }
}
