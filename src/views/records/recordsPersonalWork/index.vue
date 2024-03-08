<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工序" prop="processId">
        <el-select v-model="queryParams.processId" placeholder="请选择工序">
          <el-option
            v-for="dict in processList"
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
      <el-form-item label="生产时间">
        <el-date-picker
          v-model="daterangePassRecordsTime"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['records:recordsPersonalWork:add']"
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
          v-hasPermi="['records:recordsPersonalWork:edit']"
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
          v-hasPermi="['records:recordsPersonalWork:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['records:recordsPersonalWork:export']"
        >导出</el-button>
      </el-col>
        <!--<el-col :span="1.5">
            <el-button
                    type="info"
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
            >导入</el-button>
        </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="recordsPersonalWorkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column label="员工" align="center" prop="operateBy" />
      <el-table-column label="数量" align="center" prop="workNum" />
      <el-table-column label="合格数量" align="center" prop="passNum" />
      <el-table-column label="铸废数量" align="center" prop="castingWasteNum" />
      <el-table-column label="责废数量" align="center" prop="dutyWasteNum" />
      <el-table-column label="前序责废数量" align="center" prop="otherDutyWasteNum" />
    <el-table-column label="生产时间" align="center" prop="passRecordsTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.passRecordsTime) }}</span>
        </template>
    </el-table-column>
      <el-table-column label="生产记录员" align="center" prop="passRecordsBy" />
    <el-table-column label="铸废记录时间" align="center" prop="castingWasteRecordsTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.castingWasteRecordsTime) }}</span>
        </template>
    </el-table-column>
      <el-table-column label="铸废记录员" align="center" prop="castingWasteRecordsBy" />
    <el-table-column label="责废记录时间" align="center" prop="dutyWasteRecordsTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dutyWasteRecordsTime) }}</span>
        </template>
    </el-table-column>
      <el-table-column label="责废记录员" align="center" prop="dutyWasteRecordsBy" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['records:recordsPersonalWork:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['records:recordsPersonalWork:remove']"
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

    <!-- 添加或修改个人工作记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="工序" prop="processId">
          <el-input v-model="form.processId" placeholder="请输入工序" />
        </el-form-item>
        <el-form-item label="员工" prop="operateId">
          <el-input v-model="form.operateId" placeholder="请输入员工" />
        </el-form-item>
        <el-form-item label="数量" prop="workNum">
          <el-input v-model="form.workNum" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="合格数量" prop="passNum">
          <el-input v-model="form.passNum" placeholder="请输入合格数量" />
        </el-form-item>
        <el-form-item label="铸废数量" prop="castingWasteNum">
          <el-input v-model="form.castingWasteNum" placeholder="请输入铸废数量" />
        </el-form-item>
        <el-form-item label="责废数量" prop="dutyWasteNum">
          <el-input v-model="form.dutyWasteNum" placeholder="请输入责废数量" />
        </el-form-item>
        <el-form-item label="生产时间" prop="passRecordsTime">
          <el-date-picker clearable
            v-model="form.passRecordsTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择生产时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产记录员" prop="passRecordsBy">
          <el-input v-model="form.passRecordsBy" placeholder="请输入生产记录员" />
        </el-form-item>
        <el-form-item label="铸废记录时间" prop="castingWasteRecordsTime">
          <el-date-picker clearable
            v-model="form.castingWasteRecordsTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择铸废记录时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="铸废记录员" prop="castingWasteRecordsBy">
          <el-input v-model="form.castingWasteRecordsBy" placeholder="请输入铸废记录员" />
        </el-form-item>
        <el-form-item label="责废记录时间" prop="dutyWasteRecordsTime">
          <el-date-picker clearable
            v-model="form.dutyWasteRecordsTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择责废记录时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="责废记录员" prop="dutyWasteRecordsBy">
          <el-input v-model="form.dutyWasteRecordsBy" placeholder="请输入责废记录员" />
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
  import { searchItemList, getProcessesList, searchUserListByName } from '@/api/enumsSelect';
import { listRecordsPersonalWork, getRecordsPersonalWork, delRecordsPersonalWork,
    addRecordsPersonalWork, updateRecordsPersonalWork } from "@/api/records/recordsPersonalWork";
import { getToken } from "@/utils/auth";

export default {
  name: "RecordsPersonalWork",
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
      // 个人工作记录表格数据
      recordsPersonalWorkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 时间范围
      daterangePassRecordsTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemId: null,
        processId: null,
        operateId: null,
        passRecordsTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        processId: [
          { required: true, message: "工序不能为空", trigger: "blur" }
        ],
        operateId: [
          { required: true, message: "员工不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/records/recordsPersonalWork/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //工序列表
      processList: [],
      //员工
      memberList:[],
      memberSearchLoading: true,
    };
  },
  created() {
    this.getProcessesList();
    this.getList();
  },
  methods: {
    /** 工序列表 */
    getProcessesList() {
      getProcessesList().then(response => {
        this.processList = response.data;
      });
    },
    /** 查询个人工作记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangePassRecordsTime && '' != this.daterangePassRecordsTime) {
        this.queryParams.params["beginPassRecordsTime"] = this.daterangePassRecordsTime[0];
        this.queryParams.params["endPassRecordsTime"] = this.daterangePassRecordsTime[1];
      }
      listRecordsPersonalWork(this.queryParams).then(response => {
        this.recordsPersonalWorkList = response.rows;
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
        itemId: null,
        itemCode: null,
        processId: null,
        processName: null,
        operateId: null,
        operateBy: null,
        workNum: null,
        passNum: null,
        castingWasteNum: null,
        dutyWasteNum: null,
        passRecordsTime: null,
        passRecordsBy: null,
        castingWasteRecordsTime: null,
        castingWasteRecordsBy: null,
        dutyWasteRecordsTime: null,
        dutyWasteRecordsBy: null,
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
      this.daterangePassRecordsTime = [];
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
      this.title = "添加个人工作记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecordsPersonalWork(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改个人工作记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecordsPersonalWork(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addRecordsPersonalWork(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除个人工作记录编号为"' + ids + '"的数据项？').then(function() {
        return delRecordsPersonalWork(ids);
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
      this.download('records/recordsPersonalWork/export', {
        ...this.queryParams
      }, `recordsPersonalWork_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "个人工作记录导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('records/recordsPersonalWork/importTemplate',{...this.queryParams}, '个人工作记录导入模板.xlsx');
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
