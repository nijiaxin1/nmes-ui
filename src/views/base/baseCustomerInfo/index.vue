<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户简称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户简称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户性质" prop="customerNature">
        <el-select v-model="queryParams.customerNature" placeholder="请选择客户性质" clearable>
          <el-option
            v-for="dict in dict.type.customer_nature_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户规模" prop="customerSize">
        <el-select v-model="queryParams.customerSize" placeholder="请选择客户规模" clearable>
          <el-option
            v-for="dict in dict.type.customer_size_type"
            :key="dict.value"
            :label="dict.value"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input
          v-model="queryParams.contacts"
          placeholder="请输入联系人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="telPhone">
        <el-input
          v-model="queryParams.telPhone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['base:baseCustomerInfo:add']"
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
          v-hasPermi="['base:baseCustomerInfo:edit']"
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
          v-hasPermi="['base:baseCustomerInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:baseCustomerInfo:export']"
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

    <el-table v-loading="loading" :data="baseCustomerInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="客户简称" align="center" prop="customerName" />
      <el-table-column label="客户全称" align="center" prop="customerFullName" />
      <el-table-column label="客户性质" align="center" prop="customerNature">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.customer_nature_type" :value="scope.row.customerNature"/>
        </template>
      </el-table-column>
      <el-table-column label="客户规模" align="center" prop="customerSize">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.customer_size_type" :value="scope.row.customerSize"/>
        </template>
      </el-table-column>
      <el-table-column label="地理区域" align="center" prop="geographyArea" />
      <el-table-column label="经营状况" align="center" prop="businessStatus" />
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系电话" align="center" prop="telPhone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="单产能力" align="center" prop="unlinedProducePower" />
      <el-table-column label="拆卸能力" align="center" prop="disassembleNum" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:baseCustomerInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:baseCustomerInfo:remove']"
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

    <!-- 添加或修改客户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户简称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户简称" />
        </el-form-item>
        <el-form-item label="客户全称" prop="customerFullName">
          <el-input v-model="form.customerFullName" placeholder="请输入客户全称" />
        </el-form-item>
        <el-form-item label="客户性质" prop="customerNature">
          <el-select v-model="form.customerNature" placeholder="请选择客户性质">
              <el-option
                      v-for="dict in dict.type.customer_nature_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="客户规模" prop="customerSize">
          <el-select v-model="form.customerSize" placeholder="请选择客户规模">
              <el-option
                      v-for="dict in dict.type.customer_size_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="地理区域" prop="geographyArea">
          <el-input v-model="form.geographyArea" placeholder="请输入地理区域" />
        </el-form-item>
        <el-form-item label="经营状况" prop="businessStatus">
          <el-input v-model="form.businessStatus" placeholder="请输入经营状况" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telPhone">
          <el-input v-model="form.telPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="单产能力" prop="unlinedProducePower">
          <el-input v-model="form.unlinedProducePower" placeholder="请输入单产能力" />
        </el-form-item>
        <el-form-item label="拆卸能力" prop="disassembleNum">
          <el-input v-model="form.disassembleNum" placeholder="请输入拆卸能力" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标识" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识" />
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
import { listBaseCustomerInfo, getBaseCustomerInfo, delBaseCustomerInfo,
    addBaseCustomerInfo, updateBaseCustomerInfo } from "@/api/base/baseCustomerInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "BaseCustomerInfo",
  dicts: ['customer_size_type', 'customer_nature_type'],
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
      // 客户信息表格数据
      baseCustomerInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerName: null,
        customerNature: null,
        customerSize: null,
        contacts: null,
        telPhone: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        customerName: [
          { required: true, message: "客户简称不能为空", trigger: "blur" }
        ],
        customerNature: [
          { required: true, message: "客户性质不能为空", trigger: "change" }
        ],
        customerSize: [
          { required: true, message: "客户规模不能为空", trigger: "change" }
        ],
        contacts: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        telPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/base/baseCustomerInfo/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客户信息列表 */
    getList() {
      this.loading = true;
      listBaseCustomerInfo(this.queryParams).then(response => {
        this.baseCustomerInfoList = response.rows;
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
        customerName: null,
        customerNature: null,
        customerSize: null,
        geographyArea: null,
        businessStatus: null,
        contacts: null,
        telPhone: null,
        email: null,
        address: null,
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
      this.title = "添加客户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBaseCustomerInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBaseCustomerInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addBaseCustomerInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户信息编号为"' + ids + '"的数据项？').then(function() {
        return delBaseCustomerInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('base/baseCustomerInfo/export', {
        ...this.queryParams
      }, `baseCustomerInfo_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "客户信息导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('base/baseCustomerInfo/importTemplate',{...this.queryParams}, '客户信息导入模板.xlsx');
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
