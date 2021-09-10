
var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
var Str_profile;
var arr_queue = new Array();
var Str_queue;
var category_profile;
var queue_num = 0;
console.log(obj)
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
                    //  location.href = "index.html";
                    return;
                }

            });
        });
    });
}

const queueloop = async (refresh_token, _page) => {
    console.log('ffffffffffffffff')
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
        axios.get(urlipaddress + 'queue/' + _objectId + '?_page=' + _page + '&_limit=10&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function (response) {
            console.log(response.data.message.values)
            $("#table_view").empty();
            var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
            var _num = 0;
            $("#table_view").empty();
            if (response.data.message.values.length != 0) {
                Str_queue = JSON.stringify(response.data.message.values)

                if (category_profile != undefined) {
                    queueprofileview(category_profile)
                    return;
                }
                $("#table_view").empty();
                var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
                var _num = 0;

                $("#table_view").append(`
                <thead>
                <tr>
                    <th style="font-size: 36px;">หมายเลข</th>
                    <th style="font-size: 36px;">ช่องบริการ</th>
                </tr>
            </thead>
            `);

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
                 
                    $("#table_view").append(`
                        <tr>
                            <td>
                                <div class="info-box ${_collor[_num]} 
                                 hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid;">
                                 <div class="content">
                                        <div style="font-size: 36px;" >${response.data.message.values[i].cue}</div>
                                    </div>
                                </div>
                             </td>
                            <td>
                                <div class="info-box ${_collor[_num]}
                              hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid; ">
                                    <div class="content">
                                        <div style="font-size: 36px;">${response.data.message.values[i].serviceChannel}</div>
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
            }
            
        });
    });

}


const getqueueview = async (refresh_token) => {
    var today = new Date();
    var n_date = today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    chk_date = chk_date[0].split('/')
    var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]
    //function getqueueview(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=10&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function (response) {
            console.log(response.data.message.values)
            $("#table_view").empty();
            if (response.data.message.values.length != 0) {
                Str_queue = JSON.stringify(response.data.message.values)

                if (category_profile != undefined) {
                    queueprofileview(category_profile)
                    return;
                }
                $("#table_view").empty();
                var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
                var _num = 0;

                $("#table_view").append(`
                <thead>
                <tr>
                    <th style="font-size: 36px;">หมายเลข</th>
                    <th style="font-size: 36px;">ช่องบริการ</th>
                </tr>
            </thead>
            `);

            var _page = 1;
            var totle = response.data.message.total
            var looptotle = Math.ceil(totle / 10)
            if (looptotle > 1) { ///// คิวมากกว่า loop 100
                for (i = 0; i < looptotle; i++) {
                    await queueloop(refresh_token, _page)
                    _page = _page + 1
                }
            }else{
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
                        $("#table_view").append(`
                        <tr>
                            <td>
                                <div class="info-box ${_collor[_num]} 
                                 hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid;">
                                 <div class="content">
                                        <div style="font-size: 36px;" >${response.data.message.values[i].cue}</div>
                                    </div>
                                </div>
                             </td>
                            <td>
                                <div class="info-box ${_collor[_num]}
                              hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid; ">
                                    <div class="content">
                                        <div style="font-size: 36px;">${response.data.message.values[i].serviceChannel}</div>
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
            }
            }
        }).catch(function (res) {
            const { response } = res
        });
    });
}
function getvdoview(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        axios.get(urlipaddress + 'videoUrl/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values.videoUrl)

            var n = 0;
            var _arr = new Array();
            _arr[n] = {
                videoUrl: response.data.message.values.videoUrl,
            }

            const url = response.data.message.values.videoUrl;
            const v = new URL(url).searchParams.get('v');
            $("#view_video").empty();
            $("#view_video").append(`<iframe
                  width="100%" height="390"  
                  src="https://www.youtube.com/embed/${v}?feature=oembed&autoplay=1&mute=1&loop=1&playlist=${v}" 
                  allowfullscreen></iframe>`);
            //mute=1 ปิดเสียง
        }).catch(function (res) {
            const { response } = res
        });
    });
}

function getprofileview(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        axios.get(urlipaddress + 'profile/' + _objectId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values)
            Str_profile = JSON.stringify(response.data.message.values)
            var cnt = response.data.message.values.length;
            var n = 0;
            var num = 1;
            var _arr = new Array();
            $("#ul_profile").append(`<li><a style="cursor: pointer;" data-close="true">โปรไฟล์</a>
            </li>`);
            for (i = 0; i < cnt; i++) {
                _arr[n] = {
                    _num: num,
                    name: response.data.message.values[i].name,
                    category: response.data.message.values[i].category,
                }
                num++
                n = n + 1
                $("#ul_profile").append(`<li id='${JSON.stringify(response.data.message.values[i])}' name='${response.data.message.values[i].category}'><a style="cursor: pointer;" data-close="true">${response.data.message.values[i].name}</a>
                </li>`);
            }


            // var $select = $('#select_view');
            // $select.find('option').remove();
            // $select.append('<option value=' + '0' + '>' + '-- เลือกแผนก --' + '</option>');
            // $.each(_arr, function (key, value) {
            //     console.log(_arr)
            //     $select.append('<option value=' + response.data.message.values[i].category + '>' + response.data.message.values[i].category + '</option>');
            // });
        }).catch(function (res) {
            const { response } = res
        });
    });
}

function Getqueueprofileview(category_profile, refresh_token) {

    var today = new Date();
    var n_date = today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    chk_date = chk_date[0].split('/')
    var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]


    var profile_select = JSON.parse(category_profile)
    console.log(profile_select)
    var prm = '';
    for (i = 0; i < profile_select.category.length; i++) {
        prm += 'category=' + profile_select.category[i] + '&'
    }

    console.log(prm)

    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

      //  console.log(urlipaddress + 'queue/' + _objectId + '?' + prm + '_page=1&_limit=10&_sort=1')

        axios.get(urlipaddress + 'queue/' + _objectId + '?' + prm + '_page=1&_limit=10&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.values)

            $("#table_view").empty();
            if (response.data.message.values.length != 0) {

                $("#table_view").empty();
                var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
                var _num = 0;

                $("#table_view").append(`
                <thead>
                <tr>
                    <th style="font-size: 36px;">หมายเลข</th>
                    <th style="font-size: 36px;">ช่องบริการ</th>
                </tr>
            </thead>
            `);

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
                        $("#table_view").append(`
                        <tr>
                            <td>
                                <div class="info-box ${_collor[_num]} 
                                 hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid;">
                                 <div class="content">
                                        <div style="font-size: 36px;" >${response.data.message.values[i].cue}</div>
                                    </div>
                                </div>
                             </td>
                            <td>
                                <div class="info-box ${_collor[_num]}
                              hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid; ">
                                    <div class="content">
                                        <div style="font-size: 36px;">${response.data.message.values[i].serviceChannel}</div>
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
            }


        }).catch(function (res) {
            const { response } = res
        });
    });

}
$(async function () {
    const result = await acctoken();


    await getqueueview(result);
    getvdoview(result);
    getprofileview(result);

});
$(document).ready(async function () {
    $('#ul_profile').on('click', 'li', async function (e) {
        category_profile = $(this).attr("id");
        if (category_profile != undefined) {
            category_profile = JSON.parse(category_profile)
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                const socket = io(urlipaddress);
                socket.emit('sentProfile', category_profile.name);
            });
            const result = await acctoken();
            category_profile = JSON.stringify(category_profile)
            console.log(category_profile)

            Getqueueprofileview(category_profile, result)
        }
    });
});

function queueprofileview(category_profile) {
    var profile_select = JSON.parse(category_profile)
    var _profile = JSON.parse(Str_profile)

    var _queue = JSON.parse(Str_queue)

    // console.log(profile_select)
    // console.log(_profile)
    // console.log(_queue)

    var today = new Date();
    var n_date = today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    chk_date = chk_date[0].split('/')
    var datenew = chk_date[2] + '/' + chk_date[0] + '/' + chk_date[1]




    /////////////////  filter arrar
    const profileSelectResult = _profile
        ? _profile.filter((val) => {
            if (val.name === profile_select.name) {
                return true;
            }
            return false;
        })
        : [];
    const dataResult = profileSelectResult.length
        ? _queue.filter((val) => {
            for (let key in profileSelectResult[0].category) {
                if (val.category === profileSelectResult[0].category[key]) {
                    return true;
                }
            }
            return false;
        })
        : _queue;
    console.log(dataResult)
    $("#table_view").empty();
    var _collor = ["bg-red", "bg-pink", "bg-blue", "bg-amber", "bg-orange", "bg-teal", "bg-green", "bg-purple"];
    var _num = 0;

    $("#table_view").append(`
            <thead>
            <tr>
                <th style="font-size: 36px;">หมายเลข</th>
                <th style="font-size: 36px;">ช่องบริการ</th>
            </tr>
        </thead>
        `);
    for (i = 0; i < dataResult.length; i++) {
        let date = new Date(dataResult[i].timeAdd);
        let options = { hour12: false };
        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
        var s_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
        s_date = s_date.split(' ')
        s_date = s_date[0].split('/')
        var _date = s_date[2] + '/' + s_date[0] + '/' + s_date[1]
        var _checkdate = dayjs(datenew).isSame(_date)
     
        if (_checkdate == true) {

            $("#table_view").append(`
            <tr>
                <td>
                    <div class="info-box ${_collor[_num]} 
                     hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid;">
                     <div class="content">
                            <div style="font-size: 36px;" >${dataResult[i].cue}</div>
                        </div>
                    </div>
                 </td>
                <td>
                    <div class="info-box ${_collor[_num]}
                  hover-expand-effect" style="cursor:pointer; border-radius: 25px; border: 2px solid; ">
                        <div class="content">
                            <div style="font-size: 36px;">${dataResult[i].serviceChannel}</div>
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
}

$.getScript("ip.js", async function (data, textStatus, jqxhr) {
    var urlipaddress = data.substring(1, data.length - 1);
    const socket = io(urlipaddress);
    const result = await acctoken();

    socket.on('newProfile', async function (data) {
        if (category_profile != undefined) {
            Getqueueprofileview(category_profile)
        }
    });
    socket.on('addQueue', async function (data) {
        console.log(data)
        if (category_profile != undefined) {
            await getqueueview(result);
        } else {
            await getqueueview(result);
        }
    });
    socket.on('sentServiceChannel', async function (data) {
        console.log(data)
        if (category_profile != undefined) {
            await getqueueview(result);
        } else {
            await getqueueview(result);
        }

    });
    socket.on('sentEndQueue', async function (data) {

        if (category_profile != undefined) {
            await getqueueview(result);
        } else {
            await getqueueview(result);
        }

    });
    socket.on('sentVideoUrl', async function (data) {
        await getvdoview(result);
    });
    socket.on('voicePlay', function (data) {
        const { _id } = data;
        const { cue, serviceChannel, specialVoice, isTTS } = data.voiceData;
        let url;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            if (specialVoice) {
                url = `${urlipaddress}voice/${_id}/${cue}/${serviceChannel}/${specialVoice}`;
            } else {
                url = `${urlipaddress}voice/${_id}/${cue}/${serviceChannel}`;
            }
            $("#audio_play").append(`<source src="${url}" type="audio/mpeg">`);

        });
    });
    socket.on('voicePlay2', function (data) {
        const { _id } = data;
        const { cue, serviceChannel, specialVoice, isTTS } = data.voiceData;
        let url;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            if (specialVoice) {
                url = `${urlipaddress}voice/${_id}/${cue}/${serviceChannel}/${specialVoice}`;
            } else {
                url = `${urlipaddress}voice/${_id}/${cue}/${serviceChannel}`;
            }
            $("#audio_play").append(`<source src="${url}" type="audio/mpeg">`);

        });
    });
});
