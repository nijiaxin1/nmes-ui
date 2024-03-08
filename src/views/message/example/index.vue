<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="渠道名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入渠道名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="发送渠道" prop="sendChannel">
        <el-select v-model="queryParams.sendChannel" placeholder="请选择消息发送渠道类型" clearable>
          <el-option v-for="dict in dict.type.msg_send_channel" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['message:example:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['message:example:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['message:example:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['message:example:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="exampleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{ (scope.$index + 1) + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="渠道ID" align="center" prop="id" v-if="false" />
      <el-table-column label="渠道名称" align="center" prop="name" />
      <el-table-column label="发送渠道" align="center" prop="sendChannel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.msg_send_channel" :value="scope.row.sendChannel" />
        </template>
      </el-table-column>
      <el-table-column label="配置模板" align="center" prop="accountConfigTemplate" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['message:example:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['message:example:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改渠道账号信息样例对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="渠道名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入渠道名称" />
        </el-form-item>
        <el-form-item label="发送渠道" prop="sendChannel">
          <el-radio-group v-model="form.sendChannel" @change="sendChannelChange">
            <el-radio v-for="dict in dict.type.msg_send_channel" :key="dict.value" :label="parseInt(dict.value)">{{
              dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置模板" prop="accountConfigTemplate">
          <v-json-editor v-model="jsonStr" :show-btns="false" mode="code" lang="zh" :expandedOnStart="false"
            @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
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
import VueJsonEditor from 'vue-json-editor'
import { listExample, getExample, delExample, addExample, updateExample } from "@/api/message/example";

export default {
  name: "Example",
  components: {
    'v-json-editor': VueJsonEditor,
  },
  dicts: ['msg_send_channel'],
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
      // 渠道账号信息样例表格数据
      exampleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        sendChannel: null,
        accountConfigTemplate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "渠道名称不能为空", trigger: "blur" }
        ],
        sendChannel: [
          { required: true, message: "消息发送渠道类型不能为空", trigger: "change" }
        ],
        accountConfigTemplate: [
          { required: true, message: "账号配置模板不能为空", trigger: "blur" }
        ],
      },
      jsonStr: null,
      // json是否验证通过
      hasJsonFlag: true,
    };
  },
  created() {
    this.getList();
  },
  watch: {
    jsonStr(nValue) {
      console.log(nValue);
      this.form.accountConfigTemplate = nValue ? JSON.stringify(nValue) : nValue;
    }
  },
  methods: {
    /** 查询渠道账号信息样例列表 */
    getList() {
      this.loading = true;
      listExample(this.queryParams).then(response => {
        this.exampleList = response.rows;
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
        name: null,
        sendChannel: null,
        accountConfigTemplate: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加渠道账号信息样例";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExample(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改渠道账号信息样例";
        this.jsonStr = JSON.parse(this.form.accountConfigTemplate);
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (!this.hasJsonFlag) {
        this.$message.error("json格式不正确，请检查！")
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateExample(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addExample(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除渠道账号信息样例编号为"' + ids + '"的数据项？').then(function () {
        return delExample(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('message/example/export', {
        ...this.queryParams
      }, `example_${new Date().getTime()}.xlsx`)
    },
    /** 发送渠道改变 */
    sendChannelChange() {
      this.jsonStr = null;
    },
    onJsonChange(value) {
      // 实时保存
      this.onJsonSave(value);
    },
    onJsonSave(value) {
      this.form.accountConfigTemplate = JSON.stringify(value);
      this.hasJsonFlag = true;
    },
    onError() {
      this.hasJsonFlag = false;
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .jsoneditor-poweredBy {
  display: none;
}
</style>

