<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="班组名称" prop="teamName">
        <el-input v-model="queryParams.teamName" placeholder="请输入班组名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="班组状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择班组状态" clearable>
          <el-option v-for="dict in dict.type.team_status" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          v-hasPermi="['work:team:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['work:team:edit']">修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['work:team:remove']">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['work:team:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teamList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{ (scope.$index + 1) + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="班组ID" align="center" prop="teamId" v-if="false" />
      <el-table-column label="班组名称" align="center" prop="teamName" />
      <el-table-column label="班组负责人" align="center" prop="leaderId" />
      <el-table-column label="工序ID" align="center" prop="processId" v-if="false" />
      <el-table-column label="工序" align="center" prop="processName" v-if="false" />
      <el-table-column label="班组状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.team_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-user" @click="handleTeamUser(scope.row)"
            v-hasPermi="['team:user:list']">组员</el-button>
          <el-button size="mini" type="text" icon="el-icon-coordinate" @click="handleOpenTeamProcess(scope.row)"
            v-hasPermi="['team:process:list']">工序</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['work:team:edit', 'work:team:remove']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleUpdate" icon="el-icon-edit"
                v-hasPermi="['work:team:edit']">修改</el-dropdown-item>
              <el-dropdown-item command="handleDelete" icon="el-icon-delete"
                v-hasPermi="['work:team:remove']">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改班组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="班组名称" prop="teamName">
          <el-input v-model="form.teamName" placeholder="请输入班组名称" />
        </el-form-item>
        <el-form-item label="班组负责人" prop="leaderId">
          <el-input v-model="form.leaderId" placeholder="请输入班组负责人" />
        </el-form-item>
        <el-form-item label="班组状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in dict.type.team_status" :key="dict.value" :label="dict.value">{{ dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加组员对话框 -->
    <el-dialog :title="teamTitle" :visible.sync="teamOpen" width="80%" append-to-body>

      <el-divider content-position="left" border-color="#dcdcdc" border-style="dashed">班组信息</el-divider>
      <el-descriptions>
        <el-descriptions-item label="班组名称">{{ form.teamName }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ form.leaderId }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ form.remark }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">班组成员</el-divider>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddMember"
            v-hasPermi="['work:team:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="teamUserMultiple"
            @click="handleDeleteMember" v-hasPermi="['work:team:remove']">删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="teamUserList" @selection-change="handleTeamSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" width="70" align="left">
          <template slot-scope="scope">
            {{ (scope.$index + 1) + (teamUserQueryParams.pageNum - 1) * teamUserQueryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="false" />
        <el-table-column label="用户名称" align="center" key="userName" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="部门" align="center" key="deptName" prop="params.departName"
          :show-overflow-tooltip="true" />
        <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" width="120" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteMember(scope.row)"
              v-hasPermi="['work:team:add']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="teamUserTotal > 0" :total="teamUserTotal" :page.sync="teamUserQueryParams.pageNum"
        :limit.sync="teamUserQueryParams.pageSize" @pagination="getTeamMemberList" />
    </el-dialog>

    <!-- 查询系统用户对话框 -->
    <el-dialog :title="userTitle" :visible.sync="userOpen" width="80%" append-to-body @close="handleUserClose">
      <div class="app-container">
        <el-row :gutter="20">
          <!--部门数据-->
          <el-col :span="4" :xs="24">
            <div class="head-container">
              <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search"
                style="margin-bottom: 20px" />
            </div>
            <div class="head-container">
              <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                :filter-node-method="filterNode" ref="tree" node-key="id" highlight-current
                @node-click="handleNodeClick" />
            </div>
          </el-col>
          <!--用户数据-->
          <el-col :span="20" :xs="24">
            <el-form ref="userQueryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="userQueryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px"
                  @keyup.enter.native="handleUserQuery" />
              </el-form-item>
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="userQueryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px"
                  @keyup.enter.native="handleUserQuery" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleUserQuery">搜索</el-button>
              </el-form-item>
            </el-form>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" :disabled="userMultiple"
                  @click="handleAddVerify" v-hasPermi="['work:team:add']">添加</el-button>
              </el-col>
            </el-row>
            <el-table v-loading="loading" :data="userList" @selection-change="handleUserSelectionChange">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column label="序号" width="70" align="left">
                <template slot-scope="scope">
                  {{ (scope.$index + 1) + (userQueryParams.pageNum - 1) * userQueryParams.pageSize }}
                </template>
              </el-table-column>
              <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="false" />
              <el-table-column label="用户名称" align="center" key="userName" prop="userName" :show-overflow-tooltip="true" />
              <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
              <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"
                :show-overflow-tooltip="true" />
              <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" width="120" />
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAddVerify(scope.row)"
                    v-hasPermi="['work:team:add']">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="userTotal > 0" :total="userTotal" :page.sync="userQueryParams.pageNum"
              :limit.sync="userQueryParams.pageSize" @pagination="getUserList" />
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 添加工序对话框 -->
    <el-dialog :title="title" :visible.sync="teamProcessOpen" width="80%" append-to-body
       @close="handelTeamProcessClose">
      <el-divider content-position="left" border-color="#dcdcdc" border-style="dashed">班组信息</el-divider>
      <el-descriptions>
        <el-descriptions-item label="班组名称">{{ form.teamName }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ form.leaderId }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ form.remark }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">班组工序</el-divider>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleOpenSelectProcess"
            v-hasPermi="['team:process:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="teamProcessMultiple"
            @click="handleDeleteProcess" v-hasPermi="['team:process:remove']">删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="teamProcessList" @selection-change="handleTeamProcessSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" width="70" align="left">
          <template slot-scope="scope">
            {{ (scope.$index + 1) + (teamProcessQueryParams.pageNum - 1) * teamProcessQueryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="ID" align="center" prop="id" v-if="false" />
        <el-table-column label="工序代码" align="center" prop="processCode" />
        <el-table-column label="工序名称" align="center" prop="processName" />
        <el-table-column label="停用状态" align="center" prop="deactivationStatus">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.stop_using_flag" :value="scope.row.deactivationStatus" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="success" plain icon="el-icon-circle-check"
              @click="handleSetMainProcess(scope.row.id)" v-hasPermi="['team:process:update']"
              v-if="scope.row.isMain == 0">设置主工序</el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-circle-close"
              @click="handleCancelMainProcess(scope.row.id)" v-hasPermi="['team:process:update']"
              v-if="scope.row.isMain == 1">取消主工序</el-button> -->
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="handleDeleteProcess(scope.row)"
              v-hasPermi="['team:process:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="teamProcessTotal > 0" :total="teamProcessTotal" :page.sync="teamProcessQueryParams.pageNum"
        :limit.sync="teamProcessQueryParams.pageSize" @pagination="getTeamProcessList" />
    </el-dialog>

    <!-- 选择工序 -->
    <el-dialog :title="title" :visible.sync="openProcess" width="60%" append-to-body @close="handleProcessClose">
      <el-form :model="processQueryParams" ref="processQueryForm" size="small" :inline="true" v-show="showSearch"
        label-width="88px">
        <el-form-item label="工序代码" prop="processCode">
          <el-input v-model="processQueryParams.processCode" placeholder="请输入工序代码" clearable
            @keyup.enter.native="handleProcesQuery" />
        </el-form-item>
        <el-form-item label="工序名称" prop="processName">
          <el-input v-model="processQueryParams.processName" placeholder="请输入工序名称" clearable
            @keyup.enter.native="handleProcessQuery" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleProcessQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetProcessQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-check" size="mini" @click="handleSelectProcess"
            v-hasPermi="['team:process:select']" :disabled="processMultiple">选择</el-button>
        </el-col>
      </el-row>
      <el-table row-key="id" v-loading="loading" :data="processList" @selection-change="handleProcessSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" width="70" align="left">
          <template slot-scope="scope">
            {{ (scope.$index + 1) + (processQueryParams.pageNum - 1) * processQueryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="工序代码" align="center" prop="processCode" />
        <el-table-column label="工序名称" align="center" prop="processName" />
        <el-table-column label="停用状态" align="center" prop="deactivationStatus">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.stop_using_flag" :value="scope.row.deactivationStatus" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-hasPermi="['team:process:select']" icon="el-icon-check"
              @click="handleSelectProcess(scope.row)">选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTeam, getTeam, delTeam, addTeam, updateTeam,
  getTeamMembers, addTeamMembers, deleteTeamMembers,
  listTeamProcess, addTeamProcess, listCanAddProcess,
  delTeamProcess, setMainTeamProcess, cancelMainTeamProcess,
  checkHasMainTeamProcess
} from "@/api/system/team";
import { deptTreeSelect } from "@/api/system/user";
import { listTeamUser } from "@/api/dt/user";

export default {
  name: "Team",
  dicts: ['team_status', 'stop_using_flag'],
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
      // 班组表格数据
      teamList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        teamName: null,
        leaderId: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teamName: [
          { required: true, message: "班组名称不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "班组状态不能为空", trigger: "blur" }
        ],
      },
      //#region 添加组员
      teamTitle: null,
      teamOpen: false,
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      teamUserList: [],
      //选中
      teamUserSelectList: [],
      teamUserMultiple: true,
      // 查询参数
      teamUserQueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      teamUserTotal: 0,
      userTitle: null,
      userOpen: false,
      userList: [],
      userTotal: 0,
      // 查询参数
      userQueryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        deptId: undefined
      },
      // 组员添加列表
      teamUserAddList: [],
      // 多选
      userMultiple: true,
      //#endregion
      //#region  工序
      teamProcessOpen: false,
      // 查询参数
      teamProcessQueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      //班组工序列表
      teamProcessList: [],
      teamProcessTotal: 0,
      teamProcessMultiple: true,
      teamProcessIds: [],
      // 查询参数
      processQueryParams: {
        pageNum: 1,
        pageSize: 10,
        processCode: null,
        processName: null,
      },
      //工序列表
      processList: [],
      openProcess: false,
      teamProcessAddList: [],
      // 多选
      processMultiple: true,
      teamId: null,
      //#endregion
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getDeptTree();
  },
  methods: {
    /** 查询班组列表 */
    getList() {
      this.loading = true;
      listTeam(this.queryParams).then(response => {
        this.teamList = response.rows;
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
        teamId: null,
        teamName: null,
        processId: null,
        processName: null,
        leaderId: null,
        status: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
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
      this.ids = selection.map(item => item.teamId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const teamId = row.teamId || this.ids
      getTeam(teamId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班组";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.teamId != null) {
            updateTeam(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeam(this.form).then(response => {
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
      const teamIds = row.teamId || this.ids;
      this.$modal.confirm('是否确认删除班组编号为"' + teamIds + '"的数据项？').then(function () {
        return delTeam(teamIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/team/export', {
        ...this.queryParams
      }, `team_${new Date().getTime()}.xlsx`)
    },
    /** 组员按钮操作 */
    handleTeamUser(row) {
      this.form = row;
      this.teamTitle = "班组成员管理";
      this.teamOpen = true;
      this.getTeamMemberList(this.form.teamId);
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.userQueryParams.deptId = data.id;
      this.userQueryParams.pageNum = 1;
      this.getUserList();
      this.userQueryParams.deptId = null;
    },
    // 获取班组成员
    getTeamMemberList(teamId) {
      getTeamMembers(teamId).then(response => {
        this.teamUserList = response.rows;
        this.teamUserTotal = response.total;
        this.loading = false;
      })
    },
    // 新增组员
    handleAddMember() {
      this.userTitle = "添加组员";
      this.userOpen = true;
      this.getUserList();
    },
    // 多选
    handleTeamSelectionChange(selection) {
      this.teamUserSelectList = selection
      this.single = selection.length !== 1
      this.teamUserMultiple = !selection.length
    },
    // 删除组员
    handleDeleteMember(row) {
      if (row.userId) {
        this.teamUserSelectList = [row];
      }
      if (this.teamUserSelectList.length) {
        this.$modal.confirm('是否确认删除选中的班组成员?').then(() => {
          //添加班组ID
          this.teamUserSelectList.forEach(element => {
            element.teamId = this.form.teamId;
          });
          deleteTeamMembers(this.teamUserSelectList).then(() => {
            this.$modal.msgSuccess("删除成功");
            this.getTeamMemberList(this.form.teamId);
          })
        }).catch(() => { });
      }
    },
    /** 查询用户列表 */
    getUserList() {
      this.loading = true;
      listTeamUser(this.userQueryParams).then(response => {
        this.userList = response.rows;
        this.userTotal = response.total;
        this.loading = false;
      }
      );
    },
    /** 搜索按钮操作 */
    handleUserQuery() {
      this.userQueryParams.pageNum = 1;
      this.getUserList();
    },
    // 多选框选中数据
    handleUserSelectionChange(selection) {
      this.teamUserAddList = selection
      this.single = selection.length !== 1
      this.userMultiple = !selection.length
    },
    /** 确认添加组员按钮操作 */
    handleAddVerify(row) {
      if (row.userId) {
        this.teamUserAddList = [row];
      }
      if (this.teamUserAddList.length) {
        this.$modal.confirm('是否确认添加选中的成员?').then(() => {
          //添加班组ID
          this.teamUserAddList.forEach(element => {
            element.teamId = this.form.teamId;
          });

          addTeamMembers(this.teamUserAddList).then(response => {
            this.$modal.msgSuccess("添加成功");
          }).catch(() => { })
        });
      }
    },
    // 关闭
    handleUserClose() {
      this.resetForm("userQueryForm");
      this.handleTeamUser(this.form);
    },
    /**班组工序 */
    handleOpenTeamProcess(row) {
      this.title = "班组工序";
      this.form = row;
      this.teamId = row.teamId;
      this.getTeamProcessList();
      this.teamProcessOpen = true;
    },
    /**获取班组工序 */
    getTeamProcessList() {
      this.loading = true;
      listTeamProcess(this.teamId, this.teamProcessQueryParams).then(r => {
        this.teamProcessList = r.rows;
        this.teamProcessTotal = r.total;
        this.loading = false;
      })
    },
    /**获取工序列表 */
    getProcessList() {
      this.loading = true;
      listCanAddProcess(this.teamId, this.processQueryParams).then(response => {
        this.processList = response.rows;
        this.loading = false;
      });
    },
    /**打开选择工序 */
    handleOpenSelectProcess() {
      this.title = "工序选择";
      this.getProcessList();
      this.openProcess = true;
    },
    /** 工序搜索按钮操作 */
    handleProcessQuery() {
      this.processQueryParams.pageNum = 1;
      this.getProcessList();
    },
    /** 工序重置按钮操作 */
    resetProcessQuery() {
      this.resetForm("processQueryForm");
      this.handleProcessQuery();
    },
    // 多选框选中数据
    handleProcessSelectionChange(selection) {
      this.teamProcessAddList = selection;
      this.processMultiple = !selection.length
    },
    /**选择工序 */
    handleSelectProcess(row) {
      if (row.id) {
        this.teamProcessAddList = [row];
      }
      if (this.teamProcessAddList.length) {
        this.$modal.confirm('是否确认添加选中的工序?').then(() => {
          addTeamProcess(this.teamId, this.teamProcessAddList).then(r => {
            this.openProcess = false;
            this.getTeamProcessList();
            this.$modal.msgSuccess("添加成功");
          }).catch(() => { });
        });
      }
    },
    // 关闭
    handleProcessClose() {
      this.resetForm("processQueryForm");
      this.openProcess = false;
      this.getTeamProcessList();
    },
    /**班组工序多选 */
    handleTeamProcessSelectionChange(selection) {
      this.teamProcessIds = selection.map(s => s.id);
      this.teamProcessMultiple = !selection.length
    },
    // 删除班组工序
    handleDeleteProcess(row) {
      if (row.id) {
        this.teamProcessIds = [row.id];
      }
      if (this.teamProcessIds.length) {
        this.$modal.confirm('是否确认删除选中的班组工序?').then(() => {
          delTeamProcess(this.teamProcessIds).then(() => {
            this.$modal.msgSuccess("删除成功");
            this.getTeamProcessList();
          })
        }).catch(() => { });
      }
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleUpdate":
          this.handleUpdate(row);
          break;
        case "handleDelete":
          this.handleDelete(row);
          break;
        default:
          break;
      }
    },
    /**设置主工序 */
    handleSetMainProcess(id) {
      setMainTeamProcess(id).then(r => {
        if (r.code == 200) {
          this.getTeamProcessList();
          this.$modal.msgSuccess("设置主工序成功");
        }
      }).catch(() => { });
    },
    /**取消主工序 */
    handleCancelMainProcess(id) {
      cancelMainTeamProcess(id).then(r => {
        if (r.code == 200) {
          this.getTeamProcessList();
          this.$modal.msgSuccess("取消主工序成功");
        }
      }).catch(() => { });
    },
    /**班组对话框关闭前 */
    async handelTeamProcessBeforeClose(done) {
      let closeDialog = false;
      if (!this.teamProcessList.length) {
        this.$modal.msgError("班组工序不能为空!");
      } else {
        await checkHasMainTeamProcess(this.teamId).then(r => {
          if (r.code == 200) {
            closeDialog = true;
          }
        });
      }
      done(closeDialog);
    },
    /**班组对话框关闭 */
    handelTeamProcessClose() {

    }
  }
};
</script>
