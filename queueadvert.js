var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var dataUser = userId
var n = 0;
var arrimagedelete = new Array()
var arr = new Array();
if (dataUser != undefined) {
    dataUser = JSON.parse(dataUser)
}
var length_img;
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
            console.log(response.data.message.result[0].advtId)

            var _arr = new Array();
            for (const i in response.data.message.result) {
                _arr[i] = {
                    advtId: response.data.message.result[i].advtId,
                    imageAdvt: response.data.message.result[i].imageAdvt,
                    description: response.data.message.result[i].description,
                    name: response.data.message.result[i].name,
                }
            }

            console.log(_arr)

            var table = $('#table1').DataTable({
                "lengthMenu": [
                    [25, 50, 100],
                    [25, 50, 100]
                ],
                "pageLength": 25,
                'data': _arr,
                "ordering": false,
                "responsive": true,
                "autoWidth": false,
                "order": [],
                columns: [
                    { data: "advtId", 'visible': false },
                    { data: "imageAdvt", 'visible': false },
                    { data: "description" },
                    { data: "name", 'visible': false },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="view_img" style="font-size:16px;color:blue; cursor: pointer;">ดูรูปภาพ </i>'
                    },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="edit_advert" style="font-size:16px;color:blue; cursor: pointer;">แก้ไข </i>/ <i href="" class="remove_advert" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                    },
                ],

            });
        }).catch(function (res) {
            const { response } = res
        });
    });
}



$(document).ready(async function () {
    ///////// ลบรูปภาพ
    $('#addImagenew').on('click', 'i.delete_cc', function (e) {
        var remove_index = $(this).attr("name");
        console.log(remove_index)
        arr[parseInt(remove_index)] = " ";
        $(this).remove();

    });

    ///////// ลบรูปภาพ แก้ไข
    $('#EditaddImage').on('click', 'i.delete_cc', function (e) {
        var remove_index = $(this).attr("name");
        arrimagedelete[remove_index] = arr[remove_index];
        arr[parseInt(remove_index)] = " ";
        $(this).remove();
    });


    ///////////////// เลือกไฟล์
    $('#fileimage').on('change', function () {
        length_img = $("#addImagenew img");
        resize(this)
        return
    });

    $('#edit_fileimage').on('change', function () {
        length_img = $("#EditaddImage img");
        resizeEdit(this);
        console.log(arr)
        return
    });
    function resizeEdit(item) {
        //define the width to resize e.g 600px
        var resize_width = 600; //without px
        //    console.log(item.files)
        for (i = 0; i < item.files.length; i++) {
            var reader = new FileReader();
            //image turned to base64-encoded Data URI.
            reader.readAsDataURL(item.files[i]);
            reader.name = item.files[i].name; //get the image's name
            reader.size = item.files[i].size; //get the image's size
            reader.onload = function (event) {
                var img = new Image(); //create a image
                img.src = event.target.result; //result is base64-encoded Data URI
                img.name = event.target.name; //set name (optional)
                img.size = event.target.size; //set size (optional)
                img.onload = function (el) {
                    var elem = document.createElement('canvas'); //create a canvas
                    //scale the image to 600 (width) and keep aspect ratio
                    var scaleFactor = resize_width / el.target.width;
                    elem.width = resize_width;
                    elem.height = el.target.height * scaleFactor;

                    //draw in canvas
                    var ctx = elem.getContext('2d');
                    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

                    //get the base64-encoded Data URI from the resize image
                    var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

                    //  console.log(event.target.name)
                    var _file = dataURLtoFileEdit(srcEncoded, event.target.name)
                    console.log(_file)



                    /////// เพิ่ม รูปภาพ ทั่วไป 
                    $("#EditaddImage").append(`<a id="close"  style="font-size:18px;color:red; class="pull-right" href="#">
                <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${n}" src="${srcEncoded} "class="cc img-responsive thumbnail"></i></a>`);
                    arr[n] = dataURLtoFileEdit(srcEncoded, event.target.name);
                    n = n + 1;
                }
            }
        }
    }

    function resize(item) {
        //define the width to resize e.g 600px
        var resize_width = 600; //without px
        //    console.log(item.files)
        for (i = 0; i < item.files.length; i++) {
            var reader = new FileReader();
            //image turned to base64-encoded Data URI.
            reader.readAsDataURL(item.files[i]);
            reader.name = item.files[i].name; //get the image's name
            reader.size = item.files[i].size; //get the image's size
            reader.onload = function (event) {
                var img = new Image(); //create a image
                img.src = event.target.result; //result is base64-encoded Data URI
                img.name = event.target.name; //set name (optional)
                img.size = event.target.size; //set size (optional)
                img.onload = function (el) {
                    var elem = document.createElement('canvas'); //create a canvas
                    //scale the image to 600 (width) and keep aspect ratio
                    var scaleFactor = resize_width / el.target.width;
                    elem.width = resize_width;
                    elem.height = el.target.height * scaleFactor;

                    //draw in canvas
                    var ctx = elem.getContext('2d');
                    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

                    //get the base64-encoded Data URI from the resize image
                    var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

                    //  console.log(event.target.name)
                    var _file = dataURLtoFileEdit(srcEncoded, event.target.name)
                    console.log(_file)



                    /////// เพิ่ม รูปภาพ ทั่วไป 
                    $("#addImagenew").append(`<a id="close"  style="font-size:18px;color:red; class="pull-right" href="#">
                <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${n}" src="${srcEncoded} "class="cc img-responsive thumbnail"></i></a>`);

                    arr[n] = dataURLtoFileEdit(srcEncoded, event.target.name);
                    n = n + 1;




                }
            }
        }
    }

    console.log(dataUser)
    if (dataUser.rule == 'root') {
        document.getElementById("userlogin").innerText = 'ผู้ใช้งาน : ' + dataUser.username + ' | สิทธิ์ผู้ใช้งาน : ' + dataUser.rule
        $("#queueview").addClass('intronone');
    }
    const result = await acctoken();

    await getadvt(result);
    // await getlogocompanysetting(result)
    $('#submitcompany').on('click', async function (e) {
        const result = await acctoken();
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var formData = new FormData();
            formData.append('mId', _objectId);
            formData.append('name', document.getElementById("txtnamecompyny").value);
            formData.append('description', document.getElementById("txtnamecompyny").value);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != " ") {
                    formData.append('imageAdvt', arr[i]);
                }
            }


            const url = urlipaddress + 'advt';
            axios.post(url, formData, {
                headers: {
                    'Authorization': result,
                    'Content-Type': 'multipart/form-data'
                }
            }
            ).then(function (response) {
                console.log(response.data)
                if (response.data.message == "Successfully save advt completed.") {
                    showSuccessMessageregisteruser('บันทึกสำเร็จ', '')
                }
            }).catch(function (res) {
                const { response } = res
                showCancelMessageregisteruser(res.data.message, '')
            });

        });
    });

    var dataadvert;
    $('#table1').on('click', 'i.view_img', async function (e) {
        const result = await acctoken();
        var table = $('#table1').DataTable();
        e.preventDefault();
        var _ro = table.row($(this).parents('tr'));
        dataadvert = _ro.data();
        if (dataadvert == undefined) {
            dataadvert = table.row(this).data();
        }

        $('#myModalview').trigger('focus')
        $("#viewImage").empty();
        $("#myModalview").modal('show');
        $('#addsuppliesListmember').modal('hide')

        var nn = 0;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (let i in dataadvert.imageAdvt) {

                console.log(dataadvert.imageAdvt[i])
                axios.get(urlipaddress + "files/advt/" + dataadvert.imageAdvt[i], {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    var arrayBuffer = response.data; // Note: not oReq.responseText
                    var u8 = new Uint8Array(arrayBuffer);
                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                    var mimetype = "image/png"; // or whatever your image mime type is

                    $("#viewImage").append(`<img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);
                });


            }
        });

    });


    $('#table1').on('click', 'i.edit_advert', function (e) {
        $("#EditaddImage").empty();
        var table = $('#table1').DataTable();
        e.preventDefault();
        var _ro = table.row($(this).parents('tr'));
        dataadvert = _ro.data();

        if (dataadvert == undefined) {
            dataadvert = table.row(this).data();
        }
        console.log(dataadvert)
        $("#Editadvert").modal();
        $("#edit_adv").val(dataadvert.description)

        var nn = 0;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (let i in dataadvert.imageAdvt) {
                axios.get(urlipaddress + "files/advt/" + dataadvert.imageAdvt[i], {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    var arrayBuffer = response.data; // Note: not oReq.responseText
                    var u8 = new Uint8Array(arrayBuffer);
                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                    var mimetype = "image/png"; // or whatever your image mime type is

                    $("#EditaddImage").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                    <i name="${n}" class="delete_cc  fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${n}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);

                    arr[n] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, nn.toString() + '.jpg');
                    n = n + 1;
                });
                nn = nn + 1;
            }
        });
    });

    $('#edit_submitdev').on('click', async function (e) {
        const result = await acctoken();
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'updateAdvt';
            let formData = new FormData();
            formData.append('mId', _objectId);
            formData.append('advtId', dataadvert.advtId);
            formData.append('name', document.getElementById("edit_adv").value);
            formData.append('description', document.getElementById("edit_adv").value);


            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != " ") {
                    formData.append('imageAdvt', arr[i]);
                }
            }
            axios.put(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                console.log(response.data.message)
               // location.href = "queueadvert.html";
                showSuccessMessageregisteruser('อัพเดทข้อมูลสำเร็จ')
            }).catch(function (res) {
                const { response } = res
                showCancelMessageregisteruser(response.data.message,'')
                console.log(response.data.message)
            });
        });

    });

    $('#table1').on('click', 'i.remove_advert', function (e) {
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        dataadvert = _ro.data();

        if (dataadvert == undefined) {
            dataadvert = table.row(this).data();
        }
        $("#myModaldelete").modal();

        $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

    });


    $('#Deletenoticedata').on('click', async function (e) {
        const result = await acctoken();
        const datanew = {
            mId: _objectId,
            advtId: dataadvert.advtId
        }
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios({
                url: urlipaddress + 'delAdvt',
                method: 'delete',
                data: datanew,
                headers: { 'Authorization': result }
            }).then(function (response) {
                console.log(response.data.message)
                if (response.data.message == "delete completed.") {
                    $("#myModaldelete").empty()
                    showSuccessMessageregisteruser('ลบข้อมูลสำเร็จ')
                  
                }
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessageregisteruser(response.data.message, '')
            });
        });
    });



});

function showCancelMessageregisteruser(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function (isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}
function showSuccessMessageregisteruser(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function (isConfirm) {
        if (isConfirm) {
            location.href = "queueadvert.html";
        }
    });
}

function dataURLtoFileEdit(dataurl, filename) {
    var arr_1 = dataurl.split(','),
        mime = arr_1[0].match(/:(.*?);/)[1],
        bstr = atob(arr_1[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

