<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="标题" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="模板状态" prop="templateStatus">
        <el-select v-model="queryParams.templateStatus" placeholder="请选择当前模板状态" clearable>
          <el-option v-for="dict in dict.type.stop_using_flag" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发送ID类型" prop="idType" v-if="false">
        <el-select v-model="queryParams.idType" placeholder="请选择消息的发送ID类型" clearable>
          <el-option v-for="dict in dict.type.msg_id_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发送渠道" prop="sendChannel">
        <el-select v-model="queryParams.sendChannel" placeholder="请选择消息发送渠道" clearable>
          <el-option v-for="dict in dict.type.msg_send_channel" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="消息类型" prop="msgType" v-if="false">
        <el-select v-model="queryParams.msgType" placeholder="请选择消息类型" clearable>
          <el-option v-for="dict in dict.type.msg_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          v-hasPermi="['message:template:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['message:template:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['message:template:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['message:template:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{ (scope.$index + 1) + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="模板id" align="center" prop="id" v-if="false" />
      <el-table-column label="标题" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="模板状态" align="center" prop="templateStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.stop_using_flag" :value="scope.row.templateStatus" />
        </template>
      </el-table-column>
      <el-table-column label="发送模式" align="center" prop="sendModel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.expect_push_time" :value="scope.row.sendModel" />
        </template>
      </el-table-column>
      <el-table-column label="定时任务id" align="center" prop="cronTaskId" />
      <el-table-column label="定时表达式" align="center" prop="cronExpression" />
      <el-table-column label="发送id类型" align="center" prop="idType" v-if="false">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.msg_id_type" :value="scope.row.idType" />
        </template>
      </el-table-column>
      <el-table-column label="发送对象" align="center" prop="sendTo" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ JSON.parse(scope.row.sendTo).map(s => s.roleName).join() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送渠道" align="center" prop="sendChannel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.msg_send_channel" :value="scope.row.sendChannel" />
        </template>
      </el-table-column>
      <el-table-column label="消息类型" align="center" prop="msgType" v-if="false">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.msg_type" :value="scope.row.msgType" />
        </template>
      </el-table-column>
      <el-table-column label="屏蔽类型" align="center" prop="shieldType" v-if="false">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.msg_shield_type" :value="scope.row.shieldType" />
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="center" prop="msgContent" :show-overflow-tooltip="true" />
      <el-table-column label="消息处理器" align="center" prop="msgHandler" :show-overflow-tooltip="true" />
      <el-table-column label="发送账号" align="center" prop="sendAccount" v-if="false" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)"
            v-hasPermi="['message:template:view']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['message:template:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['message:template:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改消息模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" placeholder="请输入标题" style="width: 80%;" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="发送id类型" prop="idType" v-if="false">
          <el-radio-group v-model="form.idType">
            <el-radio v-for="dict in dict.type.msg_id_type" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息类型" prop="msgType" v-if="false">
          <el-radio-group v-model="form.msgType">
            <el-radio v-for="dict in dict.type.msg_type" :key="dict.value" :label="parseInt(dict.value)">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="屏蔽类型" prop="shieldType" v-if="false">
          <el-radio-group v-model="form.shieldType">
            <el-radio v-for="dict in dict.type.msg_shield_type" :key="dict.value" :label="parseInt(dict.value)">{{
              dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送模式" prop="sendModel">
          <el-radio-group v-model="form.sendModel">
            <el-radio v-for="dict in dict.type.expect_push_time" :key="dict.value" :label="dict.value">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="定时表达式" prop="cronExpression" v-if="seeCronExpression">
          <el-input placeholder="请输入定时表达式" v-model="form.cronExpression" :disabled="true" style="width:400px;">
            <template slot="append">
              <el-button type="primary" @click="handleShowCron">
                生成表达式
                <i class="el-icon-time el-icon--right"></i>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="发送对象" prop="sendTo">
          <el-input placeholder="请选择发送对象" v-model="form.sendTo" :disabled="true" style="width:400px;">
            <template slot="append">
              <el-button type="primary" @click="handleSelectRoles">
                选择
                <i class="el-icon-time el-icon-search"></i>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="发送渠道" prop="sendChannel">
          <el-radio-group v-model="form.sendChannel" @change="sendChannelChange">
            <el-radio v-for="dict in dict.type.msg_send_channel" :key="dict.value" :label="parseInt(dict.value)">{{
              dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送账号" prop="sendAccount">
          <el-select v-model="form.sendAccount" placeholder="请选择发送账号" clearable>
            <el-option v-for="account in accountList" :key="account.channelId" :label="account.name"
              :value="account.channelId" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送类型" prop="messageContent.sendType" v-if="form.sendChannel == 50">
          <el-radio-group v-model="form.messageContent.sendType" @change="sendTypeChange">
            <el-radio v-for="dict in dict.type.dtw_send_type" :key="dict.value" :label="dict.value">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="msgLabel.labelTitle" prop="messageContent.title" v-if="msgShow.showTitle">
          <el-input v-model="form.messageContent.title" :placeholder="msgPlaceHolder.placeholderTitle" style="width: 80%;"
            maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item :label="msgLabel.labelContent" prop="messageContent.content" v-if="msgShow.showContent">
          <el-input v-model="form.messageContent.content" type="textarea" :rows="3"
            :placeholder="msgPlaceHolder.placeholderContent" />
        </el-form-item>
        <el-form-item :label="msgLabel.labelMediaid" prop="messageContent.mediaId" v-if="msgShow.showMediaid">
          <el-input v-model="form.messageContent.mediaId" :placeholder="msgPlaceHolder.placeholderMediaId"
            style="width: 60%;" />
        </el-form-item>
        <el-form-item :label="msgLabel.labelVoiceDuration" prop="messageContent.voiceDuration"
          v-if="msgShow.showVoiceDuration">
          <el-input v-model="form.messageContent.voiceDuration" :placeholder="msgPlaceHolder.placeholderVoiceDuration"
            style="width: 60%;" />
        </el-form-item>
        <el-form-item :label="msgLabel.labelUrl" prop="messageContent.url" v-if="msgShow.showUrl">
          <el-input v-model="form.messageContent.url" :placeholder="msgPlaceHolder.placeholderUrl" style="width: 60%;" />
        </el-form-item>
        <el-form-item label="消息处理器" prop="messageHandlerInstance.handler" v-if="open">
          <el-select v-model="form.messageHandlerInstance.handler" placeholder="请选择消息处理器" clearable
            @change="handlerSelectChange">
            <el-option v-for="h in handlerList" :key="h.handler" :label="h.name" :value="h.handler" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="删除标识" prop="delFlag" v-if="false">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isEdit">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- Cron表达式生成器-->
    <el-dialog title="Cron表达式生成器" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
      <Crontab @hide="openCron = false" @fill="crontabFill" :expression="expression"></Crontab>
    </el-dialog>

    <!-- 角色管理-->
    <el-dialog title="选择消息通知发送对象" :visible.sync="role.openSendTo" append-to-body destroy-on-close>
      <el-table v-loading="role.loading" ref="roleTable" :row-key="getRowKey"
        @selection-change="handleRolesSelectionChange"
        :data="role.roles.slice((role.pageNum - 1) * role.pageSize, role.pageNum * role.pageSize)">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column label="序号" type="index" align="center">
          <template slot-scope="scope">
            <span>{{ (role.pageNum - 1) * role.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色编号" align="center" prop="roleId" v-if="false" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="权限字符" align="center" prop="roleKey" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="role.total > 0" :total="role.total" :page.sync="role.pageNum" :limit.sync="role.pageSize" />
      <el-form label-width="100px">
        <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
          <el-button type="primary" @click="roleSubmitForm()">确定</el-button>
          <el-button @click="roleClose()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate, getMessageHandler } from "@/api/message/msgtemplate";
import Crontab from '@/components/Crontab'
import { getAuthRole } from "@/api/system/user";
import { listAccount } from "@/api/message/account";

export default {
  components: { Crontab },
  name: "Template",
  dicts: ['stop_using_flag', 'msg_template_type', 'msg_id_type', 'expect_push_time', 'msg_type', 'msg_send_channel', 'msg_shield_type', 'dtw_send_type'],
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
      // 消息模板表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否查看
      isEdit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        idType: null,
        sendChannel: null,
        msgType: null,
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        templateStatus: [
          { required: true, message: "当前模板状态不能为空", trigger: "change" }
        ],
        sendModel: [
          { required: true, message: "期望发送时间不能为空", trigger: "change" }
        ],
        cronExpression: [
          { required: true, message: "定时发送表达式不能为空", trigger: "change" }
        ],
        // idType: [
        //   { required: true, message: "消息的发送id类型不能为空", trigger: "change" }
        // ],
        sendChannel: [
          { required: true, message: "消息发送渠道不能为空", trigger: "change" }
        ],
        sendAccount: [
          { required: true, message: "消息发送账号不能为空", trigger: "change" }
        ],
        sendTo: [
          { required: true, message: "消息发送对象不能为空", trigger: "change" }
        ],
        // msgType: [
        //   { required: true, message: "消息类型不能为空", trigger: "change" }
        // ],
        shieldType: [
          { required: true, message: "屏蔽类型不能为空", trigger: "change" }
        ],
        messageContent:
        {
          sendType: [
            { required: true, message: "发送类型不能为空", trigger: "blur" }
          ],
          title: [
            { required: true, message: "消息标题不能为空", trigger: "blur" }
          ],
          content: [
            { required: true, message: "消息内容不能为空", trigger: "blur" }
          ],
          mediaId: [
            { required: true, message: "mediaId不能为空", trigger: "blur" }
          ],
          voiceDuration: [
            { required: true, message: "音频时长不能为空", trigger: "blur" }
          ],
          url: [
            { required: true, message: "页面链接url不能为空", trigger: "blur" }
          ],
        },
        messageHandlerInstance: {
          handler: [
            { required: true, message: "消息处理器不能为空", trigger: "blur" }
          ],
        }
      },
      seeCronExpression: false,
      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: "",
      // 发送对象
      sendToRoles: [],
      /**发送对象 */
      role: {
        // 遮罩层
        loading: true,
        // 分页信息
        total: 0,
        pageNum: 1,
        pageSize: 10,
        // 选中角色编号
        selectRoles: [],
        // 角色信息
        roles: [],
        // 用户id
        userId: null,
        // 打开角色页面
        openSendTo: false
      },
      // 账号列表
      accountList: [],
      // 控件placeholder
      msgPlaceHolder: {
        placeholderTitle: "可用占位符${title}",
        placeholderContent: "可用占位符${content}",
        placeholderMediaId: "可用占位符${mediaId}",
        placeholderVoiceDuration: "正整数，小于60，表示语音时长",
        placeholderUrl: "可用占位符${url}",
      },
      // 控件标签
      msgLabel: {
        labelTitle: "消息标题",
        labelContent: "消息内容",
        labelMediaid: "媒体ID",
        labelVoiceDuration: "声音时长",
        labelUrl: "页面链接"
      },
      // 控件可见
      msgShow: {
        showTitle: false,
        showContent: false,
        showMediaid: false,
        showVoiceDuration: false,
        showUrl: false
      },
      // 消息处理器
      handlerList: [],
      messageHandlerInstance: {
        clazz:null,
        channel: null,
        handler: null,
        name: null,
      }
    };
  },
  watch: {
    sendToRoles: {
      deep: true,
      handler(n, o) {
        if (Array.isArray(n)) {
          this.form.sendTo = n.map(r => r.roleName).join();
        }
      }
    },
    'form.sendModel': function (n, o) {
      this.seeCronExpression = n == 1 ? true : false;
    },
  },
  created() {
    this.getList();
    this.getSendAccountList(this.form.sendChannel);
  },
  methods: {
    /** 查询消息模板列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then(response => {
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.isEdit = true;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        templateStatus: null,
        cronTaskId: null,
        cronExpression: null,
        sendModel: null,
        idType: null,
        sendTo: null,
        sendChannel: null,
        msgType: null,
        shieldType: null,
        msgContent: null,
        sendAccount: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        messageContent: {
          sendType: null,
          title: null,
          content: null,
          mediaId: null,
          voiceDuration: null,
          url: null,
        },
        messageHandlerInstance: {
          channel: null,
          handler: null,
          name: null,
        }
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
      this.isEdit = true;
      this.title = "添加消息模板";
      this.setMsgShow(false, false, false, false, false)
    },
    /**查看详情 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getTemplate(id).then(response => {
        this.form = response.data;
        if (this.form && this.form.sendTo) {
          this.sendToRoles = JSON.parse(this.form.sendTo);
        }
        this.open = true;
        this.handleSendChannel(this.form.sendChannel);
        this.title = "消息模板详情";
        this.isEdit = false;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTemplate(id).then(response => {
        this.form = response.data;
        if (this.form && this.form.sendTo) {
          this.sendToRoles = JSON.parse(this.form.sendTo);
        }
        this.open = true;
        this.isEdit = true
        this.handleSendChannel(this.form.sendChannel, this.form.messageContent.sendType);
        this.title = "修改消息模板";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.sendTo = JSON.stringify(this.sendToRoles);
            this.form.messageHandlerInstance = this.messageHandlerInstance;
            updateTemplate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.sendTo = JSON.stringify(this.sendToRoles);
            this.form.messageHandlerInstance = this.messageHandlerInstance;
            addTemplate(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除消息模板编号为"' + ids + '"的数据项？').then(function () {
        return delTemplate(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/template/export', {
        ...this.queryParams
      }, `template_${new Date().getTime()}.xlsx`)
    },
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.form.cronExpression;
      this.openCron = true;
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.form.cronExpression = value;
    },
    // 选择发送对象
    handleSelectRoles() {
      this.role.openSendTo = true;
      this.role.selectRoles = [];
      const userId = this.$store.state.user && this.$store.state.user.id;
      if (userId) {
        this.role.loading = true;
        getAuthRole(userId).then((response) => {
          this.role.roles = response.roles;
          this.role.total = this.role.roles.length;
          this.$nextTick(() => {
            this.role.roles.forEach((row) => {
              if (this.sendToRoles.some(e => row.roleId == e.roleId)) {
                this.$refs.roleTable.toggleRowSelection(row);
              }
            });
          });
          this.role.loading = false;
        });
      }
    },
    // 保存选中的数据编号
    getRowKey(row) {
      return row.roleId;
    },
    // 多选框选中数据
    handleRolesSelectionChange(selection) {
      this.role.selectRoles = [];
      selection.forEach((item) => {
        let r = {};
        r.roleId = item.roleId;
        r.roleName = item.roleName;
        this.role.selectRoles.push(r);
      });
    },
    // 确认
    roleSubmitForm() {
      this.$modal.confirm('是否确认选择的角色？').then(() => {
        this.sendToRoles = [];
        this.role.selectRoles.forEach(s => this.sendToRoles.push(s));
        this.role.openSendTo = false;
      }).catch(() => { });
    },
    // 取消
    roleClose() {
      this.role.openSendTo = false;
    },
    //获取发送账号
    getSendAccountList(sendChannel) {
      listAccount({ sendChannel: sendChannel }).then(response => {
        this.accountList = response.rows;
      });
    },
    /** 处理发送渠道 */
    handleSendChannel(channel, type) {
      this.getSendAccountList(channel);
      this.getMessageHandlerList(channel);
      switch (channel) {
        case 10:
          this.setMsgShow(true, true, false, false, false);
          break;
        case 20:
          this.setMsgShow(false, false, false, false, false);
          break;
        case 30:
          this.setMsgShow(true, true, false, false, true);
          break;
        case 50:
          this.sendTypeChange(type);
          break;
      }
    },
    /** 发送渠道改变 */
    sendChannelChange(val) {
      this.getSendAccountList(val);
      this.getMessageHandlerList(val);
      this.form.sendAccount = null;
      this.form.messageHandlerInstance.handler = null;
      switch (val) {
        case 10:
          this.setMsgShow(true, true, false, false, false);
          break;
        case 20:
          this.setMsgShow(false, true, false, false, false);
          break;
        case 30:
          this.setMsgShow(true, true, false, false, true);
          break;
        case 50:
          this.setMsgShow(false, false, false, false, false);
          this.sendTypeChange('text');
          break;
      }
    },
    /** 发送类型改变 */
    sendTypeChange(type) {
      switch (type) {
        case 'text':
          this.setMsgShow(false, true, false, false, false);
          break;
        case 'voice':
          this.setMsgShow(false, false, true, true, false);
          break;
        case 'file':
          this.setMsgShow(false, false, true, false, false);
          break;
        case 'markdown':
          this.setMsgShow(true, true, false, false, false);
          break;
        case 'image':
          this.setMsgShow(false, false, true, false, false);
          break;
        case 'link':
          this.setMsgShow(true, true, true, false, true);
          break;
      }

    },
    // 设置控件可见
    setMsgShow(...show) {
      this.msgShow.showTitle = show[0];
      this.msgShow.showContent = show[1];
      this.msgShow.showMediaid = show[2];
      this.msgShow.showVoiceDuration = show[3];
      this.msgShow.showUrl = show[4];
    },
    // 获取消息处理器
    getMessageHandlerList(sendChannel) {
      getMessageHandler(sendChannel).then(r => {
        this.handlerList = r.data;
      }).catch(() => { });
    },
    /**处理选择 */
    handlerSelectChange(value) {
      this.handlerList.forEach(h => {
        if (h.handler == value) {
          this.messageHandlerInstance = h;
        }
      })
    }
  }
};
</script>
