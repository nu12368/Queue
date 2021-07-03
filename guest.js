var _arr_qloop = new Array();
var _n_loop = 1;
var _i_loop = 0;
var q_count = 0;
var _objectId;
var str_io = '';
function acctoken(obj) {
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
                        if (str_io == '') {
                            if (userId.userId == response.data.message.values[i].uId) {
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
                                    เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
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
                        }
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
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response)
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
                    console.log(response.data.message.values[i])
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

                            if (str_io == '') {
                                if (userId.userId == response.data.message.values[i].uId) {

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
                                    เวลา ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
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
                    }
                    _num = _num + 1;
                    if (_collor.length == _num) {
                        _num = 0;
                    }
                }
                document.getElementById('count_queuetoday').innerText = 'คิวทั้งหมดของวันนี้ จำนวน ' + q_count + ' คิว'
            }
        }).catch(function (res) {
            const { response } = res
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
                var $select = $('#qr_category');
                $select.append('<option value=' + '0' + '>' + '-- กรุณาเลือกแผนก --' + '</option>');
                $.each(response.data.message.category, function (key, value) {
                    $select.append(`<option>${value.category}</option>`);
                });
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
        axios.get(urlipaddress + "file/qrcode/" + nameqr, {
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
                console.log(response.data.message.qrList.length)
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


$(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    let myParam = urlParams.toString();

    $('#tabhome').on('click', async function () {
        console.log('dddddd')
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
        var obj_refresh = JSON.parse(Cookies.get('refresh_tokenOnline'));
        var result_refresh = await acctoken(obj_refresh.refresh_token);
        console.log(result_refresh)
        await getqueueview(result_refresh)
        console.log('222222222')
        document.getElementById('div_viwe').style.display = 'none'

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
                    //console.log(response.data.message)
                    if (response.data.message == "delete completed") {

                    }
                }).catch(function (res) {
                    const { response } = res
                    console.log(response.data.message)
                    showCanceldeletequeue(response.data.message, '')
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
                // console.log(url)
                const res = await axios.get(url);
                // console.log(res.data.message.refresh_token)
                result = await acctoken(res.data.message.refresh_token)
                //  console.log(result)
                await getqueueview(result);
                _category = await getcategoryview(result);
                var nameqr = await getqrcode_List(result)
                await getqrcode(result, nameqr);

            } catch (err) {
                throw err.response.data.message;
            }
        };
        authGuest();

        $('#submitaddqueue').on('click', async function (e) {

            var obj = JSON.parse(Cookies.get('refresh_tokenOnline'));
            var userId = JSON.parse(Cookies.get('dataUserOnline'));
            var _objectId_online = Cookies.get('_objectIdOnline');

            console.log(obj)
            console.log(userId)
            console.log(_objectId_online)

            const result_online = await acctoken(obj.refresh_token);

            var select_category = document.getElementById("qr_category").value
            var post_catery;
            for (i = 0; i < _category.length; i++) {
                if (select_category == _category[i].category) {
                    post_catery = _category[i];
                }
            }
            const socket = io(urlipaddress);
            socket.emit('addQueue', { addQueue: 'Updated' });
            const dataaddQueue = {
                uId: userId.userId,
                values: post_catery.category,
                tel: document.getElementById("tel").value,
                name: document.getElementById("username").value,
            }

            axios.post(urlipaddress + 'addQueue/' + _objectId_online, dataaddQueue, {
                headers: {
                    'Authorization': result_online
                }
            }).then(function (response) {
                //  console.log(response.data.message)

                if (response.data.message.status == "Successful") {
                    document.getElementById('q_day').innerHTML = '<b>วัน/เวลา </b> ' + document.getElementById('_time').innerHTML
                    document.getElementById('q_no').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  คิวที่ No. ' + response.data.message.queue

                    $("#_viewlog").show();
                    html2canvas($("#createImg"), {
                        onrendered: function (canvas) {
                            var imgsrc = canvas.toDataURL("image/png");
                            $("#img").show();
                            // console.log(imgsrc)
                        }
                    });
                    // $("#a_load").append(`
                    // <a id="btn-Convert-Html2Image" href="#">Download</a>`);
                    displyanone()
                    showSuccessMessage_queue('จองคิวสำเร็จ', '')
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessage_queue(response.data.message, '')
            });
        });
        $('#logout_online').on('click', async function (e) {
            var obj = JSON.parse(Cookies.get('refresh_tokenOnline'));
            const result_online = await acctoken(obj);
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                const databody = {
                    refresh_token: obj
                }
                axios.post(urlipaddress + 'logout', databody, {
                    headers: {
                        'Authorization': result_online
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
            if (document.getElementById("member_register_user").value == '' || document.getElementById("member_register_pass").value == '') {
                showCancelMessage_queue('กรอกข้อมูลให้ครบ', 'ระบุ ชื่อผู้ใช้งาน และ รหัสผ่าน')
                return;
            }
            // var chk_pass = validateUsernameUSER();
            // if (chk_pass == false) {
            //     return;
            // }
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                const dataUser = {
                    userId: _objectId,
                    user: document.getElementById("member_register_user").value,
                    password: document.getElementById("member_register_pass").value,
                    rule: 'online'
                }
                axios.put(urlipaddress + 'addAccount', dataUser, {
                    headers: {
                        'Authorization': result,
                    }
                }
                ).then(function (response) {
                    //  console.log(response.data.message)
                    if (response.data.message == "This user has already been used.") {
                        showCancelMessage_queue('มีข้อมูลในระบบแล้ว', 'กรุณาระชื่อผู้ใช้งานใหม่ อีกครั้ง')
                    } else {
                        showSuccessMessage_register('บันทึกสำเร็จ', 'คุณทำการลงทะเบียนเรียบร้อยแล้ว')

                    }
                }).catch(function (res) {
                    const { response } = res
                    // console.log(response.data.message)
                    if (response.data.message == 'This user has already been used.') {
                        showCancelMessage_queue('มีข้อมูลในระบบแล้ว', '')
                    }
                });
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


                document.getElementById('add_q_online').style.display = 'block'
                document.getElementById('submit_q_login').style.display = 'none'
                document.getElementById('div_tabadd').style.display = 'block'

            }
        });
    }
});

$.getScript("ip.js", async function (data, textStatus, jqxhr) {
    var urlipaddress = data.substring(1, data.length - 1);
    const socket = io(urlipaddress);
    var obj;
    var result;
    if (Cookies.get('refresh_tokenOnline') != undefined) {
        obj = JSON.parse(Cookies.get('refresh_tokenOnline'));
        result = await acctoken(obj.refresh_token);
    }
    //  console.log(result)
    if (result != undefined) {
        socket.on('sentServiceChannel', async function (data) {
            //  console.log(data)
            str_io = 'io'
            await getqueueview(result);
        });
        socket.on('sentEndQueue', async function (data) {
            str_io = 'io'
            // console.log(data)
            await getqueueview(result);
        });
    }
});






