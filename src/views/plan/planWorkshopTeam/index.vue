<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="班组" prop="planWorkTeamId">
        <el-select v-model="queryParams.planWorkTeamId" placeholder="请选择班组" >
          <el-option
            v-for="dict in workTeamList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="批号" prop="workBatch">
        <el-input
          v-model="queryParams.workBatch"
          placeholder="请输入批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="计划生产日期" prop="planProduceDate">
        <el-date-picker clearable
          v-model="queryParams.planProduceDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划生产日期">
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
          v-hasPermi="['plan:planWorkshopTeam:add']"
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
          v-hasPermi="['plan:planWorkshopTeam:edit']"
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
          v-hasPermi="['plan:planWorkshopTeam:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planWorkshopTeam:export']"
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

    <el-table v-loading="loading" :data="planWorkshopTeamList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column label="班组" align="center" prop="planWorkTeam" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="工艺" align="center" prop="technologyCode" />
      <el-table-column label="工序" align="center" prop="processesName" />
      <el-table-column label="计划排产数量" align="center" prop="planWorkNum" />
      <el-table-column label="实际排产数量" align="center" prop="workNum" />
      <el-table-column label="计划生产日期" align="center" prop="planProduceDate" />
      <!--<el-table-column label="状态1.初始化2.执行中3.执行完成5.已废弃)" align="center" prop="status" />-->
      <el-table-column label="来料数量" align="center" prop="enterNum" />
      <el-table-column label="完成数量" align="center" prop="finishNum" />
      <el-table-column label="废品数量" align="center" prop="wasteNum" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planWorkshopTeam:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planWorkshopTeam:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 添加或修改车间班组计划对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="批号" prop="workBatch">
          <el-input v-model="form.workBatch" placeholder="请输入批号" />
        </el-form-item>
        <el-form-item label="数量" prop="workNum">
          <el-input v-model="form.workNum" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="计划生产日期" prop="planProduceDate">
          <el-date-picker clearable
            v-model="form.planProduceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态1.初始化2.执行中3.执行完成5.已废弃)" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="完成数量" prop="finishNum">
          <el-input v-model="form.finishNum" placeholder="请输入完成数量" />
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
  import {  getWorkTeamList, getNowDateStr} from '@/api/enumsSelect';
import { listPlanWorkshopTeam, getPlanWorkshopTeam, delPlanWorkshopTeam,
    addPlanWorkshopTeam, updatePlanWorkshopTeam } from "@/api/plan/planWorkshopTeam";
import { teamList } from "@/api/plan/planWorkshopPersonal";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanWorkshopTeam",
  data() {
    return {
      // 遮罩层
      loading: false,
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
      // 车间班组计划表格数据
      planWorkshopTeamList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemId: null,
        workBatch: null,
        planProduceDate: getNowDateStr(),
        status: null,
        finishNum: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        workBatch: [
          { required: true, message: "批号不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/plan/planWorkshopTeam/importData"
      },
      workTeamList:[],
      //物料信息
      itemList: [],
      itemSearchLoading: true,
    };
  },
  created() {
    this.selectWorkTeamList();
    //this.getList();
  },
  methods: {
    /** 班组列表 */
    selectWorkTeamList() {
      getWorkTeamList().then(response => {
        this.workTeamList = response.data;
      });
    },
    /** 查询车间班组计划列表 */
    /*getList() {
      this.loading = true;
      listPlanWorkshopTeam(this.queryParams).then(response => {
        this.planWorkshopTeamList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).finally(()=>this.loading = false);
    },*/
    /** 查询车间班组计划列表 */
    getList() {
      if(!this.queryParams.planProduceDate){
        this.$modal.msgError("请选择日期");
        return false;
      }
      this.loading = true;
      teamList(this.queryParams).then(response => {
        this.planWorkshopTeamList = response.data;
        //this.total = response.total;
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
        itemId: null,
        workBatch: null,
        workNum: null,
        planProduceDate: null,
        planStartTime: null,
        planFinishTime: null,
        status: null,
        finishNum: null,
        isTimeout: null,
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
      this.title = "添加车间班组计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanWorkshopTeam(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车间班组计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanWorkshopTeam(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanWorkshopTeam(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除车间班组计划编号为"' + ids + '"的数据项？').then(function() {
        return delPlanWorkshopTeam(ids);
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
    /** 导出按钮操作 */
    /*handleExport() {
      this.download('plan/planWorkshopTeam/export', {
        ...this.queryParams
      }, `planWorkshopTeam_${new Date().getTime()}.xlsx`)
    },*/
    handleExport() {
      this.download('plan/planWorkshopPersonal/exportTeamList', {
        ...this.queryParams
      }, `planWorkshopTeam_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "车间班组计划导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planWorkshopTeam/importTemplate',{...this.queryParams}, '车间班组计划导入模板.xlsx');
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
