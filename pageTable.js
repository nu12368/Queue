
$(function () {
    $('#table1').on('page.dt', function () {

        console.log('Showing page')
        var info = $('#table1').DataTable().page.info();
        // console.log(info.length)
        //  console.log(info.page + 1)

       // ShowDataTable(info.page + 1, info.length)
    });

    $('#table1').on('length.dt', function () {
      //  console.log('Showing length entries')
        var info = $('#table1').DataTable().page.info();
        //  console.log(info.length)
        // console.log(info.page + 1)
     //   ShowDataTable(info.page + 1, info.length)
    });


    function getvisitorReport(refresh_token, _page, _limit) {

       // console.log('page' + _page + 'limit' + _limit)
        // var urlipaddress = data.substring(1, data.length - 1);
        var today = new Date();
        const _m = (today.getMonth() + 1).toString().padStart(2, '0');
        //   console.log(_m)
        const _d = (today.getDate()).toString().padStart(2, '0');
        var date = today.getFullYear().toString() + _m + _d;
        //console.log(date)

        const paramInfo = '_id=' + userId + '&_time=' + date + '&_before=true&_page=' + _page + '&_limit=' + (parseInt(_limit)) + '&_sort=-1&_type=all'
        const paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=' + (parseInt(_limit)) + '&_sort=-1&_type=all'

        var _arr = new Array();
        // console.log(refresh_token)
        return new Promise(resolve => {
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);

                // console.log(paramLog)
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseLog) {
                //    console.log('visitorLog')
                 //   console.log(responseLog.data.message.result)
                    var cnt_Log = responseLog.data.message.result.length;
                    // resolve(response.data.message.visitorType);
                    axios.get(urlipaddress + 'visitorInfo?' + paramInfo, {
                        headers: {
                            'Authorization': refresh_token
                        }
                    }).then(function (responseInfo) {

                     //   console.log('responseInfo')
                     //   console.log(responseInfo.data.message.result)

                        var cnt_Info = responseInfo.data.message.result.length;
                        // resolve(response.data.message.visitorType);

                        var n = 0;
                        var totalinfo = 0;
                        var totalLog = 0;
                        if (responseInfo.data.message.total != undefined) {
                            totalinfo = responseInfo.data.message.total
                        }

                        if (responseLog.data.message.total != undefined) {
                            totalLog = responseLog.data.message.total
                        }
                        var _total = parseInt(totalinfo) + parseInt(totalLog)
                   //     console.log(_total)

                    //    console.log(cnt_Log)
                        for (i = 0; i < cnt_Log; i++) {
                          //  console.log(n)
                            //console.log(responseLog.data.message.result[i].visitorNumber)
                            if (responseLog.data.message.result[i].visitorType == undefined && responseLog.data.message.result[i].visitorNumber == undefined) {
                                // console.log('sdsdsdsds')
                            } else {
                                _arr[n] = {
                                    visitorNumber: responseLog.data.message.result[i].visitorNumber,
                                    visitorType: responseLog.data.message.result[i].visitorType,
                                    citizenId: responseLog.data.message.result[i].citizenId,
                                    name: responseLog.data.message.result[i].name,
                                    licensePlate: responseLog.data.message.result[i].licensePlate,
                                    vehicleType: responseLog.data.message.result[i].vehicleType,
                                    contactPlace: responseLog.data.message.result[i].contactPlace,
                                    recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
                                    recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
                                    etc: responseLog.data.message.result[i].etc,
                                    image: responseLog.data.message.result[i].image1 + " " + responseLog.data.message.result[i].image2 + " " + responseLog.data.message.result[i].image3 + " " + responseLog.data.message.result[i].image4,
                                    visitorId: responseLog.data.message.result[i].visitorId,
                                    timestamp: responseLog.data.message.result[i].timestamp
                                }
                                n = n + 1
                            }
                        }
                     //   console.log(_arr)
                        // console.log(cnt_Info)

                        for (i = 0; i < cnt_Info; i++) {
                            _arr[n] = {
                                //num: num,
                                visitorNumber: responseInfo.data.message.result[i].visitorNumber,
                                visitorType: responseInfo.data.message.result[i].visitorType,
                                citizenId: responseInfo.data.message.result[i].citizenId,
                                name: responseInfo.data.message.result[i].name,
                                licensePlate: responseInfo.data.message.result[i].licensePlate,
                                vehicleType: responseInfo.data.message.result[i].vehicleType,
                                contactPlace: responseInfo.data.message.result[i].contactPlace,
                                recordTimeIn: responseInfo.data.message.result[i].recordTimeIn,
                                recordTimeOut: responseInfo.data.message.result[i].recordTimeOut,
                                etc: responseInfo.data.message.result[i].etc,
                                image: responseInfo.data.message.result[i].image1 + " " + responseInfo.data.message.result[i].image2 + " " + responseInfo.data.message.result[i].image3 + " " + responseInfo.data.message.result[i].image4,
                                visitorId: responseInfo.data.message.result[i].visitorId,
                                timestamp: responseInfo.data.message.result[i].timestamp
                            }
                            n = n + 1
                        }
                      //  console.log(_arr)
                        resolve(_arr);
                    }).catch(function (res) {
                        const { response } = res
                      //  console.log(response)
                    });

                }).catch(function (res) {
                    const { response } = res
                  //  console.log(response.data)
                });
            });
        });
    }

    function acctoken() {
        // console.log('acctoken')
        // console.log(obj.refresh_token)
        return new Promise(resolve => {
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                // console.log('aaaaaaaaaaaaaa')
                axios.post(urlipaddress + 'token', data, {
                    headers: {
                        'Authorization': obj.refresh_token
                    }
                }).then(function (response) {
                    //   console.log('bbb')
                    //  console.log(response.data.message.access_token)
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

    async function ShowDataTable(_page, _limit) {
        var c_limit;
        if (_limit == 5 && _page == 1) { //////เลือกค่าเรืิ่มต้น
            c_limit = "de";
            _limit = 10
            // console.log('sdsds')
            // console.log(_limit)
        }
       // console.log(_page, _limit)
        const result = await acctoken();
        //console.log(result)
        const responsevisitorReport = await getvisitorReport(result, _page, _limit, c_limit);



        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            // var urlipaddress = data.substring(1, data.length - 1);
            // var today = new Date();
            // const _m = (today.getMonth() + 1).toString().padStart(2, '0');
            // //   console.log(_m)
            // var date = today.getFullYear().toString() + _m + today.getDate().toString();
            // //console.log(date)

            // const paramInfo = '_id=' + userId + '&_time=' + date + '&_before=true&_page='+ _page +'&_limit='+ (parseInt(_limit)+5) +'&_sort=-1&_type=all'
            // const paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page='+ _page +'&_limit='+ (parseInt(_limit)+5) +'&_sort=-1&_type=all'

            if (c_limit == "de")/////เท่ากับค่าเริ่มต้น
            {
                _limit = 5;
            }
            //console.log(paramInfo)
          //  console.log(responsevisitorReport.length)
         //   console.log(responsevisitorReport)


            $('#table1').DataTable().destroy();
            var table = $('#table1').DataTable({
                "lengthMenu": [[5, 10, 15], [5, 10, 15]],
                "pageLength": _limit,
                "pages": _page,

                'data': [...responsevisitorReport],
                "ordering": false,
                "responsive": true,
                "autoWidth": false,
                orderCellsTop: true,
                fixedHeader: true,
                "order": [],
                columns: [
                    // { data: "num" },
                    { data: "visitorNumber" },
                    { data: "visitorType" },
                    { data: "licensePlate" },
                    { data: "contactPlace" },
                    { data: "citizenId" },
                    { data: "name" },
                    { data: "vehicleType" },
                    {
                        data: "recordTimeIn",
                        render: function (data) {
                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                return '-';
                            }
                            return sp[1] + "/" + sp[0] + "/" + sp[2];
                        }
                    },
                    {
                        data: "recordTimeOut",
                        render: function (data) {

                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                return '-';
                            }
                            return sp[1] + "/" + sp[0] + "/" + sp[2];
                        }
                    },

                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="view_visitor" style="font-size:16px;color:blue; cursor: pointer;">รูปภาพ </i>'
                    },
                    { data: "etc" },

                ],
                dom: 'lBfrtip',
                buttons: [
                    {
                        title: 'export',
                        text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                        extend: 'excel',
                        footer: false,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10]
                        }

                    }

                ],
                //////////////////// ประเภท Visitor  ไปเอามาจาก

            });

            table.buttons().container().appendTo($('#test'));
            //  table.page.len( -1 ).draw();



            $(document).ready(function () {
                $('#table1').on('click', 'i.view_visitor', function (e) {
                    var table = $('#table1').DataTable();

                    e.preventDefault();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();

                    if (data == undefined) {
                        data = table.row(this).data();
                    }
                    if (data == undefined) {
                        data = table.row(this).data();
                    }

                    var img = data.image.split(' ');
                    // console.log(img)

                    $("#myModal").modal();
                    $("#viewImage").empty();

                    for (i = 0; i < img.length; i++) {
                        // console.log(img)
                        if (img[i] != "") {
                            // http://10.0.0.205:4004/images/01122020.3b3cac40-3450-4502-9723-d0525d7c893d?width=1200&height=1200&style=rc
                            $("#viewImage").append(`<img style="width: 480px; height:320px;" src="${urlipaddress}images/${img[i] + '?watermark=true&watermarkText=WAC RESEARCH'}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);
                        }
                    }

                });
            });




            var n = 0;
            var num = 1;
            var _arr = new Array();
            // axios.get(urlipaddress + 'visitorLog?' + paramLog).then(function (responseLog) {
            //     var cnt_Log = responseLog.data.message.result.length;
            //     axios.get(urlipaddress + 'visitorInfo?' + paramInfo).then(function (responseInfo) {
            //         var cnt_Info = responseInfo.data.message.result.length;
            //         console.log('responseInfo')
            //         console.log(responseInfo.data.message.result)

            //         console.log('responseLog')
            //         console.log(responseLog.data.message.result)
            //         // console.log(urlipaddress + 'visitorInfo?' + paramInfo)

            //         for (i = 0; i < cnt_Log; i++) {
            //             if (responseLog.data.message.result[i].visitorType == undefined && responseLog.data.message.result[i].visitorNumber == undefined) {
            //             } else {
            //                 _arr[n] = {
            //                     // num: num,
            //                     visitorNumber: responseLog.data.message.result[i].visitorNumber,
            //                     visitorType: responseLog.data.message.result[i].visitorType,
            //                     citizenId: responseLog.data.message.result[i].citizenId,
            //                     name: responseLog.data.message.result[i].name,
            //                     licensePlate: responseLog.data.message.result[i].licensePlate,
            //                     vehicleType: responseLog.data.message.result[i].vehicleType,
            //                     contactPlace: responseLog.data.message.result[i].contactPlace,
            //                     recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
            //                     recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
            //                     etc: responseLog.data.message.result[i].etc,
            //                     image: responseLog.data.message.result[i].image1 + " " + responseLog.data.message.result[i].image2 + " " + responseLog.data.message.result[i].image3 + " " + responseLog.data.message.result[i].image4,
            //                     visitorId: responseLog.data.message.result[i].visitorId,
            //                     timestamp: responseLog.data.message.result[i].timestamp
            //                 }
            //                 n = n + 1
            //                 num = num + 1
            //             }
            //         }
            //         //  console.log(_arr)
            //         for (i = 0; i < cnt_Info; i++) {
            //             _arr[n] = {
            //                 //num: num,
            //                 visitorNumber: responseInfo.data.message.result[i].visitorNumber,
            //                 visitorType: responseInfo.data.message.result[i].visitorType,
            //                 citizenId: responseInfo.data.message.result[i].citizenId,
            //                 name: responseInfo.data.message.result[i].name,
            //                 licensePlate: responseInfo.data.message.result[i].licensePlate,
            //                 vehicleType: responseInfo.data.message.result[i].vehicleType,
            //                 contactPlace: responseInfo.data.message.result[i].contactPlace,
            //                 recordTimeIn: responseInfo.data.message.result[i].recordTimeIn,
            //                 recordTimeOut: responseInfo.data.message.result[i].recordTimeOut,
            //                 etc: responseInfo.data.message.result[i].etc,
            //                 image: responseInfo.data.message.result[i].image1 + " " + responseInfo.data.message.result[i].image2 + " " + responseInfo.data.message.result[i].image3 + " " + responseInfo.data.message.result[i].image4,
            //                 visitorId: responseInfo.data.message.result[i].visitorId,
            //                 timestamp: responseInfo.data.message.result[i].timestamp
            //             }
            //             n = n + 1
            //             num = num + 1
            //         }
            //         console.log(_arr)



            //     }).catch(function (res) {
            //         const { response } = res
            //     });

            // }).catch(function (res) {
            //     const { response } = res
            // });



        });

    }

});