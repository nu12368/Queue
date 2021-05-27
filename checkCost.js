


$(function () {
    if (Cookies.get('activeMode') == 'คิดเงิน') {
        $("#lll").addClass('intro'); //// คิดเงิน
        $("#ll").addClass('intro'); ///// รายงานการคิดเงิน
        $("#l1").addClass('intro');  /// ประเภท visittor
        $("#l8").addClass('intro'); /// ชนิดรถ
        $("#l9").addClass('intro');  /// เพิ่มผู้ใช้งาน

        $("#l3").addClass('intro');  ///สถานที่ติดต่อ
        $("#l2").addClass('intro');  /// ทะเบียนรถ
    } else {
        $("#l1").addClass('intro');  /// ประเภท visittor
        $("#l2").addClass('intro');  /// ทะเบียนรถ
        $("#l3").addClass('intro');  ///สถานที่ติดต่อ
        $("#l4").addClass('intro');  /// ติดต่อเรื่อง
        $("#l5").addClass('intro');  /// บริษัท
        $("#l6").addClass('intro');  /// แผนกที่ติดต่อ
        $("#l7").addClass('intro');  /// ผู้รับการติดต่อ
        $("#l8").addClass('intro');  /// ชนิดรถ
        $("#l9").addClass('intro');  /// เพิ่มผู้ใช้งาน

    }

    //////////////// ลูกบ้านนัดหมาย
    if (Cookies.get('userappontment') == 'userappontment') {
        $("#l10").addClass('intro'); // นัดหมาย.
        $("#l11").addClass('intro'); // ประวัตินัดหมาย เห็นเฉพราะลูกบ้านคนนั้น
        $("#l01").addClass('intronone');
        $("#l02").addClass('intronone');
        $("#l03").addClass('intronone');
        $("#l04").addClass('intronone');
        $("#ll").addClass('intronone');
        // $("#l11").addClass('intronone');
        $("#logonamehome").addClass('intro');
        $("#l12").addClass('intro'); //  แดชบอร์ด SERVICE
        $("#l13").addClass('intro');
        $("#l14").addClass('intro'); //บริการ
        $("#l15").addClass('intro');  // ข้อมูลธุรกิจ
        $("#l16").addClass('intro'); //รายการร้องเรียน
        $("#l17").addClass('intro'); //ประกาศ
        $("#logonameservice").addClass('intro');
        $("#logoname").addClass('intronone');

        $("#l18").addClass('intronone'); /////รายชื่อลงทะเบียน
        $("#l19").addClass('intronone'); ///ลงทะเบียน
        $("#supplies").addClass('intro');
        $("#menusupplies").addClass('intronone');
        $("#add").addClass('intronone');
        $("#nameservice").addClass('intro');
        $("#id_notice").addClass('intronone');
        $("#edit_image").addClass('intro');
        $("#navbaradmin").addClass('intro');
        $("#status_edit").addClass('intronone');
        $("#status_edit_h").addClass('intronone');
        $("#asset").addClass('intronone');

        $("#allpayment").addClass('intro');
        $("#logonamepayment").addClass('intronone');
        $("#memberasset").addClass('intronone');
        // $("#namecompynyservicedashboard").addClass('intro');
        $("#namecompyny").addClass('intronone');
        $("#d001supplies").addClass('intro');


    } else {

        //$("#imageProfile").addClass('intronone');
        $("#l12").addClass('intronone'); //  แดชบอร์ด SERVICE
        $("#l13").addClass('intronone');
        $("#l14").addClass('intronone'); //บริการ
        $("#l15").addClass('intronone');  // ข้อมูลธุรกิจ
        $("#l15-1").addClass('intronone');  // 
        $("#l15-2").addClass('intronone');  // 

        $("#l16").addClass('intronone'); //รายการร้องเรียน
        $("#logonamevisitor").addClass('intro');
        $("#logonamenews").addClass('intro');
        $("#supplies").addClass('intro');
        $("#didhouseNo").addClass('intro');
        $("#didphone").addClass('intro');

        $("#logonamevisitordashboard").addClass('intro');

        $("#add_appeal").addClass('intronone');

        $("#asset").addClass('intro');
        $('#title_edit').attr('readonly', true);
        //$('#priority_edit').attr('readonly', true);
        // $('#priority_edit').prop('readonly', true);
        $('#priority_edit').attr("disabled", true);


        $("#paymentdashboard").addClass('intro');
        $("#invoice").addClass('intro');
        $("#allInvoice").addClass('intro');
        $("#allpayment").addClass('intro');
        $("#payment").addClass('intro');
        $("#category").addClass('intro');
        $("#licategory").addClass('intro');
        $("#dashboardallpayment").addClass('intronone');

        $("#dashboardappointment").addClass('intronone');
        $("#dashboardreportappointment").addClass('intronone');
        $("#namecompynymember").addClass('intronone');

    }

    if (Cookies.get('visitor') == 'visitor') {
        $("#l10").addClass('intro'); // นัดหมาย
        $("#l17").addClass('intronone');
        $("#l18").addClass('intro'); /////รายชื่อลงทะเบียน
        $("#l19").addClass('intro'); ///

        $("#supplies").addClass('intronone');
        $("#allpayment").addClass('intronone');
        $("#alltravel").addClass('intronone');
        $("#allmarket").addClass('intronone');
    }

    ///news 
    if (Cookies.get('allnotice') == 'allnotice') {
        $("#l12").addClass('intronone'); //  แดชบอร์ด SERVICE
        $("#l13").addClass('intronone');
        $("#l14").addClass('intronone'); //บริการ
        $("#l15").addClass('intronone');  // ข้อมูลธุรกิจ
        $("#l16").addClass('intronone'); //รายการร้องเรียน
        $("#l15-1").addClass('intronone');  // 
        $("#l15-2").addClass('intronone');  // 
        $("#allInvoice").addClass('intronone');
        $("#supplies").addClass('intronone');
        $("#alltravel").addClass('intronone');
        $("#allpayment").addClass('intronone');
        $("#allmarket").addClass('intronone');
    }
    //servicedashboard
    if (Cookies.get('service') == 'service') {
        $("#allInvoice").addClass('intronone');
        $("#d001").addClass('intronone');

        //////////////// ลูกบ้านนัดหมาย
        if (Cookies.get('userappontment') == 'userappontment') {
            $("#d001supplies").addClass('intro');
        } else {
            $("#d001supplies").addClass('intronone');
        }


    }


    //////////////////// serviceAdmin
    if (Cookies.get('serviceadmin') == 'serviceadmin') {
        // 
        $("#allmarket").addClass('intronone');
        $("#allnotice").addClass('intronone');
        if (Cookies.get('suppliesview') == 'suppliesview') {
            $("#supplies").addClass('intro');
            $("#allpayment").addClass('intronone');
            $("#alltravel").addClass('intronone');
            $("#allmarket").addClass('intronone');
        } else {
            $("#supplies").addClass('intronone');
            console.log(Cookies.get('serviceadmin'))
            console.log(Cookies.get('payment'))
            $("#allpayment").addClass('intronone');


        }
    }

    /////////////// พัสดุ
    if (Cookies.get('suppliesview') == 'suppliesview') {
        $("#supplies").addClass('intro');
        $("#allpayment").addClass('intronone');
        $("#alltravel").addClass('intronone');
        $("#allmarket").addClass('intronone');


    }

    //payment
    if (Cookies.get('payment') == 'payment') {
        $("#allInvoice").addClass('intro');
        $("#alltravel").addClass('intronone');
        $("#supplies").addClass('intronone');
        $("#allmarket").addClass('intronone');

    }



});