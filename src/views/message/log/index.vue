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
      <el-form-item label="发送者" prop="sendId">
        <el-input
          v-model="queryParams.sendId"
          placeholder="请输入发送者"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接收者" prop="receiveId">
        <el-select
          v-model="queryParams.receiveId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入姓名"
          :remote-method="getUserByFuzzyNickName"
          :loading="userLoading"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送渠道" prop="sendChannel">
        <el-select
          v-model="queryParams.sendChannel"
          placeholder="请选择发送渠道"
          clearable
        >
          <el-option
            v-for="dict in dict.type.msg_send_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消息状态" prop="sendStatus">
        <el-select
          v-model="queryParams.sendStatus"
          placeholder="请选择消息状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.msg_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime">
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
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['message:log:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['message:log:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['message:log:remove']">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['message:log:export']"
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
      :data="messagelogList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="false"
      />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="消息id"
        align="center"
        prop="msgId"
        v-if="false"
      />
      <el-table-column label="发送者" align="center" prop="sendId" />
      <el-table-column
        label="接收者"
        align="center"
        prop="receiver"
        show-overflow-tooltip
      />
      <el-table-column label="发送渠道" align="center" prop="sendChannel">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.msg_send_channel"
            :value="scope.row.sendChannel"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="消息类型"
        align="center"
        prop="msgType"
        v-if="false"
      >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.msg_type" :value="scope.row.msgType" />
        </template>
      </el-table-column>
      <el-table-column
        label="消息标题"
        align="center"
        prop="msgTitle"
        show-overflow-tooltip
      />
      <el-table-column
        label="消息内容"
        align="center"
        prop="msgContent"
        show-overflow-tooltip
      />
      <el-table-column
        label="发送时间"
        align="center"
        prop="sendTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.sendTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送状态" align="center" prop="sendStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.msg_status"
            :value="scope.row.sendStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="错误信息" align="center" prop="errorMsg" />
      <el-table-column label="是否阅读" align="center" prop="readStatus" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['message:log:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['message:log:remove']">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改消息(通知)发送记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发送者" prop="sendId">
          <el-input v-model="form.sendId" placeholder="请输入发送者" />
        </el-form-item>
        <el-form-item label="接收者" prop="receiveId">
          <el-input v-model="form.receiveId" placeholder="请输入接收者" />
        </el-form-item>
        <el-form-item label="发送渠道" prop="sendChannel">
          <el-select v-model="form.sendChannel" placeholder="请选择发送渠道">
            <el-option
              v-for="dict in dict.type.msg_send_channel"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息类型" prop="msgType">
          <el-select v-model="form.msgType" placeholder="请选择消息类型">
            <el-option
              v-for="dict in dict.type.msg_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息标题" prop="msgTitle">
          <el-input v-model="form.msgTitle" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="消息内容">
          <editor v-model="form.msgContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="发送时间" prop="sendTime">
          <el-date-picker
            clearable
            v-model="form.sendTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发送时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="错误信息" prop="errorMsg">
          <el-input v-model="form.errorMsg" placeholder="请输入错误信息" />
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
  </div>
</template>

<script>
import {
  listMessagelog,
  getMessagelog,
  delMessagelog,
  addMessagelog,
  updateMessagelog,
} from "@/api/message/log";
import { listUserByFuzzyNickName } from "@/api/dt/user";

export default {
  name: "Messagelog",
  dicts: ["msg_type", "msg_send_channel", "msg_status"],
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
      // 消息(通知)发送记录表格数据
      messagelogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sendId: null,
        receiveId: null,
        sendChannel: null,
        msgType: null,
        msgTitle: null,
        msgContent: null,
        sendTime: null,
        sendStatus: null,
        errorMsg: null,
        readStatus: null,
        startDate: null,
        endDate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sendId: [
          { required: true, message: "发送者不能为空", trigger: "blur" },
        ],
        receiveId: [
          { required: true, message: "接收者不能为空", trigger: "blur" },
        ],
        sendChannel: [
          { required: true, message: "发送渠道不能为空", trigger: "change" },
        ],
        msgType: [
          { required: true, message: "消息类型不能为空", trigger: "change" },
        ],
      },
      //员工列表
      userList: [],
      userLoading: false,
      // 查询时间范围
      dateRange: [],
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
    /** 查询消息(通知)发送记录列表 */
    getList() {
      this.loading = true;
      listMessagelog(this.queryParams).then((response) => {
        this.messagelogList = response.rows;
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
        msgId: null,
        sendId: null,
        receiveId: null,
        sendChannel: null,
        msgType: null,
        msgTitle: null,
        msgContent: null,
        sendTime: null,
        sendStatus: null,
        errorMsg: null,
        readStatus: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
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
      this.dateRange = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.msgId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加消息(通知)发送记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const msgId = row.msgId || this.ids;
      getMessagelog(msgId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改消息(通知)发送记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.msgId != null) {
            updateMessagelog(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMessagelog(this.form).then((response) => {
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
      const msgIds = row.msgId || this.ids;
      this.$modal
        .confirm(
          '是否确认删除消息(通知)发送记录编号为"' + msgIds + '"的数据项？'
        )
        .then(function () {
          return delMessagelog(msgIds);
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
        "message/log/export",
        {
          ...this.queryParams,
        },
        `messagelog_${new Date().getTime()}.xlsx`
      );
    },
    /** 用户别名模糊查询 */
    getUserByFuzzyNickName(query) {
      if (query !== "") {
        this.userLoading = true;
        listUserByFuzzyNickName(query).then((r) => {
          this.userList = r.rows;
          this.userLoading = false;
        });
      }
    },
  },
};
</script>
