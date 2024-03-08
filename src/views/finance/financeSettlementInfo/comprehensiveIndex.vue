<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="结算单号" prop="settlementCode">
      <el-input
        v-model="queryParams.settlementCode"
        placeholder="请输入结算单号"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
      <el-form-item label="物料图号" prop="itemId">
        <el-select v-model="queryParams.itemId" filterable  remote
                   :remote-method="remoteSearchItem"
                   placeholder="请输入物料图号" clearable >
          <el-option
            v-for="dict in itemList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算类型" prop="settlementType" >
        <el-select v-model="queryParams.settlementType" placeholder="请选择结算类型">
          <el-option
            v-for="dict in contractTypeList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算状态" prop="settlementStatus" >
        <el-select v-model="queryParams.settlementStatus" placeholder="请选择结算状态">
          <el-option
            v-for="dict in settlementStatusList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="结算日期" prop="settlementDate">
        <el-date-picker clearable
                        v-model="queryParams.settlementDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择结算日期">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item label="厂家" prop="customerId">
        <el-select v-model="queryParams.customerId" placeholder="请选择厂家" filterable  remote
                   :remote-method="remoteSearchCustomer" clearable>
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
          v-hasPermi="['finance:financeSettlementInfo:add']"
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
          v-hasPermi="['finance:financeSettlementInfo:edit']"
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
          v-hasPermi="['finance:financeSettlementInfo:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['finance:financeSettlementInfo:export']"
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

    <el-table v-loading="loading" :data="financeSettlementInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="结算单据号" align="center" prop="settlementCode" />
      <el-table-column label="结算类型" align="center" prop="settlementTypeName" />
      <el-table-column label="结算状态" align="center" prop="settlementStatusName" />
      <el-table-column label="票号" align="center" prop="invoiceCode" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="行号" align="center" prop="rowNo" />
      <el-table-column label="数量" align="center" prop="itemQuantity" />
      <el-table-column label="合同号" align="center" prop="contractCode" />
      <el-table-column label="合同价" align="center" prop="effectPrice" />
      <el-table-column label="总价" align="center" prop="settlementPrice" />
    <el-table-column label="结算时间" align="center" prop="settlementTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.settlementTime) }}</span>
        </template>
    </el-table-column>
      <el-table-column label="厂家" align="center" prop="customerName" />
      <el-table-column label="关联单号" align="center" prop="relationCode" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['finance:financeSettlementInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finance:financeSettlementInfo:remove']"
          >删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


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
  import { getFinanceContractType, getFinanceSettlementStatus, searchCustomerList, searchItemList} from '@/api/enumsSelect';
import { listFinanceSettlementInfo, getFinanceSettlementInfo, delFinanceSettlementInfo,
    addFinanceSettlementInfo, updateFinanceSettlementInfo } from "@/api/finance/financeSettlementInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "FinanceSettlementInfo",
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
      // 结算明细表格数据
      financeSettlementInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        settlementCode: null,
        settlementType: null,
        settlementStatus: null,
        customerId: null,
        itemId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        delFlag: [
          { required: true, message: "删除标识不能为空", trigger: "blur" }
        ]
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
          url: process.env.VUE_APP_BASE_API + "/finance/financeSettlementInfo/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //客户信息
      customerList: [],
      customerSearchLoading: true,
      contractTypeList:[],
      settlementStatusList:[],
    };
  },
  created() {
    this.selectFinanceContractType();
    this.getFinanceSettlementStatus();
    this.getList();
  },
  methods: {
    //合同类型
    selectFinanceContractType() {
      getFinanceContractType().then(response => {
        this.contractTypeList = response.data;
      });
    },
    //结算状态
    getFinanceSettlementStatus() {
      getFinanceSettlementStatus().then(response => {
        this.settlementStatusList = response.data;
      });
    },
    /** 查询结算明细列表 */
    getList() {
      this.loading = true;
      listFinanceSettlementInfo(this.queryParams).then(response => {
        this.financeSettlementInfoList = response.rows;
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
        settlementCode: null,
        itemId: null,
        itemCode: null,
        rowNo: null,
        itemQuantity: null,
        contractCode: null,
        contractInfoId: null,
        effectPrice: null,
        settlementPrice: null,
        settlementTime: null,
        customerId: null,
        customerName: null,
        relationCodeInfoId: null,
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
      this.title = "添加结算明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFinanceSettlementInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改结算明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFinanceSettlementInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addFinanceSettlementInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除结算明细编号为"' + ids + '"的数据项？').then(function() {
        return delFinanceSettlementInfo(ids);
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
      this.download('finance/financeSettlementInfo/export', {
        ...this.queryParams
      }, `financeSettlementInfo_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "结算明细导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('finance/financeSettlementInfo/importTemplate',{...this.queryParams}, '结算明细导入模板.xlsx');
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
