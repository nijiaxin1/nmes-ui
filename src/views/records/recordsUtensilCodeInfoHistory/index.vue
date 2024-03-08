<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="器具码" prop="utensilCode">
        <el-input
          v-model="queryParams.utensilCode"
          placeholder="请输入器具码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下游器具码" prop="downUtensilCode">
        <el-input
          v-model="queryParams.downUtensilCode"
          placeholder="请输入下游器具码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料图号" prop="itemId">
        <el-input
          v-model="queryParams.itemId"
          placeholder="请输入物料图号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序" prop="processesId">
        <el-input
          v-model="queryParams.processesId"
          placeholder="请输入工序"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="员工" prop="planOperateId">
        <el-input
          v-model="queryParams.planOperateId"
          placeholder="请输入员工"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产日期" prop="produceDate">
        <el-date-picker clearable
          v-model="queryParams.produceDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择生产日期">
        </el-date-picker>
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
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:add']"
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
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:edit']"
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
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['records:recordsUtensilCodeInfoHistory:export']"
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

    <el-table v-loading="loading" :data="recordsUtensilCodeInfoHistoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="器具码" align="center" prop="utensilCode" />
      <el-table-column label="下游器具码" align="center" prop="downUtensilCode" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="数量" align="center" prop="workNum" />
      <el-table-column label="工艺" align="center" prop="technologyCode" />
      <el-table-column label="工序" align="center" prop="processesName" />
      <el-table-column label="员工" align="center" prop="planOperateBy" />
      <el-table-column label="生产日期" align="center" prop="produceDate" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.produceDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['records:recordsUtensilCodeInfoHistory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['records:recordsUtensilCodeInfoHistory:remove']"
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

    <!-- 添加或修改器具码历史信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="器具码" prop="utensilCode">
          <el-input v-model="form.utensilCode" placeholder="请输入器具码" />
        </el-form-item>
        <el-form-item label="下游器具码" prop="downUtensilCode">
          <el-input v-model="form.downUtensilCode" placeholder="请输入下游器具码" />
        </el-form-item>
        <el-form-item label="物料图号" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="数量" prop="workNum">
          <el-input v-model="form.workNum" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="工序" prop="processesName">
          <el-input v-model="form.processesName" placeholder="请输入工序" />
        </el-form-item>
        <el-form-item label="员工" prop="planOperateBy">
          <el-input v-model="form.planOperateBy" placeholder="请输入员工" />
        </el-form-item>
        <el-form-item label="生产日期" prop="produceDate">
          <el-date-picker clearable
            v-model="form.produceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择生产日期">
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
import { listRecordsUtensilCodeInfoHistory, getRecordsUtensilCodeInfoHistory, delRecordsUtensilCodeInfoHistory,
    addRecordsUtensilCodeInfoHistory, updateRecordsUtensilCodeInfoHistory } from "@/api/records/recordsUtensilCodeInfoHistory";
import { getToken } from "@/utils/auth";

export default {
  name: "RecordsUtensilCodeInfoHistory",
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
      // 器具码历史信息表格数据
      recordsUtensilCodeInfoHistoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        utensilCode: null,
        downUtensilCode: null,
        itemId: null,
        workNum: null,
        processesId: null,
        planOperateId: null,
        produceDate: null,
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
          url: process.env.VUE_APP_BASE_API + "/records/recordsUtensilCodeInfoHistory/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询器具码历史信息列表 */
    getList() {
      this.loading = true;
      listRecordsUtensilCodeInfoHistory(this.queryParams).then(response => {
        this.recordsUtensilCodeInfoHistoryList = response.rows;
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
        utensilCode: null,
        downUtensilCode: null,
        itemId: null,
        itemCode: null,
        workNum: null,
        processesId: null,
        processesName: null,
        planOperateId: null,
        planOperateBy: null,
        produceDate: null,
        planWorkshopPersonalId: null,
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
      this.title = "添加器具码历史信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecordsUtensilCodeInfoHistory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改器具码历史信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecordsUtensilCodeInfoHistory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addRecordsUtensilCodeInfoHistory(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除器具码历史信息编号为"' + ids + '"的数据项？').then(function() {
        return delRecordsUtensilCodeInfoHistory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('records/recordsUtensilCodeInfoHistory/export', {
        ...this.queryParams
      }, `recordsUtensilCodeInfoHistory_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "器具码历史信息导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('records/recordsUtensilCodeInfoHistory/importTemplate',{...this.queryParams}, '器具码历史信息导入模板.xlsx');
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
