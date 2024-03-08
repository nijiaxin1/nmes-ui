<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--<el-form-item label="车间生产计划主键" prop="mainId">
        <el-input
          v-model="queryParams.mainId"
          placeholder="请输入车间生产计划主键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->

      <el-form-item label="工序" prop="processesId">
        <el-select v-model="queryParams.processesId" placeholder="请选择工序">
          <el-option
            v-for="dict in processesList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
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
      <!--<el-form-item label="批号" prop="workBatch">
        <el-input
          v-model="queryParams.workBatch"
          placeholder="请输入批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="计划生产日期" prop="planProduceDate">
        <el-date-picker clearable
          v-model="queryParams.planProduceDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划生产日期">
        </el-date-picker>
      </el-form-item>
      <!--<el-form-item label="计划开始时间">
        <el-date-picker
          v-model="daterangePlanStartTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="计划完成时间">
        <el-date-picker
          v-model="daterangePlanFinishTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="0:否 1:是(查询时更新)" prop="isTimeout">
        <el-input
          v-model="queryParams.isTimeout"
          placeholder="请输入0:否 1:是(查询时更新)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
          v-hasPermi="['plan:planWorkshopProcesses:add']"
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
          v-hasPermi="['plan:planWorkshopProcesses:edit']"
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
          v-hasPermi="['plan:planWorkshopProcesses:remove']"
        >删除</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          @click="openIssuePlanPersonalDialog"
          v-hasPermi="['plan:planWorkshopPersonal:edit']"
        >下发个人计划</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planWorkshopProcesses:export']"
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

    <el-table v-loading="loading" :data="planWorkshopProcessesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号"
                       type="index"
                       width="50">
      </el-table-column>
      <el-table-column label="工艺" align="center" prop="technologyCode" />
      <el-table-column label="工序" align="center" prop="processesName" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <!--<el-table-column label="批号" align="center" prop="workBatch" />-->
      <el-table-column label="顺序" align="center" prop="workBatchOrder" />
      <el-table-column label="数量" align="center" prop="workNum" />
      <el-table-column label="计划生产日期" align="center" prop="planProduceDate" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planProduceDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
    <!--<el-table-column label="计划开始时间" align="center" prop="planStartTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.planStartTime) }}</span>
        </template>
    </el-table-column>
    <el-table-column label="计划完成时间" align="center" prop="planFinishTime" width="180">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.planFinishTime) }}</span>
        </template>
    </el-table-column>-->
      <el-table-column label="计划工作时长" align="center" prop="planWorkDuration" />
      <!--<el-table-column label="状态" align="center" prop="statusName" />-->
      <el-table-column label="来料数量" align="center" prop="enterNum" />
      <el-table-column label="完成数量" align="center" prop="finishNum" />
      <el-table-column label="废品数量" align="center" prop="wasteNum" />
      <!--<el-table-column label="0:否 1:是(查询时更新)" align="center" prop="isTimeout" />-->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planWorkshopProcesses:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planWorkshopProcesses:remove']"
          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 添加或修改车间工序计划对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车间生产计划主键" prop="mainId">
          <el-input v-model="form.mainId" placeholder="请输入车间生产计划主键" />
        </el-form-item>
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="工序" prop="processesId">
          <el-select v-model="form.processesId" placeholder="请选择工序">
            <el-option
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.desc"
              :value="parseInt(dict.code)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批号" prop="workBatch">
          <el-input v-model="form.workBatch" placeholder="请输入批号" />
        </el-form-item>
        <el-form-item label="顺序" prop="workBatchOrder">
          <el-input v-model="form.workBatchOrder" placeholder="请输入顺序" />
        </el-form-item>
        <el-form-item label="数量" prop="workNum">
          <el-input v-model="form.workNum" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="计划生产日期" prop="planProduceDate">
          <el-date-picker clearable
            v-model="form.planProduceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="planStartTime">
          <el-date-picker clearable
            v-model="form.planStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划完成时间" prop="planFinishTime">
          <el-date-picker clearable
            v-model="form.planFinishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态(0.初始化1.执行中2.执行完成3.已废弃)" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="完成数量" prop="finishNum">
          <el-input v-model="form.finishNum" placeholder="请输入完成数量" />
        </el-form-item>
        <el-form-item label="0:否 1:是(查询时更新)" prop="isTimeout">
          <el-input v-model="form.isTimeout" placeholder="请输入0:否 1:是(查询时更新)" />
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

    <!-- 下发个人计划对话框 -->
    <el-dialog :title="issuePlanPersonalDialog.title" v-loading.fullscreen.lock="issuePlanPersonalDialog.loading" :visible.sync="issuePlanPersonalDialog.open"  fullscreen center>

      <el-form :model="issuePlanPersonalFormSelect" ref="issuePlanPersonalFormSelect" :rules="issuePlanPersonalRulesSelect" size="small" :inline="true"  label-width="108px">
        <!--<el-form-item label="物料图号" prop="itemId">
          <el-select v-model="issuePlanPersonalFormSelect.itemId" filterable  remote
                     :remote-method="remoteSearchItem"
                     placeholder="请输入物料图号">
            <el-option
              v-for="dict in itemList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="计划生产日期" prop="planProduceDate">
          <el-date-picker clearable
                          v-model="issuePlanPersonalFormSelect.planProduceDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择计划生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工序" prop="processesId">
          <el-select v-model="issuePlanPersonalFormSelect.processesId" placeholder="请选择工序">
            <el-option
              v-for="dict in processesList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            icon="el-icon-search"
            size="mini"
            @click="handleSelectPlanProcesses"
          >查询</el-button>
          <!--<el-button icon="el-icon-refresh" size="mini" @click="resetDirectDeliveryDialogForm">重置</el-button>-->
        </el-form-item>
      </el-form>
      <el-table  :data="issuePlanPersonalDialog.planWorkshopProcessesList">
        <el-table-column label="物料图号" align="center" prop="itemCode" />
        <el-table-column label="工序" align="center" prop="processesName" />
        <el-table-column label="批号" align="center" prop="workBatch" />
        <el-table-column label="顺序" align="center" prop="workBatchOrder" />
        <el-table-column label="数量" align="center" prop="workNum" />
        <el-table-column label="计划生产日期" align="center" prop="planProduceDate" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.planProduceDate, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划工作时长" align="center" prop="planWorkDuration" />
        <el-table-column label="状态" align="center" prop="statusName" />
        <el-table-column label="下发数量" align="center" prop="issuedNum" />
        <el-table-column label="完成数量" align="center" prop="finishNum" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-add" size="mini" @click="handleAddIssuePlanPersonal(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i></el-divider>
      <el-divider><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i><i class="el-icon-bottom"></i></el-divider>

      <el-form :model="issuePlanPersonalFormAdd" ref="issuePlanPersonalFormAdd" :rules="issuePlanPersonalRulesAdd" size="small" :inline="true"  label-width="108px">

        <el-form-item label="设备" prop="equipmentId">
          <el-select v-model="issuePlanPersonalFormAdd.equipmentId" placeholder="请选择设备">
            <el-option
              v-for="dict in equipmentList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="班次" prop="planWorkScheduleId">
          <el-select v-model="issuePlanPersonalFormAdd.planWorkScheduleId" placeholder="请选择班次" @change="handleSelectTeam">
            <el-option
              v-for="dict in workScheduleList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="planWorkTeamId">
          <el-select v-model="issuePlanPersonalFormAdd.planWorkTeamId" placeholder="请选择班组" @change="handleSelectMember">
            <el-option
              v-for="dict in workTeamList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="员工" prop="planOperateId">
          <el-select v-model="issuePlanPersonalFormAdd.planOperateId" placeholder="请选择员工" @change="forceUpdate">
            <el-option
              v-for="dict in operateList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table  :data="issuePlanPersonalDialog.list" >

        <el-table-column label="物料图号" align="center" prop="itemCode" />
        <el-table-column label="工序" align="center" prop="processesName" />
        <el-table-column label="批号" align="center" prop="workBatch" />
        <el-table-column label="顺序" align="center" prop="workBatchOrder" />
        <el-table-column label="计划排产数量" align="center" prop="planWorkNum" />
        <el-table-column label="实际排产数量" align="center" prop="workNum" />
        <el-table-column label="计划生产日期" align="center" prop="planProduceDate" >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.planProduceDate, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划工作时长" align="center" prop="planWorkDuration" />
        <el-table-column label="状态" align="center" prop="statusName" />
        <el-table-column label="下发数量" align="center" prop="issuedNum" />
        <el-table-column label="录入数量" align="center" prop="issuingNum" />
        <el-table-column label="完成数量" align="center" prop="finishNum" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!--<el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['plan:planCompanySale:edit']"
            >修改</el-button>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDeleteIssuePlanPersonalList(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer" >
        <el-button type="danger" @click="handleDelList">清空</el-button>
        <el-button type="primary" @click="issuePlanPersonal">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { searchItemList, getProcessesList, getEquipmentListByProcesses,
    getWorkScheduleSystemList, getWorkTeamList, getWorkMemberListByTeam, getNowDateStr} from '@/api/enumsSelect';
import { listPlanWorkshopProcesses, getPlanWorkshopProcesses, delPlanWorkshopProcesses,
    addPlanWorkshopProcesses, updatePlanWorkshopProcesses, listForPersonal } from "@/api/plan/planWorkshopProcesses";
  import { saveIssuePlanPersonal, processList } from "@/api/plan/planWorkshopPersonal";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanWorkshopProcesses",
  data() {
    return {
      // 遮罩层
      loading: false,
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
      // 车间工序计划表格数据
      planWorkshopProcessesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 删除标识时间范围
      daterangePlanStartTime: [],
      // 删除标识时间范围
      daterangePlanFinishTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mainId: null,
        itemId: null,
        processesId: null,
        workBatch: null,
        planProduceDate: getNowDateStr(),
        planStartTime: null,
        planFinishTime: null,
        status: null,
        isTimeout: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        processesId: [
          { required: true, message: "工序不能为空", trigger: "change" }
        ],
        workBatch: [
          { required: true, message: "批号不能为空", trigger: "blur" }
        ],
        workBatchOrder: [
          { required: true, message: "顺序不能为空", trigger: "blur" }
        ],
        delFlag: [
          { required: true, message: "删除标识不能为空", trigger: "blur" }
        ]
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
          url: process.env.VUE_APP_BASE_API + "/plan/planWorkshopProcesses/importData"
      },
      // 下发个人计划
      issuePlanPersonalDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "个人计划录入页",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //明细数据
        planWorkshopProcessesList: [],
        //个人计划数据
        list: [],
        //主表id
        id: null,
      },
      //查询表单
      issuePlanPersonalFormSelect:{},
      //录入表单
      issuePlanPersonalFormAdd:{},
      // 表单校验
      issuePlanPersonalRulesSelect: {
        planProduceDate: [
          { required: true, message: "计划执行日期不能为空", trigger: "blur" }
        ],
        processesId: [
          { required: true, message: "工序不能为空", trigger: "blur" }
        ],
      },
      issuePlanPersonalRulesAdd: {
        /*equipmentId: [
          { required: true, message: "设备不能为空", trigger: "blur" }
        ],*/
        /*planWorkScheduleId: [
          { required: true, message: "班次不能为空", trigger: "blur" }
        ],*/
        planWorkTeamId: [
          { required: true, message: "班组不能为空", trigger: "blur" }
        ],
        planOperateId: [
          { required: true, message: "员工不能为空", trigger: "blur" }
        ],
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //工序列表
      processesList: [],
      //设备列表
      equipmentList: [],
      //班次列表
      workScheduleList: [],
      //班组列表
      workTeamList: [],
      //员工列表
      operateList: [],
    };
  },
  created() {
    this.getProcessesList();
    //this.getList();
  },
  methods: {
    /** 工序列表 */
    getProcessesList() {
      getProcessesList().then(response => {
        this.processesList = response.data;
      });
    },
    /** 设备列表 */
    selectEquipmentList(processesId) {
      getEquipmentListByProcesses(processesId).then(response => {
        this.equipmentList = response.data;
      });
    },
    /** 班组列表 */
    selectWorkTeamList() {
      getWorkTeamList().then(response => {
        this.workTeamList = response.data;
      });
    },
    /** 员工列表 */
    selectWorkMemberList(teamId) {
      getWorkMemberListByTeam(teamId).then(response => {
        this.operateList = response.data;
      });
    },
    /** 查询车间工序计划列表 */
    /*getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangePlanStartTime && '' != this.daterangePlanStartTime) {
        this.queryParams.params["beginPlanStartTime"] = this.daterangePlanStartTime[0];
        this.queryParams.params["endPlanStartTime"] = this.daterangePlanStartTime[1];
      }
      if (null != this.daterangePlanFinishTime && '' != this.daterangePlanFinishTime) {
        this.queryParams.params["beginPlanFinishTime"] = this.daterangePlanFinishTime[0];
        this.queryParams.params["endPlanFinishTime"] = this.daterangePlanFinishTime[1];
      }
      listPlanWorkshopProcesses(this.queryParams).then(response => {
        this.planWorkshopProcessesList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).finally(()=>this.loading = false);
    },*/
    getList() {
      if(!this.queryParams.planProduceDate){
        this.$modal.msgError("请选择日期");
        return false;
      }
      this.loading = true;
      processList(this.queryParams).then(response => {
        this.planWorkshopProcessesList = response.data;
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
        mainId: null,
        itemId: null,
        processesId: null,
        workBatch: null,
        workBatchOrder: null,
        workNum: null,
        planProduceDate: null,
        planStartTime: null,
        planFinishTime: null,
        status: null,
        issuedNum: null,
        finishNum: null,
        isTimeout: null,
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
      this.daterangePlanStartTime = [];
      this.daterangePlanFinishTime = [];
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
      this.title = "添加车间工序计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanWorkshopProcesses(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车间工序计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanWorkshopProcesses(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanWorkshopProcesses(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除车间工序计划编号为"' + ids + '"的数据项？').then(function() {
        return delPlanWorkshopProcesses(ids);
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
    /**打开下发个人计划窗口*/
    openIssuePlanPersonalDialog(){
      this.issuePlanPersonalDialog.open = true;
      this.selectWorkTeamList();
    },
    /**查询工序信息*/
    handleSelectPlanProcesses(){
      this.$refs["issuePlanPersonalFormSelect"].validate(valid => {
        if (valid) {
          this.issuePlanPersonalDialog.loading = true;
          listForPersonal(this.issuePlanPersonalFormSelect).then(response => {
            if(response.data){
              /*response.data.directDeliveryQuantity = this.directDeliveryForm.directDeliveryQuantity;
              this.directDeliveryDialog.rowNo = this.directDeliveryDialog.rowNo + 1;
              response.data.rowNo = this.directDeliveryDialog.rowNo;*/
              this.issuePlanPersonalDialog.planWorkshopProcessesList = response.data;
              this.selectEquipmentList(this.issuePlanPersonalFormSelect.processesId);
            }else{
              this.$modal.msgError("未查询到数据");
            }
          }).finally(()=>this.issuePlanPersonalDialog.loading = false);
        }else{
          this.$modal.msgError("请先录入信息");
        }
      });
    },
    /**添加信息*/
    handleAddIssuePlanPersonal(row){
      let that = this;
      this.$prompt('请输入数量', '录入', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: '数量格式不正确'
      }).then(({ value }) => {

        debugger;
        let tempData = {};
        let tempI = -1;
        for(let i = 0; i < that.issuePlanPersonalDialog.list.length; i++){
          const item = that.issuePlanPersonalDialog.list[i];
          if(item.id == row.id){
            tempData = item;
            tempI = i;
            break;
          }
        }
        //验证是否可以下发
        const workNum = parseInt(row.workNum);
        const issuedNum = parseInt(row.issuedNum);
        let issuingNum = 0;
        if(tempI != -1){
          issuingNum = parseInt(tempData.issuingNum);
        }
        if(workNum - issuedNum - issuingNum < parseInt(value)){
          this.$modal.msgError("录入数量大于可下发数量,不可添加");
          return false;
        }
        if(tempI != -1){
          that.issuePlanPersonalDialog.list.splice(tempI, 1);
          //this.issuePlanPersonalDialog.directDeliveryQuantity = parseInt(this.directDeliveryForm.directDeliveryQuantity) + parseInt(tempData.directDeliveryQuantity);
        }
        const itemData = row;
        itemData.issuingNum = parseInt(value) + issuingNum;
        that.$nextTick(()=>{
          that.issuePlanPersonalDialog.list.push(itemData);
        });

        //this.issuePlanPersonalDialog.planCompanySaleInfoList = null;
        //this.resetDirectDeliveryDialogForm();
        that.$modal.msgSuccess("添加成功");


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        });
      });
    },
    /**删除已添加数据*/
    handleDeleteIssuePlanPersonalList(row){
      let tempI = -1;
      for(let i = 0; i < this.issuePlanPersonalDialog.list.length; i++){
        const item = this.issuePlanPersonalDialog.list[i];
        if(item.id == row.id){
          tempI = i;
          break;
        }
      }
      if(tempI != -1){
        this.issuePlanPersonalDialog.list.splice(tempI, 1);
      }
    },
    /**一键清空*/
    handleDelList(){
        this.issuePlanPersonalDialog.list=[];
    },
    /**根据班次查询班组*/
    handleSelectTeam(v){
      if(!this.issuePlanPersonalFormSelect.planProduceDate){
        this.$message({
          type: 'info',
          message: '查询班组需要根据排班,请先选择计划生产日期'
        });
        return false;
      }
      this.workTeamList = [];
      this.issuePlanPersonalFormAdd.planWorkTeamId = null;
      this.operateList = [];
      this.issuePlanPersonalFormAdd.planOperateId = null;
      this.selectWorkTeamList(v, this.issuePlanPersonalFormSelect.planProduceDate);
    },
    /**根据班组查询组员*/
    handleSelectMember(v){
      this.operateList = [];
      this.issuePlanPersonalFormAdd.planOperateId = null;
      this.selectWorkMemberList(v);
    },
    /**根据班组查询组员*/
    forceUpdate(v){
      this.$forceUpdate();
    },
    /**下发个人计划*/
    issuePlanPersonal(){
      if(this.issuePlanPersonalDialog.list.length == 0){
        this.$modal.msgError("请先添加数据");
        return false;
      }
      this.$refs["issuePlanPersonalFormAdd"].validate(valid => {
        if (valid) {
          this.issuePlanPersonalDialog.loading = true;
          const temp = {};
          temp.form = this.issuePlanPersonalFormAdd;
          temp.form.processesId = this.issuePlanPersonalFormSelect.processesId;
          temp.list = this.issuePlanPersonalDialog.list;
          saveIssuePlanPersonal(temp).then(response => {
            if(response.code == 500){
              this.$modal.msgError(response.msg);
            }else{
              this.$modal.msgSuccess(response.msg);
              this.issuePlanPersonalDialog.loading = false;
              //this.issuePlanPersonalDialog.open = false;
              this.issuePlanPersonalDialog.list = [];
              this.issuePlanPersonalDialog.planWorkshopProcessesList = [];
              this.issuePlanPersonalFormSelect = {};
              this.issuePlanPersonalFormAdd = {};
              //this.getList();
            }
          }).finally(()=>this.issuePlanPersonalDialog.loading = false);
        }
      });
    },
    /** 导出按钮操作 */
    /*handleExport() {
      this.download('plan/planWorkshopProcesses/export', {
        ...this.queryParams
      }, `planWorkshopProcesses_${new Date().getTime()}.xlsx`)
    },*/
    handleExport() {
      this.download('plan/planWorkshopPersonal/exportProcessList', {
        ...this.queryParams
      }, `planWorkshopProcesses_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "车间工序计划导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planWorkshopProcesses/importTemplate',{...this.queryParams}, '车间工序计划导入模板.xlsx');
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
