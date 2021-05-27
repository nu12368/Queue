
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
            // $("#Imageqrcode").append(`
            //    <img name="${b64encoded}"  src="${"data:" + mimetype + ";base64," + b64encoded}">`);

               $('#Imageqrcode').attr('src', `${"data:" + mimetype + ";base64," + b64encoded}`)

                 $("#a_load").append(`
                    <a id="btn-Convert-Html2Image" href="#">Download</a>`);

                  var imgsrc;
                    var dataURL;
                    html2canvas($("#createImg"), {
                        onrendered: function (canvas) {
                            imgsrc = canvas.toDataURL("image/png");
                            
                            dataURL = canvas.toDataURL();
                            var newData = imgsrc.replace(/^data:image\/png/, "data:application/octet-stream");
                        $("#btn-Convert-Html2Image").attr("download", "queue.png").attr("href", newData);
                        }
                    });
        });
        // axios.get(urlipaddress + 'message/' + _objectId, {
        //     headers: {
        //         'Authorization': refresh_token
        //     }
        // }).then(function (response) {

        //     console.log(response.data.message.values)


        // }).catch(function (res) {
        //     const { response } = res
        // });
    });
}

$(async function () {
    const result = await acctoken();
    await getqrcode(result);



});




