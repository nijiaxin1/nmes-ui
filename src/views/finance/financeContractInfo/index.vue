<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
          v-hasPermi="['finance:financeContractInfo:add']"
        >新增</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['finance:financeContractInfo:edit']"
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
          v-hasPermi="['finance:financeContractInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['finance:financeContractInfo:export']"
        >导出</el-button>
      </el-col>
        <el-col :span="1.5">
            <el-button
                    type="info"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
            >导入</el-button>
        </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="financeContractInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同号" align="center" prop="contractCode" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <!--<el-table-column label="行号" align="center" prop="rowNo" />-->
      <el-table-column label="价格" align="center" prop="effectPrice" />
    <el-table-column label="生效时间" align="center" prop="effectStartTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.effectStartTime) }}</span>
        </template>
    </el-table-column>
    <el-table-column label="失效时间" align="center" prop="effectEndTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.effectEndTime) }}</span>
        </template>
    </el-table-column>
      <el-table-column label="厂家" align="center" prop="customerName" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="材质" align="center" prop="materialType" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="型号" align="center" prop="model" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['finance:financeContractInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finance:financeContractInfo:remove']"
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

    <!-- 添加或修改合同明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料图号" prop="itemCode">
          <el-select v-model="form.itemId" filterable  remote
                     :remote-method="remoteSearchItem"
                     placeholder="请输入物料图号" clearable  @change="synItemInfo">
            <el-option
              v-for="dict in itemList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="effectPrice">
          <el-input v-model="form.effectPrice" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="生效时间" prop="effectStartTime">
          <el-date-picker clearable
            v-model="form.effectStartTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择生效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间" prop="effectEndTime">
          <el-date-picker clearable
            v-model="form.effectEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择失效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物料名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物料名称" disabled/>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位"  disabled/>
        </el-form-item>
        <el-form-item label="材质" prop="materialType">
          <el-input v-model="form.materialType" placeholder="请输入材质"  disabled/>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="form.spec" placeholder="请输入规格"  disabled/>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入型号"  disabled/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"  disabled/>
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
                  :action="upload.url + '?updateSupport=' + upload.updateSupport+'&contractCode='+ queryParams.contractCode"
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
  import { searchItemList} from '@/api/enumsSelect';
import { listFinanceContractInfo, getFinanceContractInfo, delFinanceContractInfo,
    addFinanceContractInfo, updateFinanceContractInfo } from "@/api/finance/financeContractInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "FinanceContractInfo",
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
      // 合同明细表格数据
      financeContractInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractCode: null,
        itemId: null,
        customerId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contractCode: [
          { required: true, message: "合同号不能为空", trigger: "blur" }
        ],
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        itemCode: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "厂家不能为空", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "厂家不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/finance/financeContractInfo/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
    };
  },
  created() {
    this.queryParams.contractCode = this.$route.params && this.$route.params.contractCode;
    this.getList();
  },
  methods: {
    /** 查询合同明细列表 */
    getList() {
      this.loading = true;
      listFinanceContractInfo(this.queryParams).then(response => {
        this.financeContractInfoList = response.rows;
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
        itemId: null,
        itemCode: null,
        rowNo: null,
        effectPrice: null,
        effectStartTime: null,
        effectEndTime: null,
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
      this.title = "添加合同明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFinanceContractInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改合同明细";
        this.remoteSearchItem(this.form.itemCode);
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFinanceContractInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addFinanceContractInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除合同明细编号为"' + ids + '"的数据项？').then(function() {
        return delFinanceContractInfo(ids);
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
    synItemInfo(val){
      const itemList = this.itemList;
      let itemInfo;
      for (let i = 0; i < itemList.length; i++){
        if(val == itemList[i].code){
          itemInfo = itemList[i];
          break;
        }
      }
      this.form.itemName = itemInfo.itemName;
      this.form.unit = itemInfo.unit;
      this.form.materialType = itemInfo.materialType;
      this.form.spec = itemInfo.spec;
      this.form.model = itemInfo.model;
      //debugger;
      //this.$forceUpdate();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('finance/financeContractInfo/export', {
        ...this.queryParams
      }, `financeContractInfo_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "合同明细导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('finance/financeContractInfo/importTemplate',{...this.queryParams}, '合同明细导入模板.xlsx');
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
