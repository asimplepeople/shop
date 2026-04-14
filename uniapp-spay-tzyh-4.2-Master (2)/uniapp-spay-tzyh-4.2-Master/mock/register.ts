// register.ts
export default [
    {
        // 获取声明内容
        url: '/spay/preProtocol/getContentByCodeH5',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify({
                    content: '<h1>个人信息收集声明</h1><p>注册时将会填写以下信息：</p><p>姓名：用于注册光大银行收单商户的身份识别与商户资料审核。</p><p>身份证号：用于注册光大银行收单商户的身份识别与商户资料审核。</p><p>手机号：用于注册光大银行收单商户的身份识别与商户资料审核，以及接收短信验证码以及登录信息。</p><p>银行卡信息：用于注册光大银行收单商户后的交易清算。</p><p>经营地址：用于注册光大银行收单商户的身份识别与商户资料审核。</p><p>营业执照信息：用于注册光大银行收单商户的身份识别与商户资料审核。</p>',
                    // content: '',
                    status: '1',
                }),
            };
        },
    },
    {
        // 发送短信
        url: '/spay/hnnx/merchant/sendMsgCode',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify('获取成功'),
            };
        },
    },
    {
        // 校验短信
        url: '/spay/hnnx/merchant/checkMsgCode',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify('校验成功'),
            };
        },
    },
    {
        // 校验邀请码
        url: '/spay/hnnx/merchant/getBaseInfoByInvitationCode',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify({
                    token: '111111aaaaaa', // 商户进件有效期token
                    showSign: true, // 是否展示协议
                    merchantType: 1, // 商户类型 1普通商户 2 小微商户 3 普通商户+小微商户
                    acceptOrgId: '2213123', // 所属受理机构号
                    channelId: '2213123', // 渠道ID
                    salesmanId: '2213123', // 业务员ID
                }),
            };
        },
    },
    {
        // 图片上传
        url: '/spay/hnnx/merchant/singleImgUpload',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify({
                    imgPath: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00523-2175.jpg'
                }),
            };
        },
    },
    {
        // 图像识别获取商户信息
        url: '/spay/hnnx/merchant/getMerchantInfoFromOcr',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify({
                    hasClientNo: '1', // 是否存在客户号 1存在，2不存在
                    imgPath: '20120730_212_598_E8FEE1AD-9A3E-2075-523D-04046B0CB945-1#8ba46f242e7c4bd596a4f3e9f527e773', // 影像平台ID/图片相对路径
                    idsFrontPhotoImgPath: '20120730_212_598_E8FEE1AD-9A3E-2075-523D-04046B0CB945-1#8ba46f242e7c4bd596a4f3e9f527e773', // 影像平台ID/图片相对路径(身份证正面图片)
                    idsReversePhotoImgPath: '20120730_212_598_E8FEE1AD-9A3E-2075-523D-04046B0CB945-1#8ba46f242e7c4bd596a4f3e9f527e773', // 影像平台ID/图片相对路径(身份证反面图片)
                    ecif: { // 行内现存信息，不可更改
                        idCode: '430111199101010371', // 负责人证件号
                        idName: '张三', // 负责人姓名
                        idCodeType: '1', // 负责人证件类型
                        principal: '13971111010', // 负责人手机号码
                        licenceCode: '123456789', // 营业执照编号
                        registCapitalMoneyBd: '500', // 注册资本金
                        mchName: '张三', // 商户名称
                        idCodeExpire: '2021-10-01 2021-10-01', // 身份证有效期
                        businessLicenseExpire: '2031-10-02 2031-10-02', // 营业执照有效期
                    },
                    ocr: { // 图像识别信息，可更改
                        idCode: '', // 负责人证件号
                        idName: '', // 负责人姓名
                        idCodeType: '', // 负责人证件类型
                        principal: '', // 负责人手机号码
                        licenceCode: '', // 营业执照编号
                        registCapitalMoneyBd: '', // 注册资本金
                        mchName: '', // 商户名称
                        idCodeExpire: '', // 身份证有效期
                        businessLicenseExpire: '', // 营业执照有效期
                    }
                }),
            };
        },
    },
    {
        // 判断商户主体 证件号/注册号是否能开通
        url: '/spay/hnnx/merchant/hasApplyMchAccount',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify(true),
            };
        },
    },
    {
        // 获取主体列表
        url: '/spay/hnnx/merchant/getAllSubjectType',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify([
                    {
                        name: '小微商户',
                        note: '免于办理工商注册登记、无营业执照的实体特约商户',
                        type: '1',
                        code: '',
                    },
                    {
                        name: '个体工商户',
                        note: '有营业执照，且营业执照上的主体类型一般为个体户、个体工商户、个体经营',
                        type: '2',
                        code: '',
                    },
                    {
                        name: '企业',
                        note: '有营业执照，且营业执照上的主体类型一般为个人独资企业、合伙企业、有限公司、有限责任公司',
                        type: '3',
                        code: '',
                    },
                    {
                        name: '事业单位',
                        note: '包括国内各类事业单位，如：医疗、教育、学校等单位',
                        type: '4',
                        code: '',
                    },
                    {
                        name: '政府机关',
                        note: '包括各级、各类政府机关，如机关党委、税务、民政、人社、工商、商务、市监等',
                        type: '5',
                        code: '',
                    },
                    {
                        name: '其他组织',
                        note: '不属于个体户、企业、政府/事业单位的组织机构，如社会团体、民办非企业、基金会，需提供相关部门颁发的证书，如：社会团体法人登记证书、民办非企业单位登记证书',
                        type: '6',
                        code: '',
                    },
                ]),
            };
        },
    },
];
