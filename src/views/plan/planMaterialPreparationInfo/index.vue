<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="计划号" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划日期" prop="planDate">
        <el-date-picker clearable
          v-model="queryParams.planDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划日期">
        </el-date-picker>
      </el-form-item>
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
      <!--<el-form-item label="发货仓库代码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入发货仓库代码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货仓库代码" prop="destinationCode">
        <el-input
          v-model="queryParams.destinationCode"
          placeholder="请输入收货仓库代码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货库位代码" prop="destinationStorageCode">
        <el-input
          v-model="queryParams.destinationStorageCode"
          placeholder="请输入收货库位代码"
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
          v-hasPermi="['plan:planMaterialPreparationInfo:add']"
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
          v-hasPermi="['plan:planMaterialPreparationInfo:edit']"
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
          v-hasPermi="['plan:planMaterialPreparationInfo:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleCreateOutOrder"
          v-hasPermi="['plan:planMaterialPreparationInfo:add']"
        >出库</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planMaterialPreparationInfo:export']"
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

    <el-table v-loading="loading" :data="planMaterialPreparationInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计划号" align="center" prop="planCode" />
      <el-table-column label="计划日期" align="center" prop="planDate" />
      <el-table-column label="行号" align="center" prop="rowNum" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="计划数量" align="center" prop="planNum" />
      <el-table-column label="发货仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="收货仓库名称" align="center" prop="destinationName" />
      <el-table-column label="收货库位名称" align="center" prop="destinationStorageName" />
      <el-table-column label="状态" align="center" prop="statusName" />
      <el-table-column label="完成数量" align="center" prop="finishNum" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planMaterialPreparationInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planMaterialPreparationInfo:remove']"
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

    <!-- 添加或修改备料计划明细对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划号" prop="planCode">
          <el-input v-model="form.planCode" placeholder="请输入计划号" />
        </el-form-item>
        <el-form-item label="计划日期" prop="planDate">
          <el-date-picker clearable
            v-model="form.planDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="行号" prop="rowNum">
          <el-input v-model="form.rowNum" placeholder="请输入行号" />
        </el-form-item>
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="计划数量" prop="planNum">
          <el-input v-model="form.planNum" placeholder="请输入计划数量" />
        </el-form-item>
        <el-form-item label="发货仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入发货仓库名称" />
        </el-form-item>
        <el-form-item label="收货仓库名称" prop="destinationName">
          <el-input v-model="form.destinationName" placeholder="请输入收货仓库名称" />
        </el-form-item>
        <el-form-item label="收货库位名称" prop="destinationStorageName">
          <el-input v-model="form.destinationStorageName" placeholder="请输入收货库位名称" />
        </el-form-item>
        <el-form-item label="状态1.初始化3.已完成5.已废弃)" prop="status">
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
  import { searchItemList, getNowDateStr} from '@/api/enumsSelect';
import { listPlanMaterialPreparationInfo, getPlanMaterialPreparationInfo, delPlanMaterialPreparationInfo,
    addPlanMaterialPreparationInfo, updatePlanMaterialPreparationInfo, createOutOrder } from "@/api/plan/planMaterialPreparationInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanMaterialPreparationInfo",
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
      // 备料计划明细表格数据
      planMaterialPreparationInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planCode: null,
        planDate: getNowDateStr(),
        itemId: null,
        warehouseCode: null,
        destinationCode: null,
        destinationStorageCode: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planCode: [
          { required: true, message: "计划号不能为空", trigger: "blur" }
        ],
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
          url: process.env.VUE_APP_BASE_API + "/plan/planMaterialPreparationInfo/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询备料计划明细列表 */
    getList() {
      this.loading = true;
      listPlanMaterialPreparationInfo(this.queryParams).then(response => {
        this.planMaterialPreparationInfoList = response.rows;
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
        planCode: null,
        planDate: null,
        rowNum: null,
        itemId: null,
        planNum: null,
        warehouseCode: null,
        warehouseName: null,
        destinationCode: null,
        destinationName: null,
        destinationStorageCode: null,
        destinationStorageName: null,
        status: null,
        finishNum: null,
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
      this.title = "添加备料计划明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanMaterialPreparationInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改备料计划明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanMaterialPreparationInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanMaterialPreparationInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除备料计划明细编号为"' + ids + '"的数据项？').then(function() {
        return delPlanMaterialPreparationInfo(ids);
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
    handleExport() {
      this.download('plan/planMaterialPreparationInfo/export', {
        ...this.queryParams
      }, `planMaterialPreparationInfo_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "备料计划明细导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planMaterialPreparationInfo/importTemplate',{...this.queryParams}, '备料计划明细导入模板.xlsx');
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

    /**生成出库单*/
    handleCreateOutOrder(row){
      const id = row.id || this.ids;
      createOutOrder(id).then(response=>{
        if(response.code == 500){
          this.$modal.msgError(response.msg);
        }else{
          this.$modal.msgSuccess(response.msg);
          this.getList();
        }

      }).catch((e) => {this.$modal.msgError(e);}).finally(()=>this.loading = false);
    }
  }
};
</script>
