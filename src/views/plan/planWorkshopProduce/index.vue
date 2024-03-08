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
      <el-form-item label="物料图号" prop="itemId">
        <el-select
          v-model="queryParams.itemId"
          filterable
          remote
          :remote-method="remoteSearchItem"
          placeholder="请输入物料图号"
        >
          <el-option
            v-for="dict in itemList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工艺" prop="technologyId">
        <el-select
          v-model="queryParams.technologyId"
          filterable
          remote
          :remote-method="remoteSearchTechnology"
          placeholder="请输入工艺路线编号"
        >
          <el-option
            v-for="dict in technologyList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批号" prop="workBatch">
        <el-input
          v-model="queryParams.workBatch"
          placeholder="请输入批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划生产日期" prop="planProduceDate">
        <el-date-picker
          clearable
          v-model="queryParams.planProduceDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划生产日期"
        ></el-date-picker>
      </el-form-item>
      <!--<el-form-item label="计划开始时间" prop="planStartTime">
        <el-date-picker clearable
          v-model="queryParams.planStartTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划完成时间" prop="planFinishTime">
        <el-date-picker clearable
          v-model="queryParams.planFinishTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划完成时间">
        </el-date-picker>
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
          v-hasPermi="['plan:planWorkshopProduce:add']"
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
          v-hasPermi="['plan:planWorkshopProduce:edit']"
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
          v-hasPermi="['plan:planWorkshopProduce:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          @click="openProductionSchedulingDialog"
          v-hasPermi="['plan:planExternalFoundry:edit']"
        >生产计划排班</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planWorkshopProduce:export']"
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

    <el-table
      v-loading="loading"
      :data="planWorkshopProduceList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料图号" align="center" prop="itemCode" />
      <el-table-column label="工艺" align="center" prop="technologyCode" />
      <el-table-column label="批号" align="center" prop="workBatch" />
      <el-table-column label="毛坯单位" align="center" prop="blankUnit" />
      <el-table-column label="机加工单位" align="center" prop="machiningUnit" />
      <el-table-column label="生产单位" align="center" prop="produceUnit" />
      <el-table-column label="计划生产数量" align="center" prop="planProduceNum" />
      <el-table-column label="计划储备数量" align="center" prop="planReserveNum" />
      <el-table-column label="计划销售数量" align="center" prop="planSaleNum" />
      <el-table-column label="计划生产日期" align="center" prop="planProduceDate">
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
      <el-table-column label="状态" align="center" prop="statusName" />
      <el-table-column label="完成数量" align="center" prop="finishNum" />
      <!--<el-table-column label="0:否 1:是" align="center" prop="isTimeoutName" />-->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planWorkshopProduce:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planWorkshopProduce:remove']"
          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改车间生产计划对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="物料图号" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料图号" />
        </el-form-item>
        <el-form-item label="工艺" prop="technologyId">
          <el-input v-model="form.technologyId" placeholder="请输入工艺" />
        </el-form-item>
        <el-form-item label="批号" prop="workBatch">
          <el-input v-model="form.workBatch" placeholder="请输入批号" />
        </el-form-item>
        <el-form-item label="毛坯单位" prop="blankUnit">
          <el-input v-model="form.blankUnit" placeholder="请输入毛坯单位" />
        </el-form-item>
        <el-form-item label="机加工单位" prop="machiningUnit">
          <el-input v-model="form.machiningUnit" placeholder="请输入机加工单位" />
        </el-form-item>
        <el-form-item label="生产单位" prop="produceUnit">
          <el-input v-model="form.produceUnit" placeholder="请输入生产单位" />
        </el-form-item>
        <el-form-item label="计划生产数量" prop="planProduceNum">
          <el-input v-model="form.planProduceNum" placeholder="请输入计划生产数量" />
        </el-form-item>
        <el-form-item label="计划储备数量" prop="planReserveNum">
          <el-input v-model="form.planReserveNum" placeholder="请输入计划储备数量" />
        </el-form-item>
        <el-form-item label="计划销售数量" prop="planSaleNum">
          <el-input v-model="form.planSaleNum" placeholder="请输入计划销售数量" />
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
        <el-form-item label="状态(0.初始化1.生产中2.生产完成)" prop="status">
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

    <!-- 当日排产对话框 -->
    <!--<el-dialog :title="productionSchedulingDialog.title" v-loading.fullscreen.lock="productionSchedulingDialog.loading" :visible.sync="productionSchedulingDialog.open"  fullscreen center>

      <el-table  :data="productionSchedulingDialog.dataList" >
        <el-table-column type="index" label="行号" align="center" prop="rowNo" />
        <el-table-column label="员工" align="center" prop="memberId" >
          <template slot-scope="scope">
            <el-select v-model="scope.row.workSchId" filterable  clearable  remote
                       :remote-method="remoteSearchMember" size="medium"
                       placeholder="请输入员工" >
              <el-option
                v-for="dict in memberList"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select></template></el-table-column>
        <el-table-column label="物料图号" align="center" prop="itemId" >
          <template slot-scope="{ row }">
            <el-select v-model="row.itemId" filterable  remote
                       :remote-method="remoteSearchItem1"
                       placeholder="请输入物料图号" clearable  @change="selectTechnologyListByItem">
              <el-option
                v-for="dict in itemList1"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select>
          </template></el-table-column>
        <el-table-column label="工艺路线" align="center" prop="technologyId" >
          <template slot-scope="{ row }">
            <el-select v-model="row.technologyId" filterable
                       placeholder="请输入工艺路线" clearable  @change="selectProcessesListByTechnology">
              <el-option
                v-for="dict in technologyListByItem"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select></template></el-table-column>
        <el-table-column label="工序" align="center" prop="processId" >
          <template slot-scope="{ row }">
            <el-select v-model="row.processId" filterable clearable
                       placeholder="请输入工序">
              <el-option
                v-for="dict in processesListByTechnology"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select></template></el-table-column>
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
            </el-select></template></el-table-column>
        <el-table-column label="生产数量" align="center" prop="productQuantity" >
          <template slot-scope="{ row }">
            <el-input v-model="row.productQuantity" @input="validateDeliveryQuantity"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="delProductionSchedulingRow(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer" >
        <el-button type="success" icon="el-icon-plus" @click="addProductionSchedulingRow">加一行</el-button>
        <el-button type="primary" @click="handleProductionScheduling">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>-->

    <!-- 生成生产计划对话框 -->
    <el-dialog
      :title="productionSchedulingDialog.title"
      v-loading.fullscreen.lock="productionSchedulingDialog.loading"
      :visible.sync="productionSchedulingDialog.open"
      fullscreen
      center
    >
      <el-form
        :model="productionSchedulingDialog.qPs"
        ref="productionSchedulingDialog.qPs"
        size="small"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="计划生产日期" prop="planProduceDate">
          <el-date-picker
            clearable
            v-model="productionSchedulingDialog.qPs.planProduceDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划生产日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="hQproductionSchedulingInfo"
          >搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="productionSchedulingDialog.produceInfoList" :span-method="handleSpanMethod">
        <el-table-column type="index" label="行号" align="center" prop="rowNo" />
        <el-table-column label="工序" align="center" prop="processName" />
        <el-table-column label="生产数量" align="center" prop="planProduceTotalNum">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="produceDetailsOpen(row.itemInfoList)"
            >{{row.planProduceTotalNum}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="班组" align="center" prop="planWorkTeam" />
        <el-table-column label="班次" align="center" prop="planWorkScheduleClass" />
        <el-table-column label="员工" width="380">
          <template slot-scope="scope">
            <el-tag
              style="margin: 0 2px"
              v-for="tag in scope.row.operatorList"
              :key="tag.planOperateBy"
              size="mini"
              :type="tag.scheduleFlag === '1' ? 'success' : 'danger' "
            >{{tag.planOperateBy}}</el-tag>
            <i class="el-icon-circle-plus-outline" @click="openOperator(scope.row, scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleProductionScheduling">确 定</el-button>
        <el-button @click="productionSchedulingDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 物料和数量信息 -->
    <el-drawer :title="produceDetails.title" :visible.sync="produceDetails.open">
      <div>
        <el-table :data="produceDetails.ProduceInfoList">
          <el-table-column label="物料" align="center" prop="itemCode" />
          <el-table-column label="数量" align="center" prop="planProduceNum" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="produceDetails.open = false">确 定</el-button>
        <el-button @click="produceDetails.open = false">取 消</el-button>
      </div>
    </el-drawer>

    <!-- 人员新增 -->
    <el-dialog
      :title="operatorListDialog.title"
      :visible.sync="operatorListDialog.open"
      width="60%"
    >
      <div class="operator-transfer">
        <div style="display:flex;align-items: center;">
          <p>班组：</p>
          <el-select v-model="operatorListDialog.ols" placeholder="请选择">
            <el-option
              v-for="item in TeamList"
              :key="item.teamId"
              :label="item.teamName"
              :value="item.teamId"
            ></el-option>
          </el-select>
          <el-button
            style="margin-left:10px"
            type="primary"
            size="mini"
            @click="getTeamMemberList"
          >查询</el-button>
        </div>
        <div>
          <div style="border:1px solid #000;padding:5px">
            <p>已选中人员</p>
            <el-tag
              style="margin: 0 2px"
              v-for="tag in operatorAddList"
              :key="tag.planOperateId"
              size="mini"
              closable
              @close="handleClose(tag)"
            >{{tag.planOperateBy}}</el-tag>
          </div>
          <div style="margin-left:5px">
            <el-table :data="operatorModifyList" style="width: 100%" height="290">
              <el-table-column prop="teamName" label="班组" width="180"></el-table-column>
              <el-table-column prop="userName" label="姓名" width="180"></el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="addTeamMember(scope.row,scope.$index)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operatorListDialog.open = false">确 定</el-button>
        <el-button @click="operatorListDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchItemList,
  searchTechnologyList,
  searchTechnologyListByItem,
  getProcessesList,
  getEquipmentList,
  getProcessesListByTechnology,
  searchUserListByName,
  getNowDateStr
} from "@/api/enumsSelect";
import {
  listPlanWorkshopProduce,
  getPlanWorkshopProduce,
  delPlanWorkshopProduce,
  addPlanWorkshopProduce,
  updatePlanWorkshopProduce,
  doProductionScheduling,
  findProduceInfoByDay,
  TeamMemberList,
  getTeamList
} from "@/api/plan/planWorkshopProduce";
import { getToken } from "@/utils/auth";
import Template from "../../message/template/index";

export default {
  components: { Template },
  name: "PlanWorkshopProduce",
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
      // 车间生产计划表格数据
      planWorkshopProduceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemId: null,
        technologyId: null,
        workBatch: null,
        planStartTime: null,
        planFinishTime: null,
        status: null,
        planProduceDate: getNowDateStr(),
        isTimeout: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemId: [
          { required: true, message: "物料图号不能为空", trigger: "blur" }
        ],
        technologyId: [
          { required: true, message: "工艺不能为空", trigger: "blur" }
        ],
        workBatch: [
          { required: true, message: "批号不能为空", trigger: "blur" }
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
        url:
          process.env.VUE_APP_BASE_API + "/plan/planWorkshopProduce/importData"
      },
      //物料信息
      itemList: [],
      itemList1: [],
      itemSearchLoading: true,
      //员工
      memberList: [],
      memberSearchLoading: true,
      //工艺信息
      technologyList: [],
      technologyListByItem: [],
      technologySearchLoading: true,
      // 当日排产
      /*productionSchedulingDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "当日排产",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //明细数据
        dataList: [],
      },*/
      productionSchedulingDialog: {
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "生产计划排班",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //查询条件
        qPs: {},
        //生产数据
        produceInfoList: []
      },
      //工序列表
      processesListByTechnology: [],
      //设备列表
      equipmentList: [],
      // 物料详情
      produceDetails: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 数据
        ProduceInfoList: []
      },
      // 人员新增
      operatorListDialog: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "数据连接失败",
        // 查询数据
        ols: "",
        // 数据
        OperatorList: []
      },
      // 班组数据
      TeamList: [],
      // 增加数据
      operatorAddList: [],
      // 已有数据
      operatorModifyList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 工序列表 */
    selectProcessesListByTechnology(technologyId) {
      if (technologyId) {
        getProcessesListByTechnology(technologyId).then(response => {
          this.processesListByTechnology = response.data;
        });
      } else {
        this.processesListByTechnology = [];
      }
    },
    /** 设备列表 */
    /*selectEquipmentList(processesId) {
      getEquipmentListByProcesses(processesId).then(response => {
        this.equipmentList = response.data;
      });
    },*/
    selectEquipmentList() {
      getEquipmentList().then(response => {
        this.equipmentList = response.data;
      });
    },
    /** 根据物料检索工艺列表 */
    selectTechnologyListByItem(itemId) {
      if (itemId) {
        searchTechnologyListByItem(itemId).then(response => {
          this.technologyListByItem = response.data;
        });
      } else {
        this.technologyListByItem = [];
        this.processesListByTechnology = [];
      }
    },
    /** 查询车间生产计划列表 */
    getList() {
      this.loading = true;
      listPlanWorkshopProduce(this.queryParams)
        .then(response => {
          this.planWorkshopProduceList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .finally(() => (this.loading = false));
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
        itemId: null,
        technologyId: null,
        workBatch: null,
        blankUnit: null,
        machiningUnit: null,
        produceUnit: null,
        planProduceNum: null,
        planReserveNum: null,
        planSaleNum: null,
        planStartTime: null,
        planFinishTime: null,
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加车间生产计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPlanWorkshopProduce(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车间生产计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanWorkshopProduce(this.form)
              .then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => (this.loading = false));
          } else {
            addPlanWorkshopProduce(this.form)
              .then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => (this.loading = false));
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除车间生产计划编号为"' + ids + '"的数据项？')
        .then(function() {
          return delPlanWorkshopProduce(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    //远程搜索物料信息
    remoteSearchItem(itemCode) {
      if (itemCode !== "" && this.itemSearchLoading) {
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
    remoteSearchItem1(itemCode) {
      if (itemCode !== "" && this.itemSearchLoading) {
        this.itemSearchLoading = false;
        setTimeout(() => {
          this.itemSearchLoading = true;
          searchItemList(itemCode).then(response => {
            this.itemList1 = response.data;
          });
        }, 300);
      } else {
        this.itemList = [];
      }
    },
    //远程搜索员工信息
    remoteSearchMember(memberName) {
      if (memberName !== "" && this.memberSearchLoading) {
        this.memberSearchLoading = false;
        setTimeout(() => {
          this.memberSearchLoading = true;
          searchUserListByName(memberName).then(response => {
            this.memberList = response.data;
          });
        }, 300);
      } else {
        this.itemList = [];
      }
    },
    //同步班组和班次
    /*synTeamAndPeriod(index, val) {
      debugger;
      if (memberName !== '' && this.memberSearchLoading) {
        this.memberSearchLoading = false;
        setTimeout(() => {
          this.memberSearchLoading = true;
          searchUserListByName(memberName).then(response => {
            this.memberList = response.data;
          });
        }, 300);
      } else {
        this.itemList = [];
      }
    },*/
    //远程搜索工艺信息
    remoteSearchTechnology(technologyCode) {
      if (technologyCode !== "" && this.technologySearchLoading) {
        this.technologySearchLoading = false;
        setTimeout(() => {
          this.technologySearchLoading = true;
          searchTechnologyList(itemCode).then(response => {
            this.technologyList = response.data;
          });
        }, 300);
      } else {
        this.technologyList = [];
      }
    },
    /**打开排产窗口*/
    /*openProductionSchedulingDialog(){
      this.productionSchedulingDialog.open = true;
      //this.productionSchedulingDialog.loading = true;
      //初始化个人信息
      //初始化设备信息
      this.selectEquipmentList()
      //初始化工序信息
      //this.selectProcessesList();
    },*/
    /**验证下发数量*/
    validateDeliveryQuantity(val) {},
    /**删除一行*/
    /*delProductionSchedulingRow(index, row) {
      this.productionSchedulingDialog.dataList.splice(index,1);
    },*/
    /**加一行*/
    /*addProductionSchedulingRow(){
      this.productionSchedulingDialog.dataList.push({});
    },*/
    /**排产*/
    /*handleProductionScheduling(){
      const that = this;
      //验证与筛选数量
      const list = that.productionSchedulingDialog.dataList;
      debugger;
      for(let i = 0; i < list.length; i++){
        const item = list[i];
        const productQuantity = isNaN(parseInt(item.productQuantity)) ? 0 : parseInt(item.productQuantity);
        if(productQuantity <= 0){
          this.$modal.msgError("第"+(i+1)+"行生产数量需为大于0的正整数");
          return false;
        }
        if(!item.itemId){
          this.$modal.msgError("第"+(i+1)+"行未选择物料");
          return false;
        }
        if(!item.workSchId){
          this.$modal.msgError("第"+(i+1)+"行未选择员工");
          return false;
        }
        if(!item.technologyId){
          this.$modal.msgError("第"+(i+1)+"行未选择工艺路线");
          return false;
        }
        if(!item.processId){
          this.$modal.msgError("第"+(i+1)+"行未选择工序");
          return false;
        }
      }
      this.$modal.confirm('是否确认排产').then(function() {
        that.productionSchedulingDialog.loading = true;
        return doProductionScheduling(list);
      }).then(response => {
        if(response.code == 500){
          this.$modal.msgError(response.msg);
        }else {
          this.$modal.msgSuccess("排产成功");
          this.productionSchedulingDialog.open = false;
          this.getList();
        }
      }).catch((e) => {this.$modal.msgError(e);}).finally(()=>this.productionSchedulingDialog.loading = false);
    },*/
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "plan/planWorkshopProduce/export",
        {
          ...this.queryParams
        },
        `planWorkshopProduce_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "车间生产计划导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "plan/planWorkshopProduce/importTemplate",
        { ...this.queryParams },
        "车间生产计划导入模板.xlsx"
      );
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
      this.$alert(response.msg, "导入结果", {
        dangerouslyUseHTMLString: true,
        callback: action => {
          this.getList();
        }
      });
    },

    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    /**打开排产窗口*/
    openProductionSchedulingDialog() {
      this.productionSchedulingDialog.open = true;
    },
    hQproductionSchedulingInfo() {
      this.productionSchedulingDialog.loading = true;
      this.productionSchedulingDialog.produceInfoList = [];
      findProduceInfoByDay(this.productionSchedulingDialog.qPs)
        .then(response => {
          if (response.data) {
            this.productionSchedulingDialog.produceInfoList = response.data;
            //this.searchTechnology();
          } else {
            this.$modal.msgError("未查询到排产信息");
          }
        })
        .finally(() => (this.productionSchedulingDialog.loading = false));
    },
    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        // 获取当前单元格的值
        const currentValue = row.processId;

        // 获取上一行相同列的值
        const preRow = this.productionSchedulingDialog.produceInfoList[
          rowIndex - 1
        ];
        const preValue = preRow ? preRow.processId : null;

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (
            let i = rowIndex + 1;
            i < this.productionSchedulingDialog.produceInfoList.length;
            i++
          ) {
            const nextRow = this.productionSchedulingDialog.produceInfoList[i];
            const nextValue = nextRow.processId;
            if (nextValue === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return { rowspan, colspan: 1 };
        }
      }
    },
    /**排产*/
    handleProductionScheduling() {
      const that = this;
      //验证与筛选数量
      const list = that.productionSchedulingDialog.produceInfoList;
      debugger;
      let dataList = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.operatorList == null || item.operatorList.length == 0) {
          continue;
        }
        dataList.push(item);
      }
      if (dataList.length == 0) {
        this.$modal.msgError("未排");
        return false;
      }
      this.$modal
        .confirm("是否确认")
        .then(function() {
          that.productionSchedulingDialog.loading = true;
          return doProductionScheduling(dataList);
        })
        .then(response => {
          if (response.code == 500) {
            this.$modal.msgError(response.msg);
          } else {
            this.$modal.msgSuccess("操作成功");
            this.productionSchedulingDialog.open = false;
            this.productionSchedulingDialog.produceInfoList = [];
            this.getList();
          }
        })
        .catch(e => {
          this.$modal.msgError(e);
        })
        .finally(() => (this.productionSchedulingDialog.loading = false));
    },
    produceDetailsOpen(val) {
      this.produceDetails = {
        open: true,
        title: "物料详情数量",
        ProduceInfoList: val
      };
    },
    tagOperateBy(tag) {
      if (tag.scheduleFlag === "1") {
        tag.scheduleFlag = "0";
      } else {
        tag.scheduleFlag = "1";
      }
    },
    openOperator(val, index) {
      console.log(val);
      this.operatorIndex = index;
      const { operatorList } = val;
      this.operatorAddList = operatorList;
      // this.operatorModifyList;
      this.operatorListDialog.open = true;
      getTeamList().then(res => {
        this.TeamList = res.rows;
      });
    },
    async getTeamMemberList() {
      const res = await TeamMemberList(this.operatorListDialog.ols);
      this.operatorModifyList = res.rows;
      this.operatorAddList.forEach(item => {
        this.operatorModifyList.forEach((el, index) => {
          if (item.planOperateId === el.userId) {
            this.operatorModifyList.splice(index, 1);
          }
        });
      });
    },
    // 添加
    addTeamMember(val, index) {
      const { teamId, teamName, userId, userName } = val;
      // const copyArr = JSON.parse(JSON.stringify(this.operatorAddList));
      const pu = this.operatorAddList.map(item => {
        return item.planOperateId;
      });
      if (pu.indexOf(userId) != -1) {
        this.$modal.msgError("排班人员已选中");
        return;
      } else {
        const params = {
          planOperateBy: userName,
          planOperateId: userId,
          planProduceNum: "",
          planWorkTeam: teamName,
          planWorkTeamId: teamId,
          scheduleFlag: "1"
        };
        this.operatorAddList.push(params);
      }
    },
    // 删除
    handleClose(tag) {
      this.operatorAddList.splice(this.operatorAddList.indexOf(tag), 1);
    },
    // delTeamMember(val, index) {
    //   this.operatorAddList.splice(index, 1);
    //   const param = {
    //     userName: val.planOperateBy,
    //     teamName: val.planWorkTeam
    //   };
    //   this.operatorModifyList.push(param);
    // },
    // 确认
    openOperatorListDialog() {}
  }
};
</script>

<style lang="scss" scoped>
.operator-transfer {
  ::v-deep .el-transfer-panel {
    width: 300px;
  }
}
</style>
