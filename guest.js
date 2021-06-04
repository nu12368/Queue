
var _objectId;
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
var _arr_qloop = new Array();
var _n_loop = 1;
var _i_loop = 0;
const queueloop = async (refresh_token, _page) => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'queue/' + _objectId + '?_page='+ _page +'&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
           // console.log(response.data.message.values)
          //  $('#table_view').DataTable().destroy();
          //  $("#table_view").empty();
            var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
            var _num = 0;
           
            for (i = 0; i < response.data.message.values.length; i++) {
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
                _num = _num + 1;
                if (_collor.length == _num) {
                    _num = 0;
                }
            }
            
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
           // console.log(response.data.message)
            var totle = response.data.message.total
          //  console.log(totle)
            var looptotle = Math.ceil(totle / 100)
           // console.log(looptotle)
            if (looptotle > 1) { ///// คิวมากกว่า loop 100
                var _page = 1;
                $("#table_view").append(`
                <thead>
                <tr>
                    <th style="font-size: 28px;">หมายเลข</th>
                    <th style="font-size: 28px;">ช่องบริการ</th>
                </tr>
            </thead>
            `);
                for (i = 0; i < looptotle; i++) {
                    queueloop(refresh_token, _page)
                    _page = _page + 1
                }
                
            }else{
                $("#table_view").empty();
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
                for (i = 0; i < response.data.message.values.length; i++) {
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
                    _num = _num + 1;
                    if (_collor.length == _num) {
                        _num = 0;
                    }
                }
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
function getqrcode(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + "images/qrcode/" + _objectId + '.qr1', {
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
$(async function () {
    const urlParams = new URLSearchParams(window.location.search);
    let myParam = urlParams.toString();
   // console.log(myParam)
    let result;
    var _category;
    var _objid = myParam.split('=');
    _objectId = _objid[1];
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const authGuest = async () => {
            const url = `${urlipaddress}guest?${myParam}`;
            try {
                const res = await axios.get(url);
                result = await acctoken(res.data.message.refresh_token)
              //  console.log(result)
                getqueueview(result);
                _category = await getcategoryview(result);
                getqrcode(result);
                // return res.data.message;
            } catch (err) {
                throw err.response.data.message;
            }
        };
        authGuest();

        $('#submitaddqueue').on('click', function (e) {

          //  console.log(_category)
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
                values: post_catery.category,
                tel: document.getElementById("tel").value,
                name: document.getElementById("username").value,
            }

            axios.post(urlipaddress + 'addQueue/' + _objectId, dataaddQueue, {
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
              //  console.log(response.data.message)

                if (response.data.message.status == "Successful") {
                    document.getElementById('q_day').innerHTML = '<b>วัน/เวลา </b> ' + document.getElementById('_time').innerHTML
                    document.getElementById('q_no').innerHTML = 'คิวที่ No. ' + response.data.message.queue

                    $("#_viewlog").show();
                    var imgsrc;
                    var dataURL;
                    html2canvas($("#createImg"), {
                        onrendered: function (canvas) {
                            imgsrc = canvas.toDataURL("image/png");
                            $("#img").show();
                            dataURL = canvas.toDataURL();
                        }
                    });
                    // $("#a_load").append(`
                    // <a id="btn-Convert-Html2Image" href="#">Download</a>`);
                    showSuccessMessage_queue('จองคิวสำเร็จ', '')
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessage_queue(response.data.message, '')

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

            }
        });
    }





});







