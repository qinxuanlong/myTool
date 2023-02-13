<template>
    <div>
        <div class="container" v-if="pageStatus == '0'">
            <el-card style="margin-bottom: 20px">
                <el-form :inline="true" :model="searchInfo" ref="searchInfo" class="demo-form-inline" @submit.native.prevent>
                    <!-- <el-form-item prop="name">
                        <el-input
                            style="width: 240px"
                            v-model="searchInfo.name"
                            placeholder="请输入企业名称"
                            @keyup.enter.native="onSearch"
                            clearable
                        ></el-input>
                    </el-form-item> -->
                    <el-form-item prop="taskCode">
                        <el-input
                            style="width: 240px"
                            v-model="searchInfo.taskCode"
                            placeholder="请输入任务编码"
                            @keyup.enter.native="onSearch"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="taskName">
                        <el-input
                            style="width: 240px"
                            v-model="searchInfo.taskName"
                            placeholder="请输入任务名称"
                            @keyup.enter.native="onSearch"
                            clearable
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-card>

            <el-card>
                <!-- <div class="addBtn">
                    <el-button type="primary" size="mini" @click="seeProjectDetails">查看</el-button>
                </div> -->
                <el-tabs v-model="searchInfo.statusBtn" type="card" @tab-click="handleClick">
                    <el-tab-pane label="全部" name="-1"></el-tab-pane>

                    <!-- <el-tab-pane label="发布待审核" name="1"></el-tab-pane> -->
                    <el-tab-pane label="进行中" name="2"></el-tab-pane>
                    <el-tab-pane label="结算待审核" name="3"></el-tab-pane>
                    <el-tab-pane label="待结算" name="4"></el-tab-pane>
                    <el-tab-pane label="已完成" name="5"></el-tab-pane>
                </el-tabs>
                <zy-table class :table="tableInfo" @onHandleSelectionChange="onHandleSelectionChange">
                    <template slot="operation" slot-scope="current">
                        <span class="btn-text" @click="seeProjectDetails(current.row)">查看</span>
                        <!-- <span class="btn-text" @click="openAddOrEdit(current.row)">编辑</span>
                        <span class="btn-text" @click="delbtn(current.row)">审核</span> -->
                    </template>
                </zy-table>
                <zy-pagination
                    class="mt20"
                    :pageTotal="pageTotal"
                    :currentPage.sync="currentPage"
                    :pageSize.sync="pageSize"
                    @currentPageChange="currentPageChange"
                    @pageSizeChange="pageSizeChange"
                ></zy-pagination>
            </el-card>
        </div>

        <div v-if="pageStatus == '1'">
            <AssignmentDetails :currentId="currentId" @back="Goback"></AssignmentDetails>
        </div>
        <div v-if="pageStatus == '2'">
            <ProjectDetails  :currentId="currentId" :currentStatus="currentStatus" @back="Goback" ></ProjectDetails>
        </div>
        <div v-if="pageStatus == '3'">
            <EditAssignmentDetails :currentId="currentId" @back="Goback"></EditAssignmentDetails>
        </div>
    </div>
</template>

<script>
import AssignmentDetails from './component/AssignmentDetails.vue';
import ProjectDetails from './component/ProjectDetails.vue';
import EditAssignmentDetails from './component/EditAssignmentDetails.vue';
export default {
    name: 'assignmentManage',
    components: { AssignmentDetails, ProjectDetails, EditAssignmentDetails },
    data() {
        return {
            title: '',
            currentId: '',
            currentStatus:'',
            tableInfo: {},
            searchInfo: {
                taskCode: '', // 	任务编码
                taskName: '' ,// 	任务名称
                statusBtn:'-1',
                status:''
            },
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            ids: [],
            pageStatus: '0'
        };
    },

    created() {
        this.init();
        this.getList();
    },
    methods: {
        //初始化表格
        init() {
            this.tableInfo = {
                border: false, // 是否带有纵向边框，默认为false
                // loading: true, // 加载中动画
                hasOperation: true, // 有无操作功能
                hasSelect: true, //有无复选框
                checkList: ['任务编码', '企业名称', '任务名称', '产品', '任务金额', '跟台月份', '状态', '发布时间', '操作'],
                tr: [
                    {
                        id: 1,
                        label: '任务编码',
                        prop: 'taskCode',
                        width:200
                    },
                    {
                        id: 2,
                        label: '企业名称',
                        prop: 'enterpriseName'
                    },
                    {
                        id: 4,
                        label: '任务名称',
                        prop: 'taskName'
                    },
                    {
                        id: 5,
                        label: '产品',
                        prop: 'proName'
                    },
                    {
                        id: 6,
                        label: '任务金额',
                        prop: 'amount'
                    },
                    {
                        id: 7,
                        label: '跟台月份',
                        prop: 'workMonth'
                    },
                    {
                        id: 8,
                        label: '状态',
                        prop: 'statusName'
                    },
                    {
                        id: 9,
                        label: '发布时间',
                        prop: 'createTime'
                    },
                    {
                        id: '18',
                        width: '200',
                        label: '操作',
                        prop: 'operation',
                        show: 'template',
                        isShow: true
                    }
                ],
                data: []
            };
        },
        //获取列表
        getList() {
            if (this.searchInfo.statusBtn == '-1') {
                this.searchInfo.status = ''
            } else {
                this.searchInfo.status = this.searchInfo.statusBtn 
            }
            let info = {
                ...this.searchInfo,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            this.$http.post(api.task.getList, info).then((res) => {
                if (res.code == 200) {
                    if (res.data.list !== null && res.data.list.length > 0) {
                        this.pageTotal = res.data.total;
                        this.tableInfo.data = res.data.list;
                    } else {
                        this.pageTotal = 0;
                        this.tableInfo.data = [];
                    }
                    this.tableInfo.loading = false;
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        showClose: true
                    });
                }
            });
        },

        //查询按钮
        onSearch() {
            this.currentPage = 1;
            this.getList();
        },
        // tab 切换
        handleClick() {
            this.init();
            this.onSearch();
        },
        // 切换页面
        currentPageChange(pageNo) {
            this.currentPage = pageNo;
            this.getList();
        },
        // 切换页面条数
        pageSizeChange(pageNo) {
            this.pageSize = pageNo;
            this.getList();
        },

        delbtn(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http.post(api.supplier.delUserDeal, { userId: row.userId }).then((res) => {
                        if (res.code == 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true
                            });
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error',
                                showClose: true
                            });
                        }
                        this.getList();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        //复选框事件
        onHandleSelectionChange(value) {
            this.ids = value.map((item) => {
                return item.id;
            });
            console.log(value);
            console.log(this.ids);
        },
        // 组件返回
        Goback() {
            this.pageStatus = '0';
            this.currentId = '';
            this.currentStatus = ''
            this.getList();
        },
        // 查看详情
        seeDetails(row) {
            this.pageStatus = '1';
            this.currentId = row.taskId
            console.log('============',row.taskId);
            
        },
        // 查看项目详情
        seeProjectDetails(row) {
            this.pageStatus = '2';
            this.currentStatus = row.status
            this.currentId = row.taskId
        },
        // 编辑详情
        EidtDetails(row) {
            this.pageStatus = '3';
            this.currentStatus = row.status
            this.currentId = row.taskId
        },
        // 供应商编辑
        openAddOrEdit(row) {
            this.pageStatus = '1';
            this.currentStatus = row.status
            this.currentId = row.taskId;
           
        }
    }
};
</script>

<style lang="scss" scoped>
.addBtn {
    width: 100%;
    text-align: right;
}

.red {
    color: red;
}

.EnterpriseInfor-form {
    h4 {
        margin: 20px 0;
    }
}

.auditItem {
    width: 100%;
    /* height: 300px; */
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;

    .el-form-item--small.el-form-item {
        margin-bottom: 0 !important;
    }
}

.fenFunConenter {
    height: 300px;
    overflow-y: auto;
}

.underLine {
    text-decoration: underline;
    cursor: pointer;
    color: #666;
}
</style>

 <template>
    <div style="width: 1000px; margin: 0 auto" class="page-container">
        <el-card>
            <div class="title-page">
                <div>项目详情</div>
                <div @click="returnpage"><el-button type="primary">返回</el-button></div>
            </div>
            <el-tabs v-model="status" type="card" @tab-click="onRefresh()">
                <el-tab-pane label="项目" name="1">
                    <el-form :model="productInfo" ref="productInfo" label-width="110px" :rules="rules" label-position="left">
                        <el-row type="flex" justify="space-between" v-if="currentStatus == '3'">
                            <el-col :span="11">
                                <el-form-item label="税地选择:" prop="taxId">
                                    <el-select
                                        v-model="productInfo.taxId"
                                        clearable
                                        @change="changeTax"
                                        placeholder="请选择税地"
                                        style="width: 100%"
                                    >
                                        <el-option
                                            v-for="item in TaxData"
                                            :label="item.taxName"
                                            :value="item.taxId"
                                            :key="item.taxId"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11"> </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="11">
                                <el-form-item label="任务名称:" prop="taskName">
                                    <el-input
                                        ref="taskName"
                                        placeholder="请输入任务名称"
                                        clearable
                                        v-model="productInfo.taskName"
                                        maxlength="15"
                                        v-if="isEidt"
                                    ></el-input>
                                    <span v-else>{{ productInfo.taskName }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="产品:" prop="proCode">
                                    <el-select
                                        v-if="isEidt"
                                        v-model="productInfo.proCode"
                                        clearable
                                        placeholder="请选择产品"
                                        @change="changeProCode"
                                        style="width: 100%"
                                    >
                                        <el-option
                                            v-for="item in productList"
                                            :label="item.proName"
                                            :value="item.proCode"
                                            :key="item.id"
                                        ></el-option>
                                    </el-select>
                                    <span v-else>{{ productInfo.proName }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="11" class="date">
                                <el-form-item label="跟台月份:" prop="workMonth">
                                    <el-date-picker
                                        v-if="isEidt"
                                        v-model="productInfo.workMonth"
                                        type="month"
                                         value-format="yyyy-MM"
                                        placeholder="选择月"
                                        style="width: 100%"
                                    >
                                    </el-date-picker>
                                    <span v-else>{{ productInfo.workMonth }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="院方名称:" prop="hospital">
                                    <el-select
                                        v-if="isEidt"
                                        v-model="productInfo.hospital"
                                        clearable
                                        placeholder="请选择院方名称"
                                        style="width: 100%"
                                    >
                                        <el-option
                                            v-for="item in hospitalList"
                                            :key="item.id"
                                            :label="item.hospital"
                                            :value="item.hospital"
                                        ></el-option>
                                    </el-select>
                                    <span v-else>{{ productInfo.hospital }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between">
                            <el-col :span="11">
                                <el-form-item label="科室名称:" prop="department">
                                    <el-input
                                        ref="department"
                                        placeholder="请输入科室名称"
                                        clearable
                                        v-model="productInfo.department"
                                        v-if="isEidt"
                                    ></el-input>
                                    <span v-else>{{ productInfo.department }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="主刀医生:" prop="doctor">
                                    <el-input v-if="isEidt" placeholder="请输入主刀医生" clearable v-model="productInfo.doctor"></el-input>
                                    <span v-else>{{ productInfo.doctor }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row type="flex" justify="space-between">
                            <el-col :span="11">
                                <el-form-item label="预计金额:" prop="amount">
                                    <el-input
                                        v-if="isEidt"
                                        ref="amount"
                                        placeholder="请输入预计金额"
                                        clearable
                                        v-model="productInfo.amount"
                                    ></el-input>
                                    <span v-else>{{ productInfo.amount }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11"></el-col>
                        </el-row>
                        <el-row
                            type="flex"
                            justify="space-between"
                            v-if="currentStatus == '1' || currentStatus == '3' || currentStatus == '4' || currentStatus == '5'"
                        >
                            <el-col :span="11">
                                <el-form-item label="业务模式:" prop="amount">
                                    <span>{{ productInfo.bizType }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="结算方式:" prop="amount">
                                    <span>{{ productInfo.settleType }}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div v-if="currentStatus == '3'" class="dialog-footer" style="margin-top: 30px; padding-bottom: 50px">
                        <el-button @click="reject">驳 回</el-button>
                        <el-button @click="adopt('productInfo')" type="primary">通 过</el-button>
                    </div>
                    <div v-else class="dialog-footer" style="margin-top: 30px; padding-bottom: 50px">
                        <el-button @click="returnpage">取 消</el-button>
                        <el-button @click="updateTaskData('productInfo')" v-if="isEidt" type="primary">确 定</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="人员" name="2">
                    <div class="btn-box">
                        <el-button @click="addPersonnel" type="primary" v-if="currentStatus == '2'">新增人员</el-button>
                    </div>
                    <zy-table class :table="tableInfo" @onHandleSelectionChange="onHandleSelectionChange">
                        <template slot="operation" slot-scope="current">
                            <!-- 人员审核 (1抢单审核、2任务进行中、3任务待审核、4待结算、5已结算、9取消抢单、10任务审核失败、11结算失败、12已退款) -->
                            <span v-if="isEidt">
                                <span v-if="current.row.status == '1'">
                                    <span class="btn-text" @click="personnelToExamine(current.row, '2')">通过</span>
                                    <span class="btn-text" @click="personnelToExamine(current.row, '6')">驳回</span>
                                </span>
                                <span class="btn-text" v-else-if="current.row.status == '4'" @click="EditOrAcceptance(current.row, '0')"
                                    >编辑</span
                                >
                                <span class="btn-text" v-else-if="current.row.status == '3'" @click="EditOrAcceptance(current.row, '1')"
                                    >验收</span
                                >
                                <span v-else>{{ current.row.statusName }}</span>
                            </span>
                            <span v-else>
                                <span class="btn-text" @click="showOrAcceptance(current.row, '2')">查看</span>
                            </span>
                        </template>
                    </zy-table>
                </el-tab-pane>
            </el-tabs>
            <div v-if="status == '1'"></div>
            <div v-if="status == '2'">
                <!-- <zy-pagination
                    class="mt20"
                    :pageTotal="pageTotal"
                    :currentPage.sync="currentPage"
                    :pageSize.sync="pageSize"
                    @currentPageChange="currentPageChange"
                    @pageSizeChange="pageSizeChange"
                ></zy-pagination> -->
            </div>
        </el-card>
        <EditAssignmentDetails ref="EditAssignmentDetails" @back="getList"></EditAssignmentDetails>
        <AddPersonnel ref="AddPersonnel" @back="getList"></AddPersonnel>
        <UploadVoucher ref="UploadVoucher" @submit="offlineAdopt"></UploadVoucher>
    </div>
</template>

<script>
import EditAssignmentDetails from './EditAssignmentDetails.vue';
import AddPersonnel from './AddPersonnel.vue';
import UploadVoucher from './UploadVoucher.vue';
export default {
    name: 'ProjectDetails',
    props: {
        currentId: {
            type: String,
            default: ''
        },
        currentStatus: {
            type: String,
            default: ''
        }
    },
    components: { EditAssignmentDetails, AddPersonnel, UploadVoucher },
    watch: {
        currentId(val, old) {
            this.productId = val;
        }
    },
    data() {
        return {
            productId: '',
            status: '1',
            productInfo: {
                taskId: '', // 	任务id
                taskName: '', // 	任务名称
                proName: '', // 	产品名称
                hospital: '', // 	院方名称
                department: '', // 	科室
                doctor: '', // 	主刀医生
                amount: '', // 	任务金额
                workMonth: '', // 	跟台月份
                status: '', // 	状态(1发布待审核、2进行中、3结算待审核、4待结算、5已结算、7结算审核驳回、8发布审核驳回、9任务取消)
                statusName: '', // 	状态(1发布待审核、2进行中、3结算待审核、4待结算、5已结算、7结算审核驳回、8发布审核驳回、9任务取消)
                createTime: '', // 	发布时间
                userId: '', // 	用户id
                taxId: '', // 税地id
                taxName: '' // 税地name
            },
            rules: {
                taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
                proCode: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
                // hospital: [{ required: true, message: '请选择院方名称', trigger: 'blur' }],
                // department: [{ required: true, message: '请输入科室', trigger: 'blur' }],
                // doctor: [{ required: true, message: '请输入主刀医生', trigger: 'blur' }],

                // amount: [
                //     { required: true, message: '请输入任务金额', trigger: 'blur' },
                //     {
                //         pattern: /^\d+(\.\d{0,2})?$/,
                //         message: '请输入正确的格式,保留两位小数',
                //         trigger: ['blur', 'change']
                //     }
                // ],
                workMonth: [{ required: true, message: '请选择跟台月份', trigger: 'blur' }],
                taxId: [{ required: true, message: '请选择税地', trigger: 'blur' }]
            },
            tableInfo: {},
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            ids: [],
            /**
             * 产品
             */
            productList: [],
            /**
             * 医院
             */
            hospitalList: [],
            isEidt: true, //
            TaxData: [] // 获取任务税地数据
        };
    },

    created() {
        this.productId = this.currentId;
        // if (this.productId == '') {
        //     this.title = '新增商品';
        // }
        this.init();
        this.getDetail();
        this.getWebTaskProductList();
        this.getWebTaskHospitalList();
        // 人员数据
        this.getList();
    },
    mounted() {},
    methods: {
        // 新增人员
        addPersonnel() {
            this.$refs.AddPersonnel.open(this.productId);
        },
        // 编辑
        EditOrAcceptance(row, status) {
            this.$refs.EditAssignmentDetails.open(row.userTaskId, status);
        },
        // 展示
        showOrAcceptance(row, status) {
            this.$refs.EditAssignmentDetails.showOpen(row.userTaskId, status, false);
        },
        init() {
            this.tableInfo = {
                border: false, // 是否带有纵向边框，默认为false
                // loading: true, // 加载中动画
                hasOperation: true, // 有无操作功能
                hasSelect: true, //有无复选框
                checkList: ['用户姓名', '身份证号', '手机号', '金额', '状态', '操作'],
                tr: [
                    {
                        id: 1,
                        label: '用户姓名',
                        prop: 'name'
                    },
                    {
                        id: 3,
                        label: '身份证号',
                        prop: 'cardId'
                    },
                    {
                        id: 5,
                        label: '手机号',
                        prop: 'account'
                    },
                    {
                        id: 7,
                        label: '金额',
                        prop: 'amount'
                    },

                    {
                        id: 10,
                        label: '状态',
                        prop: 'statusName'
                    },
                    {
                        id: '18',
                        width: '200',
                        label: '操作',
                        prop: 'operation',
                        show: 'template',
                        isShow: true
                    }
                ],
                data: []
            };
        },
        returnpage() {
            this.productInfo = {
                taskId: '', // 	任务id
                taskName: '', // 	任务名称
                proName: '', // 	产品名称\
                proCode: '', //
                hospital: '', // 	院方名称
                department: '', // 	科室
                doctor: '', // 	主刀医生
                amount: '', // 	任务金额
                workMonth: '', // 	跟台月份
                status: '', // 	状态(1发布待审核、2进行中、3结算待审核、4待结算、5已结算、7结算审核驳回、8发布审核驳回、9任务取消)
                statusName: '', // 	状态(1发布待审核、2进行中、3结算待审核、4待结算、5已结算、7结算审核驳回、8发布审核驳回、9任务取消)
                createTime: '', // 	发布时间
                userId: '', // 	用户id
                taxId: '', // 税地id
                taxName: '' // 税地name
            };

            this.$emit('back');
        },
        // 选择产品
        changeProCode(val) {
            for (let i = 0; i < this.productList.length; i++) {
                const element = this.productList[i];
                if (element.proCode == val) {
                    this.productInfo.proName = element.proName;
                }
            }
        },
        // 更新任务详情数据
        updateTaskData(formName) {
            var that = this;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http.post(api.task.updateTaskData, { ...this.productInfo }).then((res) => {
                        if (res.code == 200) {
                            that.$message.success('操作成功');
                            that.returnpage();
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error',
                                showClose: true
                            });
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //获取 任务 详情
        getDetail() {
            this.$http.get(api.task.getWebTaskDetail + '/' + this.productId).then((res) => {
                if (res.code == 200) {
                    if (res.data) {
                        this.productInfo = res.data;
                        if (this.currentStatus == '2') {
                            this.isEidt = true;
                        } else {
                            this.isEidt = false;
                        }
                        if (this.currentStatus == '3') {
                            this.getTaskTaxData(this.productInfo.bizTypeNum);
                        }
                    }
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        showClose: true
                    });
                }
            });
        },
        // 产品下拉数据
        getWebTaskProductList() {
            this.$http.get(api.task.getWebTaskProductList).then((res) => {
                if (res.code == 200) {
                    if (res.data) {
                        this.productList = res.data;
                    }
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        showClose: true
                    });
                }
            });
        },
        // 院方下拉数据
        getWebTaskHospitalList() {
            this.$http.get(api.task.getWebTaskHospitalList).then((res) => {
                if (res.code == 200) {
                    if (res.data) {
                        this.hospitalList = res.data;
                    }
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        showClose: true
                    });
                }
            });
        },
        // 人员数据
        getList() {
            this.$http.post(api.task.getWebTaskUserDetail, { taskId: this.productId }).then((res) => {
                if (res.code == 200) {
                    if (res.data) {
                        this.tableInfo.data = res.data;
                    } else {
                        this.pageTotal = 0;
                        this.tableInfo.data = [];
                    }
                    this.tableInfo.loading = false;
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        showClose: true
                    });
                }
            });
        },
        // 图展示弹窗
        handlePictureCardPreview(file) {
            this.image.onPreview(file.url);
        },
        // 切换页面
        currentPageChange(pageNo) {
            this.currentPage = pageNo;
            this.getList();
        },
        // 切换页面条数
        pageSizeChange(pageNo) {
            this.pageSize = pageNo;
            this.getList();
        },
        //复选框事件
        onHandleSelectionChange(value) {
            this.ids = value.map((item) => {
                return item.id;
            });
            console.log(value);
            console.log(this.ids);
        },
        // 人员的审核
        personnelToExamine(row, status) {
            this.$confirm('此操作将更改该人员状态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let info = {
                        userTaskId: row.userTaskId,
                        status: status
                    };
                    this.$http.post(api.task.webAuthTaskUserDeal, info).then((res) => {
                        if (res.code == 200) {
                            this.$message.success('操作成功');
                            this.getList();
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error',
                                showClose: true
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },

        /**
         * 获取税地选择
         * @param {*} type
         */
        getTaskTaxData(type) {
            this.$http.get(api.task.getTaskTaxData + '/' + type).then((res) => {
                if (res.code == 200) {
                    this.TaxData = res.data;
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error',
                        showClose: true
                    });
                }
            });
        },
        /**
         * 审核项目
         * @param {string} status  状态,驳回：7 结算审核驳回，通过：4待结算
         */
        settleTaskAuthDeal(status, url) {
            console.log('item.taxName', this.productInfo);
            this.$confirm('此操作将更改该任务状态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http
                        .post(api.task.settleTaskAuthDeal, {
                            taskId: this.productInfo.taskId, // 任务id
                            status: status, // 状态,驳回：7 结算审核驳回，通过：4待结算
                            taxId: this.productInfo.taxId, // 税源地id — status = 4必传
                            taxName: this.productInfo.taxName, // 税源地名称 — status = 4必传
                            voucherUrl: url // 凭证 — 线下结算使用
                        })
                        .then((res) => {
                            if (res.code == 200) {
                                this.$message.success('操作成功');
                                this.returnpage();
                            } else {
                                this.$message({
                                    message: res.message,
                                    type: 'error',
                                    showClose: true
                                });
                            }
                        });
                })
                .catch((e) => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
        },
        // 刷新数据
        onRefresh() {
            this.getList();
        },

        //通过
        adopt(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 线下结算打开弹窗
                    if (this.productInfo.settleType == '线下结算') {
                        this.$refs.UploadVoucher.open();
                    } else {
                        this.settleTaskAuthDeal('4');
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //驳回
        reject() {
            // 状态,驳回：7 结算审核驳回，通过：4待结算
            this.settleTaskAuthDeal('7');
        },
        /**
         * 选择税地回调
         */
        changeTax(val) {
            this.TaxData.forEach((item) => {
                if (item.taxId == val) {
                    this.productInfo.taxName = item.taxName;
                }
            });
        },
        /**
         * 线下结算通过
         */
        offlineAdopt(file) {
             // 状态,驳回：7 结算审核驳回，通过：4待结算
            this.settleTaskAuthDeal('4', file.url);
        }
    }
};
</script>

<style lang="scss" scoped>
.title-page {
    color: #333;
    font-size: 9px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
    border-bottom: solid 1px #f1f1f1;
    padding-bottom: 5px;
}
.info-panel {
    margin-left: 20px;
}
.info-panel-title {
    color: #df1f26;
    font-size: 9px;
    font-weight: 600;
    margin-bottom: 20px;
}
.tip {
    color: #999;
}
.page-container {
    ::v-deep .planCompany {
        z-index: 20000 !important;
    }
}
.date {
    ::v-deep .el-month-table td.today .cell {
    }
}
.btn-box {
    padding: 10px;
    text-align: right;
}
</style>

