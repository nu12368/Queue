var _arr_qloop = new Array();
var _n_loop = 1;
var _i_loop = 0;
var q_count = 0;
var _objectId;
var str_io = '';
var num = 1;
var _arr = new Array();
var n = 0;
var arrayProp = new Array()
function acctoken(obj) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'permit', {}, {
                headers: {
                    'Authorization': obj
                }
            }).then(function (response) {
                resolve(response.data.message.access_token);
            }).catch(function (res) {
                const { response } = res
                if (response.data.message == "Unauthorized") {
                    // location.href = "index.html";
                    return;
                }

            });
        });
    });
}
const queueloop = async (refresh_token, _page) => {
    var today = new Date();
    var n_date = today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    chk_date = chk_date[0].split('/')
    var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'queue/' + _objectId + '?_page=' + _page + '&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function (response) {
            $("#table_view").empty();
            var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
            var _num = 0;

            for (i = 0; i < response.data.message.values.length; i++) {
                let date = new Date(response.data.message.values[i].timeAdd);
                let options = { hour12: false };
                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                var s_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
                s_date = s_date.split(' ')
                s_date = s_date[0].split('/')
                var _date = s_date[2] + '/' + s_date[0] + '/' + s_date[1]
                var _checkdate = dayjs(datenew).isSame(_date)
                if (_checkdate == true) {
                    q_count = q_count + 1
                    $("#table_view").append(`
                        <tr>
                            <td>
                                <div class="info-box ${_collor[_num]} 
                                 hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid;">
                                 <div class="content">
                                        <div style="font-size: 28px;" >${response.data.message.values[i].cue}</div>
                                    </div>
                                </div>
                             </td>
                            <td>
                                <div class="info-box ${_collor[_num]}
                              hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid; ">
                                    <div class="content">
                                        <div style="font-size: 28px;">${response.data.message.values[i].serviceChannel}</div>
                                    </div>
                                </div>
                         </td>
                        </tr>
                    `);

                    /////////////////// เฉพราะของตัวเอง
                    if (Cookies.get('dataUserOnline') != undefined) {
                        var userId = JSON.parse(Cookies.get('dataUserOnline'));
                        // if (str_io == '') {
                        if (userId.uId == response.data.message.values[i].uId) {
                            let date = new Date(response.data.message.values[i].timeAdd);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')

                            $("#table_queueonline").append(`
                                <tr>
                                    <td>
                                    <div>
                                    <p
                                        style="text-align: center;">
                                    <div>
                                        <b>
                                            <h3 style="text-align:justify; font-size: 24px;"
                                            > คิวที่ No. ${response.data.message.values[i].cue}</h3>
                                        </b>
                                    </div>
                                    </p>
                                    <p >
                                    แผนก ${response.data.message.values[i].category}
                                    </p>
                                    <p >
                                    วัน-เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
                                    </p>
                                    <p >
                                    ชื่อ ${response.data.message.values[i].name}
                                    </p>
                                    <p >
                                    เบอร์โทร ${response.data.message.values[i].tel}
                                    </p>
                                    <hr />
                                    </div>
                                 </td>
                                 <td><a  class="q_delete"  id='${response.data.message.values[i]._id}' style="text-align:justify; color: red; font-size: 24px; cursor: pointer;">ลบ</a></td>                            
                                </tr>
                            `);
                            displyanone()()
                        }
                        //}
                    }
                }
                _num = _num + 1;
                if (_collor.length == _num) {
                    _num = 0;
                }
            }
            document.getElementById('count_queuetoday').innerText = 'คิวทั้งหมดของวันนี้ จำนวน ' + q_count + ' คิว'
        });
    });

}
function getqueueview(refresh_token) {
    console.log('_objeccccccccccccccccccccccccccccccccccccccccccccctId')
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        // console.log(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=100&_sort=1')
        axios.get(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            //  console.log('ssssssssssssssssssssssssssssssssss')
            $("#table_view").empty();
            //  console.log(response)
            var today = new Date();
            var n_date = today.toISOString();
            let date = new Date(n_date);
            let options = { hour12: false };
            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
            var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
            chk_date = chk_date.split(' ')
            chk_date = chk_date[0].split('/')
            var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]
            var totle = response.data.message.total
            var looptotle = Math.ceil(totle / 100)
            if (looptotle > 1) { ///// คิวมากกว่า loop 100

                var _page = 1;
                $("#table_view").empty();
                $("#table_view").append(`
                <thead>
                <tr>
                    <th style="font-size: 28px;">หมายเลข</th>
                    <th style="font-size: 28px;">ช่องบริการ</th>
                </tr>
            </thead>
            `);

                ///////////////// เฉพราะของตัวเอง
                $("#table_queueonline").empty();

                for (i = 0; i < looptotle; i++) {
                    queueloop(refresh_token, _page)
                    _page = _page + 1
                }

            } else {


                //  $("#table_view").empty();
                var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
                var _num = 0;
                $("#table_view").append(`
                <thead>
                <tr>
                    <th style="font-size: 28px;">หมายเลข</th>
                    <th style="font-size: 28px;">ช่องบริการ</th>
                </tr>
            </thead>
            `);

                $("#table_queueonline").empty();

                for (i = 0; i < response.data.message.values.length; i++) {
                    // console.log(response.data.message.values[i])
                    let date = new Date(response.data.message.values[i].timeAdd);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    var s_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
                    s_date = s_date.split(' ')
                    s_date = s_date[0].split('/')
                    var _date = s_date[2] + '/' + s_date[0] + '/' + s_date[1]
                    var _checkdate = dayjs(datenew).isSame(_date)

                    //  console.log(_date)
                    if (_checkdate == true) {
                        q_count = q_count + 1
                        $("#table_view").append(`
                        <tr>
                            <td>
                                <div class="info-box ${_collor[_num]} 
                                 hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid;">
                                 <div class="content">
                                        <div style="font-size: 28px;" >${response.data.message.values[i].cue}</div>
                                    </div>
                                </div>
                             </td>
                            <td>
                                <div class="info-box ${_collor[_num]}
                              hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid; ">
                                    <div class="content">
                                        <div style="font-size: 28px;">${response.data.message.values[i].serviceChannel}</div>
                                    </div>
                                </div>
                         </td>
                        </tr>
                    `);

                        /////////////////// เฉพราะของตัวเอง
                        if (Cookies.get('dataUserOnline') != undefined) {
                            var userId = JSON.parse(Cookies.get('dataUserOnline'));
                            //  console.log(str_io)
                            //if (str_io == '') {
                            if (userId.uId == response.data.message.values[i].uId) {

                                let date = new Date(response.data.message.values[i].timeAdd);
                                let options = { hour12: false };
                                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                $("#table_queueonline").empty();
                                //   console.log('oooooooooooooooooooooooooooooooooooooooooooooooooo')
                                $("#table_queueonline").append(`
                                <tr>
                                    <td>
                                    <div>
                                    <p
                                        style="text-align: center;">
                                    <div>
                                        <b>
                                            <h3 style="text-align:justify; font-size: 24px;"
                                            > คิวที่ No. ${response.data.message.values[i].cue}</h3>
                                        </b>
                                    </div>
                                    </p>
                                    <p >
                                    แผนก ${response.data.message.values[i].category}
                                    </p>
                                    <p >
                                    วัน-เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
                                    </p>
                                    <p >
                                    ชื่อ ${response.data.message.values[i].name}
                                    </p>
                                    <p >
                                    เบอร์โทร ${response.data.message.values[i].tel}
                                    </p>
                                    <hr />
                                    </div>
                                 </td>
                                 <td><a  class="q_delete"  id='${response.data.message.values[i]._id}' style="text-align:justify; color: red; font-size: 24px; cursor: pointer;">ลบ</a></td>                            
                                </tr>
                            `);
                                displyanone()
                            }
                        }
                    }
                    _num = _num + 1;
                    if (_collor.length == _num) {
                        _num = 0;
                    }
                }
                document.getElementById('count_queuetoday').innerText = 'คิวทั้งหมดของวันนี้ จำนวน ' + q_count + ' คิว'
            }
        }).catch(function (res) {
            console.log(res.response.data)

        });
    });
}

const queuebookingloop = async (refresh_token, _page) => {

    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'getbookingQueue/' + _objectId + '?_page=' + _page + '&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values)
            var totle = response.data.message.total
            var looptotle = Math.ceil(totle / 100)
            if (looptotle > 1) { ///// คิวมากกว่า loop 100
                var _page = 1;
                ///////////////// เฉพราะของตัวเอง
                $("#table_queueonline").empty();
                for (i = 0; i < looptotle; i++) {
                    queuebookingloop(refresh_token, _page)
                    _page = _page + 1
                }
            } else {
                $("#table_queueonline").empty();
                for (i = 0; i < response.data.message.values.length; i++) {
                    /////////////////// เฉพราะของตัวเอง
                    if (Cookies.get('dataUserOnline') != undefined) {
                        var userId = JSON.parse(Cookies.get('dataUserOnline'));
                        //  console.log(str_io)
                        //if (str_io == '') {
                        if (userId.uId == response.data.message.values[i].uId) {

                            let date = new Date(response.data.message.values[i].timeAdd);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')

                            var timeadd = sp[2].split(' ')

                            var timeStart = timeadd[0] + '/' + sp[0].padStart(2, '0') + '/' + sp[1].padStart(2, '0')
                            console.log(datenew)
                            console.log(timeStart)
                            var _checkdate = dayjs(datenew).isSame(timeStart)
                            console.log(_checkdate)

                            if (_checkdate == true) {
                                $("#table_queueonline").empty();
                                $("#table_queueonline").append(`
                                            <tr>
                                                <td>
                                                <div>
                                                <p
                                                    style="text-align: center;">
                                                <div>
                                                    <b>
                                                        <h3 style="text-align:justify; font-size: 24px;"
                                                        > คิวที่ No. ${response.data.message.values[i].cue}</h3>
                                                    </b>
                                                </div>
                                                </p>
                                                <p >
                                                แผนก ${response.data.message.values[i].category}
                                                </p>
                                                <p >
                                                วัน-เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
                                                </p>
                                                <p >
                                                ชื่อ ${response.data.message.values[i].name}
                                                </p>
                                                <p >
                                                เบอร์โทร ${response.data.message.values[i].tel}
                                                </p>
                                                <hr />
                                                </div>
                                            </td>
                                            <td><a  class="q_delete"  id='${response.data.message.values[i]._id}' style="text-align:justify; color: red; font-size: 24px; cursor: pointer;">ลบ</a></td>                            
                                            </tr>
                                        `);
                                displyanone()
                                break
                            } else {
                                _checkdate = dayjs(timeStart).isAfter(datenew)
                                console.log(_checkdate)
                                ////////////////// จองล่วงหน้า
                                if (_checkdate == true) {
                                    $("#table_queueonline").empty();
                                    $("#table_queueonline").append(`
                                                    <tr>
                                                        <td>
                                                        <div>
                                                        <p
                                                            style="text-align: center;">
                                                        <div>
                                                            <b>
                                                                <h3 style="text-align:justify; font-size: 24px;"
                                                                > คิวที่ No. ${response.data.message.values[i].cue}</h3>
                                                            </b>
                                                        </div>
                                                        </p>
                                                        <p >
                                                        แผนก ${response.data.message.values[i].category}
                                                        </p>
                                                        <p >
                                                        วัน-เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
                                                        </p>
                                                        <p >
                                                        ชื่อ ${response.data.message.values[i].name}
                                                        </p>
                                                        <p >
                                                        เบอร์โทร ${response.data.message.values[i].tel}
                                                        </p>
                                                        <hr />
                                                        </div>
                                                    </td>
                                                    <td><a  class="q_delete"  id='${response.data.message.values[i]._id}' style="text-align:justify; color: red; font-size: 24px; cursor: pointer;">ลบ</a></td>                            
                                                    </tr>
                                                `);
                                    displyanone()

                                    break
                                }
                            }


                        }
                    }
                }
            }
        }).catch(function (res) {
            console.log(res.response.data)

        });
    });

}
async function getqueuebookingview(refresh_token) {

    var today = new Date();
    var n_date = today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    chk_date = chk_date[0].split('/')
    var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'getbookingQueue/' + _objectId + '?_page=1&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values)
            var totle = response.data.message.total
            var looptotle = Math.ceil(totle / 100)
            if (looptotle > 1) { ///// คิวมากกว่า loop 100
                var _page = 1;
                ///////////////// เฉพราะของตัวเอง
                $("#table_queueonline").empty();
                for (i = 0; i < looptotle; i++) {
                    queuebookingloop(refresh_token, _page)
                    _page = _page + 1
                }
            } else {
                $("#table_queueonline").empty();
                for (i = 0; i < response.data.message.values.length; i++) {
                    /////////////////// เฉพราะของตัวเอง
                    if (Cookies.get('dataUserOnline') != undefined) {
                        var userId = JSON.parse(Cookies.get('dataUserOnline'));
                        //  console.log(str_io)
                        //if (str_io == '') {
                        if (userId.uId == response.data.message.values[i].uId) {
                            console.log(response.data.message.values)
                            let date = new Date(response.data.message.values[i].timeAdd);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')

                            var timeadd = sp[2].split(' ')

                            var timeStart = timeadd[0] + '/' + sp[0].padStart(2, '0') + '/' + sp[1].padStart(2, '0')
                            console.log(datenew)
                            console.log(timeStart)
                            var _checkdate = dayjs(datenew).isSame(timeStart)
                            console.log(_checkdate)



                            let date_booking = new Date(response.data.message.values[i].bookingData.dayOfBooking);
                            let options_booking = { hour12: false };
                            var sp_booking = date_booking.toLocaleString('en-US', options_booking).replace(',', '').split('/')
                            var booking_y = sp_booking[2].split(' ')
                            if (_checkdate == true) {
                                $("#table_queueonline").empty();
                                $("#table_queueonline").append(`
                                            <tr>
                                                <td>
                                                <div>
                                                <p
                                                    style="text-align: center;">
                                                <div>
                                                    <b>
                                                        <h3 style="text-align:justify; font-size: 24px;"
                                                        > คิวที่ No. ${response.data.message.values[i].cue}</h3>
                                                    </b>
                                                </div>
                                                </p>
                                                <p >
                                                แผนก ${response.data.message.values[i].category}
                                                </p>
                                                <p >
                                                วัน-เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
                                                </p>
                                                <p >
                                                วันที่จองล่วงหน้า ${sp_booking[1].padStart(2, '0') + '/' + sp_booking[0].padStart(2, '0') + '/' + booking_y[0]}
                                                </p>
                                                <p >
                                                ช่วงเวลา ${response.data.message.values[i].bookingData.timeOfBooking}
                                                </p>
                                                <p >
                                                ชื่อ ${response.data.message.values[i].name}
                                                </p>
                                                <p >
                                                เบอร์โทร ${response.data.message.values[i].tel}
                                                </p>
                                                <hr />
                                                </div>
                                            </td>
                                            <td><a  class="q_delete"  id='${response.data.message.values[i]._id}' style="text-align:justify; color: red; font-size: 24px; cursor: pointer;">ลบ</a></td>                            
                                            </tr>
                                        `);
                                displyanone()
                                break
                            } else {
                                _checkdate = dayjs(timeStart).isAfter(datenew)
                                console.log(_checkdate)
                                ////////////////// จองล่วงหน้า
                                if (_checkdate == true) {
                                    $("#table_queueonline").empty();
                                    $("#table_queueonline").append(`
                                                    <tr>
                                                        <td>
                                                        <div>
                                                        <p
                                                            style="text-align: center;">
                                                        <div>
                                                            <b>
                                                                <h3 style="text-align:justify; font-size: 24px;"
                                                                > คิวที่ No. ${response.data.message.values[i].cue}</h3>
                                                            </b>
                                                        </div>
                                                        </p>
                                                        <p >
                                                        แผนก ${response.data.message.values[i].category}
                                                        </p>
                                                        <p >
                                                        วัน-เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
                                                        </p>
                                                        <p >
                                                        วันที่จองล่วงหน้า ${sp_booking[1].padStart(2, '0') + '/' + sp_booking[0].padStart(2, '0') + '/' + booking_y[0]}
                                                        </p>
                                                        <p >
                                                        ช่วงเวลา ${response.data.message.values[i].bookingData.timeOfBooking}
                                                        </p>
                                                        <p >
                                                        ชื่อ ${response.data.message.values[i].name}
                                                        </p>
                                                        <p >
                                                        เบอร์โทร ${response.data.message.values[i].tel}
                                                        </p>
                                                        <hr />
                                                        </div>
                                                    </td>
                                                    <td><a  class="q_delete"  id='${response.data.message.values[i]._id}' style="text-align:justify; color: red; font-size: 24px; cursor: pointer;">ลบ</a></td>                            
                                                    </tr>
                                                `);
                                    displyanone()

                                    break
                                }
                            }


                        }
                    }
                }
            }
        }).catch(function (res) {
            console.log(res.response.data)

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
                //    console.log(response.data.message.result)
                for (const i in response.data.message.result) {
                    if (response.data.message.result[i].category == category) {
                        arrar_null = response.data.message.result[i]
                    }
                }
                resolve(arrar_null)
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
            }).then(async function (response) {
                var $select = $('#qr_category');
                $select.append('<option value=' + '0' + '>' + '-- กรุณาเลือกแผนก --' + '</option>');
                $.each(response.data.message.category, function (key, value) {
                    $select.append(`<option>${value.category}</option>`);
                });



                /////////////////// แผนก ตรวจสอบ สถานะคิว
                var category = response.data.message.category
                for (i = 0; i < category.length; i++) {
                    // console.log(response.data.message.category[i])
                    var prop = await getProp(refresh_token, response.data.message.category[i].category)
                    console.log(prop)
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


                var $select = $('#select_category');
                $select.append('<option value=' + '0' + '>' + '-- เลือกแผนก --' + '</option>');
                $.each(_arr, function (key, value) {
                    console.log(value)
                    //  var datatime = JSON.stringify(value)
                    //  $select.append(`<option>${value.category}</option>`);

                    if (value.intervalDifference != '') {
                        var datatime = JSON.stringify(value)
                        $select.append('<option value=' + datatime + '>' + value.category + '</option>');
                    }

                });

                console.log(response.data.message.category)
                resolve(response.data.message.category);
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}
function getqrcode(refresh_token, nameqr) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + "files/qrcode/" + nameqr, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            var arrayBuffer = response.data; // Note: not oReq.responseText
            var u8 = new Uint8Array(arrayBuffer);
            var b64encoded = btoa(String.fromCharCode.apply(null, u8));
            var mimetype = "image/png"; // or whatever your image mime type is
            $("#Imageqrcode").append(`
               <img name="${b64encoded}"  src="${"data:" + mimetype + ";base64," + b64encoded}">`);

            //   $("#Imageqrcode_view").append(`src="${"data:" + mimetype + ";base64," + b64encoded}"`);

            $('#Imageqrcode_view').attr('src', `${"data:" + mimetype + ";base64," + b64encoded}`)


            //    $("#Imageqrcode_view").append(`
            //    <img name="${b64encoded}"  src="${"data:" + mimetype + ";base64," + b64encoded}">`);

        });
    });
}
function getqrcode_List(refresh_token) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + "qrList/" + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                console.log(response.data.message.qrList)
                // Genqrcode(refresh_token)
                if (response.data.message.qrList.length == 0) {
                    resolve('true')
                } else {

                    resolve(response.data.message.qrList[0])
                }
            });
        });
    });
}
function displyanone() {
    // document.getElementById('submitaddqueue').style.display = 'none'
    // document.getElementById('tel').style.display = 'none'
    // document.getElementById('username').style.display = 'none'
    // document.getElementById('qr_category').style.display = 'none'
    // document.getElementById('line1').style.display = 'none'
    // document.getElementById('line2').style.display = 'none'
    // document.getElementById('line3').style.display = 'none'
}

function timeLimit(refresh_token, category, datainterDiff) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'timeLimit/' + _objectId + '?_limit=100', {
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
function getbookingQueue(refresh_token, dayOfBooking, category, proptime_) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);

            console.log(urlipaddress + 'getbookingQueue/' + _objectId + '?dayOfBooking=' + dayOfBooking + '&category=' + category)
            axios.get(urlipaddress + 'getbookingQueue/' + _objectId + '?dayOfBooking=' + dayOfBooking + '&category=' + category, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function (response) {
                console.log(response.data.message)
                var q_limit;
                console.log(proptime_)
                if (proptime_ != '') {
                    q_limit = await timeLimit(refresh_token, category, proptime_)
                } else {
                    q_limit = await timeLimit(refresh_token, category, document.getElementById("select_time").value)
                }
                console.log(q_limit)
                var q_remain;
                var respo = response.data.message.total
                q_remain = parseInt(q_limit) - parseInt(respo)
                if (q_limit != 0) {
                    if (proptime_ != '') {//////บันทึก คิว
                        resolve(q_remain);
                    } else {///////ตรวจสอบ
                        document.getElementById("q_totle").innerText = q_limit + ' คิว'
                        document.getElementById("q_add").innerText = response.data.message.total + ' คิว'
                        if (q_remain < 0 || q_remain == 0) {
                            document.getElementById("q_remaining").innerText = 'เต็มแล้ว'
                            document.getElementById("q_remaining").style.color = 'red'
                        } else {
                            document.getElementById("q_remaining").innerText = q_remain.toString() + ' คิว'
                            document.getElementById("q_remaining").style.color = 'green'
                        }
                        // document.getElementById("q_remaining").innerText = q_remain.toString() + ' คิว'
                        console.log(response.data.message.total)
                        $("#StatusQueue").modal('show');
                    }
                } else {
                    swal({
                        title: 'ช่วงเวลา ' + document.getElementById("select_time").value + ' ไม่ได้กำหนดจำนวนคิว',
                        text: '',
                        type: "error",
                    }, function (isConfirm) {
                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                    });
                }
                resolve(q_remain);
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}

function getbookingQueueToday(refresh_token, dayOfBooking, category, proptime_) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            console.log(urlipaddress + 'queue/' + _objectId + '?dayOfBooking=' + dayOfBooking + '&category=' + category)
            axios.get(urlipaddress + 'queue/' + _objectId + '?dayOfBooking=' + dayOfBooking + '&category=' + category, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function (response) {
                console.log(response.data.message)
                var q_limit;
                console.log(proptime_)
                if (proptime_ != '') {
                    q_limit = await timeLimit(refresh_token, category, proptime_)
                } else {
                    q_limit = await timeLimit(refresh_token, category, document.getElementById("select_time").value)
                }
                console.log(q_limit)
                var q_remain;
                var respo = response.data.message.total
                q_remain = parseInt(q_limit) - parseInt(respo)

                console.log(q_remain)
                if (q_limit != 0) {
                    if (proptime_ != '') {//////บันทึก คิว
                        resolve(q_remain);
                    } else {///////ตรวจสอบ
                        document.getElementById("q_totle").innerText = q_limit + ' คิว'
                        document.getElementById("q_add").innerText = response.data.message.total + ' คิว'

                        if (q_remain < 0 || q_remain == 0) {
                            document.getElementById("q_remaining").innerText = 'เต็มแล้ว'
                            document.getElementById("q_remaining").style.color = 'red'
                        } else {
                            document.getElementById("q_remaining").innerText = q_remain.toString() + ' คิว'
                            document.getElementById("q_remaining").style.color = 'green'
                        }

                        console.log(response.data.message.total)
                        $("#StatusQueue").modal('show');
                    }
                } else {
                    swal({
                        title: 'ช่วงเวลา ' + document.getElementById("select_time").value + ' ไม่ได้กำหนดจำนวนคิว',
                        text: '',
                        type: "error",
                    }, function (isConfirm) {
                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                    });
                }
                resolve(q_remain);
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}

function getadvt(refresh_token) {
    console.log(refresh_token)
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        axios.get(urlipaddress + 'advt/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.result.length)
            if (response.data.message.result.length == 0) {
                document.getElementById('div_adv').style.display = 'none'
                return
            }
            var _arr = new Array();
            // $("#carousel-example-generic_2").empty();
            $(".carousel-indicators").append(`
                <li data-target="#carousel-example-generic_2" data-slide-to="0" class="active"></li>
            `);
            var _n_slide = 1
            for (const i in response.data.message.result[0].imageAdvt) {
                console.log(response.data.message.result[0].imageAdvt[i])
                axios.get(urlipaddress + "files/advt/" + response.data.message.result[0].imageAdvt[i], {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (response) {
                    console.log(response.data)
                    var arrayBuffer = response.data; // Note: not oReq.responseText
                    var u8 = new Uint8Array(arrayBuffer);
                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                    var mimetype = "image/png"; // or whatever your image mime type is

                    if (_n_slide == 1) {
                        $(".carousel-indicators").append(`
                            <li data-target="#carousel-example-generic_2" data-slide-to="${_n_slide}"></li>
                            `);
                        $(".carousel-inner").append(`
                            <div class="item active">
                                <img src="${"data:" + mimetype + ";base64," + b64encoded}" />
                            </div>
                            `);
                    } else {

                        $(".carousel-indicators").append(`
                        <li data-target="#carousel-example-generic_2" data-slide-to="${_n_slide}"></li>
                        `);
                        $(".carousel-inner").append(`
                        <div class="item">
                            <img src="${"data:" + mimetype + ";base64," + b64encoded}"/>
                        </div>
                        `);
                    }
                    _n_slide = _n_slide + 1

                });
            }
            //     $("#carousel-example-generic_2").append(`
            //     <a class="left carousel-control" href="#carousel-example-generic_2"
            //     role="button" data-slide="prev">
            //     <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            //     <span class="sr-only">Previous</span>
            // </a>
            // <a class="right carousel-control" href="#carousel-example-generic_2"
            //     role="button" data-slide="next">
            //     <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            //     <span class="sr-only">Next</span>
            // </a>
            //     `);


        }).catch(function (res) {
            const { response } = res
        });
    });
}

var add_queue_result;
$(async function () {

    const urlParams = new URLSearchParams(window.location.search);
    let myParam = urlParams.toString();

    $('#tabhome').on('click', async function () {
        console.log('dddddd')
        $("#table_view").empty();
        var obj_refresh = JSON.parse(Cookies.get('refresh_tokenOnline'));
        var result_refresh = await acctoken(obj_refresh.refresh_token);
        console.log(result_refresh)
        await getqueueview(result_refresh)

        document.getElementById('add_q_online').style.display = 'block'
        document.getElementById('submit_q_login').style.display = 'none'
        document.getElementById('div_tabadd').style.display = 'block'
        document.getElementById('div_viwe').style.display = 'block'

    });

    $('#tab_qonline').on('click', async function () {
        console.log('ttttttttttttttttttttt')
        var obj_refresh = JSON.parse(Cookies.get('refresh_tokenOnline'));
        var result_refresh = await acctoken(obj_refresh.refresh_token);
        console.log(result_refresh)
        console.log('------------------------------------------------')
        var q = await getqueueview(result_refresh)
        console.log(q)
        if (q == undefined) {
            await getqueuebookingview(result_refresh)
        }
        console.log('*****************************************************')
        console.log('222222222')
        document.getElementById('div_viwe').style.display = 'none'
        document.getElementById('logout_online').style.display = 'block'


    });
    $('#table_queueonline').on('click', 'a.q_delete', function (e) {
        var remove_qid = $(this).attr("id");
        console.log(remove_qid)
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

            var obj_refresh = JSON.parse(Cookies.get('refresh_tokenOnline'));
            var result = await acctoken(obj_refresh.refresh_token);

            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                var _objectId = Cookies.get('_objectIdOnline');

                console.log(result)
                console.log(remove_qid)
                console.log(_objectId)

                axios({
                    url: urlipaddress + 'queue/' + _objectId,
                    method: 'delete',
                    data: {
                        _id: remove_qid
                    },
                    headers: { 'Authorization': result }
                }).then(function (response) {
                    console.log(response.data.message)
                    if (response.data.message == "delete completed") {

                    }
                }).catch(function (res) {
                    const { response } = res
                    console.log(response.data.message)
                    if (response.data.message == 'update fail.') {
                        axios({
                            url: urlipaddress + 'delBookingQueue/' + _objectId,
                            method: 'delete',
                            data: {
                                _id: remove_qid
                            },
                            headers: { 'Authorization': result }
                        }).then(function (responsebooking) {
                            console.log(responsebooking.data.message)
                            if (responsebooking.data.message == "delete completed") {

                            }
                        }).catch(function (resbooking) {

                            console.log(resbooking.data.message)
                        })
                    }

                    //
                });
            });
            swal({
                title: "ลบข้อมูลสำเร็จ",
                text: 'คุณทำรายการสำเร็จแล้ว',
                type: "success",
            }, function (isConfirm) {
                if (isConfirm) {
                    location.href = 'guest.html?' + myParam
                }
            });
        });

    });
    if (Cookies.get('refresh_tokenOnline') != undefined) {
        ////// refresh
        var obj_refresh;
        var result_refresh;
        obj_refresh = JSON.parse(Cookies.get('refresh_tokenOnline'));
        result_refresh = await acctoken(obj_refresh.refresh_token);

        document.getElementById('add_q_online').style.display = 'block'
        document.getElementById('submit_q_login').style.display = 'none'
        document.getElementById('div_tabadd').style.display = 'block'
    } else {

        document.getElementById('add_q_online').style.display = 'none'
        document.getElementById('submit_q_login').style.display = 'block'
        document.getElementById('div_tabadd').style.display = 'none'

    }
    console.log(myParam)
    let result;
    var _category;
    var _objid = myParam.split('=');
    _objectId = _objid[1];

    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const authGuest = async () => {
            const url = `${urlipaddress}guest?${myParam}`;
            try {
                console.log(url)
                const res = await axios.get(url);
                console.log(res.data.message)
                result = await acctoken(res.data.message.guest_token)
                console.log(result)
                add_queue_result = result
                _category = await getcategoryview(result);
                await getqueueview(result);

                console.log(_category)
                var nameqr = await getqrcode_List(result)

                await getqrcode(result, nameqr);


                await getadvt(result)


            } catch (err) {
                throw err.response.data.message;
            }
        };
        authGuest();

        $('#submitaddqueue').on('click', async function (e) {

            var obj = JSON.parse(Cookies.get('refresh_tokenOnline'));
            var userId = JSON.parse(Cookies.get('dataUserOnline'));
            var _objectId_online = Cookies.get('_objectIdOnline');

            const result_online = await acctoken(obj.refresh_token);

            var timeStart = document.getElementById('datequeue').value.split('/');
            var newdate = await dateToday()
            timeStart = timeStart[0].replace('-', '/').replace('-', '/')
            //   console.log(timeStart.replace('/', '').replace('/', ''))
            //  console.log(newdate)
            var _checkdate = dayjs(newdate).isSame(timeStart)
            //console.log(_checkdate)
            console.log(document.getElementById("proptime").value)

            var select_category = document.getElementById("qr_category").value
            var post_catery;
            for (i = 0; i < _category.length; i++) {
                if (select_category == _category[i].category) {
                    post_catery = _category[i];
                }
            }




            //if (status_queue != 0) {
            if (_checkdate == true) {  ///////////////////////////////////// จอนออนไลน์  วันนี้
                const socket = io(urlipaddress);
                socket.emit('addQueue', { addQueue: 'Updated' });
                const dataaddQueue = {
                    uId: userId.uId,
                    values: post_catery.category,
                    tel: document.getElementById("tel").value,
                    name: document.getElementById("username").value,
                }

                var dayOfBooking = document.getElementById('datequeue').value.replace('-', '').replace('-', '')
                var status_queue = await getbookingQueueToday(result_online, dayOfBooking, post_catery.category, document.getElementById("proptime").value)

                console.log(document.getElementById("proptime").value)
                console.log(status_queue)
                if (status_queue == 0 || status_queue < 0) {
                    if (document.getElementById("proptime").value != '0') {
                        showCancelMessage_queue('คิวเต็มแล้ว', '')
                        return;
                    }

                }

                axios.post(urlipaddress + 'addQueue/' + _objectId_online, dataaddQueue, {
                    headers: {
                        'Authorization': result_online
                    }
                }).then(async function (response) {
                    if (response.data.message.status == "Successful") {
                        // document.getElementById('q_day').innerHTML = '<b>วัน/เวลา </b> ' + document.getElementById('_time').innerHTML.replace('วันที่ : ', '')
                        // document.getElementById('q_no').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  คิวที่ No. ' + response.data.message.queue
                        document.getElementById('dayOfBooking').style.display = 'none'
                        if (document.getElementById("proptime").value == '0') {
                            console.log('--------------------')
                            document.getElementById('q_day').innerHTML = '<b>วัน/เวลา </b> ' + document.getElementById('_time').innerHTML.replace('วันที่ : ', '')
                            // document.getElementById('dayOfBooking').innerHTML = '<b>วันที่จองล่วงหน้า </b> ' + timeStart
                            document.getElementById('timeOfBooking').innerHTML = '<b>จองช่วงเวลา </b> ' + '-'
                            document.getElementById('q_no').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  คิวที่ No. ' + response.data.message.queue
                        } else {
                            console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                            document.getElementById('q_day').innerHTML = '<b>วัน/เวลา </b> ' + document.getElementById('_time').innerHTML.replace('วันที่ : ', '') + '<br>'
                            // document.getElementById('dayOfBooking').innerHTML = '<b>วันที่จองล่วงหน้า </b> ' + timeStart
                            document.getElementById('timeOfBooking').innerHTML = '<b>จองช่วงเวลา </b> ' + document.getElementById("proptime").value

                            document.getElementById('q_no').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  คิวที่ No. ' + response.data.message.queue
                        }


                        $("#_viewlog").show();
                        html2canvas($("#createImg"), {
                            onrendered: function (canvas) {
                                var imgsrc = canvas.toDataURL("image/png");
                                $("#img").show();
                            }
                        });
                        displyanone()
                        await showSuccessMessage_queue('จองคิวสำเร็จ', '')

                    }
                }).catch(function (res) {
                    const { response } = res
                    console.log(response.data.message)
                    showCancelMessage_queue(response.data.message, '')
                });
            } else {

                _checkdate = dayjs(timeStart).isAfter(newdate)
                console.log(_checkdate)
                ////////////////// จองล่วงหน้า
                if (_checkdate == true) {
                    //showCancelMessage_queue('ระบบยังไม่เปิดให้จองคิวล่วงหน้า', 'ระบบกำลังปรับปรุงการจองคิวล่างหน้า')

                    // var obj = JSON.parse(Cookies.get('refresh_tokenOnline'));
                    // var userId = JSON.parse(Cookies.get('dataUserOnline'));
                    // var _objectId_online = Cookies.get('_objectIdOnline');
                    // const result_online = await acctoken(obj.refresh_token);

                    // var select_category = document.getElementById("qr_category").value
                    // var post_catery;
                    // for (i = 0; i < _category.length; i++) {
                    //     if (select_category == _category[i].category) {
                    //         post_catery = _category[i];
                    //     }
                    // }

                    /////// เช็ค คิว ก่อน ว่า ว่างไม่ว่าง
                    var dayOfBooking = document.getElementById('datequeue').value.replace('-', '').replace('-', '')
                    var status_queue = await getbookingQueue(result_online, dayOfBooking, post_catery.category, document.getElementById("proptime").value)

                    console.log(document.getElementById("proptime").value)
                    console.log(status_queue)
                    if (status_queue == 0 || status_queue < 0) {
                        if (document.getElementById("proptime").value != '0') {
                            showCancelMessage_queue('คิวเต็มแล้ว', '')
                            return;
                        }

                    }
                    var dataaddQueue;
                    if (document.getElementById("proptime").value == '0') {
                        dataaddQueue = {
                            uId: userId.uId,
                            values: post_catery.category,
                            tel: document.getElementById("tel").value,
                            name: document.getElementById("username").value,
                            vehicleNumber: document.getElementById("vehicleNumber").value,
                            dayOfBooking: timeStart.replace('/', '').replace('/', ''),
                            timeOfBooking: '',
                        }
                    } else {
                        dataaddQueue = {
                            uId: userId.uId,
                            values: post_catery.category,
                            tel: document.getElementById("tel").value,
                            name: document.getElementById("username").value,
                            vehicleNumber: document.getElementById("vehicleNumber").value,
                            dayOfBooking: timeStart.replace('/', '').replace('/', ''),
                            timeOfBooking: document.getElementById("proptime").value,
                        }
                    }
                    console.log(dataaddQueue)
                    axios.post(urlipaddress + 'addBookingQueue/' + _objectId_online, dataaddQueue, {
                        headers: {
                            'Authorization': result_online
                        }
                    }).then(async function (response) {
                        console.log(response.data.message.status)
                        var time_booking = timeStart.split('/')
                        if (response.data.message.status == "Successful") {

                            if (document.getElementById("proptime").value == '0') {
                                console.log('--------------------')
                                document.getElementById('q_day').innerHTML = '<b>วัน/เวลา </b> ' + document.getElementById('_time').innerHTML.replace('วันที่ : ', '')

                                document.getElementById('dayOfBooking').innerHTML = '<b>วันที่จองล่วงหน้า </b> ' + time_booking[2] + '/' + time_booking[1] + '/' + time_booking[0]
                                document.getElementById('timeOfBooking').innerHTML = '<b>จองช่วงเวลา </b> ' + '-'

                                document.getElementById('q_no').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  คิวที่ No. ' + response.data.message.queue
                            } else {
                                console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                                document.getElementById('q_day').innerHTML = '<b>วัน/เวลา </b> ' + document.getElementById('_time').innerHTML.replace('วันที่ : ', '') + '<br>'
                                document.getElementById('dayOfBooking').innerHTML = '<b>วันที่จองล่วงหน้า </b> ' + time_booking[2] + '/' + time_booking[1] + '/' + time_booking[0]
                                document.getElementById('timeOfBooking').innerHTML = '<b>จองช่วงเวลา </b> ' + document.getElementById("proptime").value

                                document.getElementById('q_no').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  คิวที่ No. ' + response.data.message.queue
                            }

                            $("#_viewlog").show();
                            html2canvas($("#createImg"), {
                                onrendered: function (canvas) {
                                    var imgsrc = canvas.toDataURL("image/png");
                                    $("#img").show();
                                }
                            });
                            displyanone()
                            await showSuccessMessage_queue('จองคิวสำเร็จ', '')

                        }
                    }).catch(function (res) {
                        const { response } = res
                        console.log(response.data.message)
                        showCancelMessage_queue(response.data.message, '')
                    });
                } else {
                    showCancelMessage_queue('เลยเวลาจอง', '')
                }
            }
            //} else {
            //     showCancelMessage_queue('คิวเต็มแล้ว', '')
            // }





        });
        $('#logout_online').on('click', async function (e) {
            var obj = JSON.parse(Cookies.get('refresh_tokenOnline'));
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                const databody = {
                    refresh_token: obj.refresh_token
                }
                axios.post(urlipaddress + 'logout', databody, {
                    headers: {
                        'Authorization': obj.refresh_token
                    }
                }).then(function (response) {
                    if (response.data.message == "success") {
                        Cookies.remove('dataUserOnline');
                        Cookies.remove('refresh_tokenOnline');
                        Cookies.remove('_objectIdOnline');
                        document.getElementById('add_q_online').style.display = 'none'
                        document.getElementById('submit_q_login').style.display = 'block'
                        document.getElementById('div_tabadd').style.display = 'none'
                        showSuccessMessage_register('ออกจากระบบ', '')
                    }
                }).catch(function (res) {
                    const { response } = res
                });
            });
        });
        $('#Submitmember_register').on('click', function (e) {
            if (document.getElementById("check_register").value == 'register_Phone') {
                $.getScript("ip.js", function (data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    var formData = new FormData();
                    const url = urlipaddress + 'addAccount';
                    formData.append('mId', _objectId);
                    formData.append('username', document.getElementById("member_register_user").value);
                    formData.append('password', document.getElementById("member_register_user").value);
                    formData.append('rule', 'online');
                    formData.append('phone', document.getElementById("member_register_user").value);
                    formData.append('editMode', false);
                    console.log(url)
                    axios.put(url, formData, {
                        headers: {
                            'Authorization': result,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    ).then(async function (response) {
                        if (response.data.message == "This user has already been used.") {
                            showCancelMessage_queue('มีข้อมูลในระบบแล้ว', 'กรุณาระชื่อผู้ใช้งานใหม่ อีกครั้ง')
                        } else {
                            document.getElementById('user_register').innerHTML = '<b>ชื่อผู้ใช้งาน : </b> ' + document.getElementById('member_register_user').value
                            $("#div_register_save").show();
                            html2canvas($("#createImg_register"), {
                                onrendered: function (canvas) {
                                    var imgsrc = canvas.toDataURL("image/png");
                                }
                            });
                            await showSuccessMessage_Register_Save_user('บันทึกสำเร็จ', 'คุณทำการลงทะเบียนเรียบร้อยแล้ว')
                        }
                    }).catch(function (res) {
                        const { response } = res
                        if (response.data.message == 'This user has already been used.') {
                            showCancelMessage_queue('มีข้อมูลในระบบแล้ว', '')
                        }
                    });
                });
            } else {
                if (document.getElementById("member_register_user").value == '' || document.getElementById("member_register_pass").value == '') {
                    showCancelMessage_queue('กรอกข้อมูลให้ครบ', 'ระบุ ชื่อผู้ใช้งาน และ รหัสผ่าน')
                    return;
                }
                if ($('#member_register_pass').val() == $('#member_register_pass_confirm').val()) {
                    console.log('Matching')
                } else {
                    showCancelMessage_queue('รหัสผ่านใหม่ไม่ตรงกัน', 'รหัสผ่านใหม่ไม่ตรงกัน กรุณาระบุ รหัสให้ตรงกัน')
                    return
                }

                $.getScript("ip.js", function (data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    var formData = new FormData();
                    const url = urlipaddress + 'addAccount';
                    formData.append('mId', _objectId);
                    formData.append('username', document.getElementById("member_register_user").value);
                    formData.append('password', document.getElementById("member_register_pass").value);
                    formData.append('rule', 'online');
                    formData.append('phone', document.getElementById("member_register_phone").value);
                    formData.append('editMode', false);
                    console.log(url)
                    axios.put(url, formData, {
                        headers: {
                            'Authorization': result,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    ).then(async function (response) {
                        if (response.data.message == "This user has already been used.") {
                            showCancelMessage_queue('มีข้อมูลในระบบแล้ว', 'กรุณาระชื่อผู้ใช้งานใหม่ อีกครั้ง')
                        } else {
                            document.getElementById('user_register').innerHTML = '<b>ชื่อผู้ใช้งาน : </b> ' + document.getElementById('member_register_user').value
                            document.getElementById('password_regis').innerHTML = '<b>รหัสผ่าน : </b> ' + document.getElementById('member_register_pass').value
                            $("#div_register_save").show();
                            html2canvas($("#createImg_register"), {
                                onrendered: function (canvas) {
                                    var imgsrc = canvas.toDataURL("image/png");
                                }
                            });
                            await showSuccessMessage_Register_Save_user('บันทึกสำเร็จ', 'คุณทำการลงทะเบียนเรียบร้อยแล้ว')
                        }
                    }).catch(function (res) {
                        const { response } = res
                        if (response.data.message == 'This user has already been used.') {
                            showCancelMessage_queue('มีข้อมูลในระบบแล้ว', '')
                        }
                    });
                });
            }




        });

        $('#qr_category').on('change', async function () {
            propcategory = document.getElementById("qr_category").value
            //  console.log(propcategory)
            var prop = await getProp(result, propcategory)
            console.log(prop)
            // console.log(propcategory)
            $('#proptime').empty();
            var $select = $('#proptime');
            $select.append('<option value=' + '0' + '>' + '-- เลือกช่วงเวลา --' + '</option>');
            $.each(prop.intervalDifference, function (key, value) {
                console.log(value)
                if (value.intervalDifference != '') {
                    //var datatime = JSON.stringify(value)
                    $select.append('<option value=' + value + '>' + value + '</option>');
                    //   var datatime = JSON.stringify(value)
                    //   $select.append('<option value=' + datatime + '>' + value.category + '</option>');
                }

            });
        });
    });
    function showCancelMessage_queue(title, text) {
        swal({
            title: title,
            text: text,
            type: "error",
        }, function (isConfirm) {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        });
    }
    function showSuccessMessage_register(text, _q) {
        swal({
            title: "สำเร็จ",
            text: text,
            type: "success",
        }, function (isConfirm) {
            if (isConfirm) {

            }
        });
    }
    function showSuccessMessage_Register_Save_user(text, _q) {
        swal({
            title: "สำเร็จ",
            text: text,
            type: "success",
        }, function (isConfirm) {
            if (isConfirm) {
                html2canvas($("#createImg_register"), {
                    onrendered: function (canvas) {
                        var imgageData = canvas.toDataURL("image/png");
                        // console.log(imgageData)
                        // Get the canvas
                        var canvas = document.getElementById("canvas");
                        // Convert the canvas to data
                        // Create a link
                        var aDownloadLink = document.createElement('a');
                        // Add the name of the file to the link
                        aDownloadLink.download = 'username.png';
                        // Attach the data to the link
                        aDownloadLink.href = imgageData;
                        // Get the code to click the download link
                        aDownloadLink.click();
                    }
                });

            }
        });
    }
    function showSuccessMessage_queue(text, _q) {
        swal({
            title: "สำเร็จ",
            text: text,
            type: "success",
        }, function (isConfirm) {
            if (isConfirm) {
                html2canvas($("#createImg"), {
                    onrendered: function (canvas) {
                        var imgageData = canvas.toDataURL("image/png");
                        // console.log(imgageData)
                        // Get the canvas
                        var canvas = document.getElementById("canvas");
                        // Convert the canvas to data
                        // Create a link
                        var aDownloadLink = document.createElement('a');
                        // Add the name of the file to the link
                        aDownloadLink.download = 'queue.png';
                        // Attach the data to the link
                        aDownloadLink.href = imgageData;
                        // Get the code to click the download link
                        aDownloadLink.click();
                        // var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
                        // $("#btn-Convert-Html2Image").attr("download", "queue.png").attr("href", newData);
                    }
                });
                $("#div_register_save").hide();
            }
        });
    }

    var propcategory
    var proptime
    $('#select_category').on('change', async function () {
        //  try {
        propcategory = JSON.parse(document.getElementById("select_category").value)


        $('#select_time').empty();
        var $select = $('#select_time');
        $select.append('<option value=' + '0' + '>' + '-- เลือกช่วงเวลา --' + '</option>');
        $.each(propcategory.intervalDifference, function (key, value) {
            console.log(value)
            if (value.intervalDifference != '') {
                var datatime = JSON.stringify(value)
                $select.append('<option value=' + value + '>' + value + '</option>');
            }

        });
    });


    $('#CheckQueue').on('click', async function () {

        console.log(document.getElementById('select_category').value)
        var select_category = document.getElementById('select_category').value;
        select_category = JSON.parse(select_category)
        console.log(select_category)
        var dayOfBooking = document.getElementById('datequeue_Check').value.replace('-', '').replace('-', '')
        var today = new Date();
        var n_date = today.toISOString();
        let date = new Date(n_date);
        let options = { hour12: false };
        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
        var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
        chk_date = chk_date.split(' ')
        chk_date = chk_date[0].split('/')
        var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]
        console.log(datenew)
        var dateselect = document.getElementById('datequeue_Check').value.replace('-', '/').replace('-', '/')
        console.log(dateselect)
        var _checkdate = dayjs(dateselect).isAfter(datenew)


        console.log(dayOfBooking, select_category.category)
        if (_checkdate == true) {
            await getbookingQueue(result, dayOfBooking, select_category.category, '')
        } else {
            _checkdate = dayjs(dateselect).isSame(datenew)
            if (_checkdate == true) {
                await getbookingQueue(result, dayOfBooking, select_category.category, '')
            } else {
                showCancelMessage_queue('เลยเวลาจอง', '')
            }
        }
    });


});




async function dateToday() {
    var today = new Date();
    var n_date = today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    chk_date = chk_date[0].split('/')
    var thisTime = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]
    return thisTime
}
$.getScript("ip.js", async function (data, textStatus, jqxhr) {
    var urlipaddress = data.substring(1, data.length - 1);
    const socket = io(urlipaddress);
    var obj;
    var result;
    if (Cookies.get('refresh_tokenOnline') != undefined) {
        obj = JSON.parse(Cookies.get('refresh_tokenOnline'));
        result = await acctoken(obj.refresh_token);


    }

    console.log(result)
    if (result != undefined) { /////login
        socket.on('addQueue', async function (data) {
            console.log(add_queue_result)
            $("#table_view").empty();
            console.log(data)
            str_io = 'io'
            await getqueueview(result);
        });
        socket.on('sentServiceChannel', async function (data) {
            $("#table_view").empty();
            console.log(data)
            str_io = 'io'
            await getqueueview(result);
        });
        socket.on('sentEndQueue', async function (data) {
            $("#table_view").empty();
            str_io = 'io'
            console.log(data)
            await getqueueview(result);
        });
    } else {
        socket.on('addQueue', async function (data) {
            console.log(add_queue_result)
            $("#table_view").empty();
            console.log(data)
            str_io = 'io'
            await getqueueview(add_queue_result);
        });
        socket.on('sentServiceChannel', async function (data) {
            $("#table_view").empty();
            console.log(data)
            str_io = 'io'
            await getqueueview(add_queue_result);
        });
        socket.on('sentEndQueue', async function (data) {
            $("#table_view").empty();
            str_io = 'io'
            console.log(data)
            await getqueueview(add_queue_result);
        });
    }
});






