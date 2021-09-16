
var length_img;
var arr = new Array();
var arrimagedelete = new Array();
var arrimageedit = new Array();
var n = 0;
var num_index_edit = 0;
var _idupdate;
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;
console.log(userId)


function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            // console.log('aaaaaaaaaaaaaa')
            axios.post(urlipaddress + 'permit', {}, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function (response) {
                //   console.log('bbb')
                // console.log(response.data.message.access_token)
                resolve(response.data.message.access_token);

            }).catch(function (res) {
                const { response } = res
                //   console.log(response.data.message)

                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }

            });
        });
    });
}

$(async function () {
    console.log('dsdssds')
    const result = await acctoken();
    var imagesPreview = function (input) {
        if (input.files) {
            var filesAmount = input.files.length;
            document.getElementById("imgsixeedit").innerText = '';
            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                var typefile = input.files[i].name.split('.');
                if (typefile[1] != 'PNG' && typefile[1] != 'JPG' && typefile[1] != 'jpg' && typefile[1] != 'jpeg' && typefile[1] != 'png') {
                    document.getElementById("imgsixeedit").innerText = 'เลือกรูปภาพใหม่ เป็นไฟล์ JPEG, JPG, PNG !!!' + '\n' + input.files[i].name;
                    document.getElementById("imgsixeedit").style.color = "red";
                    return;
                }
                // if (input.files[i].size > 2192282) {
                //     //  alert('1111111111111')
                //     document.getElementById("imgsixeedit").innerText = "ขนาดภาพใหญ่เกินไป !!" + '\n' + input.files[i].name;
                //     document.getElementById("imgsixeedit").style.color = "red";
                //     return;
                // }
                reader.onload = function (event) {
                    length_img = $("#EditaddImage img");
                    if (length_img.length > 4) {

                        document.getElementById("imgsixeedit").innerText = "อัพไฟล์รูปได้ไม่เกิน 5 รูป !!!";
                        document.getElementById("imgsixeedit").style.color = "red";
                        return;
                    }
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
        return;
    };

    function resize(item) {
        //define the width to resize e.g 600px
        var resize_width = 600;//without px
        // console.log(item.files)
        for (i = 0; i < item.files.length; i++) {
            //get the image selected
            // var item = document.querySelector('#uploader').files[0];

            //create a FileReader
            var reader = new FileReader();

            //image turned to base64-encoded Data URI.
            reader.readAsDataURL(item.files[i]);
            reader.name = item.files[i].name;//get the image's name
            reader.size = item.files[i].size; //get the image's size
            reader.onload = function (event) {
                var img = new Image();//create a image
                img.src = event.target.result;//result is base64-encoded Data URI
                img.name = event.target.name;//set name (optional)
                img.size = event.target.size;//set size (optional)
                img.onload = function (el) {
                    var elem = document.createElement('canvas');//create a canvas

                    //scale the image to 600 (width) and keep aspect ratio
                    var scaleFactor = resize_width / el.target.width;
                    elem.width = resize_width;
                    elem.height = el.target.height * scaleFactor;

                    //draw in canvas
                    var ctx = elem.getContext('2d');
                    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

                    //get the base64-encoded Data URI from the resize image
                    var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

                    //assign it to thumb src
                    //    document.querySelector('#image').src = srcEncoded;

                    /*Now you can send "srcEncoded" to the server and
                    convert it to a png o jpg. Also can send
                    "el.target.name" that is the file's name.*/

                    //  console.log(event.target.name)
                    var _file = dataURLtoFile(srcEncoded, event.target.name)
                    console.log(_file)

                    $("#EditaddImage").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${n}" src="${srcEncoded} "class="cc img-responsive thumbnail"></i></a>`);

                    arr[n] = dataURLtoFile(srcEncoded, event.target.name);
                    n = n + 1;

                }
            }
        }
    }

    var namefile;
    var typename;
    $('#edit_fileimage').on('change', function () {
        length_img = $("#EditaddImage img");
        resize(this);
        //  imagesPreview(this);
        // var file_data = $('#edit_fileimage').prop('files');
        // var file_length = document.getElementById("edit_fileimage").files.length;

        // for (var i = 0; i < file_length; i++) {
        //     typename = file_data[i].type;
        //     namefile = file_data[i].name
        //     _checkimage(file_data[i]);
        //     if (file_data[i].size > 2192282) {
        //         return;
        //     }
        // }
        return
    });


    function _checkimage(_file) {
        getDataUrl(_file, function (imgBase64) {
            $("#EditaddImage").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
            <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12"><img name="${n}" src="${imgBase64}"class="img-responsive thumbnail"></i></a>`);

            arr[n] = dataURLtoFile(imgBase64, _file.name);

            n = n + 1;

        });

        console.log(arr)
    }



    function dataURLtoFile(dataurl, filename) {
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

    function getDataUrl(file, callback2) {
        var callback = function (srcOrientation) {
            var reader2 = new FileReader();
            reader2.onload = function (e) {
                var srcBase64 = e.target.result;
                var img = new Image();

                img.onload = function () {
                    var width = img.width,
                        height = img.height,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext("2d");

                    // set proper canvas dimensions before transform & export
                    if (4 < srcOrientation && srcOrientation < 9) {
                        canvas.width = height;
                        canvas.height = width;
                    } else {
                        canvas.width = width;
                        canvas.height = height;
                    }

                    // transform context before drawing image
                    switch (srcOrientation) {
                        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
                        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
                        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
                        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
                        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                        default: break;
                    }

                    // draw image
                    ctx.drawImage(img, 0, 0);

                    // export base64
                    callback2(canvas.toDataURL(file.type, 1.0));
                };
                img.src = srcBase64;
            }
            reader2.readAsDataURL(file);
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
            var length = view.byteLength, offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }

    ///////// ลบรูปภาพ
    $('#EditaddImage').on('click', 'i.delete_cc', function (e) {
        var remove_index = $(this).attr("name");
        arrimagedelete[remove_index] = arr[remove_index];
        arr[parseInt(remove_index)] = " ";
        $(this).remove();
    });





    var data;
    $.getScript("ip.js", function (dataipaddress, textStatus, jqxhr) {
        var urlipad = dataipaddress.substring(1, dataipaddress.length - 1);


    



















        $('#table_supplies').on('click', 'i.view_edit', function (e) {
            e.preventDefault();
            $("#EditaddImage").empty();
            var table = $('#table_supplies').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }

            $("#myModaledit").modal();

            //     console.log(_data.parcelImage)
            var nn = 0;
            for (let i in data.parcelImage) {
                console.log(data.parcelImage[i])

                axios.get(urlipad + "view/images/" + data.parcelImage[i], {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    var arrayBuffer = response.data; // Note: not oReq.responseText
                    var u8 = new Uint8Array(arrayBuffer);
                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                    var mimetype = "image/png"; // or whatever your image mime type is

                    // $("#EditaddImage").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                    // <i name="${n}" class="delete_cc  fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);

                    //console.log("data:" + mimetype + ";base64," + b64encoded)

                    $("#EditaddImage").append(`<img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);


                });

                nn = nn + 1;
            }

            if (data.status == 'new') {
                data.status = 'มา'
            }
            document.getElementById("edit_submitsupplies").disabled = false;
            if (data.status == 'รับแล้ว') {
                console.log(data.status)
                document.getElementById("edit_submitsupplies").disabled = true;
            }



            $("#_id_updatedata").val(data.parcelId);
            $("#roomedit").val(data.room);
            $("#descriptionedit").val(data.description);
            $("#statusdeit").val(data.status);
        });


        /////////////////////////// ส่งมอบพัสดุ
        $('#edit_submitsupplies').on('click', function (e) {
            const url = urlipad + 'deliver';
            let formData = new FormData();
            formData.append('userId', userId);
            formData.append('parcelId', data.parcelId);
            //  formData.append('parcelImage', '');
            //    formData.append('receiverImage', '');
            formData.append('room', document.getElementById("roomedit").value);
            formData.append('description', document.getElementById("descriptionedit").value);
            formData.append('status', document.getElementById("statusdeit").value);

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != " ") {
                    formData.append('receiverImage', arr[i]);
                    //  formData.append('parcelImage', arr[i]);
                }
            }
            axios.put(url, formData, {
                headers: {
                    'Authorization': result
                }
            }
            ).then(function (response) {
                console.log(response.data.message)
                location.href = "supplies.html";
            }).catch(function (res) {
                const { response } = res
                console.log(response.data.message)
            });
        });

        ////////////////  แก้ไขประกาศ
        $('#table_id8').on('click', 'i.edit_supplies', function (e) {
            e.preventDefault();
            $("#EditaddImage").empty();
            var table = $('#table_id8').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }

            $("#Editnotice").modal();

            var nn = 0;
            for (let i in data.announceImage) {
                console.log(data.announceImage[i])

                axios.get(urlipad + "view/images/" + data.announceImage[i], {
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

            for (i = 0; i < data.tag.length; i++) {
                $('#editinput-tags').tagsInput();
                $('#editinput-tags').addTag(data.tag[i]);
            }


            let date = new Date(data.showDate);
            let options = { hour12: false };
            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')

            var _d = sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]

            $("#selectdeleteedit").val(data.isRemoved);
            $("#editshowDate").val(_d.substring(0, 10));
            $("#edittxttimenotice").val(_d.substring(10, _d.length));
            // $("#edittxttimenotice").val('14:00');
            $("#edit_posttopic").val(data.topic);
            $("#edit_postdetail").val(data.detail);
            $("#edit_weblink").val(data.weblink);

        });

        /////////////////////////// อัพเดท ประกาศ
        $('#edit_submitpostinvoice').on('click', function (e) {


            var category;
            if (Cookies.get('announce') != undefined) {
                category = 'announce'
            }
            if (Cookies.get('asset') != undefined) {
                category = 'asset'
            }
            if (Cookies.get('service') != undefined) {
                category = 'service'
            }
            if (Cookies.get('business') != undefined) {
                category = 'business'
            }
            if (Cookies.get('travel') != undefined) {
                category = 'travel'
            }

            document.getElementById("edit_lbl_notice").innerText = ''
            const url = urlipad + 'announce';

            let formData = new FormData();
            var ddd = document.getElementById('editshowDate').value
            var s_time = document.getElementById('edittxttimenotice').value.replace(' ', '');
            s_time = s_time.substring(0, 5);
            document.getElementById("_id_updatedata").innerText = ''
            var timedaysshowDate;
            var strdaysshowDate;
            if (ddd == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาระบุวันที่'
                document.getElementById("_id_updatedata").style.color = 'red'
                return

            } else {
                timedaysshowDate = document.getElementById('editshowDate').value.split('/');
                // alert('ggggggggg')
                var aaa = new Date(`${timedaysshowDate[2] + '-' + timedaysshowDate[1] + '-' + timedaysshowDate[0]}T${s_time}:00`).toISOString()
                strdaysshowDate = aaa;
                //  alert(strdaysshowDate)
                //  strdaysshowDate = new Date(timedaysshowDate[2] + '-' + timedaysshowDate[1] + '-' + timedaysshowDate[0] + ' ' + s_time + ':' + '00').toISOString();
            }


            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('announceId', data.announceId);
                formData.append('announceImage', '');
                formData.append('topic', document.getElementById("edit_posttopic").value);
                formData.append('detail', document.getElementById("edit_postdetail").value);
                formData.append('weblink', document.getElementById("edit_weblink").value);
                var _sp = document.getElementById("editinput-tags").value.split(',')
                for (i = 0; i < _sp.length; i++) {
                    formData.append('tag[]', _sp[i]);
                }
                formData.append('category', category);
                formData.append('showDate', strdaysshowDate);
                var isRemoved = false;
                if (document.getElementById("selectdeleteedit").value == 'true') {
                    isRemoved = true;
                }
                formData.append('isRemoved', isRemoved);
            } else {
                formData.append('userId', userId);
                formData.append('announceId', data.announceId);
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('announceImage', arr[i]);
                    }
                }
                formData.append('topic', document.getElementById("edit_posttopic").value);
                formData.append('detail', document.getElementById("edit_postdetail").value);
                formData.append('weblink', document.getElementById("edit_weblink").value);
                var _sp = document.getElementById("editinput-tags").value.split(',')

                for (i = 0; i < _sp.length; i++) {
                    formData.append('tag[]', _sp[i]);
                }
                formData.append('category', category);
                formData.append('showDate', strdaysshowDate);
                var isRemoved = false;
                if (document.getElementById("selectdeleteedit").value == 'true') {
                    isRemoved = true;
                }
                formData.append('isRemoved', isRemoved);
            }

            axios.put(url, formData,
                {
                    headers: {
                        'Authorization': result
                    }
                }
            ).then(function (response) {
                console.log(response.data.message);
                if (response.data.message.data == 'update completed') {
                    // document.getElementById("edit_lbl_notice").innerText = 'อัพเดทข้อมูลสำเร็จ'
                    // document.getElementById("edit_lbl_notice").style.color = 'green'
                    if (category == 'announce') {
                        //   location.href = "allnotice.html";
                        showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ', 'allnotice.html');
                    }
                    if (category == 'service') {
                        //  location.href = "allservice.html";
                        showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ', 'allservice.html');
                    }
                    if (category == 'business') {
                        //  location.href = "allbusiness.html";
                        showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ', 'allbusiness.html');
                    }
                    if (category == 'asset') {
                        // location.href = "allasset.html";
                        showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ', 'allasset.html');
                    }
                    if (category == 'travel') {
                        //  location.href = "alltravel.html";
                        showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ', 'alltravel.html');
                    }
                }

            }).catch(function (res) {
                const { response } = res
                //  console.log(response.data.message)
                showCancelMessage(response.data.message, '')
                //document.getElementById("edit_lbl_notice").innerText = response.data.message
                //document.getElementById("edit_lbl_notice").style.color = 'red'
            });

        });

        ////////////////// แก้ไข member
        $('#table2').on('click', 'i.edit_member', function (e) {
            e.preventDefault();
            var table = $('#table2').DataTable();
            var _ro = table.row($(this).parents('tr'));
            var data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }
            $("#EditaddImage").empty();
            $("#myModaleditdatamember").modal();

            var nn = 0;
            for (let i in data.imageProfile) {
                console.log(data.imageProfile[i])

                axios.get(urlipad + "view/images/" + data.imageProfile[i], {
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
                    <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12"><img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" ></i></a>`);
                    arr[n] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, nn.toString() + '.jpg');
                    n = n + 1;
                });
                nn = nn + 1;
            }

            $("#editusername").val(data.username);
            $("#editphone").val(data.phone);
            $("#edithouseNo").val(data.houseNo);

            console.log(data.tag)
            $('#editinput-tags').tagsInput();
            for (i = 0; i < data.tag.length; i++) {

                $('#editinput-tags').addTag(data.tag[i]);
            }
            $("#editaddress").val(data.address);

        });

        /////////////////////////// อัพเดท USER MEMBER
        $('#UPDATEEDITMEMBER').on('click', function (e) {
            document.getElementById("update_member").innerText = ''
            const url = urlipad + 'addAccount';
            let formData = new FormData();
            console.log(arr)
            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('username', document.getElementById("editusername").value);
                formData.append('rule', 'member');
                formData.append('phone', document.getElementById("editphone").value);
                formData.append('houseNo', document.getElementById("edithouseNo").value);

                var _sp = document.getElementById("editinput-tags").value.split(',')
                for (i = 0; i < _sp.length; i++) {
                    formData.append('tag[]', _sp[i]);
                }
                formData.append('address', document.getElementById("editaddress").value);
                formData.append('editMode', true);
            } else {

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('imageProfile', arr[i]);
                    }
                }
                formData.append('userId', userId);
                formData.append('username', document.getElementById("editusername").value);
                formData.append('rule', 'member');
                formData.append('phone', document.getElementById("editphone").value);
                formData.append('houseNo', document.getElementById("edithouseNo").value);

                var _sp = document.getElementById("editinput-tags").value.split(',')
                for (i = 0; i < _sp.length; i++) {
                    formData.append('tag[]', _sp[i]);
                }
                formData.append('address', document.getElementById("editaddress").value);
                formData.append('editMode', true);
            }
            //   console.log(arr)
            axios.put(url, formData, {
                headers: {
                    'Authorization': result
                }
            }
            ).then(function (response) {
                //  console.log(response.data.message);
                if (response.data.message == 'update completed') {
                    showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ', 'visitorregisteruser.html');
                    // document.getElementById("update_member").innerText = 'อัพเดทข้อมูลสำเร็จ'
                    // document.getElementById("update_member").style.color = 'green'
                    // location.href = "visitorregisteruser.html";
                }

            }).catch(function (res) {
                const { response } = res
                //   console.log(response.data.message)
                showCancelMessage(response.data.message, '')
                // document.getElementById("update_member").innerText = response.data.message
                // document.getElementById("update_member").style.color = 'red'
            });

        });






        ////////////////////////////// แก้ไข เจ้าหน้าที่
        $('#table1').on('click', 'i.edituser', function (e) {
            e.preventDefault();
            var table = $('#table1').DataTable();
            var _ro = table.row($(this).parents('tr'));
            data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }

            $("#myModaledituser").modal();
            console.log(data)
            document.getElementById("user_edit_name").value = data._user;
            document.getElementById("ruleedit").value = data._type;

            var nn = 0;
            for (let i in data.imageProfile) {
                console.log(data.imageProfile[i])

                axios.get(urlipad + "view/images/" + data.imageProfile[i], {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    var arrayBuffer = response.data; // Note: not oReq.responseText
                    var u8 = new Uint8Array(arrayBuffer);
                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                    var mimetype = "image/png"; // or whatever your image mime type is
                    $("#EditaddImageadmin").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                    <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12"><img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" ></i></a>`);
                    arr[n] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, nn.toString() + '.jpg');
                    n = n + 1;
                });
                nn = nn + 1;
            }
        });

        /////////////////////อัพเดทข้อมูล เจ้าหน้าที่
        $('#UPDATEEDIT').on('click', async function (e) {
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);

                var formData = new FormData();
                const url = urlipaddress + 'addAccount';
                formData.append('userId', userId);
                formData.append('username', document.getElementById("user_edit_name").value);
                formData.append('rule', document.getElementById("ruleedit").value);
                formData.append('editMode', true);
                if (arr.length == 0) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] != " ") {
                            formData.append('imageProfile', arr[i]);
                        }
                    }
                } else {
                    formData.append('imageProfile', '');
                }
                axios.put(url, formData, {
                    headers: {
                        'Authorization': result,
                        'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(function (response) {
                    console.log(response.data.message)
                    if (response.data.message == "This user has already been used.") {
                        // document.getElementById("update_").innerText = "มีข้อมูลในระบบแล้ว";
                        // document.getElementById("update_").style.color = "red";
                        showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                    } else {
                        showSuccessMessageregisteruser('อัพเดทข้อมูลสำเร็จ')
                        // document.getElementById("update_").innerText = "บันทึกสำเร็จ";
                        // document.getElementById("update_").style.color = "green";
                        getUser(result);
                        //  location.href = "visitorregisteruser.html";
                    }

                }).catch(function (res) {
                    const { response } = res
                    // console.log(response.data.message)
                    if (response.data.message == 'This user has already been used.') {
                        // document.getElementById("update_").innerText = "มีข้อมูลในระบบแล้ว";
                        // document.getElementById("update_").style.color = "red";
                        showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                    }
                });


            });
        });





        //////////////////// แก้ไข service resolved
        $('#table1_resolved').on('click', 'i.edit_service', function (e) {
            e.preventDefault();
            $("#EditaddImage").empty();
            var table = $('#table1_resolved').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }

            $("#EditService").modal();
            //     console.log(_data.parcelImage)
            var nn = 0;
            for (let i in data.ticketImage) {
                axios.get(urlipad + "view/images/" + data.ticketImage[i], {
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
            <i name="${n}" class="delete_cc  fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);

                    arr[n] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, nn.toString() + '.jpg');
                    n = n + 1;
                });

                nn = nn + 1;
            }


            $("#title_edit").val(data.title);
            $("#description_edit").val(data.description);

            if (data.status == 'resolved') {

                $("#status_edit").val('Resolved');
            }

            if (data.priority == 'low') {

                $("#priority_edit").val('Low');
            }
            if (data.priority == 'medium') {

                $("#priority_edit").val('Medium');
            }
            if (data.priority == 'high') {

                $("#priority_edit").val('High');
            }

        });








        ////////////////  แก้ไขรายการค้างชำระ
        $('#table_id2').on('click', 'i.edit_invoice', function (e) {
            e.preventDefault();
            $("#EditaddImage").empty();
            var table = $('#table_id2').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }

            $("#Editnotice").modal();

            var nn = 0;
            for (let i in data.invoiceImage) {
                console.log(data.invoiceImage[i])

                axios.get(urlipad + "view/images/" + data.invoiceImage[i], {
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

            console.log(data)
            $("#ref2").val(data.ref2);
            $("#category").val(data.category);
            $("#amount").val(data.amount);


            let date = new Date(data.startDate);
            let options = { hour12: false };
            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
            var _d = sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]
            $("#startDate").val(_d.substring(0, 10));

            let d_date = new Date(data.dueDate);
            let d_options = { hour12: false };
            var d_sp = d_date.toLocaleString('en-US', d_options).replace(',', '').split('/')
            var _date = d_sp[1].padStart(2, '0') + "/" + d_sp[0].padStart(2, '0') + "/" + d_sp[2]
            $("#dueDate").val(_date.substring(0, 10));
            $("#description").val(data.description);

        });

        /////////////////////////// อัพเดท รายการค้างชำระ
        $('#edit_invoice').on('click', function (e) {
            console.log('aaaaaaaaaaaaaaaaaaa')
            const url = urlipad + 'invoice';
            let formData = new FormData();
            var d_date = document.getElementById('dueDate').value
            console.log(d_date)
            document.getElementById("_id_updatedata").innerText = ''
            var s_date;
            var str_startdate
            var str_duetdate
            if (d_date == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาระบุวันที่ครบชำระ'
                document.getElementById("_id_updatedata").style.color = 'red'
                return

            } else {
                s_date = document.getElementById('startDate').value.split('/');
                d_date = document.getElementById('dueDate').value.split('/');

                str_startdate = convertTZ(s_date[2] + '-' + s_date[1] + '-' + s_date[0], 'Asia/Bangkok').toISOString()
                str_duetdate = convertTZ(d_date[2] + '-' + d_date[1] + '-' + d_date[0], 'Asia/Bangkok').toISOString()

            }

            function convertTZ(date, tzString) {
                return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
            }

            if (document.getElementById("amount").value == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาระบุจำนวนเงิน'
                document.getElementById("_id_updatedata").style.color = 'red'
                return
            }
            if (document.getElementById("category").value == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาระบุประเภทค่าใช้จ่าย'
                document.getElementById("_id_updatedata").style.color = 'red'
                return
            }
            if (document.getElementById("ref2").value == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาระบุบ้านเลขที่'
                document.getElementById("_id_updatedata").style.color = 'red'
                return
            }

            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('invoiceId', data.invoiceId);
                formData.append('invoiceImage', '');
                formData.append('ref2', document.getElementById("ref2").value);
                formData.append('category', document.getElementById("category").value);
                formData.append('status', 'ค้างชำระ');
                formData.append('amount', document.getElementById("amount").value);
                formData.append('description', document.getElementById("description").value);
                formData.append('startDate', str_startdate);
                formData.append('dueDate', str_duetdate);

            } else {

                formData.append('userId', userId);
                formData.append('invoiceId', data.invoiceId);
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('invoiceImage', arr[i]);
                    }
                }
                formData.append('ref2', document.getElementById("ref2").value);
                formData.append('category', document.getElementById("category").value);
                formData.append('status', 'ค้างชำระ');
                formData.append('amount', document.getElementById("amount").value);
                formData.append('description', document.getElementById("description").value);
                formData.append('startDate', str_startdate);
                formData.append('dueDate', str_duetdate);

            }
            console.log(url)
            axios.put(url, formData,
                {
                    headers: {
                        'Authorization': result
                    }
                }
            ).then(function (response) {
                console.log(response.data.message.data)
                if (response.data.message.data == 'update completed') {
                    showSuccessMessage('สำเร็จ', 'ทำรายการสำเร็จ', 'allInvoice.html');
                    // document.getElementById("_id_updatedata").innerText = 'บันทึกข้อมูลสำเร็จ'
                    // document.getElementById("_id_updatedata").style.color = 'green'
                    // location.href = "allInvoice.html";
                }
            }).catch(function (res) {
                const { response } = res
                if (response.data.message == 'Please specify a announceImage.') {
                    showCancelMessage('กรุณาระบุเลือกไฟล์รูปภาพ', '')
                    // document.getElementById("_id_updatedata").innerText = 'กรุณาระบุเลือกไฟล์รูปภาพ'
                    // document.getElementById("_id_updatedata").style.color = 'red'
                    return
                } else {
                    showCancelMessage(response.data.message, '')
                }
            });
        });


        var invoiceId;
        $('#myButtonSearch').on('click', async function (e) {
            $("#EditaddImage").empty();
            console.log(document.getElementById("ref1").value)

            if (document.getElementById("ref1").value == '') {
                document.getElementById("lbl_1").innerText = 'กรุณาระบุเลขอ้างอิง ref1'
                document.getElementById("lbl_1").style.color = 'red'
                return
            }

            if (document.getElementById("ref1").value != '') {
                for (let i = 1; i < 10; i++) {
                    await getinvoice(result, i)
                }

                if (_arr.length != 0) {
                    for (let i = 0; i < _arr.length; i++) {
                        if (document.getElementById("ref1").value == _arr[i].ref1) {
                            document.getElementById("view").style.display = "block";

                            $("#ref2").val(_arr[i].ref2)
                            $("#category").val(_arr[i].category)
                            $("#amount").val(_arr[i].amount)

                            console.log(_arr[i])
                            $("#credit").val(_arr[i].credit)
                            $("#remain").val(_arr[i].remain)

                            var nn = 0;
                            for (let img in _arr[i].invoiceImage) {

                                axios.get(urlipad + "view/images/" + _arr[i].invoiceImage, {
                                    responseType: 'arraybuffer',
                                    headers: {
                                        'Authorization': result
                                    }
                                }).then(function (response) {
                                    var arrayBuffer = response.data; // Note: not oReq.responseText
                                    var u8 = new Uint8Array(arrayBuffer);
                                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                                    var mimetype = "image/png"; // or whatever your image mime type is
                                    $("#EditaddImage").append(`
                                 <img name="${nn}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);

                                });

                                nn = nn + 1;
                            }

                            let date = new Date(_arr[i].startDate);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            var _d = sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]
                            $("#startDate").val(_d.substring(0, 10));


                            let d_date = new Date(_arr[i].dueDate);
                            let d_options = { hour12: false };
                            var d_sp = d_date.toLocaleString('en-US', d_options).replace(',', '').split('/');
                            var _date = d_sp[1].padStart(2, '0') + "/" + d_sp[0].padStart(2, '0') + "/" + d_sp[2];
                            $("#dueDate").val(_date.substring(0, 10));

                            $("#description").val(_arr[i].description);
                            $("#statuspayment").val(_arr[i].status);

                            if (_arr[i].status == "ค้างชำระ") {
                                document.getElementById("statuspayment").style.color = "red";
                            } else {
                                document.getElementById("statuspayment").style.color = "green";
                            }
                            invoiceId = _arr[i].invoiceId;

                            break;
                        }
                    }
                }
            }
        });


        /////////////////////////   Payment
        $('#submitpayment').on('click', function (e) {

            //  var id = document.getElementById("paymentinvoiceid").value
            console.log(invoiceId)
            var datamember = Cookies.get('datamemberID');
            if (datamember != undefined) {
                datamember = JSON.parse(datamember)
            }

            const url = urlipad + 'pay';
            let formData = new FormData();
            var d_date = document.getElementById('creditDate').value

            document.getElementById("_id_updatedata").innerText = ''
            var str_creditDate;
            var s_time = document.getElementById('txttimepayment').value;


            if (d_date == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาระบุวันที่ครบชำระ'
                document.getElementById("_id_updatedata").style.color = 'red'
                return

            } else {
                d_date = document.getElementById('creditDate').value.split('/');
                //str_creditDate = convertTZ(d_date[2] + '-' + d_date[1] + '-' + d_date[0], 'Asia/Bangkok').toISOString()
                str_creditDate = new Date(`${d_date[2] + '-' + d_date[1] + '-' + d_date[0]}T${s_time}:00`).toISOString()

            }
            // function convertTZ(date, tzString) {
            //     return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
            // }

            if (arr.length == 0) {
                document.getElementById("_id_updatedata").innerText = 'กรุณาเลือกรูปภาพสลิป'
                document.getElementById("_id_updatedata").style.color = 'red'
                return
            }
            if (document.getElementById("via").value == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาเลือกช่องทางการชำระเงิน'
                document.getElementById("_id_updatedata").style.color = 'red'
                return
            }

            if (document.getElementById("paymentcredit").value == '') {
                document.getElementById("_id_updatedata").innerText = 'กรุณาระบุจำนวนเงินที่ชำระ'
                document.getElementById("_id_updatedata").style.color = 'red'
                return
            }
            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('invoiceId', invoiceId);
                formData.append('paymentImage', '');
                formData.append('credit', document.getElementById("paymentcredit").value);
                formData.append('via', document.getElementById("via").value);
                formData.append('payDate', str_creditDate);
                formData.append('receiveName', datamember.username);
            } else {

                formData.append('userId', userId);
                formData.append('invoiceId', invoiceId);
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('paymentImage', arr[i]);
                    }
                }
                formData.append('credit', document.getElementById("paymentcredit").value);
                formData.append('via', document.getElementById("via").value);
                formData.append('payDate', str_creditDate);
                formData.append('receiveName', datamember.username);
            }
            axios.put(url, formData,
                {
                    headers: {
                        'Authorization': result
                    }
                }
            ).then(function (response) {

                if (response.data.message.data == 'update completed') {
                    // document.getElementById("_id_updatedata").innerText = 'ชำระสำเร็จ'
                    // document.getElementById("_id_updatedata").style.color = 'green'
                    //   location.href = "payment.html";

                    showSuccessMessage('สำเร็จ', 'ทำรายการสำเร็จ', 'payment.html');
                }
            }).catch(function (res) {
                const { response } = res
                showCancelMessage(response.data.message, '')
                // if (response.data.message == 'Please specify a announceImage.') {
                //     document.getElementById("_id_updatedata").innerText = 'กรุณาระบุเลือกไฟล์รูปภาพ'
                //     document.getElementById("_id_updatedata").style.color = 'red'
                //     return
                // }
            });
        });

        function showCancelMessage(title, text) {
            swal({
                title: title,
                text: text,
                type: "error",
            }, function (isConfirm) {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            });
        }

        function showSuccessMessage(title, text, page) {
            swal({
                title: title,
                text: text,
                type: "success",
            }, function (isConfirm) {
                if (isConfirm) {
                    location.href = page;
                }
            });
        }

    });
});


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







