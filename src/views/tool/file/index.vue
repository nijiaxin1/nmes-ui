<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名" prop="originFileName">
        <el-input v-model="queryParams.originFileName" placeholder="请输入文件名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="文件类型" prop="fileType">
        <el-select v-model="queryParams.fileType" placeholder="请选择文件类型" clearable>
          <el-option v-for="dict in dict.type.file_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="false">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['tool:file:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['tool:file:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload ref="upload" :before-upload="handleBeforeUpload" :on-progress="handleProcess"
          :on-error="handleUploadError" :on-success="handleUploadSuccess" :show-file-list="false" :action="upload.url"
          :headers="upload.headers" :file-list="upload.fileList" multiple :accept="fileAccept">
          <el-button type="success" plain icon="el-icon-upload" size="mini">上传</el-button>
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <div v-cloak>
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="downloadZip"
            :disabled="multiple">下载</el-button>
        </div>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['tool:file:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['tool:file:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column label="文件id" align="center" prop="fileId" v-if="false" />
      <el-table-column label="mediaId" align="center" prop="mediaId" show-overflow-tooltip />
      <el-table-column label="文件名" align="center" prop="originFileName" show-overflow-tooltip />
      <el-table-column label="文件名" align="center" prop="fileName" v-if="false" />
      <el-table-column label="文件类型" align="center" prop="fileType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.file_type" :value="scope.row.fileType" />
        </template>
      </el-table-column>
      <el-table-column label="网络请求路径" align="center" prop="filePath" show-overflow-tooltip />
      <el-table-column label="文件大小(KB)" align="center" prop="fileSize" />
      <el-table-column label="文件描述" align="center" prop="fileDescription" v-if="false" />
      <el-table-column label="备注" align="center" prop="remark" v-if="false" />
      <el-table-column label="操作" align="center" class-name="small-padding" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['tool:file:edit']" v-if="false">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)"
            v-hasPermi="['tool:file::view']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-download" @click="handleDownload(scope.row)"
            v-hasPermi="['tool:file:download']">下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['tool:file:remove']">删除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['tool:file:update']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="syncFileToDt" icon="el-icon-upload"
                v-hasPermi="['tool:file:update']">上传钉钉</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 进度条 -->
    <el-dialog :title="title" :visible.sync="processing" width="55%" append-to-body>
      <span>{{ processFileName }}</span>
      <el-progress :percentage="progressPercent" :text-inside="true" :stroke-width="12" status="success">
      </el-progress>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="view" width="65%" append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="文件名">{{ info.originFileName }}</el-descriptions-item>
        <el-descriptions-item label="mediaId">{{ info.mediaId }}</el-descriptions-item>
        <el-descriptions-item label="文件类型">
          <dict-tag :options="dict.type.file_type" :value="info.fileType" />
        </el-descriptions-item>
        <el-descriptions-item label="网络请求路径">{{ info.filePath }}</el-descriptions-item>
        <el-descriptions-item label="文件大小(KB)">{{ info.fileSize }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  synctoDt,
} from "@/api/tool/file";
import { getToken } from "@/utils/auth";

export default {
  name: "Info",
  dicts: ["file_type"],
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
      // 文件管理表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mediaId: null,
        originFileName: null,
        fileName: null,
        fileType: null,
        filePath: null,
        fileSize: null,
        fileDescription: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fileName: [
          { required: true, message: "文件名不能为空", trigger: "blur" },
        ],
        fileType: [
          { required: true, fileType: "文件类型不能为空", trigger: "change" },
        ],
      },
      report: {},
      fileSize: 100,
      fileType: [],
      fileAccept: null,
      fileList: [],
      multipleSelection: [],
      filePaths: [],
      editEnable: true,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/tool/file/info/upload/file",
      },
      // 显示进度条
      processing: false,
      progressPercent: 0,
      timer: null,
      finishtimer: null,
      processFileName: null,
      // 详情
      view: false,
      info: {}
    };
  },
  created() {
    this.getList();
    this.getDicts("file_type")
      .then((r) => {
        if (r.data) {
          this.fileType = r.data.map((e) => {
            return e.dictValue;
          });
          if (this.fileType) {
            this.fileAccept = this.fileType
              .map((f) => {
                return "." + f;
              })
              .join(",");
          }
        }
      })
      .catch(() => { });
  },
  methods: {
    /** 查询文件管理列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.infoList = response.rows;
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
        fileId: null,
        mediaId: null,
        fileName: null,
        fileType: null,
        filePath: null,
        fileSize: null,
        fileDescription: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
      this.getList();
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文件管理";
    },
    handleView(row) {
      this.info = row;
      this.title = "文件详情";
      this.view = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fileId = row.fileId || this.ids;
      getInfo(fileId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文件管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.fileId != null) {
            updateInfo(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then((response) => {
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
      const fileIds = row.fileId || this.ids;
      this.$modal
        .confirm('是否确认删除文件管理编号为"' + fileIds + '"的数据项？')
        .then(function () {
          return delInfo(fileIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "tool/file/info/export",
        {
          ...this.queryParams,
        },
        `info_${new Date().getTime()}.xlsx`
      );
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$message.error(
            `文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`
          );
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    // 上传中
    handleProcess(event, file, fileList) {
      this.title = "文件上传";
      this.processing = true;
      this.processFileName = file.name;
      this.progressPercent = Number(
        ((event.loaded / event.total) * 100).toFixed(2)
      );
      if (this.progressPercent >= 100) {
        this.progressPercent = 100;
        setTimeout(() => {
          this.processing = false;
        }, 2000); // 一秒后关闭进度条
      }
    },
    // 上传成功回调
    handleUploadSuccess(res, file, fileList) {
      // 清除上传文件列表
      this.$refs.upload.clearFiles();
      // this.$modal.msgSuccess("上传成功");
      this.getList();
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传失败, 请重试");
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.fileId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.multipleSelection = selection;
    },
    /** 下载文件 */
    handleDownload(row) {
      this.download(
        "/tool/file/info/download/" + row.fileId,
        { ...this.queryParams },
        row.originFileName
      );
    },
    // zip下载
    downloadZip() {
      let files = this.multipleSelection.map((item) => {
        return item.fileLocalPath;
      });
      let zipName = this.$store.state.user.name;
      this.$download.zip(
        "/tool/file/info/download/zip?files=" + files,
        zipName
      );
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "syncFileToDt":
          this.syncFileToDt(row);
          break;
        default:
          break;
      }
    },
    /**同步文件到钉钉 */
    syncFileToDt(row) {
      console.log(this);
      synctoDt(this.appKey, row.fileId)
        .then((response) => {
          if (response.code == 200) {
            this.$message.success("成功同步文件到钉钉！");
          } else {
            this.$message.error(response.msg);
          }
          this.getList();
        })
        .catch(() => { });
    },
  },
};
</script>
