
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

const getqueueview = async (refresh_token) => {

    //function getqueueview(refresh_token) {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        axios.get(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=10&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
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

                for (i = 0; i < response.data.message.values.length; i++) {
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
    var profile_select = JSON.parse(category_profile)
    console.log(profile_select)
    var prm = '';
    for (i = 0; i < profile_select.category.length; i++) {
        prm += 'category=' + profile_select.category[i] + '&'
    }

    console.log(prm)

    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        //console.log(urlipaddress + 'queue/' + _objectId + '? '+ prm +'_page=1&_limit=10&_sort=1')

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


        }).catch(function (res) {
            const { response } = res
        });
    });

}
$(async function () {
    const result = await acctoken();


    getqueueview(result);
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

$.getScript("ip.js", async function (data, textStatus, jqxhr) {
    var urlipaddress = data.substring(1, data.length - 1);
    const socket = io(urlipaddress);
    const result = await acctoken();

    socket.on('newProfile', async function (data) {
        if (category_profile != undefined) {
            Getqueueprofileview(category_profile)
        }
    });
    socket.on('sentServiceChannel', async function (data) {

        if (category_profile != undefined) {
            getqueueview(result);
        } else {
            getqueueview(result);
        }

    });
    socket.on('sentEndQueue', async function (data) {

        if (category_profile != undefined) {
            getqueueview(result);
        } else {
            getqueueview(result);
        }

    });
    socket.on('sentVideoUrl', async function (data) {
        getvdoview(result);
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
