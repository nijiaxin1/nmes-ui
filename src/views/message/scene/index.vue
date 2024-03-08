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
      <el-form-item label="记录人" prop="recorderId" v-if="false">
        <el-input
          v-model="queryParams.recorderId"
          placeholder="请输入记录人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker clearable v-model="queryParams.recordTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择记录时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="记录时间" prop="recordTime">
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
          v-hasPermi="['message:scene:add']"
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
          v-hasPermi="['message:scene:edit']"
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
          v-hasPermi="['message:scene:remove']"
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
          v-hasPermi="['message:scene:export']"
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
      :data="sceneList"
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
      <el-table-column label="记录ID" align="center" prop="id" v-if="false" />
      <el-table-column label="记录人" align="center" prop="recorder" />
      <el-table-column
        label="记录时间"
        align="center"
        prop="recordTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.recordTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="记录说明"
        align="center"
        prop="recordTitle"
        width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="记录内容"
        align="center"
        prop="recordContent"
        width="180"
        :show-overflow-tooltip="true"
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
            v-hasPermi="['message:scene:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['message:scene:remove']"
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

    <!-- 添加或修改现场管理记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="65%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="记录人" prop="recorderId" v-if="false">
          <el-input v-model="form.recorderId" placeholder="请输入记录人" />
        </el-form-item>
        <el-form-item label="记录时间" prop="recordTime" v-if="false">
          <el-date-picker
            clearable
            v-model="form.recordTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择记录时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录说明" prop="recordTitle">
          <el-input v-model="form.recordTitle" placeholder="请输入记录说明" />
        </el-form-item>
        <el-form-item label="记录内容" prop="recordContent">
          <el-input
            v-model="form.recordContent"
            type="textarea"
            placeholder="请输入记录内容"
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
  listScene,
  getScene,
  delScene,
  addScene,
  updateScene,
  addSceneWithImages,
} from "@/api/message/scene";

export default {
  name: "Scene",
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
      // 现场管理记录表格数据
      sceneList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recorderId: null,
        recordTime: null,
        startDate: null,
        endDate: null,
        recordContent: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recordTitle: [
          { required: true, message: "记录说明不能为空", trigger: "blur" },
        ],
        recordContent: [
          { required: true, message: "记录内容不能为空", trigger: "blur" },
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
    /** 查询现场管理记录列表 */
    getList() {
      this.loading = true;
      listScene(this.queryParams).then((response) => {
        this.sceneList = response.rows;
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
        recorderId: null,
        recordTime: null,
        recordContent: null,
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
      this.title = "添加现场管理记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getScene(id).then((response) => {
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
        this.title = "修改现场管理记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append("recordTitle", this.form.recordTitle);
          formData.append("recordContent", this.form.recordContent);
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
            updateScene(formData).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSceneWithImages(formData).then((response) => {
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
          return delScene(ids);
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
        "message/scene/export",
        {
          ...this.queryParams,
        },
        `scene_${new Date().getTime()}.xlsx`
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
