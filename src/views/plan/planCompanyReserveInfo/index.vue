<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公司储备计划号" prop="companyReservePlanCode">
        <el-input
          v-model="queryParams.companyReservePlanCode"
          placeholder="请输入公司储备计划号"
          clearable
          :disabled="true"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['plan:planCompanyReserveInfo:add']"
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
          v-hasPermi="['plan:planCompanyReserveInfo:edit']"
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
          v-hasPermi="['plan:planCompanyReserveInfo:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planCompanyReserveInfo:export']"
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

    <el-table v-loading="loading" :data="planCompanyReserveInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="公司储备计划号" align="center" prop="companyReservePlanCode" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="行号" align="center" prop="rowNo" />
      <el-table-column label="储备数量" align="center" prop="foundryPlanQuantity" />
      <!--<el-table-column label="已铸造数量" align="center" prop="foundryedQuantity" />
      <el-table-column label="状态" align="center" prop="planStatusName" />
      <el-table-column label="入库单号" align="center" prop="foundryIntoCode" />
      <el-table-column label="入库时间" align="center" prop="foundryIntoTime" width="180">
          <template slot-scope="scope">
              <span>{{ parseTime(scope.row.foundryIntoTime) }}</span>
          </template>
      </el-table-column>
      <el-table-column label="入库仓库" align="center" prop="foundryIntoWarehouse" />-->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planCompanyReserveInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planCompanyReserveInfo:remove']"
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

    <!-- 添加或修改公司储备计划明细对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司储备计划号" prop="companyReservePlanCode">
          <el-input v-model="form.companyReservePlanCode" placeholder="请输入公司储备计划号" />
        </el-form-item>
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="行号" prop="rowNo">
          <el-input v-model="form.rowNo" placeholder="请输入行号" />
        </el-form-item>
        <el-form-item label="计划铸造数量" prop="foundryPlanQuantity">
          <el-input v-model="form.foundryPlanQuantity" placeholder="请输入计划铸造数量" />
        </el-form-item>
        <el-form-item label="已铸造数量" prop="foundryedQuantity">
          <el-input v-model="form.foundryedQuantity" placeholder="请输入已铸造数量" />
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
        <el-form-item label="入库单号" prop="foundryIntoCode">
          <el-input v-model="form.foundryIntoCode" placeholder="请输入入库单号" />
        </el-form-item>
        <el-form-item label="入库时间" prop="foundryIntoTime">
          <el-date-picker clearable
            v-model="form.foundryIntoTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入库时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库仓库" prop="foundryIntoWarehouse">
          <el-input v-model="form.foundryIntoWarehouse" placeholder="请输入入库仓库" />
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
  import { searchItemList } from '@/api/enumsSelect';
import { listPlanCompanyReserveInfo, getPlanCompanyReserveInfo, delPlanCompanyReserveInfo,
    addPlanCompanyReserveInfo, updatePlanCompanyReserveInfo } from "@/api/plan/planCompanyReserveInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanCompanyReserveInfo",
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
      // 公司储备计划明细表格数据
      planCompanyReserveInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyReservePlanCode: null,
        itemId: null,
        planStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyReservePlanCode: [
          { required: true, message: "公司储备计划号不能为空", trigger: "blur" }
        ],
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
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
          url: process.env.VUE_APP_BASE_API + "/plan/planCompanyReserveInfo/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true
    };
  },
  created() {
    this.queryParams.companyReservePlanCode = this.$route.params && this.$route.params.planCode;
    this.getList();
  },
  methods: {
    /** 查询公司储备计划明细列表 */
    getList() {
      this.loading = true;
      listPlanCompanyReserveInfo(this.queryParams).then(response => {
        this.planCompanyReserveInfoList = response.rows;
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
        itemId: null,
        rowNo: null,
        foundryPlanQuantity: null,
        foundryedQuantity: null,
        planStatus: null,
        foundryIntoCode: null,
        foundryIntoTime: null,
        foundryIntoWarehouse: null,
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
      this.title = "添加公司储备计划明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanCompanyReserveInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公司储备计划明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanCompanyReserveInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanCompanyReserveInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除公司储备计划明细编号为"' + ids + '"的数据项？').then(function() {
        return delPlanCompanyReserveInfo(ids);
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
      this.download('plan/planCompanyReserveInfo/export', {
        ...this.queryParams
      }, `planCompanyReserveInfo_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "公司储备计划明细导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planCompanyReserveInfo/importTemplate',{...this.queryParams}, '公司储备计划明细导入模板.xlsx');
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
