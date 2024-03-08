<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同号" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合同号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同类型" prop="contractType" >
        <el-select v-model="queryParams.contractType" placeholder="请选择合同类型">
          <el-option
            v-for="dict in contractTypeList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签订日期" prop="signDate">
        <el-date-picker clearable
          v-model="queryParams.signDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择签订日期">
        </el-date-picker>
      </el-form-item>
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['finance:financeContract:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="openAddFinanceContractDialog"
          v-hasPermi="['finance:financeContract:add']"
        >手动添加合同</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['finance:financeContract:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['finance:financeContract:export']"
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

    <el-table v-loading="loading" :data="financeContractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同号" align="center" prop="contractCode" >
        <template slot-scope="scope">
          <router-link :to="'/finance/financeContract-info/index/' + scope.row.contractCode" class="link-type">
            <span>{{ scope.row.contractCode }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="合同类型" align="center" prop="contractTypeName" />
      <el-table-column label="状态" align="center" prop="contractStatusName" />
      <el-table-column label="签订日期" align="center" prop="signDate" />
      <el-table-column label="厂家" align="center" prop="customerName" />
      <el-table-column label="审核人" align="center" prop="auditor" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAudit(scope.row)"
            v-hasPermi="['finance:financeContract:edit']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['finance:financeContract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finance:financeContract:remove']"
          >删除</el-button>
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

    <!-- 添加或修改合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同号" prop="contractCode">
          <el-input v-model="form.contractCode" placeholder="请输入合同号" />
          <el-button type="primary" plain @click="getCodeBySystem">系统生成</el-button>
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType" >
          <el-select v-model="form.contractType" placeholder="请选择合同类型">
            <el-option
              v-for="dict in contractTypeList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="状态" prop="contractStatus">
          <el-radio-group v-model="form.contractStatus">
            <el-radio
              v-for="dict in contractStatusList"
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="签订日期" prop="signDate">
          <el-date-picker clearable
            v-model="form.signDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择签订日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="厂家" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择厂家" filterable  remote
                     :remote-method="remoteSearchCustomer" clearable>
            <el-option
              v-for="dict in customerList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
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


    <!-- 新增对话框 -->
    <el-dialog :title="addFinanceContractDialog.title" v-loading.fullscreen.lock="addFinanceContractDialog.loading" :visible.sync="addFinanceContractDialog.open"  fullscreen center>
      <el-form :model="addFinanceContractFormAdd" ref="addFinanceContractFormAdd" :rules="addFinanceContractRulesAdd" size="small" :inline="true"  label-width="108px">
        <el-form-item label="合同号" prop="contractCode">
          <el-input v-model="addFinanceContractFormAdd.contractCode" placeholder="请输入合同号" />
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="addFinanceContractFormAdd.contractType" placeholder="请选择合同类型" clearable>
            <el-option
              v-for="dict in contractTypeList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂家" prop="customerId">
          <el-select v-model="addFinanceContractFormAdd.customerId" placeholder="请选择厂家" filterable  remote
                     :remote-method="remoteSearchCustomer" clearable>
            <el-option
              v-for="dict in customerList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签订日期" prop="signDate" >
          <el-date-picker clearable
                          v-model="addFinanceContractFormAdd.signDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择签订日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-table  :data="addFinanceContractDialog.dataList" >
        <el-table-column type="index" label="行号" align="center" prop="rowNo" />
        <el-table-column label="物料图号" align="center" prop="itemId" >
          <template slot-scope="scope">
            <el-select v-model="scope.row.itemId" filterable  remote
                       :remote-method="remoteSearchItem"
                       placeholder="请输入物料图号" clearable @change="(val) => synItemInfo(scope.$index, val)">
              <el-option
                v-for="dict in itemList"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select>
          </template></el-table-column>
        <el-table-column  label="物料名称" align="center" prop="itemName" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column  label="材质" align="center" prop="materialType" />
        <el-table-column  label="规格" align="center" prop="spec" />
        <el-table-column  label="型号" align="center" prop="model" />
        <el-table-column label="价格" align="center" prop="effectPrice" >
          <template slot-scope="{ row }">
            <el-input v-model="row.effectPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="生效时间" align="center" prop="effectStartTime" >
          <template slot-scope="{ row }">
            <el-date-picker clearable
                            v-model="row.effectStartTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择生效时间">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="失效时间" align="center" prop="effectEndTime" >
          <template slot-scope="{ row }">
          <el-date-picker clearable
                          v-model="row.effectEndTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择失效时间">
          </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delAddFinanceContractRow(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer" >
        <el-button type="success" icon="el-icon-plus" @click="addAddFinanceContractRow">加一行</el-button>
        <el-button type="primary" @click="handleAddFinanceContract">确 定</el-button>
        <el-button @click="addFinanceContractDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getFinanceContractType, getFinanceContractStatus, searchCustomerList, searchItemList} from '@/api/enumsSelect';
import { listFinanceContract, getFinanceContract, delFinanceContract,
    addFinanceContract, updateFinanceContract, doAddFinanceContract,
  getCodeBySystem, auditContract } from "@/api/finance/financeContract";
import { getToken } from "@/utils/auth";

export default {
  name: "FinanceContract",
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
      // 合同表格数据
      financeContractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractCode: null,
        contractType: null,
        contractStatus: null,
        signDate: null,
        customerId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contractCode: [
          { required: true, message: "合同号不能为空", trigger: "blur" }
        ],
        contractType: [
          { required: true, message: "合同类型不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "厂家不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/finance/financeContract/importData"
      },
      contractTypeList:[],
      contractStatusList:[],
      // 新增合同
      addFinanceContractDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "合同生成",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //明细数据
        dataList: [],
      },
      //录入表单
      addFinanceContractFormAdd:{},
      // 表单校验
      addFinanceContractRulesAdd: {
        customerId: [
          { required: true, message: "厂家不能为空", trigger: "change" }
        ],
        contractType: [
          { required: true, message: "合同类型不能为空", trigger: "change" }
        ],
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //客户信息
      customerList: [],
      customerSearchLoading: true,
    };
  },
  created() {
    this.selectFinanceContractType();
    this.selectFinanceContractStatus();
    this.getList();
  },
  methods: {
    //合同类型
    selectFinanceContractType() {
      getFinanceContractType().then(response => {
        this.contractTypeList = response.data;
      });
    },
    //合同状态
    selectFinanceContractStatus() {
      getFinanceContractStatus().then(response => {
        this.contractStatus = response.data;
      });
    },
    /** 查询合同列表 */
    getList() {
      this.loading = true;
      listFinanceContract(this.queryParams).then(response => {
        this.financeContractList = response.rows;
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
        contractCode: null,
        contractType: null,
        contractStatus: null,
        signDate: null,
        customerId: null,
        customerName: null,
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
      this.title = "添加合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFinanceContract(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改合同";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFinanceContract(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addFinanceContract(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          }
        }
      });
    },
    /** 审核 */
    handleAudit(row) {
        this.loading = true;
      this.$modal.confirm('是否确认审核合同"' + row.contractCode + '"？').then(function() {
        return auditContract(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审核成功");
      }).catch((e) => {this.$modal.msgError(e);}).finally(()=>this.loading = false);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除合同编号为"' + ids + '"的数据项？').then(function() {
        return delFinanceContract(ids);
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
    /**打开新增合同窗口*/
    openAddFinanceContractDialog(){
      this.addFinanceContractDialog.open = true;
    },
    /**验证下发数量*/
    validateDeliveryQuantity(val){

    },
    /**删除一行*/
    delAddFinanceContractRow(index, row) {
      this.addFinanceContractDialog.dataList.splice(index,1);
    },
    /**加一行*/
    addAddFinanceContractRow(){
      this.addFinanceContractDialog.dataList.push({});
    },
    synItemInfo(index, val){
      const itemList = this.itemList;
      let itemInfo;
      for (let i = 0; i < itemList.length; i++){
        if(val == itemList[i].code){
          itemInfo = itemList[i];
          break;
        }
      }
      this.addFinanceContractDialog.dataList[index].itemName = itemInfo.itemName;
      this.addFinanceContractDialog.dataList[index].unit = itemInfo.unit;
      this.addFinanceContractDialog.dataList[index].materialType = itemInfo.materialType;
      this.addFinanceContractDialog.dataList[index].spec = itemInfo.spec;
      this.addFinanceContractDialog.dataList[index].model = itemInfo.model;
      //debugger;
      //this.$forceUpdate();
    },
    /**新增合同*/
    handleAddFinanceContract(){
      if(this.addFinanceContractDialog.dataList.length == 0){
        this.$modal.msgError("请添加合同明细数据");
        return false;
      }
      const that = this;
      this.$refs["addFinanceContractFormAdd"].validate(valid => {
        if(valid) {
          //验证与筛选数量
          const list = that.addFinanceContractDialog.dataList;
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            debugger;
            const effectPrice = parseFloat(item.effectPrice);
            if (isNaN(effectPrice) || effectPrice <= 0) {
              this.$modal.msgError("第" + (i + 1) + "行价格需为大于0的数");
              return false;
            }
            if (!item.itemId) {
              this.$modal.msgError("第" + (i + 1) + "行未选择物料");
              return false;
            }
            if (!item.effectStartTime) {
              this.$modal.msgError("第" + (i + 1) + "行未选择生效时间");
              return false;
            }
            if (!item.effectEndTime) {
              this.$modal.msgError("第" + (i + 1) + "行未选择失效时间");
              return false;
            }
          }
          this.$modal.confirm('是否确认新增合同').then(function () {
            that.addFinanceContractDialog.loading = true;
            that.addFinanceContractFormAdd.infoList = list;
            return doAddFinanceContract(that.addFinanceContractFormAdd);
          }).then(response => {
            this.$modal.msgSuccess(response.msg);
            if (response.code != 500) {
              this.addFinanceContractDialog.open = false;
              this.getList();
            }
          }).catch((e) => {
            this.$modal.msgError(e);
          }).finally(() => this.addFinanceContractDialog.loading = false);
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('finance/financeContract/export', {
        ...this.queryParams
      }, `financeContract_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "合同导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('finance/financeContract/importTemplate',{...this.queryParams}, '合同导入模板.xlsx');
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
    },
    //系统生成合同号
    getCodeBySystem(){
      getCodeBySystem().then(response => {
        this.form.contractCode = response.data;
      }).catch( e =>{
        window.alert(e);
      })
    }
  }
};
</script>
