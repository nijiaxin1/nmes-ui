<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班组" prop="teamId">
        <el-select v-model="queryParams.teamId" clearable placeholder="请选择班组">
          <el-option v-for="item in teamList" :key="item.teamId" :label="item.teamName" :value="item.teamId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班次" prop="periodId">
        <el-select v-model="queryParams.periodId" clearable placeholder="请选择班次">
          <el-option v-for="item in workClassList" :key="item.periodId" :label="item.periodName" :value="item.periodId">
            <span style="float: left">{{ item.periodName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.periodTime }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工序" prop="processId">
        <el-select v-model="queryParams.processId" clearable placeholder="请选择工序">
          <el-option v-for="item in processList" :key="item.id" :label="item.processName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="nickName">
        <el-select v-model="queryParams.userId" filterable clearable remote reserve-keyword placeholder="请输入姓名"
          :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in sysUserList" :key="item.userId" :label="item.nickName" :value="item.userId">
          </el-option>
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
          v-hasPermi="['system:schedule:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-copy-document" size="mini" @click="handleCopy"
          v-hasPermi="['system:schedule:copy']" v-if="false">复制</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:schedule:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:schedule:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:schedule:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="scheduleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ (scope.$index + 1) + (queryParams.pageNum - 1) * queryParams.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主键" align="center" prop="id" v-if="false" />
      <el-table-column label="班组" align="center" prop="teamName" />
      <el-table-column label="班次" align="center" prop="periodName" />
      <el-table-column label="时间" align="center" prop="periodTime" />
      <el-table-column label="姓名" align="center" prop="nickName" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:schedule:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:schedule:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改生产排班对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="65%" append-to-body :before-close="handleAddDialogClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-divider content-position="left">班组</el-divider>
        <el-form-item label="班组" prop="teamId">
          <el-select v-model="form.teamId" clearable placeholder="请选择班组" @change="handleTeamChange">
            <el-option v-for="item in teamList" :key="item.teamId" :label="item.teamName" :value="item.teamId">
              <span style="float: left">{{ item.teamName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次" prop="periodId" v-if="false">
          <el-select v-model="form.periodId" clearable placeholder="请选择班次" @change="handlePeriodChange">
            <el-option v-for="item in workClassList" :key="item.periodId" :label="item.periodName" :value="item.periodId">
              <span style="float: left">{{ item.periodName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.periodTime }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="left">班组成员</el-divider>
        <el-table v-loading="loading" :data="teamUserList" @selection-change="handleTeamUserSelectionChange">
          <el-table-column type="selection" width="50" align="center" v-if="false" />
          <el-table-column label="班组ID" align="center" key="teamId" prop="teamId" v-if="false" />
          <el-table-column label="班组" align="center" key="teamName" prop="teamName" />
          <el-table-column label="用户ID" align="center" key="userId" prop="userId" v-if="false" />
          <el-table-column label="用户名称" align="center" key="userName" prop="userName" />
          <el-table-column label="班次" align="center" key="periodId" prop="periodId">
            <template slot-scope="scope">
              <el-select v-model="scope.row.periodId" clearable placeholder="请选择班次" @change="handlePeriodChange">
                <el-option v-for="item in workClassList" :key="item.periodId" :label="item.periodName"
                  :value="item.periodId">
                  <span style="float: left">{{ item.periodName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.periodTime }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="工序" align="center" key="processId" prop="processId">
            <template slot-scope="scope">
              <el-select v-model="scope.row.processId" clearable placeholder="请选择工序">
                <el-option v-for="item in teamProcessList" :key="item.id" :label="item.processName"
                  :value="item.processId">
                  <span style="float: left">{{ item.processName }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-plus" @click="handleScheduleAdd(scope.row)"
                v-hasPermi="['system:schedule:edit']">新增</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="left">排班信息</el-divider>
        <el-row>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleAddDelete"
              v-hasPermi="['system:schedule:remove']">删除</el-button>
          </el-col>
        </el-row>
        <br />
        <el-table v-loading="loading" :data="teamScheduleList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" align="center" width="70">
            <template slot-scope="scope">
              <span>{{ (scope.$index + 1) + (queryParams.pageNum - 1) * queryParams.pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="主键" align="center" prop="id" v-if="false" />
          <el-table-column label="班组" align="center" prop="teamName" />
          <el-table-column label="班次" align="center" prop="periodName" />
          <el-table-column label="时间" align="center" prop="periodTime" />
          <el-table-column label="姓名" align="center" prop="nickName" />
          <el-table-column label="工序" align="center" prop="processName" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleAddDelete(scope.row)"
                v-hasPermi="['system:schedule:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSchedule, addSchedule, delSchedule, updateSchedule, listSchedule,
  addWorkSchedules, getTodayWorkSchedulesOfTeam
} from "@/api/system/schedule";
import { listClass } from "@/api/system/workscheduleclass";
import { listEnableTeam, listTeamProcess, getTeamMemberList } from "@/api/system/team";
import { listUserByFuzzyNickName } from "@/api/dt/user";
import { listProcess } from "@/api/base/process";

export default {
  name: "Schedule",
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
      // 生产排班表格数据
      scheduleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        scheduleDate: null,
        scheduleId: null,
        userId: null,
        nickName: null,
        teamId: null,
        processId: null,
      },
      nickName: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        scheduleDate: [
          { required: true, message: "排班日期不能为空", trigger: "blur" }
        ],
        scheduleName: [
          { required: true, message: "班制不能为空", trigger: "blur" }
        ],
        periodId: [
          { required: true, message: "班次不能为空", trigger: "blur" }
        ],
        teamId: [
          { required: true, message: "班组不能为空", trigger: "blur" }
        ],
        processId: [
          { required: true, message: "工序不能为空", trigger: "blur" }
        ],
      },
      // 班制
      workShiftSystem: null,
      // 查询参数
      wssQueryParams: {
        pageNum: 1,
        pageSize: 10,
        scheduleName: null,
        periodName: null,
      },
      // 生产班次表格数据
      workClassList: [],
      // 班组表格数据
      teamList: [],
      // 班组工序列表
      teamProcessList: [],
      teamUserList: [],
      // 选中班组成员
      teamUserSelectList: [],
      isAdd: true,
      // 系统用户列表
      sysUserList: [],
      // 工序列表
      processList: [],
      // 班组排班信息
      teamScheduleList: [],
    };
  },
  created() {
    this.getList();
    this.getListByScheduleId();
    this.getTeamList();
    this.getProcessList();
  },
  methods: {
    /** 查询生产排班列表 */
    getList() {
      this.loading = true;
      listSchedule(this.queryParams).then(response => {
        this.scheduleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.queryParams.teamId = null;
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        scheduleDate: null,
        scheduleId: null,
        userId: null,
        teamId: null,
        teamIds: [],
        processId: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        scheduleUserVos: [],
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
      this.queryParams.userId = null;
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
      this.isAdd = true;
      this.open = true;
      this.teamScheduleList = [];
      this.title = "添加生产排班";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSchedule(id).then(response => {
        this.form = response.data;
        this.handleTeamChange(this.form.teamId);
        this.open = true;
        this.isAdd = false;
        this.title = "修改生产排班";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSchedule(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.scheduleUserVos = this.teamUserSelectList;
            addWorkSchedules(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.getTeamMemberScheduleInfoList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中的生产排班数据？').then(function () {
        return delSchedule(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('work/schedule/export', {
        ...this.queryParams
      }, `schedule_${new Date().getTime()}.xlsx`)
    },
    /** 通过班制ID查询生产班次列表 */
    getListByScheduleId() {
      listClass().then(response => {
        this.workClassList = response.rows;
      });
    },
    /** 查询班组列表 */
    getTeamList() {
      listEnableTeam().then(response => {
        this.teamList = response.rows;
      });
    },
    /**班次切换 */
    handlePeriodChange() {
    },
    /**班组切换 */
    handleTeamChange(teamId) {
      if (teamId) {
        this.getTeamMemberList(teamId);
        this.getTeamProcessList(teamId);
        this.queryParams.teamId = teamId;
        this.getTeamScheduleList();
      }
    },
    /** 查询生产排班列表 */
    getTeamScheduleList() {
      this.loading = true;
      listSchedule(this.queryParams).then(response => {
        this.teamScheduleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**获取班组工序 */
    getTeamProcessList(teamId) {
      listTeamProcess(teamId).then(r => {
        this.teamProcessList = r.rows;
      })
    },
    // 获取班组成员
    getTeamMemberList(teamId) {
      getTeamMemberList(teamId).then(response => {
        this.teamUserList = response.rows;
      })
    },
    // 获取班组成员排班信息
    getTeamMemberScheduleInfoList() {
      getTodayWorkSchedulesOfTeam(this.form).then(response => {
        this.teamUserList = response.rows;
      })
    },
    // 多选
    handleTeamUserSelectionChange(selection) {
      this.teamUserSelectList = selection
    },
    /** 用户别名模糊查询 */
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        listUserByFuzzyNickName(query).then(r => {
          this.sysUserList = r.rows;
          this.loading = false;
        });
      }
    },
    /** 查询工序表列表 */
    getProcessList() {
      listProcess().then(response => {
        this.processList = response.rows;
      });
    },
    /**设置表格行禁止选择 */
    checkSelectable(row) {
      return row.isScheduled == '否';
    },
    /** 排班信息 */
    handleScheduleAdd(row) {
      if (!row.periodId || !row.processId) {
        this.$modal.msgError("请选择班次和工序！");
      } else {
        row.id = null;
        addSchedule(row).then(r => {
          this.$modal.msgSuccess("新增成功");
          this.getTeamScheduleList();
        })
      }
    },
    /** 新增排班的对话框点击X关闭的回调 */
    handleAddDialogClose() {
      this.cancel();
    },
    /** 删除按钮操作 */
    handleAddDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中的生产排班数据？').then(function () {
        return delSchedule(ids);
      }).then(() => {
        this.getTeamScheduleList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
  }
};
</script>
