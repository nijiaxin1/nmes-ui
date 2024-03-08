<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="设备ID" prop="deviceId" v-if="false">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报修人" prop="reporterId" v-if="false">
        <el-input
          v-model="queryParams.reporterId"
          placeholder="请输入报修人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报修时间" prop="repairTime">
        <el-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="报修时间" prop="repairTime">
        <el-date-picker clearable v-model="queryParams.repairTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择报修时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="处理人员" prop="technicianId" v-if="false">
        <el-input
          v-model="queryParams.technicianId"
          placeholder="请输入处理人员"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处理时间" prop="repairCompletionTime" v-if="false">
        <el-date-picker
          clearable
          v-model="queryParams.repairCompletionTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择处理时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['message:report:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['message:report:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['message:report:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['message:report:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="reportList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column label="报修ID" align="center" prop="id" v-if="false" />
      <el-table-column
        label="设备ID"
        align="center"
        prop="deviceId"
        v-if="false"
      />
      <el-table-column label="报修人" align="center" prop="reporter" />
      <el-table-column
        label="报修时间"
        align="center"
        prop="repairTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.repairTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="报修说明"
        align="center"
        prop="repairTitle"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="问题描述"
        align="center"
        prop="problemDescription"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="报修状态"
        align="center"
        prop="repairStatus"
        v-if="false"
      />
      <el-table-column
        label="处理人员"
        align="center"
        prop="technicianId"
        v-if="false"
      />
      <el-table-column
        label="处理时间"
        align="center"
        prop="repairCompletionTime"
        width="180"
        v-if="false"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(
              scope.row.repairCompletionTime
            )
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="处理结果"
        align="center"
        prop="repairResult"
        v-if="false"
      />
      <el-table-column label="备注" align="center" prop="remark" v-if="false" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['message:report:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['message:report:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改报修记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="deviceId" v-if="false">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="报修人" prop="reporterId" v-if="false">
          <el-input v-model="form.reporterId" placeholder="请输入报修人" />
        </el-form-item>
        <el-form-item label="报修时间" prop="repairTime" v-if="false">
          <el-date-picker
            clearable
            v-model="form.repairTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择报修时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报修说明" prop="repairTitle">
          <el-input v-model="form.repairTitle" placeholder="请输入报修说明" />
        </el-form-item>
        <el-form-item label="问题描述" prop="problemDescription">
          <el-input
            v-model="form.problemDescription"
            type="textarea"
            placeholder="请输入问题描述"
          />
        </el-form-item>
        <el-form-item label="处理人员" prop="technicianId" v-if="false">
          <el-input v-model="form.technicianId" placeholder="请输入处理人员" />
        </el-form-item>
        <el-form-item label="处理时间" prop="repairCompletionTime" v-if="false">
          <el-date-picker
            clearable
            v-model="form.repairCompletionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择处理时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理结果" prop="repairResult" v-if="false">
          <el-input
            v-model="form.repairResult"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="拍照上传" prop="uploadImages">
          <el-input v-model="form.uploadImages" v-show="false" />
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            multiple
            :on-change="handleChange"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="false">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="删除标识" prop="delFlag" v-if="false">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listReport,
  getReport,
  delReport,
  addReport,
  updateReport,
  addReportWithImages,
} from "@/api/message/report";

export default {
  name: "Report",
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
      // 报修记录表格数据
      reportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: null,
        reporterId: null,
        repairTime: null,
        startDate: null,
        endDate: null,
        problemDescription: null,
        repairStatus: null,
        technicianId: null,
        repairCompletionTime: null,
        repairResult: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" },
        ],
        reporterId: [
          { required: true, message: "报修人ID不能为空", trigger: "blur" },
        ],
        repairTitle: [
          { required: true, message: "报修说明不能为空", trigger: "blur" },
        ],
        problemDescription: [
          { required: true, message: "问题描述不能为空", trigger: "blur" },
        ],
        uploadImages: [
          { required: true, message: "图片不能为空", trigger: "blur" },
        ],
      },
      // 查询时间范围
      dateRange: [],
      // 图片上传
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [],
    };
  },
  created() {
    this.getList();
  },
  watch: {
    dateRange(n) {
      if (n && n.length == 2) {
        this.queryParams.startDate = n[0];
        this.queryParams.endDate = n[1];
      } else {
        this.queryParams.startDate = null;
        this.queryParams.endDate = null;
      }
    },
  },
  methods: {
    /** 查询报修记录列表 */
    getList() {
      this.loading = true;
      listReport(this.queryParams).then((response) => {
        this.reportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        deviceId: null,
        reporterId: null,
        repairTime: null,
        repairTitle: null,
        problemDescription: null,
        repairStatus: null,
        technicianId: null,
        repairCompletionTime: null,
        repairResult: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        uploadImages: null,
      };
      this.fileList = [];
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
      this.dateRange = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加报修记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getReport(id).then((response) => {
        this.form = response.data;
        if (response.data.sysFileInfos) {
          this.form.uploadImages = response.data.sysFileInfos.length;
          response.data.sysFileInfos.forEach((f) => {
            this.fileList.push({
              name: f.originFileName,
              url: process.env.VUE_APP_BASE_API + f.filePath,
              fileId: f.fileId,
            });
          });
        }
        this.open = true;
        this.title = "修改报修记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append("repairTitle", this.form.repairTitle);
          formData.append("problemDescription", this.form.problemDescription);
          // 把多个文件放到同一个请求
          this.fileList.forEach((el) => {
            if (el.raw) {
              formData.append("files", el.raw);
            } else {
              formData.append("fileIds", el.fileId);
            }
          });
          if (this.form.id != null) {
            formData.append("id", this.form.id);
            updateReport(formData).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReportWithImages(formData).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除选中的数据项？")
        .then(function () {
          return delReport(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "message/report/export",
        {
          ...this.queryParams,
        },
        `report_${new Date().getTime()}.xlsx`
      );
    },
    /** 移除图片 */
    handleRemove(file) {
      this.fileList = this.fileList.filter((f) => f.uid !== file.uid);
      if (this.fileList.length > 0) {
        this.form.uploadImages = this.fileList.length;
      } else {
        this.form.uploadImages = null;
      }
    },
    /** 预览图片 */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /** 图片状态改变 */
    handleChange(file, fileList) {
      this.fileList = fileList;
      if (this.fileList.length > 0) {
        this.form.uploadImages = this.fileList.length;
      } else {
        this.form.uploadImages = null;
      }
    },
  },
};
</script>
