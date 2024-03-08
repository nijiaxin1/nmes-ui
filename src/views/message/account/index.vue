<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="账号名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入账号名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="消息发送渠道" prop="sendChannel">
        <el-select v-model="queryParams.sendChannel" placeholder="请选择消息发送渠道" clearable>
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
          v-hasPermi="['message:account:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['message:account:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['message:account:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['message:account:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accountList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{ (scope.$index + 1) + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="渠道ID" align="center" prop="channelId" v-if="false" />
      <el-table-column label="账号名称" align="center" prop="name" />
      <el-table-column label="消息发送渠道" align="center" prop="sendChannel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.msg_send_channel" :value="scope.row.sendChannel" />
        </template>
      </el-table-column>
      <el-table-column label="账号配置" align="center" prop="accountConfig" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['message:account:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['message:account:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改渠道账号信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="账号名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入账号名称" style="width: 60%;" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="消息发送渠道" prop="sendChannel">
          <el-radio-group v-model="form.sendChannel" @change="sendChannelChange">
            <el-radio v-for="dict in dict.type.msg_send_channel" :key="dict.value" :label="parseInt(dict.value)">{{
              dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号配置" prop="accountConfig">
          <v-json-editor v-model="jsonStr" :show-btns="false" mode="code" lang="zh" :expandedOnStart="false"
            @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" rows="2" />
        </el-form-item>
      </el-form>
      <div>
        <el-divider content-position="left">账号配置样例</el-divider>
        <el-tabs type="border-card" v-if="accountExampleList.length > 0">
          <el-tab-pane v-for="example in accountExampleList" :label="example.name">
            <template>
              <jsonView :data="JSON.parse(example.accountConfigTemplate)"></jsonView>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueJsonEditor from 'vue-json-editor'
import jsonView from 'vue-json-views'

import { listAccount, getAccount, delAccount, addAccount, updateAccount } from "@/api/message/account";
import { listExample } from "@/api/message/example";

export default {
  name: "Account",
  components: {
    'v-json-editor': VueJsonEditor,
    jsonView
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
      // 渠道账号信息表格数据
      accountList: [],
      // 渠道账号信息样例表格数据
      accountExampleList: [],
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
        accountConfig: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "账号名称不能为空", trigger: "blur" }
        ],
        sendChannel: [
          { required: true, message: "消息发送渠道不能为空", trigger: "change" }
        ],
        accountConfig: [
          { required: true, message: "账号配置不能为空", trigger: "blur" },
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
      this.form.accountConfig = nValue ? JSON.stringify(nValue) : nValue;
    }
  },
  methods: {
    /** 查询渠道账号信息列表 */
    getList() {
      this.loading = true;
      listAccount(this.queryParams).then(response => {
        this.accountList = response.rows;
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
        channelId: null,
        name: null,
        sendChannel: null,
        accountConfig: null,
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
      this.ids = selection.map(item => item.channelId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加渠道账号信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const channelId = row.channelId || this.ids
      getAccount(channelId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改渠道账号信息";
        this.sendChannelChange(this.form.sendChannel);
        this.jsonStr = JSON.parse(this.form.accountConfig);
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
          if (this.form.channelId != null) {
            updateAccount(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAccount(this.form).then(response => {
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
      const channelIds = row.channelId || this.ids;
      this.$modal.confirm('是否确认删除渠道账号信息编号为"' + channelIds + '"的数据项？').then(function () {
        return delAccount(channelIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('message/account/export', {
        ...this.queryParams
      }, `account_${new Date().getTime()}.xlsx`)
    },
    /** 发送渠道改变 */
    sendChannelChange(val) {
      this.jsonStr = null;
      listExample({ sendChannel: val }).then(response => {
        this.accountExampleList = response.rows;
      });
    },
    onJsonChange(value) {
      // 实时保存
      this.onJsonSave(value);
    },
    onJsonSave(value) {
      this.form.accountConfig = JSON.stringify(value);
      this.hasJsonFlag = true;
    },
    onError(value) {
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
