<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="排班日期" prop="scheduleDate">
        <el-date-picker clearable
          v-model="queryParams.scheduleDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择排班日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="班组" prop="teamId">
        <el-select v-model="queryParams.teamId" placeholder="请选择班组"  clearable>
          <el-option
            v-for="dict in workTeamList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班次" prop="periodId">
        <el-select v-model="queryParams.periodId" placeholder="请选择班次"  clearable>
          <el-option
            v-for="dict in workScheduleClassList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工" prop="userId">
        <el-select v-model="queryParams.userId" filterable  remote
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
      <el-form-item label="设备" prop="equipmentId">
        <el-select v-model="queryParams.equipmentId" placeholder="请选择工序">
          <el-option
            v-for="dict in equipmentList"
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
          v-hasPermi="['records:recordsWorkSchedule:add']"
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
          v-hasPermi="['records:recordsWorkSchedule:edit']"
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
          v-hasPermi="['records:recordsWorkSchedule:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['records:recordsWorkSchedule:export']"
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

    <el-table v-loading="loading" :data="recordsWorkScheduleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="排班日期" align="center" prop="scheduleDate" />
      <el-table-column label="班组" align="center" prop="teamName" />
      <el-table-column label="班次" align="center" prop="periodName" />
      <el-table-column label="员工" align="center" prop="userName" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column label="设备编号" align="center" prop="equipmentCode" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['records:recordsWorkSchedule:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['records:recordsWorkSchedule:remove']"
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

    <!-- 添加或修改生产排班记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="排班日期" prop="scheduleDate">
          <el-date-picker clearable
            v-model="form.scheduleDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择排班日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班组ID" prop="teamId">
          <el-input v-model="form.teamId" placeholder="请输入班组ID" />
        </el-form-item>
        <el-form-item label="班次ID" prop="periodId">
          <el-input v-model="form.periodId" placeholder="请输入班次ID" />
        </el-form-item>
        <el-form-item label="员工ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入员工ID" />
        </el-form-item>
        <el-form-item label="工序ID" prop="processId">
          <el-input v-model="form.processId" placeholder="请输入工序ID" />
        </el-form-item>
        <el-form-item label="设备" prop="equipmentId">
          <el-input v-model="form.equipmentId" placeholder="请输入设备" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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
  import { searchItemList, getProcessesList, getWorkTeamList, getEquipmentList, searchUserListByName, getNowDateStr, getWorkScheduleClassList } from '@/api/enumsSelect';
import { listRecordsWorkSchedule, getRecordsWorkSchedule, delRecordsWorkSchedule,
    addRecordsWorkSchedule, updateRecordsWorkSchedule } from "@/api/records/recordsWorkSchedule";
import { getToken } from "@/utils/auth";

export default {
  name: "RecordsWorkSchedule",
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
      // 生产排班记录表格数据
      recordsWorkScheduleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        scheduleDate: getNowDateStr(),
        teamId: null,
        periodId: null,
        userId: null,
        processId: null,
        equipmentId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
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
          url: process.env.VUE_APP_BASE_API + "/records/recordsWorkSchedule/importData"
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
      //班次
      workScheduleClassList: [],
    };
  },
  created() {
    this.getProcessesList();
    this.selectWorkTeamList();
    this.selectEquipmentList();
    this.selectWorkScheduleClassList();
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
    /** 班次列表 */
    selectWorkScheduleClassList() {
      getWorkScheduleClassList().then(response => {
        this.workScheduleClassList = response.data;
      });
    },
    /** 器具列表 */
    selectEquipmentList() {
      getEquipmentList().then(response => {
        this.equipmentList = response.data;
      });
    },
    /** 查询生产排班记录列表 */
    getList() {
      this.loading = true;
      listRecordsWorkSchedule(this.queryParams).then(response => {
        this.recordsWorkScheduleList = response.rows;
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
        scheduleDate: null,
        teamId: null,
        teamName: null,
        periodId: null,
        periodName: null,
        userId: null,
        userName: null,
        processId: null,
        processName: null,
        equipmentId: null,
        equipmentCode: null,
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
      this.title = "添加生产排班记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecordsWorkSchedule(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改生产排班记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecordsWorkSchedule(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addRecordsWorkSchedule(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除生产排班记录编号为"' + ids + '"的数据项？').then(function() {
        return delRecordsWorkSchedule(ids);
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
      this.download('records/recordsWorkSchedule/export', {
        ...this.queryParams
      }, `recordsWorkSchedule_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "生产排班记录导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('records/recordsWorkSchedule/importTemplate',{...this.queryParams}, '生产排班记录导入模板.xlsx');
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
