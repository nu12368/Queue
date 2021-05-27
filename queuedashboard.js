
var obj = JSON.parse(Cookies.get('refresh_token'));
var userId = Cookies.get('dataUser');
var _objectId = Cookies.get('_objectId');
var _arr = new Array();
var n = 0;
var Str_profile;
var Str_queue;
var category_profile;


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
function getqueueview(refresh_token) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'queue/' + _objectId + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.values);
            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}
function getprofileview(refresh_token) {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'profile/' + _objectId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.values);

            }).catch(function (res) {
                const { response } = res
            });
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
                resolve(response.data.message.category);

            }).catch(function (res) {
                const { response } = res
            });
        });
    });
}

$(async function () {
    const result = await acctoken();

    const queueview = await getqueueview(result);
    const fileview = await getprofileview(result);
    const categoryview = await getcategoryview(result);

    console.log(queueview)
    console.log(fileview)
    console.log(categoryview)

    var chartcategory = new Array();
    var chartcategory_queue = new Array();
    var q_num = 0;
    for (i = 0; i < categoryview.length; i++) {  /////แผนก
        chartcategory[i] = categoryview[i].category

        for (i_q = 0; i_q < queueview.length; i_q++) {  ////คิวทั้งหมด
            console.log(queueview[i].category)
            if (queueview[i_q].category == categoryview[i].category) {
                chartcategory_queue[i] = q_num
                q_num = q_num + 1;
            }

        }
        q_num =0;

    }

    q_num = 0;
    var chartprofile = new Array();
    var chartprofile_queue = new Array();
    for (i = 0; i < fileview.length; i++) {  /////โปรไฟล์

        chartprofile[i] = fileview[i].name
       // console.log(fileview[i])

        for (i_p = 0; i_p < fileview[i].category.length; i_p++) {
          //  console.log(fileview[i].category[i_p])
            for (i_q = 0; i_q < queueview.length; i_q++) {  ////คิวทั้งหมด
               // console.log(queueview[i_q].category)
               // console.log( fileview[i].category[i_p])
               console.log(fileview[i].category[i_p])
                if (queueview[i_q].category == fileview[i].category[i_p]) {
                    chartprofile_queue[i] = q_num
                 
                    q_num = q_num + 1;
                }
            }
        }
        console.log(q_num)
        q_num = 0
    }
console.log(chartprofile_queue)

    $(function () {
        new Chart(document.getElementById("bar_queuecategory").getContext("2d"), getChartJs('bar'));
        new Chart(document.getElementById("bar_queueprofile").getContext("2d"), getChartJs('bar2'));
        // new Chart(document.getElementById("pie_chartout").getContext("2d"), getChartJs('pieOut'));
        // new Chart(document.getElementById("pie_chartbalance").getContext("2d"), getChartJs('pieBalance'));


    });
    function getChartJs(type) {
        if (type === 'line') {
            config = {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],

                    datasets: [{
                        label: "My First dataset",
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: 'rgba(0, 188, 212, 0.75)',
                        backgroundColor: 'rgba(0, 188, 212, 0.3)',
                        pointBorderColor: 'rgba(0, 188, 212, 0)',
                        pointBackgroundColor: 'rgba(0, 188, 212, 0.9)',
                        pointBorderWidth: 1
                    }, {
                        label: "My Second dataset",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        borderColor: 'rgba(233, 30, 99, 0.75)',
                        backgroundColor: 'rgba(233, 30, 99, 0.3)',
                        pointBorderColor: 'rgba(233, 30, 99, 0)',
                        pointBackgroundColor: 'rgba(233, 30, 99, 0.9)',
                        pointBorderWidth: 1
                    }

                    ]
                },
                options: {
                    responsive: true,
                    legend: false
                }
            }
        }
        else if (type === 'bar') {
            config = {
                type: 'bar',
                data: {
                    labels: chartcategory,
                    datasets: [{
                        label: 'จำนวนคิว',
                        data: chartcategory_queue,
                        backgroundColor: 'rgba(139, 195, 74)'
                    }
                    ]
                },
                options: {
                    responsive: true,
                    legend: false
                    // legend: {
                    //     // position: 'right',
                    // },
                }
            }
        }
        else if (type === 'bar2') {
            config = {
                type: 'bar',
                data: {
                    labels: chartprofile,
                    datasets: [{
                        label: "A",
                        data: [65, 59, 80, 81, 56, 55, 40],
                        backgroundColor: 'rgba(0, 188, 212, 0.8)'
                    }, {
                        label: "B",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        backgroundColor: 'rgba(233, 30, 99, 0.8)'
                    }
                        , {
                        label: "My Second dataset",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        backgroundColor: 'rgba(233, 30, 99, 0.8)'
                    }
                        , {
                        label: "My Second dataset",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        backgroundColor: 'rgba(233, 30, 99, 0.8)'
                    }
                    ]
                },
                options: {
                    responsive: true,
                    legend: false
                }
            }
            // config = {
            //     type: 'bar',
            //     data: {
            //         labels: chartprofile,
            //         datasets: [{
            //             label: 'จำนวนคิว',
            //             data: chartcategory_queue,
            //             backgroundColor: 'rgb(0, 188, 212)'
            //         }
            //         ]
            //     },
            //     options: {
            //         responsive: true,
            //         legend: {
            //             position: 'right',
            //         },
            //     }
            // }
        }
        else if (type === 'pieBalance') {
            var s = 0;
            for (i = 0; i < PicchartBalance.length; i++) {
                s += parseInt(PicchartBalance[i]) + parseInt(PicchartBalance[i])
            }
            if (s != 0) {
                config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: PicchartBalance,
                            backgroundColor: [
                                "rgb(233, 30, 99)",
                                "rgb(255, 193, 7)",
                                "rgb(0, 188, 212)",
                                "rgb(139, 195, 74)",
                                "rgb(255, 255,0 )",
                                "rgb(255, 102,102)",
                                "rgb(255, 128, 0 )",
                                "rgb(0, 0, 255)",
                                "rgb(127, 0, 255)",
                                "rgb(25,25,112)",
                                "rgb(210,105,30)"
                            ],
                        }],
                        labels: responsevisitorType,
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: 'right',
                        },

                    },

                }
            }



        }
        return config;
    }
});


