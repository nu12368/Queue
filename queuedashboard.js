
var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
var Str_profile;
var Str_queue;
var category_profile;

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
function getqueueview(refresh_token) { ////// 
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            //    console.log(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=100&_sort=1')
            axios.get(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                $("#queue").text(response.data.message.total + " คิว");
                resolve(response.data.message.values);
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
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
                $("#qadd").text(response.data.message.total + " คิว");
                resolve(response.data.message);
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
                $("#qcall").text(response.data.message.total + " คิว");
                resolve(response.data.message);
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
                $("#qend").text(response.data.message.total + " คิว");
                resolve(response.data.message);
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
var _arr_qloop = new Array();
var _n_loop = 1;
var _i_loop = 0;
const queueloop = async (refresh_token, prm, _page, q) => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?' + prm + '_page=' + _page + '&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            if (response.data.message.values.length != 0) {
                for (i = 0; i < response.data.message.values.length; i++) {
                    var _timesCall = '';
                    var _timesend = '';
                    if (response.data.message.values[i].timesCall == undefined) {
                        _timesCall = ''
                    } else {
                        _timesCall = response.data.message.values[i].timesCall
                    }
                    if (response.data.message.values[i].timeEnd == undefined) {
                        _timesend = ''
                    } else {
                        _timesend = response.data.message.values[i].timeEnd
                    }
                    _arr_qloop[_i_loop] = {
                        num: _n_loop,
                        category: response.data.message.values[i].category,
                        cue: response.data.message.values[i].cue,
                        serviceChannel: response.data.message.values[i].serviceChannel,
                        name: response.data.message.values[i].name,
                        tel: response.data.message.values[i].tel,
                        timeAdd: response.data.message.values[i].timeAdd,
                        timesCall: _timesCall,
                        timeEnd: _timesend
                    }
                    _i_loop = _i_loop + 1
                    _n_loop = _n_loop + 1
                }
            }

            $('#tablequeue_view').DataTable().destroy();
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
                        data: "timesCall",
                        render: function (data) {
                            if (data != '') {
                                let date = new Date(data);
                                let options = { hour12: false };
                                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                                    return '-';
                                }
                                return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                            } else {
                                return false
                            }
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
                            } else {
                                return false
                            }
                        }
                    }
                ]
            });
            if (q == 'qadd/') {
                table.columns([7, 8]).visible(false);
            }
            if (q == 'qcall/') {
                table.columns([8, 9]).visible(false);
            }
        });
    });

}
function Getqueueviewcategory(categoryqueue, refresh_token, q) {
    var prm = 'category=' + categoryqueue + '&'
    var _arr = new Array();
    var _n = 1;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + q + _objectId + '?' + prm + '_page=1&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {

            var totle = response.data.message.total
            var looptotle = Math.ceil(totle / 100)
            if (looptotle > 1) { ///// คิวมากกว่า loop 100
                var _page = 1;
                for (i = 0; i < looptotle; i++) {
                    queueloop(refresh_token, prm, _page, q)
                    _page = _page + 1
                }
                
            } else {   ////// น้อยกว่า 100
                if (response.data.message.values.length != 0) {
                    for (i = 0; i < response.data.message.values.length; i++) {
                        var _timesCall = '';
                        var _timesend = '';
                        if (response.data.message.values[i].timesCall == undefined) {
                            _timesCall = ''
                        } else {
                            _timesCall = response.data.message.values[i].timesCall
                        }
                        if (response.data.message.values[i].timeEnd == undefined) {
                            _timesend = ''
                        } else {
                            _timesend = response.data.message.values[i].timeEnd
                        }
                        _arr[i] = {
                            num: _n,
                            category: response.data.message.values[i].category,
                            cue: response.data.message.values[i].cue,
                            serviceChannel: response.data.message.values[i].serviceChannel,
                            name: response.data.message.values[i].name,
                            tel: response.data.message.values[i].tel,
                            timeAdd: response.data.message.values[i].timeAdd,
                            timesCall: _timesCall,
                            timeEnd: _timesend
                        }
                        _n = _n + 1
                    }

                    $('#tablequeue_view').DataTable().destroy();
                    var table = $('#tablequeue_view').DataTable({
                        "lengthMenu": [[25, 50, 100], [25, 50, 100]],
                        "pageLength": 25,
                        'data': [..._arr],
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
                                data: "timesCall",
                                render: function (data) {
                                    if (data != '') {
                                        let date = new Date(data);
                                        let options = { hour12: false };
                                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                        if (date.toLocaleString('en-US', options).replace(',', '') == '') {
                                            return '-';
                                        }
                                        return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                                    } else {
                                        return false
                                    }
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
                                    } else {
                                        return false
                                    }
                                }
                            }
                        ]
                    });
                    if (q == 'qadd/') {
                        table.columns([7, 8]).visible(false);
                    }
                    if (q == 'qcall/') {
                        table.columns([8, 9]).visible(false);
                    }
                }
            }

        }).catch(function (res) {
            const { response } = res
        });
    });

}

$(async function () {
    const result = await acctoken();
    var _arrdataqueue = new Array();
    var _n = 0
    /////// กราฟ
    const queueview = await getqueueview(result);
    const fileview = await getprofileview(result);
    const categoryview = await getcategoryview(result);

    // console.log(queueview)
    //////ตาราง
    const queuecount = await getqadd(result); ////คิวรอรับบริการ
    const qcall = await getqcall(result); ////คิวกำลังรับบริการ
    const qend = await getqend(result);   ////คิวรับบริการแล้ว

    // console.log(categoryview)

    // console.log(queuecount)
    // console.log(qcall)
    // console.log(qend)
    var view_queue = 0;
    var view_qcall = 0;
    var view_qend = 0;

    for (i = 0; i < categoryview.length; i++) {
        if (queuecount.values.length != 0) {
            for (i_queue = 0; i_queue < queuecount.category.length; i_queue++) {////คิวรอรับบริการ
                if (categoryview[i].category == queuecount.category[i_queue]._id) {
                    view_queue = queuecount.category[i_queue].count
                }
            }
        }

        if (qcall.values.length != 0) {
            for (i_queue = 0; i_queue < qcall.category.length; i_queue++) {////คิวกำลังรับบริการ
                if (categoryview[i].category == qcall.category[i_queue]._id) {
                    view_qcall = qcall.category[i_queue].count
                }
            }
        }

        if (qend.values.length != 0) {
            for (i_queue = 0; i_queue < qend.category.length; i_queue++) {////////คิวรับบริการแล้ว จบ คิว
                if (categoryview[i].category == qend.category[i_queue]._id) {
                    view_qend = qend.category[i_queue].count
                }
            }
        }

        _arrdataqueue[i] = {
            category: categoryview[i].category,
            queue: view_queue,
            qcall: view_qcall,
            qend: view_qend
        }
        view_qcall = 0
        view_queue = 0
        view_qend = 0
    }

    $('#tablequeue').DataTable({
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
                        return data = 0
                    }

                }
            },
            {
                data: "qcall",
                render: function (data) {
                    if (data != 0) {
                        return '<u><a class="qcall" style="color:blue; cursor: pointer;">' + data + '</a></u>';
                    } else {
                        return data = 0
                    }

                }
            },
            {
                data: "qend",
                render: function (data) {
                    if (data != 0) {
                        return '<u><a class="qend" style="color:blue; cursor: pointer;">' + data + '</a></u>';
                    } else {
                        return data = 0
                    }

                }
            },
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
            for (i = 1; i < 4; i++) {
                total = api
                    .column(i)
                    .data()
                    .reduce(function (a, b) {
                        //     console.log(intVal(a) + intVal(b))
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


    $(document).ready(function () {
        var data;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            $('#tablequeue').on('click', 'a.queue', function (e) { /////ผู้รอรับบริการ แผนก
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
                Getqueueviewcategory(data.category, result, 'qadd/')
            });
            $('#tablequeue').on('click', 'a.qcall', function (e) { /////ผู้กำลังรับบริการ แผนก
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
                document.getElementById("h_name_report").innerText = 'ผู้กำลังรับบริการ'
                document.getElementById("div_qall").style.display = 'none'
                document.getElementById("div_qdisplay").style.display = 'block'
                Getqueueviewcategory(data.category, result, 'qcall/')
            });
            $('#tablequeue').on('click', 'a.qend', function (e) { /////ผู้รับบริการแล้ว แผนก
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
                document.getElementById("h_name_report").innerText = 'ผู้รับบริการแล้ว'
                document.getElementById("div_qall").style.display = 'none'
                document.getElementById("div_qdisplay").style.display = 'block'
                Getqueueviewcategory(data.category, result, 'qend/')
            });
            $('#tablequeue').on('click', 'tfoot th', function () {  /////ผู้รอรับบริการ ทั้งหมด
                var table = $('#tablequeue').DataTable();
                var index = table.column($(this).index() + ':visible').index();
                console.log(index)
                switch (index) {
                    case 1:
                        // _arr_qloop = new Array();
                        // _n_loop = 1;
                        // _i_loop = 0;
                        // document.getElementById("h_name_report").innerText = 'ผู้รอรับบริการทั้งหมด'
                        // document.getElementById("div_qall").style.display = 'none'
                        // document.getElementById("div_qdisplay").style.display = 'block'

                        break;
                    case 2:

                        break;
                    case 3:
                     
                        break;
                    case 4:

                        break;
                    case 5:

                        break;
                    case 6:

                        break;
                    default:

                }
            });

        });
    });



    /////กราฟ
    var chartcategory = new Array();
    var chartcategory_queue = new Array();
    var q_num = 0;
    for (i = 0; i < categoryview.length; i++) {  /////แผนก
        chartcategory[i] = categoryview[i].category
        for (i_q = 0; i_q < queueview.length; i_q++) {  ////คิวทั้งหมด
            if (queueview[i_q].category == categoryview[i].category) {
                chartcategory_queue[i] = q_num
                q_num = q_num + 1;
            } else {
                if (q_num == 0) {
                    chartcategory_queue[i] = 0
                }
            }
        }
        q_num = 0;
    }

    q_num = 0;
    var chartprofile = new Array();
    var chartprofile_num = new Array();
    var chartprofile_queue2 = new Array();
    var chart_category = new Array();
    var xxx;
    var aa = 0;
    for (i = 0; i < fileview.length; i++) {  /////โปรไฟล์
        chartprofile[i] = fileview[i].name
        chartprofile_num[i] = fileview[i].category.length

    }


    $(function () {
        new Chart(document.getElementById("bar_queuecategory").getContext("2d"), getChartJs('bar'));
        //  new Chart(document.getElementById("bar_queueprofile").getContext("2d"), getChartJs('bar2'));
        new Chart(document.getElementById("donut_chart_category").getContext("2d"), getChartJs('piecategory'));
        new Chart(document.getElementById("donut_chart_profile").getContext("2d"), getChartJs('pieprofile'));
        // new Chart(document.getElementById("pie_chartbalance").getContext("2d"), getChartJs('pieBalance'));
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
                    legend: false
                }
            }
        }
        else if (type === 'bar') {
            config = {
                type: 'bar',
                data: {
                    labels: chartcategory,
                    datasets: [{
                        label: 'จำนวนคิว',
                        data: chartcategory_queue,
                        backgroundColor: 'rgba(139, 195, 74)'
                    }
                    ]
                },
                options: {
                    responsive: true,
                    legend: false
                    // legend: {
                    //     // position: 'right',
                    // },
                }
            }
        }
        else if (type === 'bar2') {

            // config = {
            //     type: 'bar',
            //     data: {
            //         labels: chartprofile,
            //         datasets: [{
            //             label: chart_category,
            //             backgroundColor: 'rgba(0, 188, 212, 0.8)',
            //             data: chartprofile_queue,
            //         }
            //         ]
            //     },
            //     options: {
            //         responsive: true,
            //         legend: false
            //     }
            // }
            // config = {
            //     type: 'bar',
            //     data: {
            //         labels: chartprofile,
            //         datasets: [{
            //             label: chart_category,
            //             backgroundColor: 'rgba(0, 188, 212, 0.8)',
            //             data: [36, 0, 0, 0, 22],
            //         }
            //             , {
            //             label: chart_category,
            //             data: [0, 0, 0, 0, 22],
            //             backgroundColor: 'rgba(233, 30, 99, 0.8)'
            //         }
            //             , {
            //             label: chart_category,
            //             data: [0, 44, 0, 0, 2],
            //             backgroundColor: 'rgba(139, 195, 74)'
            //         }
            //             , {
            //             label: chart_category,
            //             data: [0, 0, 0, 0, 0],
            //             backgroundColor: 'rgb(0, 0, 255)'
            //         }, {
            //             label: chart_category,
            //             data: [0, 0, 0, 0, 0],
            //             backgroundColor: 'rgb(127, 0, 255)'
            //         }
            //             , {
            //             label: chart_category,
            //             data: [0, 0, 0, 0, 0],
            //             backgroundColor: 'rgb(25,25,112)'
            //         }
            //             , {
            //             label: chart_category,
            //             data: [0, 0, 0, 0, 0],
            //             backgroundColor: 'rgb(210,105,30)'
            //         }
            //         ]
            //     },
            //     options: {
            //         responsive: true,
            //         legend: false
            //     }
            // }

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
});


