<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="销售计划号" prop="companySalePlanCode">
        <el-input
          v-model="queryParams.companySalePlanCode"
          placeholder="请输入销售计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料图号" prop="itemId">
        <el-select v-model="queryParams.itemId" filterable  remote
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
      <el-form-item label="状态" prop="planStatusS" >
        <el-select v-model="planStatusS" multiple  placeholder="请选择状态">
          <el-option
            v-for="dict in planStatusList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机加工单位" prop="abuttingJointManufacturerId">
        <el-select v-model="queryParams.abuttingJointManufacturerId" placeholder="请选择机加工单位" filterable  remote
                   :remote-method="remoteSearchCustomer">
          <el-option
            v-for="dict in customerList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
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
          v-hasPermi="['plan:planCompanySaleInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['plan:planCompanySaleInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['plan:planCompanySaleInfo:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planCompanySaleInfo:export']"
        >导出</el-button>
      </el-col>
        <!--<el-col :span="1.5">
            <el-button
                    type="info"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
            >导入</el-button>
        </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planCompanySaleInfoList" @selection-change="handleSelectionChange">
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
      <el-table-column label="销售数量" align="center" prop="auditedQuantity" />
      <el-table-column label="已生成出库数量" align="center" prop="issuedQuantity" />
      <el-table-column label="已发交数量" align="center" prop="distributedQuantity" />
      <!--<el-table-column label="已结算数量" align="center" prop="settlementQuantity" />-->
      <el-table-column label="状态" align="center" prop="planStatusName" />
      <el-table-column label="机加工单位" align="center" prop="abuttingJointManufacturer" />
      <!--<el-table-column label="配送出库单号" align="center" prop="distributedOutCode" />
    <el-table-column label="配送出库时间" align="center" prop="distributedOutTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.distributedOutTime) }}</span>
        </template>
    </el-table-column>-->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row)"
          v-hasPermi="['plan:planCompanySaleInfo:edit']"
        >修改</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planCompanySaleInfo:remove']"
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

    <!-- 添加或修改公司销售计划明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="销售计划号" prop="companySalePlanCode">
          <el-input v-model="form.companySalePlanCode" placeholder="请输入销售计划号" :disabled="true"/>
        </el-form-item>
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" :disabled="true" />
        </el-form-item>
        <el-form-item label="行号" prop="rowNo">
          <el-input v-model="form.rowNo" placeholder="请输入行号":disabled="true" />
        </el-form-item>
        <!--<el-form-item label="需求配送时间" prop="distributionTime" :disabled="true">
          <el-date-picker clearable
            v-model="form.distributionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择需求配送时间">
          </el-date-picker>
        </el-form-item>-->
        <el-form-item label="需求数量" prop="demandQuantity">
          <el-input v-model="form.demandQuantity" placeholder="请输入需求数量" :disabled="true"/>
        </el-form-item>
        <el-form-item label="销售数量" prop="auditedQuantity">
          <el-input v-model="form.auditedQuantity" placeholder="请输入销售数量" />
        </el-form-item>
        <!--<el-form-item label="已下发数量" prop="issuedQuantity">
          <el-input v-model="form.issuedQuantity" placeholder="请输入已下发数量" />
        </el-form-item>
        <el-form-item label="已发交数量" prop="distributedQuantity">
          <el-input v-model="form.distributedQuantity" placeholder="请输入已发交数量" />
        </el-form-item>
        <el-form-item label="已结算数量" prop="settlementQuantity">
          <el-input v-model="form.settlementQuantity" placeholder="请输入已结算数量" />
        </el-form-item>
        <el-form-item label="状态(1.初始化2.已下发3.已完成5.已结算)" prop="planStatus">
          <el-radio-group v-model="form.planStatus">
            <el-radio
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="机加工单位" prop="abuttingJointManufacturer">
          <el-input v-model="form.abuttingJointManufacturer" placeholder="请输入机加工单位":disabled="true" />
        </el-form-item>
        <!--<el-form-item label="配送出库单号" prop="distributedOutCode">
          <el-input v-model="form.distributedOutCode" placeholder="请输入配送出库单号" />
        </el-form-item>
        <el-form-item label="配送出库时间" prop="distributedOutTime">
          <el-date-picker clearable
            v-model="form.distributedOutTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择配送出库时间">
          </el-date-picker>
        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

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
  </div>
</template>

<script>
  import { searchItemList, getSalePlanStatus } from '@/api/enumsSelect';
import { listPlanCompanySaleInfo, getPlanCompanySaleInfo, delPlanCompanySaleInfo,
    addPlanCompanySaleInfo, updatePlanCompanySaleInfo } from "@/api/plan/planCompanySaleInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanCompanySaleInfo",
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
      // 公司销售计划明细表格数据
      planCompanySaleInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //状态多选值
      planStatusS: '1,3',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companySalePlanCode: null,
        itemId: null,
        planStatus: null,
        abuttingJointManufacturerId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companySalePlanCode: [
          { required: true, message: "销售计划号不能为空", trigger: "blur" }
        ],
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
      },
      // 导入参数
      upload: {
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
          url: process.env.VUE_APP_BASE_API + "/plan/planCompanySaleInfo/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      planStatusList:[],
      //客户信息
      customerList: [],
      customerSearchLoading: true,
    };
  },
  created() {
    this.selectSalePlanStatus();
    this.getList();
  },
  methods: {
    //结算状态
    selectSalePlanStatus() {
      getSalePlanStatus().then(response => {
        this.planStatusList = response.data;
      });
    },
    /** 查询公司销售计划明细列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      this.queryParams.params.planStatusS = this.planStatusS;
      listPlanCompanySaleInfo(this.queryParams).then(response => {
        this.planCompanySaleInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).finally(()=>this.loading = false);
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
        itemId: null,
        rowNo: null,
        distributionTime: null,
        demandQuantity: null,
        issuedQuantity: null,
        distributedQuantity: null,
        settlementQuantity: null,
        planStatus: null,
        abuttingJointManufacturer: null,
        distributedOutCode: null,
        distributedOutTime: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公司销售计划明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanCompanySaleInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公司销售计划明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanCompanySaleInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanCompanySaleInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除公司销售计划明细编号为"' + ids + '"的数据项？').then(function() {
        return delPlanCompanySaleInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    //远程搜索物料信息
    remoteSearchItem(itemCode) {
      if (itemCode !== '' && this.itemSearchLoading) {
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

    //远程搜索客户信息
    remoteSearchCustomer(customerName) {
      if (customerName !== '' && this.customerSearchLoading) {
        this.customerSearchLoading = false;
        setTimeout(() => {
          this.customerSearchLoading = true;
          searchCustomerList(customerName).then(response => {
            this.customerList = response.data;
          });
        }, 300);
      } else {
        this.customerList = [];
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('plan/planCompanySaleInfo/export', {
        ...this.queryParams
      }, `planCompanySaleInfo_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "公司销售计划明细导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planCompanySaleInfo/importTemplate',{...this.queryParams}, '公司销售计划明细导入模板.xlsx');
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
        this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true, callback: action=>{
                this.getList();
            } });

    },

    // 提交上传文件
    submitFileForm() {
        this.$refs.upload.submit();
    }
  }
};
</script>
