
var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'token', data, {
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

$(async function () {
    const result = await acctoken();
    $(document).ready(function () {
        $('#logout').on('click', function (e) {
            console.log('dsd')
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                const databody = {
                    refresh_token: obj.refresh_token
                }
                axios.post(urlipaddress + 'logout', databody, {
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    if (response.data.message == "success") {
                        location.href = "index.html";
                    }
                }).catch(function (res) {
                    const { response } = res
                });
            });
        });
    });
});