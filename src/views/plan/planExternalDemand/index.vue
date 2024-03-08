<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="需求计划号" prop="externalDemandPlanCode">
        <el-input
          v-model="queryParams.externalDemandPlanCode"
          placeholder="请输入需求计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划配送日期" prop="planExcuteDate">
        <el-date-picker clearable
          v-model="queryParams.planExcuteDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划配送日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="原计划号" prop="sourcePlanCode">
        <el-input
          v-model="queryParams.sourcePlanCode"
          placeholder="请输入原计划号"
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
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['plan:planExternalDemand:add']"
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
          v-hasPermi="['plan:planExternalDemand:edit']"
        >修改</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleDelete"
          v-hasPermi="['plan:planExternalDemand:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          :disabled="single"
          @click="distributeDemand"
          v-hasPermi="['plan:planExternalDemand:edit']"
        >下发</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planExternalDemand:export']"
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

    <el-table v-loading="loading" :data="planExternalDemandList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="需求计划号" align="center" prop="externalDemandPlanCode" >
        <template slot-scope="scope">
          <router-link :to="'/plan/externalDemand-info/index/' + scope.row.externalDemandPlanCode" class="link-type">
            <span>{{ scope.row.externalDemandPlanCode }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="导入文件名称" align="center" prop="importFileName" />
      <!--<el-table-column label="计划类型(1.铸造计划,2.需求计划)" align="center" prop="planType" />-->
      <el-table-column label="状态" align="center" prop="planStatusName" />
      <el-table-column label="计划配送日期" align="center" prop="planExcuteDate" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planExcuteDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原计划号" align="center" prop="sourcePlanCode" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planExternalDemand:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planExternalDemand:remove']"
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

    <!-- 添加或修改需求计划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="需求计划号" prop="externalDemandPlanCode">
          <el-input v-model="form.externalDemandPlanCode" placeholder="请输入需求计划号" />
        </el-form-item>
        <el-form-item label="导入文件名称" prop="importFileName">
          <el-input v-model="form.importFileName" placeholder="请输入导入文件名称" />
        </el-form-item>
        <!--<el-form-item label="计划类型(1.铸造计划,2.需求计划)" prop="planType">
          <el-select v-model="form.planType" placeholder="请选择计划类型(1.铸造计划,2.需求计划)">
            <el-option
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="状态" prop="planStatus">
          <el-select v-model="form.planStatus" placeholder="请选择状态">
            <el-option
              v-for="dict in planExternalDemandStatusList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划配送日期" prop="planExcuteDate">
          <el-date-picker clearable
            v-model="form.planExcuteDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划配送日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="原计划号" prop="sourcePlanCode">
          <el-input v-model="form.sourcePlanCode" placeholder="请输入原计划号" />
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
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" >

        <el-form ref="upload.fileForm" label-width="100px" :model="upload.fileForm" label-position="left" :rules="fileRules">
          <el-form-item label="计划配送日期" prop="planExcuteDate">
            <el-date-picker clearable
                            v-model="upload.fileForm.planExcuteDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择请选择计划配送日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="原计划号" prop="sourcePlanCode">
            <el-input v-model="upload.fileForm.sourcePlanCode"></el-input>
          </el-form-item>
        </el-form>
          <hr/><br/>
          <el-upload
                  ref="upload"
                  :limit="1"
                  accept=".xlsx, .xls"
                  :headers="upload.headers"
                  :action="upload.url + '?updateSupport=' + upload.updateSupport"
                  :disabled="upload.isUploading"
                  :data="upload.fileForm"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :before-upload="handleBeforeUpload"
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
          <div>
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
  import { getPlanExternalDemandStatus, getNowDateStr } from '@/api/enumsSelect';
import { listPlanExternalDemand, getPlanExternalDemand, delPlanExternalDemand,
    addPlanExternalDemand, updatePlanExternalDemand, distributeDemand } from "@/api/plan/planExternalDemand";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanExternalDemand",
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
      // 需求计划表格数据
      planExternalDemandList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        externalDemandPlanCode: null,
        planType: null,
        planStatus: null,
        planExcuteDate: getNowDateStr(),
        sourcePlanCode: null,
      },
      // 表单参数
      form: {},
      fileForm: {},
      // 表单校验
      rules: {
        externalDemandPlanCode: [
          { required: true, message: "需求计划号不能为空", trigger: "blur" }
        ],
        /*planType: [
          { required: true, message: "计划类型(1.铸造计划,2.需求计划)不能为空", trigger: "change" }
        ],*/
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
          url: process.env.VUE_APP_BASE_API + "/plan/planExternalDemandInfo/importData",
          //携带参数
        fileForm: {},
      },
      fileRules: {
        planExcuteDate: [
          { required: true, message: "计划执行日期不能为空", trigger: "blur" }
        ],
        /*planType: [
          { required: true, message: "计划类型(1.铸造计划,2.需求计划)不能为空", trigger: "change" }
        ],*/
      },
      //状态
      planExternalDemandStatusList: [],
    };
  },
  created() {
    this.getPlanExternalDemandStatus();
    this.getList();
  },
  methods: {
    /** 设备状态列表 */
    getPlanExternalDemandStatus() {
      getPlanExternalDemandStatus().then(response => {
        this.planExternalDemandStatusList = response.data;
      });
    },
    /** 查询需求计划列表 */
    getList() {
      this.loading = true;
      listPlanExternalDemand(this.queryParams).then(response => {
        this.planExternalDemandList = response.rows;
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
        externalDemandPlanCode: null,
        importFileName: null,
        planType: null,
        planStatus: null,
        planExcuteDate: null,
        sourcePlanCode: null,
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
    resetFileForm() {
      this.fileForm = {
        planExcuteDate: null,
        sourcePlanCode: null
      };
      this.resetForm("fileForm");
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
      this.title = "添加需求计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanExternalDemand(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改需求计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanExternalDemand(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanExternalDemand(this.form).then(response => {
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
      const id = row.id;
      this.$modal.confirm('是否确认删除需求计划编号为"' + id + '"的数据项？').then(function() {
        return delPlanExternalDemand(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /**下发需求计划*/
    distributeDemand(row){
      const id = row.id || this.ids;
      this.$modal.confirm('是否确认生成销售计划?').then(function() {
        return distributeDemand(id)
      }).then(response=>{
        this.$modal.msg(response.msg);
        this.getList();
      }).catch(e=>{
        this.$alert(e);
      }).finally(()=>this.loading = false)

    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('plan/planExternalDemand/export', {
        ...this.queryParams
      }, `planExternalDemand_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "需求计划导入";
        this.upload.open = true;
      this.resetFileForm();
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planExternalDemandInfo/importTemplate',{...this.queryParams}, '需求计划导入模板.xlsx');
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
    // 文件上传成功处理
    handleBeforeUpload(file) {
      let bs = false;
      if(!file){
        this.$alert("请选择上传文件");
        return bs;
      }
      this.$refs["upload.fileForm"].validate(valid => {
        if (valid) {
          //this.upload.data = this.fileForm;
          bs = true;
        }
      })
      return bs;
    },

    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
