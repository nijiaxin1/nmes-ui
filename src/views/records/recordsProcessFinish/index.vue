<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="器具码" prop="finishUtensilCode">
        <el-input
          v-model="queryParams.finishUtensilCode"
          placeholder="请输入器具码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序" prop="processId">
        <el-select v-model="queryParams.processId" placeholder="请选择工序"  clearable>
          <el-option
            v-for="dict in processesList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
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
      <el-form-item label="员工" prop="operateId">
        <el-select v-model="queryParams.operateId" filterable  remote
                   :remote-method="remoteSearchMember"
                   placeholder="请输入员工">
          <el-option
            v-for="dict in memberList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="完成时间">
        <el-date-picker
          v-model="daterangeTime"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <!--<el-form-item label="工作班次" prop="workSchedule">
        <el-input
          v-model="queryParams.workSchedule"
          placeholder="请输入工作班次"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备" prop="equipmentId">
        <el-input
          v-model="queryParams.equipmentId"
          placeholder="请输入设备"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源器具码" prop="sourceUtensilCode">
        <el-input
          v-model="queryParams.sourceUtensilCode"
          placeholder="请输入来源器具码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="器具码" prop="finishUtensilCode">
        <el-input
          v-model="queryParams.finishUtensilCode"
          placeholder="请输入器具码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="录入人" prop="recordBy">
        <el-input
          v-model="queryParams.recordBy"
          placeholder="请输入录入人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
          v-hasPermi="['records:recordsProcessFinish:add']"
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
          v-hasPermi="['records:recordsProcessFinish:edit']"
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
          v-hasPermi="['records:recordsProcessFinish:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['records:recordsProcessFinish:export']"
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

    <el-table v-loading="loading" :data="recordsProcessFinishList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column label="物料" align="center" prop="itemCode" />
      <el-table-column label="顺序" align="center" prop="workBatchOrder" />
      <el-table-column label="员工" align="center" prop="planOperateBy" />
      <!--<el-table-column label="计划工作时长(s)" align="center" prop="planWorkDuration" />-->
      <!--<el-table-column label="生产员" align="center" prop="operateBy" />-->
      <el-table-column label="所属班组" align="center" prop="workTeam" />
      <el-table-column label="工作班次" align="center" prop="workSchedule" />
      <el-table-column label="设备码" align="center" prop="equipmentCode" />
      <el-table-column label="来源器具码" align="center" prop="sourceUtensilCode" />
      <el-table-column label="器具码" align="center" prop="finishUtensilCode" />
      <el-table-column label="数量" align="center" prop="operateNum" />
      <el-table-column label="录入人" align="center" prop="recordBy" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="录入时间" align="center" prop="createTime"  width="180"/>
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['records:recordsProcessFinish:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['records:recordsProcessFinish:remove']"
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

    <!-- 添加或修改工序完成记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工序" prop="processCode">
          <el-input v-model="form.processCode" placeholder="请输入工序" />
        </el-form-item>
        <el-form-item label="物料" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入物料" />
        </el-form-item>
        <el-form-item label="顺序" prop="workBatchOrder">
          <el-input v-model="form.workBatchOrder" placeholder="请输入顺序" />
        </el-form-item>
        <el-form-item label="员工" prop="planOperateBy">
          <el-input v-model="form.planOperateBy" placeholder="请输入员工" />
        </el-form-item>
        <el-form-item label="计划工作时长(s)" prop="planWorkDuration">
          <el-input v-model="form.planWorkDuration" placeholder="请输入计划工作时长(s)" />
        </el-form-item>
        <el-form-item label="生产员" prop="operateBy">
          <el-input v-model="form.operateBy" placeholder="请输入生产员" />
        </el-form-item>
        <el-form-item label="所属班组" prop="workTeam">
          <el-input v-model="form.workTeam" placeholder="请输入所属班组" />
        </el-form-item>
        <el-form-item label="工作班次" prop="workSchedule">
          <el-input v-model="form.workSchedule" placeholder="请输入工作班次" />
        </el-form-item>
        <el-form-item label="设备码" prop="equipmentCode">
          <el-input v-model="form.equipmentCode" placeholder="请输入设备码" />
        </el-form-item>
        <el-form-item label="来源器具码" prop="sourceUtensilCode">
          <el-input v-model="form.sourceUtensilCode" placeholder="请输入来源器具码" />
        </el-form-item>
        <el-form-item label="器具码" prop="finishUtensilCode">
          <el-input v-model="form.finishUtensilCode" placeholder="请输入器具码" />
        </el-form-item>
        <el-form-item label="数量" prop="operateNum">
          <el-input v-model="form.operateNum" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="录入人" prop="recordBy">
          <el-input v-model="form.recordBy" placeholder="请输入录入人" />
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
  import { searchItemList, getProcessesList, getWorkTeamList, getEquipmentList, searchUserListByName, getNowDateStr } from '@/api/enumsSelect';
import { listRecordsProcessFinish, getRecordsProcessFinish, delRecordsProcessFinish,
    addRecordsProcessFinish, updateRecordsProcessFinish } from "@/api/records/recordsProcessFinish";
import { getToken } from "@/utils/auth";

export default {
  name: "RecordsProcessFinish",
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
      // 工序完成记录表格数据
      recordsProcessFinishList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 时间范围
      daterangeTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        processId: null,
        itemId: null,
        planOperateId: null,
        operateId: null,
        workTeam: null,
        workSchedule: null,
        equipmentId: null,
        sourceUtensilCode: null,
        finishUtensilCode: null,
        recordBy: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mainId: [
          { required: true, message: "来料记录不能为空", trigger: "blur" }
        ],
        processId: [
          { required: true, message: "工序不能为空", trigger: "blur" }
        ],
        workBatch: [
          { required: true, message: "批号不能为空", trigger: "blur" }
        ],
        workBatchOrder: [
          { required: true, message: "顺序不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/records/recordsProcessFinish/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //工序列表
      processesList: [],
      //员工
      memberList:[],
      memberSearchLoading: true,
      //设备列表
      equipmentList: [],
      //班组列表
      workTeamList: [],
    };
  },
  created() {
    this.getProcessesList();
    this.selectWorkTeamList();
    this.selectEquipmentList();
    this.getList();
  },
  methods: {
    /** 工序列表 */
    getProcessesList() {
      getProcessesList().then(response => {
        this.processesList = response.data;
      });
    },
    /** 班组列表 */
    selectWorkTeamList() {
      getWorkTeamList().then(response => {
        this.workTeamList = response.data;
      });
    },
    /** 器具列表 */
    selectEquipmentList() {
      getEquipmentList().then(response => {
        this.equipmentList = response.data;
      });
    },
    /** 查询工序完成记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeTime && '' != this.daterangeTime) {
        this.queryParams.params["beginTime"] = this.daterangeTime[0];
        this.queryParams.params["endTime"] = this.daterangeTime[1];
      }
      listRecordsProcessFinish(this.queryParams).then(response => {
        this.recordsProcessFinishList = response.rows;
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
        mainId: null,
        processId: null,
        processCode: null,
        itemId: null,
        itemCode: null,
        workBatch: null,
        workBatchOrder: null,
        planOperateId: null,
        planOperateBy: null,
        planWorkDuration: null,
        operateId: null,
        operateBy: null,
        workTeam: null,
        workSchedule: null,
        equipmentId: null,
        equipmentCode: null,
        sourceUtensilCode: null,
        finishUtensilCode: null,
        operateNum: null,
        recordBy: null,
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
      this.title = "添加工序完成记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecordsProcessFinish(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工序完成记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecordsProcessFinish(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addRecordsProcessFinish(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工序完成记录编号为"' + ids + '"的数据项？').then(function() {
        return delRecordsProcessFinish(ids);
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
    //远程搜索物料信息
    remoteSearchMember(memberName) {
      if (memberName !== '' && this.memberSearchLoading) {
        this.memberSearchLoading = false;
        setTimeout(() => {
          this.memberSearchLoading = true;
          searchUserListByName(memberName).then(response => {
            this.memberList = response.data;
          });
        }, 300);
      } else {
        this.memberList = [];
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('records/recordsProcessFinish/export', {
        ...this.queryParams
      }, `recordsProcessFinish_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "工序完成记录导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('records/recordsProcessFinish/importTemplate',{...this.queryParams}, '工序完成记录导入模板.xlsx');
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
