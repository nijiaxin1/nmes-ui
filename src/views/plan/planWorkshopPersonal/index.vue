<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工序" prop="processesId">
        <el-select v-model="queryParams.processesId" placeholder="请选择工序"  clearable>
          <el-option
            v-for="dict in processesList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料图号" prop="itemId">
        <el-select v-model="queryParams.itemId" filterable  remote  clearable
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
      <el-form-item label="员工" prop="planOperateId">
        <el-select v-model="queryParams.planOperateId" filterable  remote
                   :remote-method="remoteSearchMember"
                   placeholder="请输入员工">
          <el-option
            v-for="dict in memberList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划生产班组" prop="planWorkTeamId">
        <el-select v-model="queryParams.planWorkTeamId" placeholder="请选择工序">
          <el-option
            v-for="dict in workTeamList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="计划工作班次主键" prop="planWorkScheduleId">
        <el-input
          v-model="queryParams.planWorkScheduleId"
          placeholder="请输入计划工作班次主键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="设备" prop="equipmentId">
        <el-select v-model="queryParams.equipmentId" placeholder="请选择工序">
          <el-option
            v-for="dict in equipmentList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态">
          <el-option
            v-for="dict in planPersonalStatusList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code+''"
          ></el-option>
        </el-select>
      </el-form-item>
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
          v-hasPermi="['plan:planWorkshopPersonal:add']"
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
          v-hasPermi="['plan:planWorkshopPersonal:edit']"
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
          v-hasPermi="['plan:planWorkshopPersonal:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planWorkshopPersonal:export']"
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

    <el-table v-loading="loading" :data="planWorkshopPersonalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openUpdatePlanDialog(scope.row)"
            v-hasPermi="['plan:planWorkshopPersonal:edit']"
            v-if="scope.row.status == '1'"
          >审核</el-button>
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planWorkshopPersonal:remove']"
          >删除</el-button>-->
        </template>
      </el-table-column>
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="工序" align="center" prop="processesName" />
      <el-table-column label="批号" align="center" prop="workBatch" />
      <el-table-column label="顺序" align="center" prop="workBatchOrder" />
      <el-table-column label="计划排产数量" align="center" prop="planWorkNum" />
      <el-table-column label="实际排产数量" align="center" prop="workNum" />
      <el-table-column label="来料数量" align="center" prop="enterNum" />
      <el-table-column label="完成数量" align="center" prop="finishNum" />
      <el-table-column label="来料废品数量" align="center" prop="enterWasteNum" />
      <el-table-column label="加工废品数量" align="center" prop="finishWasteNum" />
      <el-table-column label="计划生产日期" align="center" prop="planProduceDate" />
      <el-table-column label="员工" align="center" prop="planOperateBy" />
      <el-table-column label="计划生产班组" align="center" prop="planWorkTeam" />
      <el-table-column label="计划工作班次" align="center" prop="planWorkScheduleClass" />
      <el-table-column label="计划工作时长(s)" align="center" prop="planWorkDuration" />
      <el-table-column label="设备码" align="center" prop="equipmentBarcode" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="状态" align="center" prop="statusName" />
      <!--<el-table-column label="备注" align="center" prop="remark" />-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改个人计划对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="工序" prop="processesId">
          <el-input v-model="form.processesId" placeholder="请输入工序" />
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
        <el-form-item label="员工" prop="planOperateBy">
          <el-input v-model="form.planOperateBy" placeholder="请输入员工" />
        </el-form-item>
        <el-form-item label="计划生产班组" prop="planWorkTeam">
          <el-input v-model="form.planWorkTeam" placeholder="请输入计划生产班组" />
        </el-form-item>
        <el-form-item label="计划工作班次" prop="planWorkSchedule">
          <el-input v-model="form.planWorkSchedule" placeholder="请输入计划工作班次" />
        </el-form-item>
        <el-form-item label="计划工作时长(s)" prop="planWorkDuration">
          <el-input v-model="form.planWorkDuration" placeholder="请输入计划工作时长(s)" />
        </el-form-item>
        <el-form-item label="设备码" prop="equipmentBarcode">
          <el-input v-model="form.equipmentBarcode" placeholder="请输入设备码" />
        </el-form-item>
        <el-form-item label="状态1.初始化2.执行中3.执行完成5.已废弃)" prop="status">
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


    <!-- 修改计划对话框 -->
    <el-dialog :title="updatePlanDialog.title" v-loading.fullscreen.lock="updatePlanDialog.loading" :visible.sync="updatePlanDialog.open"  fullscreen center>

      <el-table  :data="updatePlanDialog.dataList" height="500">
        <el-table-column type="index" label="行号" align="center" prop="rowNo" />
        <el-table-column label="物料图号" align="center" prop="itemCode" />
        <el-table-column label="工序" align="center" prop="processesCodeName" />
        <el-table-column label="批号" align="center" prop="workBatch" />
        <el-table-column label="顺序" align="center" prop="workBatchOrder" />
        <el-table-column label="计划排产数量" align="center" prop="planWorkNum" />
        <el-table-column label="实际排产数量" align="center" prop="workNum" >
          <template slot-scope="{ row }">
            <el-input v-model="row.workNum" @blur="changeWorkNum(row)" :disabled="row.planWorkNum == row.enterNum && row.workNum > 0"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="计划生产日期" align="center" prop="planProduceDate" />
        <el-table-column label="员工" align="center" prop="planOperateBy" />
        <el-table-column label="计划生产班组" align="center" prop="planWorkTeam" />
        <el-table-column label="计划工作班次" align="center" prop="planWorkScheduleClass" />
        <el-table-column label="计划工作时长(s)" align="center" prop="planWorkDuration" />
        <el-table-column label="设备" align="center" prop="equipmentId" >
          <template slot-scope="{ row }">
            <el-select v-model="row.equipmentId" filterable clearable
                       placeholder="请输入设备">
              <el-option
                v-for="dict in equipmentList"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select></template>
        </el-table-column>
        <!--<el-table-column label="状态" align="center" prop="statusName" />-->
        <el-table-column label="来料数量" align="center" prop="enterNum" />
        <el-table-column label="完成数量" align="center" prop="finishNum" />
        <!--<el-table-column label="备注" align="center" prop="remark" />-->
      </el-table>

      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="handleUpdatePlan">确 定</el-button>
        <el-button @click="updatePlanDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { searchItemList, getProcessesList, getWorkTeamList,
    getEquipmentList, searchUserListByName, getNowDateStr,
    getPlanPersonalStatusList} from '@/api/enumsSelect';
  import { listPlanWorkshopPersonal, getPlanWorkshopPersonal, delPlanWorkshopPersonal,
    addPlanWorkshopPersonal, updatePlanWorkshopPersonal, searchPlanByCond, doUpdatePlan } from "@/api/plan/planWorkshopPersonal";
  import { getToken } from "@/utils/auth";

export default {
  name: "PlanWorkshopPersonal",
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
      // 个人计划表格数据
      planWorkshopPersonalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemId: null,
        processesId: null,
        workBatch: null,
        planProduceDate: getNowDateStr(),
        planOperateId: null,
        planWorkTeamId: null,
        planWorkScheduleId: null,
        equipmentId: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
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
          url: process.env.VUE_APP_BASE_API + "/plan/planWorkshopPersonal/importData"
      },
      //物料信息
      itemList: [],
      itemSearchLoading: true,
      //工序列表
      processesList: [],
      //员工
      memberList:[],
      memberSearchLoading: true,
      //设备列表
      equipmentList: [],
      //班组列表
      workTeamList: [],
      // 修改计划
      updatePlanDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "计划审核",
        //明细数据
        dataList: [],
        //修改的数据
        updateDataList: [],
      },
      planPersonalStatusList:[],
    };
  },
  created() {
    this.getProcessesList();
    this.selectWorkTeamList();
    this.selectEquipmentList();
    this.selectPlanPersonalStatusList();
    this.getList();
  },
  methods: {
    /** 工序列表 */
    getProcessesList() {
      getProcessesList().then(response => {
        this.processesList = response.data;
      });
    },
    /** 班组列表 */
    selectWorkTeamList() {
      getWorkTeamList().then(response => {
        this.workTeamList = response.data;
      });
    },
    /** 器具列表 */
    selectEquipmentList() {
      getEquipmentList().then(response => {
        this.equipmentList = response.data;
      });
    },
    /** 个人计划状态 */
    selectPlanPersonalStatusList() {
      getPlanPersonalStatusList().then(response => {
        this.planPersonalStatusList = response.data;
      });
    },
    /** 查询个人计划列表 */
    getList() {
      this.loading = true;
      debugger;
      listPlanWorkshopPersonal(this.queryParams).then(response => {
        this.planWorkshopPersonalList = response.rows;
        this.total = response.total;
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
        planOperateId: null,
        planOperateBy: null,
        planWorkTeamId: null,
        planWorkTeam: null,
        planWorkScheduleId: null,
        planWorkSchedule: null,
        planStartTime: null,
        planFinishTime: null,
        planWorkDuration: null,
        equipmentId: null,
        equipmentBarcode: null,
        status: null,
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
      this.title = "添加个人计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanWorkshopPersonal(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改个人计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanWorkshopPersonal(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanWorkshopPersonal(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除个人计划编号为"' + ids + '"的数据项？').then(function() {
        return delPlanWorkshopPersonal(ids);
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
    //远程搜索物料信息
    remoteSearchMember(memberName) {
      if (memberName !== '' && this.memberSearchLoading) {
        this.memberSearchLoading = false;
        setTimeout(() => {
          this.memberSearchLoading = true;
          searchUserListByName(memberName).then(response => {
            this.memberList = response.data;
          });
        }, 300);
      } else {
        this.memberList = [];
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('plan/planWorkshopPersonal/export', {
        ...this.queryParams
      }, `planWorkshopPersonal_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "个人计划导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planWorkshopPersonal/importTemplate',{...this.queryParams}, '个人计划导入模板.xlsx');
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
    },

    /**打开修改计划窗口*/
    openUpdatePlanDialog(row){
      this.updatePlanDialog.open = true;
      //查询同物料同工艺同工序的所有个人计划
      const tempQueryForm = {};
      tempQueryForm.itemId = row.itemId;
      tempQueryForm.technologyId = row.technologyId;
      tempQueryForm.processesId = row.processesId;
      tempQueryForm.planProduceDate = row.planProduceDate;
      searchPlanByCond(tempQueryForm).then(response =>{
        const list = response.data;
        for (let i = 0; i < list.length; i++){
          list[i].newWorkNum = list[i].workNum
        }
        this.updatePlanDialog.dataList = list;
      })
    },
    /**验证修改数量
     * 不能小于来料数量*/
    changeWorkNum(row){
      const planWorkNum = isNaN(parseInt(row.planWorkNum)) ? 0 : parseInt(row.planWorkNum);
      const enterNum = isNaN(parseInt(row.enterNum)) ? 0 : parseInt(row.enterNum);
      const workNum = isNaN(parseInt(row.workNum)) ? 0 : parseInt(row.workNum);
      if(workNum < enterNum){
        this.$modal.msgError("录入的生产数量需大于等于来料数量");
        return false;
      }
    },
    /**修改计划*/
    handleUpdatePlan(){
      const that = this;
      //验证与筛选数量
      const list = that.updatePlanDialog.dataList;
      let totalWorkNum = 0;
      let totalNewWorkNum = 0;
      const paramList = [];
      for(let i = 0; i < list.length; i++){
        const item = list[i];
        const planWorkNum = isNaN(parseInt(item.planWorkNum)) ? 0 : parseInt(item.planWorkNum);
        const enterNum = isNaN(parseInt(item.enterNum)) ? 0 : parseInt(item.enterNum);
        const workNum = isNaN(parseInt(item.workNum)) ? 0 : parseInt(item.workNum);
        if(workNum < 0){
          this.$modal.msgError("录入的生产数量需为大于等于0的正整数");
          return false;
        }
        if(workNum < enterNum){
          this.$modal.msgError("录入的生产数量需大于等于来料数量");
          return false;
        }
        totalWorkNum += planWorkNum;
        totalNewWorkNum += workNum;
        //if(planWorkNum != workNum){
          const paramMap = {};
          paramMap.id = item.id;
          paramMap.workNum = item.workNum;
          paramMap.equipmentId = item.equipmentId;
          paramList.push(paramMap);
        //}
      }
      if(totalWorkNum != totalNewWorkNum){
        this.$modal.msgError("计划总数不可改变("+totalWorkNum+"!="+totalNewWorkNum+")");
        return false;
      }
      if(paramList.length == 0){
        this.$modal.msgSuccess("不存在需要修改的计划");
        return false;
      }
      this.$modal.confirm('是否确认修改').then(function() {
        that.updatePlanDialog.loading = true;
        return doUpdatePlan(paramList);
      }).then(response => {
        if(response.code == 500){
          this.$modal.msgError(response.msg);
        }else {
          this.$modal.msgSuccess("修改成功");
          this.updatePlanDialog.open = false;
          this.getList();
        }
      }).catch((e) => {this.$modal.msgError(e);}).finally(()=>this.updatePlanDialog.loading = false);
    },
  }
};
</script>
