var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
console.log(_objectId)

function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'permit', {}, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function(response) {
                resolve(response.data.message.access_token);
            }).catch(function(res) {
                const { response } = res
                if (response.data.message == "Unauthorized") {
                    location.href = "index.html";
                    return;
                }
            });
        });
    });
}

function getqrcode(refresh_token, nameqr) {
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        console.log(urlipaddress + "files/qrcode/" + nameqr)
        axios.get(urlipaddress + "files/qrcode/" + nameqr, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data)
            var arrayBuffer = response.data; // Note: not oReq.responseText
            var u8 = new Uint8Array(arrayBuffer);
            var b64encoded = btoa(String.fromCharCode.apply(null, u8));
            var mimetype = "image/png"; // or whatever your image mime type is
            // $('#Imageqrcode').attr('src', `${"data:" + mimetype + ";base64," + b64encoded}`)
            $('#Imageqrcode').attr('src', `${"data:" + mimetype + ";base64," + b64encoded}`)

            $("#a_load").append(`
                    <a id="btn-Convert-Html2Image" href="#">ดาวน์โหลด</a>`);
            var imgsrc;
            var dataURL;
            html2canvas($("#createImg"), {
                onrendered: function(canvas) {
                    imgsrc = canvas.toDataURL("image/png");
                    dataURL = canvas.toDataURL();
                    var newData = imgsrc.replace(/^data:image\/png/, "data:application/octet-stream");
                    $("#btn-Convert-Html2Image").attr("download", "queue.png").attr("href", newData);
                }
            });
        });

    });
}

function Genqrcode(refresh_token) {
    console.log(refresh_token)
    console.log('sdsds')
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var ipclientUrl;
            $.getScript("ipclient.js", function(dataipclient, textStatus, jqxhr) {
                ipclientUrl = dataipclient.substring(1, dataipclient.length - 1);
                var formData = new FormData();
                var file_data = $('#filelogo').prop('files')[0];
                if (file_data != undefined) {
                    formData.append('imageQrcode', file_data);
                } else {
                    formData.append('imageQrcode', '');
                }
                const url = urlipaddress + 'qrGen';
                formData.append('mId', _objectId);
                formData.append('clientUrl', ipclientUrl.substring(0, ipclientUrl.length - 1));
                formData.append('dotsOptionsType', 'square');
                axios.post(url, formData, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function(response) {
                    console.log(response.data.message)

                    if (response.data.message == 'Generate Qr complete') {

                    }
                    resolve(response.data.message)

                }).catch(function(res) {
                    const { response } = res
                    console.log(response)
                });
            });
        });
    });
}

function getqrcode_List(refresh_token) {
    console.log(_objectId)
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + "qrList/" + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function(response) {
                console.log(response.data.message)
                    // Genqrcode(refresh_token)
                if (response.data.message == 'directory not found') {
                    resolve('true')
                } else {
                    resolve(response.data.message.qrList[0])
                }
            }).catch(function(res) {
                //  console.log(res)
                const { response } = res
                // console.log('dsdsdsdssdsds')
                //  resolve('true')
                //console.log(response.data.message)
            });
        });
    });
}
$(async function() {
    const result = await acctoken();
    // var checkGen = Genqrcode(result)
    //return
    var autogen = await getqrcode_List(result)
    console.log(autogen)
        //  return
    var c;
    var nameqrcode;
    if (autogen == 'true') {
        c = await Genqrcode(result)
    } else {
        nameqrcode = autogen
    }

    nameqrcode = await getqrcode_List(result)

    console.log(nameqrcode)
        // te = nameqrcode;
    await getqrcode(result, nameqrcode);


    $("#i_regenlogo").on('click', async function(e) {
        $("#filelogo").trigger('click');
        let photo = document.getElementById("filelogo");
        photo.addEventListener("change", handleFiles, false);
        async function handleFiles() {
            const fileList = this.files; /* now you can work with the file list */
            console.log(this.files)
            const result = await acctoken();
            await Genqrcode(result)
            location.href = "queueqrcode.html";
        }
    });

    $('#i_regen').on('click', async function(e) {
        const result = await acctoken();
        await Genqrcode(result)
        location.href = "queueqrcode.html";
    });
});