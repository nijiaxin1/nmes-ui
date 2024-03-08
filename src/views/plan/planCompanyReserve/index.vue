<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="储备计划号" prop="companyReservePlanCode">
        <el-input
          v-model="queryParams.companyReservePlanCode"
          placeholder="请输入储备计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="铸造计划号" prop="externalFoundryPlanCode">
        <el-input
          v-model="queryParams.externalFoundryPlanCode"
          placeholder="请输入铸造计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划执行日期" prop="planExcuteDate">
        <el-date-picker clearable
          v-model="queryParams.planExcuteDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划执行日期">
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
          v-hasPermi="['plan:planCompanyReserve:add']"
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
          v-hasPermi="['plan:planCompanyReserve:edit']"
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
          v-hasPermi="['plan:planCompanyReserve:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planCompanyReserve:export']"
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

    <el-table v-loading="loading" :data="planCompanyReserveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="储备计划号" align="center" prop="companyReservePlanCode">
        <template slot-scope="scope">
          <router-link :to="'/plan/companyReserve-info/index/' + scope.row.companyReservePlanCode" class="link-type">
            <span>{{ scope.row.companyReservePlanCode }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="铸造计划号" align="center" prop="externalFoundryPlanCode" />
      <!--<el-table-column label="计划类型" align="center" prop="planType" />-->
      <el-table-column label="状态" align="center" prop="planStatusName" />
      <el-table-column label="计划执行日期" align="center" prop="planExcuteDate">
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
            v-hasPermi="['plan:planCompanyReserve:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planCompanyReserve:remove']"
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

    <!-- 添加或修改公司储备计划对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="储备计划号" prop="companyReservePlanCode">
          <el-input v-model="form.companyReservePlanCode" placeholder="请输入储备计划号" />
        </el-form-item>
        <el-form-item label="铸造计划号" prop="externalFoundryPlanCode">
          <el-input v-model="form.externalFoundryPlanCode" placeholder="请输入铸造计划号" />
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
        <el-form-item label="状态(1.初始化2.已下发3.已完成)" prop="planStatus">
          <el-radio-group v-model="form.planStatus">
            <el-radio
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计划执行日期" prop="planExcuteDate">
          <el-date-picker clearable
            v-model="form.planExcuteDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划执行日期">
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
  </div>
</template>

<script>
  import { getNowDateStr } from '@/api/enumsSelect';
import { listPlanCompanyReserve, getPlanCompanyReserve, delPlanCompanyReserve,
    addPlanCompanyReserve, updatePlanCompanyReserve } from "@/api/plan/planCompanyReserve";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanCompanyReserve",
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
      // 公司储备计划表格数据
      planCompanyReserveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyReservePlanCode: null,
        externalFoundryPlanCode: null,
        planStatus: null,
        planExcuteDate: getNowDateStr(),
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyReservePlanCode: [
          { required: true, message: "储备计划号不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/plan/planCompanyReserve/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公司储备计划列表 */
    getList() {
      this.loading = true;
      listPlanCompanyReserve(this.queryParams).then(response => {
        this.planCompanyReserveList = response.rows;
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
        companyReservePlanCode: null,
        externalFoundryPlanCode: null,
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
      this.title = "添加公司储备计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanCompanyReserve(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公司储备计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanCompanyReserve(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanCompanyReserve(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除公司储备计划编号为"' + ids + '"的数据项？').then(function() {
        return delPlanCompanyReserve(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('plan/planCompanyReserve/export', {
        ...this.queryParams
      }, `planCompanyReserve_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "公司储备计划导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planCompanyReserve/importTemplate',{...this.queryParams}, '公司储备计划导入模板.xlsx');
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
