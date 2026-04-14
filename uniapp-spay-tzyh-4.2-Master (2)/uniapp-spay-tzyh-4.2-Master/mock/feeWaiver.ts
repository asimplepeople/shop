export default [
    {
        // 商户手续费减免列表
        url: '/spay/merchant/fee/subsidy/list',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify({
                    rule1_2rows:[
                        {
                            acitivtyId:'90003',
                            activityName:'阶梯减免',
                            beginTime:'2022-07-13',
                            endTime: '2022-11-1',
                            id: '102042',
                            subsidyRemain:'0.00',
                            subsidyRule: '2',
                            subsidyTotal: '0.00',
                            susidyUse: '0.00'
                        }
                    ],
                    rule3rows: [
                        {
                            acitivtyId: '90006',
                            activityName: '按笔减免',
                            beginTime: '2022-07-13',
                            billAmount: '800.00',
                            endTime: '2022-11-11',
                            maxPayOrderCount: '20',
                            maxPayOrderMoney: '200',
                            mchId: '218550000001',
                            subsidyRule: '3'
                        }
                    ]
                }),
            };
        },
    },
    {
        // 商户手续费减免明细规则1_2
        url: '/spay/merchant/fee/subsidy/detail_rule1_2',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify({
                    rows:[
                        {
                            accDate:'2022-07-13',
                            id:'1',
                            susidyUse:'20.00'
                        },
                        {
                            accDate:'2022-07-13',
                            id:'2',
                            susidyUse:'20.00'
                        }
                    ],
                    summery:{
                        acticityName: '阶梯减免',
                        beginTime: '2022-07-13',
                        endTime: '2022-11-1',
                        remark: '阶梯减免',
                        susidyUse: '20.00'
                    }

                }),
            };
        },
    },
    {
        // 商户手续费减免明细规则3
        url: '/spay/merchant/fee/subsidy/detail_rule3',
        method: 'post',
        response: ({ body }) => {
            console.log(body);
            return {
                result: '200',
                message: JSON.stringify({
                    rows:[
                        {
                            accDate:'2022-07-13',
                            id:'1',
                            susidyUse:'20.00'
                        },
                        {
                            accDate:'2022-07-13',
                            id:'2',
                            susidyUse:'20.00'
                        },
                        {
                            accDate:'2022-07-13',
                            id:'3',
                            susidyUse:'20.00'
                        }
                    ],
                    summery:{
                        acticityName: '按笔减免',
                        beginTime: '2022-07-13',
                        endTime: '2022-08-11',
                        remark: '按笔减免',
                        susidyUse: '20.00'
                    }

                }),
            };
        },
    },
];