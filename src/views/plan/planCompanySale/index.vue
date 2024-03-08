<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="销售计划号" prop="companySalePlanCode">
        <el-input
          v-model="queryParams.companySalePlanCode"
          placeholder="请输入销售计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求计划号" prop="externalDemandPlanCode">
        <el-input
          v-model="queryParams.externalDemandPlanCode"
          placeholder="请输入需求计划号"
          git
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划配送日期" prop="planExcuteDate">
        <el-date-picker
          clearable
          v-model="queryParams.planExcuteDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划配送日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['plan:planCompanySale:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['plan:planCompanySale:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['plan:planCompanySale:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="warning"
          plain
          icon="el-icon-edit"
          @click="openAuditedDialog()"
          v-hasPermi="['plan:planCompanySale:edit']"
        >审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planCompanySale:export']"
        >导出</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
            <el-button
                    type="info"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
            >导入</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="planCompanySaleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="销售计划号" align="center" prop="companySalePlanCode">
        <template slot-scope="scope">
          <router-link
            :to="'/plan/companySale-info/index/' + scope.row.companySalePlanCode"
            class="link-type"
          >
            <span>{{ scope.row.companySalePlanCode }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="需求计划号" align="center" prop="externalDemandPlanCode" />
      <!--<el-table-column label="计划类型" align="center" prop="planType" />-->
      <!--<el-table-column label="状态" align="center" prop="planStatusName" />-->
      <el-table-column label="计划配送日期" align="center" prop="planExcuteDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planExcuteDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planCompanySale:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planCompanySale:remove']"
          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改公司销售计划对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="销售计划号" prop="companySalePlanCode">
          <el-input v-model="form.companySalePlanCode" placeholder="请输入销售计划号" />
        </el-form-item>
        <el-form-item label="需求计划号" prop="externalDemandPlanCode">
          <el-input v-model="form.externalDemandPlanCode" placeholder="请输入需求计划号" />
        </el-form-item>
        <el-form-item label="计划类型" prop="planType">
          <el-select v-model="form.planType" placeholder="请选择计划类型">
            <el-option
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态(1.初始化2.已下发3.已完成5.已结算)" prop="planStatus">
          <el-radio-group v-model="form.planStatus">
            <el-radio
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计划配送日期" prop="planExcuteDate">
          <el-date-picker clearable
            v-model="form.planExcuteDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划配送日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="删除标识" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 直送对话框 -->
    <!--<el-dialog :title="directDeliveryDialog.title" v-loading.fullscreen.lock="directDeliveryDialog.loading" :visible.sync="directDeliveryDialog.open"  fullscreen center>

        <el-form :model="directDeliveryForm" ref="directDeliveryForm" :rules="directDeliveryRules" size="small" :inline="true"  label-width="68px">
          <el-form-item label="物料图号" prop="itemId">
            <el-select v-model="directDeliveryForm.itemId" filterable  remote
                       :remote-method="remoteSearchItem"
                       placeholder="请输入物料图号">
              <el-option
                v-for="dict in itemList"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="直送数量" prop="directDeliveryQuantity">
            <el-input v-model="directDeliveryForm.directDeliveryQuantity" placeholder="请输入直送数量" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              size="mini"
              @click="handlefindSaleInfo"
            >查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetDirectDeliveryDialogForm">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table  :data="directDeliveryDialog.planCompanySaleInfoList" @selection-change="handleSelectionChange1">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="销售计划号" align="center" prop="companySalePlanCode" />
          <el-table-column label="物料图号" align="center" prop="itemCode" />
          <el-table-column label="行号" align="center" prop="rowNo" />
          <el-table-column label="需求配送时间" align="center" prop="distributionTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.distributionTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="需求数量" align="center" prop="demandQuantity" />
          <el-table-column label="已下发数量" align="center" prop="issuedQuantity" />
          <el-table-column label="已发交数量" align="center" prop="distributedQuantity" />
          <el-table-column label="已结算数量" align="center" prop="settlementQuantity" />
          <el-table-column label="状态" align="center" prop="planStatusName" />
          <el-table-column label="机加工单位" align="center" prop="abuttingJointManufacturer" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-add" size="mini" @click="handleAddDirectDeliveryInfo(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i></el-divider>
        <el-divider><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i></el-divider>
        <el-table  :data="directDeliveryDialog.list" >

          <el-table-column label="物料图号" align="center" prop="itemCode" />
          &lt;!&ndash;<el-table-column label="行号" align="center" prop="rowNo" />&ndash;&gt;
          <el-table-column label="需求配送时间" align="center" prop="distributionTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.distributionTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="需求数量" align="center" prop="demandQuantity" />
          <el-table-column label="已下发数量" align="center" prop="issuedQuantity" />
          <el-table-column label="已发交数量" align="center" prop="distributedQuantity" />
          <el-table-column label="已结算数量" align="center" prop="settlementQuantity" />
          <el-table-column label="直送数量" align="center" prop="directDeliveryQuantity" />
          <el-table-column label="状态" align="center" prop="planStatusName" />
          <el-table-column label="机加工单位" align="center" prop="abuttingJointManufacturer" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              &lt;!&ndash;<el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['plan:planCompanySale:edit']"
              >修改</el-button>&ndash;&gt;
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeleteDirectDeliveryList(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

          <div slot="footer" class="dialog-footer" >
              <el-button type="primary" @click="handleDirectDelivery">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
    </el-dialog>-->

    <!-- 销售计划审核对话框 -->
    <el-dialog
      :title="auditedDialog.title"
      v-loading.fullscreen.lock="auditedDialog.loading"
      :visible.sync="auditedDialog.open"
      fullscreen
      center
    >
      <el-table
        :data="auditedDialog.planCompanySaleInfoList"
        @selection-change="handleSelectionChangeAudited"
        height="500"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="销售计划号" align="center" prop="companySalePlanCode" />
        <el-table-column label="物料图号" align="center" prop="itemCode" />
        <el-table-column label="行号" align="center" prop="rowNo" />
        <el-table-column label="需求配送时间" align="center" prop="distributionTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.distributionTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求数量" align="center" prop="demandQuantity" />
        <el-table-column label="销售数量" align="center" prop="auditedQuantity">
          <template slot-scope="{ row }">
            <el-input v-model="row.auditedQuantity"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="已生成出库数量" align="center" prop="issuedQuantity" />
        <el-table-column label="已发交数量" align="center" prop="distributedQuantity" />
        <!--<el-table-column label="已结算数量" align="center" prop="settlementQuantity" />-->
        <el-table-column label="状态" align="center" prop="planStatusName" />
        <el-table-column label="机加工单位" align="center" prop="abuttingJointManufacturer" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAudited">确 定</el-button>
        <el-button @click="auditedDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { searchItemList, getNowDateStr } from "@/api/enumsSelect";
import {
  listPlanCompanySale,
  getPlanCompanySale,
  delPlanCompanySale,
  addPlanCompanySale,
  updatePlanCompanySale,
  doDelivery,
  directDelivery,
  saveDirectDelivery,
  goAudited
} from "@/api/plan/planCompanySale";
import {
  findSaleInfoForDirectDelivery,
  listNoAuditedPageByCode,
  listNoPageHaveInventoryByCode,
  listNoPageNoInventoryByCode
} from "@/api/plan/planCompanySaleInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanCompanySale",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 公司销售计划表格数据
      planCompanySaleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companySalePlanCode: null,
        externalDemandPlanCode: null,
        planStatus: null,
        planExcuteDate: getNowDateStr()
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companySalePlanCode: [
          { required: true, message: "销售计划号不能为空", trigger: "blur" }
        ],
        externalDemandPlanCode: [
          { required: true, message: "需求计划号不能为空", trigger: "blur" }
        ]
      },
      // 导入参数
      upload: {
        // 遮罩层
        loading: true,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/plan/planCompanySale/importData"
      },
      // 直送
      /*directDeliveryDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "直送信息录入页",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //明细数据
        planCompanySaleInfoList: [],
        //直送数据
        list: [],
        //主表id
        id: null,
        //计划号
        companySalePlanCode: null,
        //行号
        rowNo: 0,
      },*/
      //查询表单
      directDeliveryForm: {},
      // 表单校验
      directDeliveryRules: {
        itemId: [{ required: true, message: "物料不能为空", trigger: "blur" }],
        directDeliveryQuantity: [
          { required: true, message: "直送数量不能为空", trigger: "blur" }
        ]
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      // 审核
      auditedDialog: {
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "销售计划审核页",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //明细数据
        planCompanySaleInfoList: [],
        //勾选数据
        selectPlanCompanySaleInfoList: []
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公司销售计划列表 */
    getList() {
      this.loading = true;
      listPlanCompanySale(this.queryParams)
        .then(response => {
          this.planCompanySaleList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .finally(() => (this.loading = false));
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        companySalePlanCode: null,
        externalDemandPlanCode: null,
        planType: null,
        planStatus: null,
        planExcuteDate: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    // 表单重置
    resetDirectDeliveryDialogForm() {
      /*this.directDeliveryForm = {
        itemId: null,
        directDeliveryQuantity: 0,
      };*/
      this.resetForm("directDeliveryForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 多选框选中数据
    handleSelectionChange1(selection) {
      this.ids = selection.map(item => item.id);
      this.directDeliveryDialog.single = selection.length !== 1;
      this.directDeliveryDialog.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公司销售计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPlanCompanySale(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公司销售计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanCompanySale(this.form)
              .then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => (this.loading = false));
          } else {
            addPlanCompanySale(this.form)
              .then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => (this.loading = false));
          }
        }
      });
    },
    /**打开审核窗口*/
    openAuditedDialog() {
      this.auditedDialog.open = true;
      this.auditedDialog.loading = true;
      listNoAuditedPageByCode()
        .then(response => {
          if (response.data) {
            /*response.data.directDeliveryQuantity = this.directDeliveryForm.directDeliveryQuantity;
          this.directDeliveryDialog.rowNo = this.directDeliveryDialog.rowNo + 1;
          response.data.rowNo = this.directDeliveryDialog.rowNo;*/
            this.auditedDialog.planCompanySaleInfoList = response.data;
          } else {
            this.$modal.msgError("未查询到销售信息");
          }
        })
        .finally(() => (this.auditedDialog.loading = false));
    },
    // 多选框选中数据
    handleSelectionChangeAudited(selection) {
      this.auditedDialog.selectPlanCompanySaleInfoList = selection;
    },
    /**审核*/
    handleAudited() {
      const that = this;
      if (this.auditedDialog.selectPlanCompanySaleInfoList.length == 0) {
        this.$modal.msgError("请选择");
        return false;
      }
      this.$modal
        .confirm("请确认审核完成")
        .then(function() {
          that.auditedDialog.loading = true;
          return goAudited(that.auditedDialog.selectPlanCompanySaleInfoList);
        })
        .then(response => {
          if (response.code == 500) {
            this.$modal.msgError(response.msg);
          } else {
            this.$modal.msgSuccess("审核成功");
            this.auditedDialog.open = false;
            this.getList();
          }
        })
        .catch(e => {
          this.$modal.msgError(e);
        })
        .finally(() => (this.auditedDialog.loading = false));
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除公司销售计划编号为"' + ids + '"的数据项？')
        .then(function() {
          return delPlanCompanySale(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 发交操作 */
    /*handleDelivery(row) {
      const id = row.id ;
      this.$modal.confirm('是否确认生成发交单？').then(function() {
        return deliver(id);
      }).then(response => {
        this.$modal.msgSuccess(response.msg);
      }).catch(() => {});
    },*/
    /** 打开直送信息录入页面 */
    /*openDirectDeliveryDialog(row){
      this.directDeliveryDialog.open = true;
      this.directDeliveryDialog.companySalePlanCode = row.companySalePlanCode;
    },*/
    /**查询明细信息*/
    /*handlefindSaleInfo(){
      this.$refs["directDeliveryForm"].validate(valid => {
        if (valid) {
          this.directDeliveryDialog.loading = true;
          this.directDeliveryForm.companySalePlanCode = this.directDeliveryDialog.companySalePlanCode;
          findSaleInfoForDirectDelivery(this.directDeliveryForm).then(response => {
              if(response.data){
                /!*response.data.directDeliveryQuantity = this.directDeliveryForm.directDeliveryQuantity;
                this.directDeliveryDialog.rowNo = this.directDeliveryDialog.rowNo + 1;
                response.data.rowNo = this.directDeliveryDialog.rowNo;*!/
                this.directDeliveryDialog.planCompanySaleInfoList = response.data;
              }else{
                this.$modal.msgError("该物料不存在销售信息");
              }
            }).finally(()=>this.directDeliveryDialog.loading = false);
        }else{
          this.$modal.msgError("请先录入信息");
        }
      });
    },*/
    /**添加直送信息*/
    /*handleAddDirectDeliveryInfo(row){
      if(!this.directDeliveryForm.directDeliveryQuantity){
        this.$modal.msgError("请先录入直送数量");
        return false;
      }

      debugger;
      let tempData = {};
      let tempI = -1;
      for(let i = 0; i < this.directDeliveryDialog.list.length; i++){
        const item = this.directDeliveryDialog.list[i];
        if(item.id == row.id){
          tempData = item;
          tempI = i;
          break;
        }
      }
      //验证是否可以下发
      const demandQuantity = parseInt(row.demandQuantity);
      const issuedQuantity = parseInt(row.issuedQuantity);
      let directDeliveryQuantity = 0;
      if(tempI != -1){
        directDeliveryQuantity = parseInt(tempData.directDeliveryQuantity);
      }
      if(demandQuantity - issuedQuantity - directDeliveryQuantity < parseInt(this.directDeliveryForm.directDeliveryQuantity)){
        this.$modal.msgError("直送数量大于待下发数量,不可添加");
        return false;
      }
      if(tempI != -1){
        this.directDeliveryDialog.list.splice(tempI, 1);
        this.directDeliveryForm.directDeliveryQuantity = parseInt(this.directDeliveryForm.directDeliveryQuantity) + parseInt(tempData.directDeliveryQuantity);
      }
      const itemData = row;
      itemData.directDeliveryQuantity = this.directDeliveryForm.directDeliveryQuantity;
      /!*this.directDeliveryDialog.rowNo = this.directDeliveryDialog.rowNo + 1;
      itemData.rowNo = this.directDeliveryDialog.rowNo;*!/
      this.directDeliveryDialog.list.push(itemData);

      this.directDeliveryDialog.planCompanySaleInfoList = null;
      //this.resetDirectDeliveryDialogForm();
      this.$modal.msgSuccess("添加成功");
    },*/
    /**删除已添加数据*/
    /*handleDeleteDirectDeliveryList(row){
      let tempI = -1;
      for(let i = 0; i < this.directDeliveryDialog.list.length; i++){
        const item = this.directDeliveryDialog.list[i];
        if(item.id == row.id){
          tempI = i;
          break;
        }
      }
      if(tempI != -1){
        this.directDeliveryDialog.list.splice(tempI, 1);
      }
    },*/
    /**直送保存*/
    /*handleDirectDelivery(){
      if(this.directDeliveryDialog.list.length == 0){
        this.$modal.msgError("请先添加直送数据");
        return false;
      }
      this.directDeliveryDialog.loading = true;
      //传输时只需要一个id一个直送数量
      let paramList = [];
      for(let i = 0; i < this.directDeliveryDialog.list.length; i++) {
        const item = this.directDeliveryDialog.list[i];
        let temp = {};
        temp.id = item.id;
        temp.itemCode = item.itemCode;
        temp.directDeliveryQuantity = item.directDeliveryQuantity;
        paramList.push(temp);
      }
      saveDirectDelivery(paramList).then(response => {
        if(response.code == 500){
          this.$modal.msgError(response.msg);
        }else{
          this.$modal.msgSuccess(response.msg);
          this.directDeliveryDialog.loading = false;
          this.directDeliveryDialog.open = false;
          this.directDeliveryDialog.list = [];
          this.directDeliveryDialog.planCompanySaleInfoList = [];
          this.resetDirectDeliveryDialogForm();
          this.getList();
        }
      }).finally(()=>this.directDeliveryDialog.loading = false);
    },*/
    //远程搜索物料信息
    remoteSearchItem(itemCode) {
      if (itemCode !== "" && this.itemSearchLoading) {
        this.itemSearchLoading = false;
        setTimeout(() => {
          this.itemSearchLoading = true;
          searchItemList(itemCode).then(response => {
            this.itemList = response.data;
          });
        }, 300);
      } else {
        this.itemList = [];
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "plan/planCompanySale/export",
        {
          ...this.queryParams
        },
        `planCompanySale_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "公司销售计划导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "plan/planCompanySale/importTemplate",
        { ...this.queryParams },
        "公司销售计划导入模板.xlsx"
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.loading = true;
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.loading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", {
        dangerouslyUseHTMLString: true,
        callback: action => {
          this.getList();
        }
      });
    },

    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
