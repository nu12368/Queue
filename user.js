var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var dataUser = userId
if (dataUser != undefined) {
    dataUser = JSON.parse(dataUser)
}

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
                }

            });
        });
    });
}

var strlogo
const getlogocompany = async (refresh_token) => {
    console.log(refresh_token)
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        console.log(urlipaddress + 'logo/' + _objectId)
        axios.get(urlipaddress + 'logo/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message)
            for (let index = 0; index < response.data.message.length; index++) {
                if(response.data.message[index].usedFor == 'web'){
                    document.getElementById('logoname').innerText = response.data.message[index].name
                    // document.getElementById('txtnamecompyny').value = response.data.message[index].name
                     viewlogo(refresh_token, response.data.message[index].imageLogo[0])
                }
            }
        }).catch(function (res) {
            const { response } = res
        });
    });
}

function viewlogo(refresh_token, idlogo) {
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId
        axios.get(urlipaddress + "files/logo/" + idlogo, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (responseview) {
            console.log(responseview.data)
            var arrayBuffer = responseview.data; // Note: not oReq.responseText
            var u8 = new Uint8Array(arrayBuffer);
            var b64encoded = btoa(String.fromCharCode.apply(null, u8));
            var mimetype = "image/png"; // or whatever your image mime type is
            $('#LOGOVIEW').attr('src', "data:" + mimetype + ";base64," + b64encoded);
            //   console.log(b64encoded)
        });
    });
}



$(document).ready(async function () {
    console.log(dataUser)
    if (dataUser.rule == 'root') {
        document.getElementById("userlogin").innerText = 'ผู้ใช้งาน : ' + dataUser.username  + ' | สิทธิ์ผู้ใช้งาน : ' + dataUser.rule
        $("#queueview").addClass('intronone');
    }
    console.log(_objectId)
    const result = await acctoken();
    await getlogocompany(result)
    // $.getScript("ip.js", function (data, textStatus, jqxhr) {
    //     var urlipaddress = data.substring(1, data.length - 1);
    //     document.getElementById('userlogin').innerText = datamember.username
    //     if (datamember.imageProfile.length != 0) {
    //         for (let i in datamember.imageProfile) {
    //             axios.get(urlipaddress + "view/images/" + datamember.imageProfile[i], {
    //                 responseType: 'arraybuffer',
    //                 headers: {
    //                     'Authorization': result
    //                 }
    //             }).then(function (response) {
    //                 var arrayBuffer = response.data; // Note: not oReq.responseText
    //                 var u8 = new Uint8Array(arrayBuffer);
    //                 var b64encoded = btoa(String.fromCharCode.apply(null, u8));
    //                 var mimetype = "image/png"; // or whatever your image mime type is
    //                 $('#imageProfile').attr('src', "data:" + mimetype + ";base64," + b64encoded);
    //             });
    //         }
    //     }
    //     return
    // });
});