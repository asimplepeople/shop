document.onreadystatechange = setAlertTitle;

var apiInstance;
var fileData;
var ocrCapture;

var DATA_CANNOT_PARSED = '10003'; //输入数据项无法解析
var SERVICE_SYSTEM_EXCEPTION = '10011'; //服务系统异常错误
var RECOGNITION_RESULT_EMPTY = '10100'; //识别结果为空
var CONNECTION_SERVICE_TIMEOUT = '10101'; //连接识别服务超时
var CONNECTION_RECOGNITION_EXCEPTION = '10102'; //连接识别服务异常
var SUCCESS = '0'; //识别成功
var RECOGNITION_FALSE = '-1';//识别错误
var RESULT_OK = 0; //操作成功
var CALLBACK_TYPE_SIGNATURE = 10; //签名框点击确认之后的回调，回调中包含签名快照
var CALLBACK_TYPE_DIALOG_CANCEL = 11; //点击签名框"取消"按钮时的回调，同时也会触发dismiss回调
var CALLBACK_TYPE_COMMENTSIGN = 12; //批注签名框点击确认之后的回调，回调中包含签名快照
var CALLBACK_TYPE_GETVERSION = 13; //获得版本号

var RESULT_ERROR = -1; //操作失败
var EC_API_NOT_INITED = 1; //接口未初始化错误
//var CALLBACK_TYPE_START_RECORDING = 14;
//var CALLBACK_TYPE_STOP_RECORDING = 15;

function setAlertTitle()
{
    document.title = '返回结果';
}


//配置模板数据
//此为PDF/HTML/XML模板签名设置待签数据
//PDF/HTML/XML模板签名和数据签名只能设置一个
//使用PDF/HTML/XML模板签名要调用"生成PDF上传数据"的接口
function testSetTemplateData(formData)
{

    // var formData = "{\"bjcaxssrequest\":{\"submitinfo\":[{\"username\":\"测星雨\",\"identitycardnbr\":\"320902198901191012\"},{\"username\":\"测星雨123\",\"identitycardnbr\": \"320902198901191012\"}]}}";

    // var formData = '';
    //文件数据
    //var formData = fileData;
    var businessId = '123123';//集成信手书业务的唯一标识
    var template_serial = '4000';//用于生成PDF的模板ID
    var res;

    //配置JSON格式签名原文
    /**
     * 设置表单数据，每次业务都需要set一次
     * @param template_type 签名所用的模板类型
     * @param contentUtf8Str 表单数据，类型为Utf8字符串
     * @param businessId 业务工单号
     * @param template_serial 模板序列号
     * @returns {*} 是否设置成功
     */
    res = apiInstance.setTemplate(TemplateType.PDF,formData,businessId,template_serial);

    if (res){
        // alert("setTemplateData success");
        return res;
    } else {
        alert('setTemplateData error');
        return res;
    }
}

//配置签名数据
//此为数据签名设置待签数据接口
//PDF/HTML/XML模板签名和数据签名只能设置一个
//使用数据签名要调用"生成文本上传数据"的接口
function testSetOrgData()
{
    /**
     * 设置表单数据，每次业务都需要set一次
     * @param template_type 签名所用的模板id, 即context id
     * @param orgData 表单数据，类型为Utf8字符串，传入原文即可
     * @returns {*} 是否设置成功
     */

    var orgData = 'ziyunb';
    res = apiInstance.setOrgData(TemplateType.TEXT,orgData);

    if (res){
        alert('setOrgData success');
        return res;
    } else {
        alert('setOrgData error');
        return res;
    }
}

//选择文件
function handleFiles(files){
    if (files.length){
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function FileReaderOnload() {
            var buffer = reader.result;
            var uint8Array = new Uint8Array(reader.result);
            var bufStr = '';
            var bufarray = Base64.encodeUint8Array(uint8Array);
            bufStr = bufarray;
            fileData = bufStr;
        };
        reader.readAsArrayBuffer(file);
    }
}

//添加单签签名框
function testAddSignatureObj(objId, signer, initData)
{
    var context_id = objId;

    /**
     *根据关键字定位签名位置
     * @param keyWord 关键字字面值
     * @param xOffset X轴偏移量，适配关键字和规则
     * @param yOffset Y轴偏移量，适配关键字和规则
     * @param pageNo 全文第几个关键字，0为全部关键字都签，负数为从后往前数
     * @param KWIndex 与pageNo相同，为全文第几个关键字，0为全部关键字都签，负数为从后往前数
     * @constructor
     */
    //注：SignRule_KeyWord建议客户不要再使用，使用SignRule_KeyWordV2
    var signerRule
    if (initData.isKeyWord) {
        signerRule = new SignRule_KeyWordV2(initData.keyWord, 10, 1, 0, 0);
    } else {
        signerRule = new SignRule_XYZ(...initData.xyz);
    }

    var signatureConfig = new SignatureConfig(signer,signerRule);
    //1:时间在上、2：时间在下、3：时间在右
    var timeTag = new TimeTag(1,'yyMMdd hh:mm:ss');
    signatureConfig.timeTag = timeTag;
    signatureConfig.singleWidth = 80;
    signatureConfig.singleHeight = 80;
    signatureConfig.title = '请投保人李明签字';
    signatureConfig.penColor = '#FF0000';
    signatureConfig.signature_stroke_width = 12;//签名笔划粗细
    signatureConfig.isTSS = true;//是否开始时间戳服务
    signatureConfig.signatureImgRatio = 1.0;//签名图片清晰度
    signatureConfig.nessesary = false;
    signatureConfig.isdistinguish = false;
    signatureConfig.signature_max_times = 2;//手写识别最大次数，取值1-99，默认为3
    signatureConfig.ocrCapture = ocrCapture;
    signatureConfig.isShowBgText = true;
    var res = apiInstance.addSignatureObj(context_id,signatureConfig);
    if (res){
        // alert("addSignatureObj "+context_id+" success");
        return res;
    } else {
        alert('addSignatureObj '+context_id+' error');
        return res;
    }
}


//添加批签签名框
function testAddCommentObj(objId, signer, initData)
{
    var context_id = objId;

    /**
     * 根据坐标定位签名方式
     * @param left 签名图片最左边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
     * @param top 签名图片顶边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
     * @param right 签名图片最右边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
     * @param bottom 签名图片底边坐标值，相对于PDF当页最左下角(0,0)点，向上和向右分别为X轴、Y轴正方向
     * @param pageNo 签名在PDF中的页码，从1开始
     * @param unit 坐标系单位，目前支持"dp"和"pt"
     * @constructor
     */
    var signerRule
    if (initData.isKeyWord) {
        signerRule = new SignRule_KeyWordV2(initData.keyWord, 10, 1, 0, 0);
    } else {
        signerRule = new SignRule_XYZ(...initData.xyz);
    }

    var commentConfig = new CommentConfig(signer,signerRule);
    commentConfig.commitment = '本人已阅';
    commentConfig.mass_word_height = 50;
    commentConfig.mass_word_width = 50;
    commentConfig.mass_words_in_single_line = 3;
    commentConfig.penColor = '#FF0000';
    commentConfig.comment_stroke_width = 8;//批注笔划粗细
    commentConfig.commentImgRatio = 3.0;//批注图片清晰度
    commentConfig.nessesary = false;
    commentConfig.isdistinguish = false;
    commentConfig.comment_max_times = 2;//手写识别最大次数，取值1-99，默认为3
    commentConfig.ocrCapture = ocrCapture;
    commentConfig.mass_dlg_type = CommentInputType.WhiteBoard;
    var res = apiInstance.addCommentObj(context_id,commentConfig);
    if (res){
        // alert("addCommentObj "+context_id+" success");
        return res;
    } else {
        alert('addCommentObj '+context_id+' error');
        return res;
    }
}


//demo总入口
function testAnySign(channel, initData)
{
    var res;

    //识别回调接口
    var identify_callback = function(errCode){
        if (errCode == SUCCESS){
            return;
        }
        if (errCode == DATA_CANNOT_PARSED) {
            alert('输入数据项无法解析！');
        } else if (errCode == SERVICE_SYSTEM_EXCEPTION) {
            alert('服务系统异常错误！');
        } else if (errCode == RECOGNITION_RESULT_EMPTY) {
            alert('识别结果为空！');
        } else if (errCode == CONNECTION_SERVICE_TIMEOUT) {
            alert('连接识别服务超时！');
        } else if (errCode == CONNECTION_RECOGNITION_EXCEPTION) {
            alert('连接识别服务异常！');
        } else if (errCode == RECOGNITION_FALSE) {
            alert('书写错误！');
        } else {
            alert(errCode);
        }
    };

    var callback = function(context_id,context_type,val){
        document.getElementById('other').style.display = 'block';
        if (context_type == CALLBACK_TYPE_SIGNATURE){
            //签名回显
            document.getElementById('xss_20').src = 'data:image/png;base64,' + val;
            var aImg=document.getElementById('xss_20');
            for (var i=0;i<aImg.length;i++){
                aImg[i].style.height='1500';
                aImg[i].style.width='1500';
            }
        } else if (context_type == CALLBACK_TYPE_COMMENTSIGN){
            //签名回显
            document.getElementById('xss_21').src = 'data:image/png;base64,' + val;
            var aImg=document.getElementById('xss_21');
            for (var i=0;i<aImg.length;i++){
                aImg[i].style.height='250';
                aImg[i].style.width='250';
            }
        }
        setAlertTitle();
        // alert("收到浏览器回调：" + "context_id：" + context_id + " context_type：" + context_type + " value：" + val);
    };//测试回调，将回调数据显示

    ////////////////////////////////////////////////

    //设置签名算法，默认为RSA，可以设置成SM2
    EncAlgType.EncAlg = 'RSA';

    apiInstance = new AnySignApi();
    //var channel = "10010";//渠道号，由信手书提供，请咨询项目经理
    //初始化签名接口
    res = apiInstance.initAnySignApi(callback,channel);

    if (!res){
        alert('init error');
    } else {

    }
    ////////////////////////////////////////////////

    //开启识别
    ocrCapture = new OCRCapture();
    ocrCapture.text = 'a';
    ocrCapture.IPAdress = 'http://223.70.139.221:11204/HWRV2/RecvServlet';
    // ocrCapture.IPAdress = "http://192.168.126.32:11204/HWRV2/RecvServlet";
    ocrCapture.appID = '123';
    ocrCapture.count = 5;
    ocrCapture.language = Language.CHS;
    ocrCapture.resolution = 80;
    ocrCapture.serviceID = '999999';

    setIdentifyCallBack(identify_callback);

    ///////////////////////////////////////////////

    //注册一个单位签章
    var signer = new Signer(initData.name, initData.IDNumber);
    //注册单字签字对象20
    res = testAddSignatureObj(20, signer, initData);
    if (!res){
        alert('testAddSignatureObj error');
        return;
    } else {

    }

    res = testAddSignatureObj(21, signer, initData);
    if (!res){
        alert('testAddSignatureObj error');
        return;
    } else {

    }

    res = testAddCommentObj(30, signer, initData);
    if (!res){
        alert('testAddCommentObj error');
        return;
    } else {

    }

    ////////////////////////////////////////////////
    /**
     * 使用服务器规则配置签名
     * @param tid 服务器端生成的配置规则
     * @constructor
     */
    /*var signerRule = new SignRule_Tid("111");
    var cachet_config = new CachetConfig(signer, signerRule, false);

    res = apiInstance.addCachetObj(cachet_config);

    if(!res){
       alert("addCachetObj error");
    }else{

    }*/

    //将配置提交
    res = apiInstance.commitConfig();

    if (res){
        // alert("Init ALL 提交配置成功");
    } else {
        alert('Init ALL 提交配置失败');
    }

    ////////////////////////////////////////////////

}

function testSignatureStatus()
{
    alert('getSignatureStatus :' + apiInstance.getSignatureStatus());
}

function testCommentStatus()
{
    alert('getCommentStatus :' + apiInstance.getCommentStatus());
}

function testIsReadyToUpload()
{
    alert('testIsReadyToUpload :' + apiInstance.isReadyToUpload());
}

//生成签名加密数据
//此为使用PDF/HTML/XML模板签名时所用，在数据签名时无效
function testGenData(callback)
{
    var res = document.getElementById('result');
    try
    {
        res.value = apiInstance.getUploadDataGram();
        callback(JSON.parse(res.value))
    }
    catch (err)
    {
        alert(err);
    }
}

//生成签名加密数据
//此为使用数据签名时所用，在PDF/HTML/XML模板签名时无效
function testTextGenData(callback)
{
    var res = document.getElementById('result');
    try
    {
        res.value = apiInstance.getUploadDataGramForText();
        callback(JSON.parse(res.value))
    }
    catch (err)
    {
        alert(err);
    }
}

//弹出签名框签名
function testPopupDialog(context_id)
{
    if (!apiInstance){
        alert('信手书接口没有初始化');
        return;
    }
    if (context_id == 21){
        switch (apiInstance.showSingleSignDialog(context_id)){
            case RESULT_OK:
                document.getElementById('other').style.display = 'none';
                break;
            case EC_API_NOT_INITED:
                alert('信手书接口没有初始化');
                break;
            case EC_WRONG_CONTEXT_ID:
                alert('没有配置相应context_id的签字对象');
                break;
        }
    } else if (context_id == 20){
        switch (apiInstance.showSignatureDialog(context_id)){
            case RESULT_OK:
                // 强制横屏时请加入以下代码
                // use_landscape = true;
                // resize()
                // $("body").addClass("body")
                // $("#anysignCanvas").addClass("canvas");
                // 强制横屏结束
                document.getElementById('other').style.display = 'none';
                break;
            case EC_API_NOT_INITED:
                alert('信手书接口没有初始化');
                break;
            case EC_WRONG_CONTEXT_ID:
                alert('没有配置相应context_id的签字对象');
                break;
        }
    }
}

//弹出协议框
var temp_id = '';

var showAgreement = false; //选择是否弹出告知协议框

function show_agreement(context_id) {
    if (showAgreement == true) {
        temp_id = context_id;
        document.getElementById('agreement_layer').style.display = 'block';
    }
    else {
        testPopupDialog(context_id);
    }
}

function agreement_cancel() {
    document.getElementById('agreement_layer').style.display = 'none';
}

function agreement_ok() {
    document.getElementById('agreement_layer').style.display = 'none';
    testPopupDialog(temp_id);
}

function setIdentifyCallBack(callback){
    if (!apiInstance){
        alert('信手书接口没有初始化');
        return;
    }
    apiInstance.setIdentifyCallBack(callback);
}

//弹出批注签名框
//数据签名时，批注无效V2.4.7
function testCommentDialog(context_id)
{
    if (!apiInstance){
        alert('信手书接口没有初始化');
        return;
    }
    switch (apiInstance.showCommentDialog(context_id)){
        case RESULT_OK:
            document.getElementById('other').style.display = 'none';
            break;
        case EC_API_NOT_INITED:
            alert('信手书接口没有初始化');
            break;
        case EC_WRONG_CONTEXT_ID:
            alert('没有配置相应context_id的签字对象');
            break;
        case EC_COMMENT_ALREADY_SHOW:
            alert('批注签名框已弹出，请勿重复操作！');
    }

}

//获取签名api版本信息
function testGetVersion()
{
    alert(apiInstance.getVersion());
}

//获取设备操作系统信息
function testGetOsInfo()
{
    alert(apiInstance.getOSInfo());
    alert(navigator.userAgent);
    alert(window.__wxjs_is_wkwebview);
}

//jane
function testAddEvidence(result)
{
    alert(apiInstance.addEvidence(20,'<html><head><title></title><meta http-equiv=\'Content-Type\' content=\'text/html; charset=UTF-8\' /></head><body><div><div><label>keyword:</label></div><div><label>列名2：</label></div><div><label>列名3：</label></div></div></body></html>',DataFormat.IMAGE_JPEG,BioType.PHOTO_SIGNER_IDENTITY_CARD_BACK,0));
}

function CopyText(TextAreaName){
    document.querySelector('#'+TextAreaName).select();
    document.execCommand('copy');
}


// init
window.initSign = (initData, pdfBase64) => {
    testAnySign(999999, initData);
    testSetTemplateData(pdfBase64);
    testPopupDialog(20);
    setTimeout(() => {
        document.querySelector('#anysignCanvas').height = window.innerHeight - 84
    })
}

// function uploadFile() {
//   console.log('sss')
//   var input = document.querySelector('.test')
//   var file = input.files[0]
//   var reader = new FileReader()
//   reader.onload = () => {
//     console.log(reader.result)
//     var iframe = document.createElement('iframe')
//     iframe.src = reader.result
//     document.body.append(iframe)
//   }
//   reader.onerror = err => console.log(err)
//   reader.readAsDataURL(file)
// // }
window.createSign = (callback) => {
    sign_confirm();
    setTimeout(() => {
        testGenData(callback);
        // testTextGenData(callback)
    }, 600);
};