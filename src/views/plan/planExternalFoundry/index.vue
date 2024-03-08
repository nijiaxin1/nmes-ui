<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="铸造计划号" prop="externalFoundryPlanCode">
        <el-input
          v-model="queryParams.externalFoundryPlanCode"
          placeholder="请输入铸造计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司储备计划号" prop="companyReservePlanCode">
        <el-input
          v-model="queryParams.companyReservePlanCode"
          placeholder="请输入公司储备计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划执行时间" prop="planExcuteDate">
        <el-date-picker clearable
          v-model="queryParams.planExcuteDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择计划执行时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="毛坯单位" prop="abuttingJointManufacturer">
        <el-input
          v-model="queryParams.abuttingJointManufacturer"
          placeholder="请输入毛坯单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['plan:planExternalFoundry:add']"
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
          v-hasPermi="['plan:planExternalFoundry:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="single"
          @click="handleDelete"
          v-hasPermi="['plan:planExternalFoundry:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['plan:planExternalFoundry:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          size="mini"
          @click="openDistributeDialog"
          v-hasPermi="['plan:planExternalFoundry:edit']"
        >排产</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planExternalFoundryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="铸造计划号" align="center" prop="externalFoundryPlanCode">
        <template slot-scope="scope">
          <router-link :to="'/plan/externalFoundry-info/index/' + scope.row.externalFoundryPlanCode" class="link-type">
            <span>{{ scope.row.externalFoundryPlanCode }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="公司储备计划号" align="center" prop="companyReservePlanCode" />
      <el-table-column label="导入文件名称" align="center" prop="importFileName" />
      <!--<el-table-column label="计划类型(1.铸造计划,2.需求计划)" align="center" prop="planType" />-->
      <el-table-column label="状态" align="center" prop="planStatusName" />
      <el-table-column label="计划执行时间" align="center" prop="planExcuteDate" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planExcuteDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原计划号" align="center" prop="sourcePlanCode" />
      <el-table-column label="毛坯单位" align="center" prop="abuttingJointManufacturer" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['plan:planExternalFoundry:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:planExternalFoundry:remove']"
          >删除</el-button>
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

    <!-- 添加或修改铸造计划对话框 -->
    <!--<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="铸造计划号" prop="externalFoundryPlanCode">
          <el-input v-model="form.externalFoundryPlanCode" placeholder="请输入铸造计划号" />
        </el-form-item>
        <el-form-item label="公司储备计划号" prop="companyReservePlanCode">
          <el-input v-model="form.companyReservePlanCode" placeholder="请输入公司储备计划号" />
        </el-form-item>
        <el-form-item label="导入文件名称" prop="importFileName">
          <el-input v-model="form.importFileName" placeholder="请输入导入文件名称" />
        </el-form-item>
        <el-form-item label="计划类型(1.铸造计划,2.需求计划)" prop="planType">
          <el-select v-model="form.planType" placeholder="请选择计划类型(1.铸造计划,2.需求计划)">
            <el-option
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态(1.初始化2.已下发)" prop="planStatus">
          <el-radio-group v-model="form.planStatus">
            <el-radio
              v-for="dict in dict.type."
              :key="dict.code"
              :label="dict.code"
            >{{dict.desc}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计划执行时间" prop="planExcuteDate">
          <el-date-picker clearable
            v-model="form.planExcuteDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划执行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="原计划号" prop="sourcePlanCode">
          <el-input v-model="form.sourcePlanCode" placeholder="请输入原计划号" />
        </el-form-item>
        <el-form-item label="毛坯单位" prop="abuttingJointManufacturer">
          <el-input v-model="form.abuttingJointManufacturer" placeholder="请输入毛坯单位" />
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
        <el-form ref="upload.fileForm" label-width="100px" :model="upload.fileForm" label-position="left" :rules="fileRules">
          <el-form-item label="计划执行日期" prop="planExcuteDate">
            <el-date-picker clearable
                            v-model="upload.fileForm.planExcuteDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择计划执行日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="原计划号" prop="sourcePlanCode">
            <el-input v-model="upload.fileForm.sourcePlanCode"></el-input>
          </el-form-item>
          <el-form-item label="毛坯单位" prop="abuttingJointManufacturer">
            <el-input v-model="upload.fileForm.abuttingJointManufacturer"></el-input>
          </el-form-item>
        </el-form>
        <hr/><br/>
        <el-upload
                  ref="upload"
                  :limit="1"
                  accept=".xlsx, .xls"
                  :headers="upload.headers"
                  :action="upload.url + '?updateSupport=' + upload.updateSupport"
                  :disabled="upload.isUploading"
                  :data="upload.fileForm"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :before-upload="handleBeforeUpload"
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
          <div >
              <el-button type="primary" @click="submitFileForm">确 定</el-button>
              <el-button @click="upload.open = false">取 消</el-button>
          </div>
      </el-dialog>

      <!-- 下发对话框 -->
      <!--<el-dialog :title="distribute.title" :visible.sync="distribute.open" width="400px">
        <el-form ref="distribute.form" label-width="100px" :model="distribute.form" label-position="left">
          <el-form-item label="计划铸造执行日期" prop="foundryPlanExcuteDate">
            <el-date-picker clearable
                            v-model="distribute.form.foundryPlanExcuteDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择铸造计划执行日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="需求计划需求日期" prop="demandPlanExcuteDate">
            <el-date-picker clearable
                            v-model="distribute.form.demandPlanExcuteDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择需求计划需求日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div >
            <el-button type="primary" @click="handleDistribute">确 定</el-button>
            <el-button @click="distribute.open = false">取 消</el-button>
        </div>
      </el-dialog>-->
      <!-- 下发不满足需求对话框 -->
      <el-dialog :title="dissatisfyDemand.title" :visible.sync="dissatisfyDemand.open">
        <el-table :data="dissatisfyDemand.lackData">
          <el-table-column property="itemCode" label="物料图号"></el-table-column>
          <el-table-column property="lackQuantity" label="差额"></el-table-column>
        </el-table>
      </el-dialog>

    <!-- 生成生产计划对话框 -->
    <el-dialog :title="distributeDialog.title" v-loading.fullscreen.lock="distributeDialog.loading" :visible.sync="distributeDialog.open"  fullscreen center>

      <el-form
        :model="distributeDialog.qPs"
        ref="distributeDialog.qPs"
        size="small"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="计划生产日期" prop="planProduceDate">
          <el-date-picker
            clearable
            v-model="distributeDialog.qPs.planExcuteDate"
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
            @click="hQDistributeInfo"
          >搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table  :data="distributeDialog.infoList" :span-method="handleSpanMethod" height="500">
       <!-- <el-table-column type="selection" width="55" align="center" />-->
        <el-table-column type="index" label="行号" align="center" prop="rowNo" />
        <!--<el-table-column label="铸造计划号" align="center" prop="externalFoundryPlanCode" />-->
        <el-table-column label="物料图号" align="center" prop="itemCode" />
        <el-table-column label="铸造数量" align="center" prop="foundryQuantity" />
        <el-table-column label="毛坯库存数量" align="center" prop="mpInvertoryQuantity" />
        <el-table-column label="成品库存数量" align="center" prop="cpInvertoryQuantity" />
        <el-table-column label="未完成销售数量" align="center" prop="allDemandQuantity" />
        <el-table-column label="在制品库存数量" align="center" prop="zzpInvertoryQuantity" />
        <el-table-column label="已排产数量" align="center" prop="productionSchedulingQuantity" />
        <el-table-column label="工艺路线" align="center" prop="technologyCode" />
        <!--<el-table-column label="工艺路线" align="center" prop="technologyId" >
          <template slot-scope="{ row }">
            <el-select v-model="row.technologyId" filterable
                       placeholder="请输入工艺路线编号" @focus="selectTechnology(row)">
              <el-option
                v-for="dict in technologyListByItem"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>-->
        <el-table-column label="生产数量" align="center" prop="productQuantity" >
          <template slot-scope="{ row }">
            <el-input v-model="row.productQuantity" @input="validateDeliveryQuantity"></el-input>
          </template>
        </el-table-column>
        <!--<el-table-column label="质量状态(1:待检;2:合格;3:不合格)" align="center" prop="qualityStatus" />-->
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>

      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="handleDistribute">确 定</el-button>
        <el-button @click="distributeDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { searchTechnologyListByItem, getNowDateStr} from '@/api/enumsSelect';
import { listPlanExternalFoundry, getPlanExternalFoundry, delPlanExternalFoundry,
    addPlanExternalFoundry, updatePlanExternalFoundry, distributePlan, doDistribute } from "@/api/plan/planExternalFoundry";
import { listNoPageByCode, listNoPageByDate } from "@/api/plan/planExternalFoundryInfo";
import { getToken } from "@/utils/auth";

export default {
  name: "PlanExternalFoundry",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中数组
      codeArray: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 铸造计划表格数据
      planExternalFoundryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        externalFoundryPlanCode: null,
        companyReservePlanCode: null,
        planStatus: null,
        planExcuteDate: getNowDateStr(),
        abuttingJointManufacturer: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        externalFoundryPlanCode: [
          { required: true, message: "铸造计划号不能为空", trigger: "blur" }
        ],
      },
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "铸造计划导入",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/plan/planExternalFoundryInfo/importData",
        //携带参数
        fileForm: {},
      },
      fileRules: {
        planExcuteDate: [
          { required: true, message: "计划执行日期不能为空", trigger: "blur" }
        ],
        abuttingJointManufacturer: [
          { required: true, message: "毛坯单位不能为空", trigger: "blur" }
        ],
      },
      // 下发不满足需求展示
      dissatisfyDemand: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "不满足需求项展示",
        //携带参数
        lackData: {},
      },
      // 下发
      distributeDialog:{
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "生成生产计划",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //查询条件
        qPs:{},
        //明细数据
        infoList: [],
      },
      //工艺信息
      technologyListByItem: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //工艺信息
    /*searchTechnology() {
      searchTechnologyList2().then(response => {
        this.technologyList = response.data;
      });
    },*/
    /** 查询铸造计划列表 */
    getList() {
      this.loading = true;
      listPlanExternalFoundry(this.queryParams).then(response => {
        this.planExternalFoundryList = response.rows;
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
        externalFoundryPlanCode: null,
        companyReservePlanCode: null,
        importFileName: null,
        planType: null,
        planStatus: null,
        planExcuteDate: null,
        sourcePlanCode: null,
        abuttingJointManufacturer: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    // 表单重置
    resetFileForm() {
      this.fileForm = {
        planExcuteDate: null,
        sourcePlanCode: null
      };
      this.resetForm("fileForm");
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
      this.codeArray = selection.map(item => item.externalFoundryPlanCode)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加铸造计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlanExternalFoundry(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改铸造计划";
      });
    },
    /** 提交按钮 */
    submitForm() {
        this.loading = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlanExternalFoundry(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(()=>this.loading = false);
          } else {
            addPlanExternalFoundry(this.form).then(response => {
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
      const id = row.id;
      this.$modal.confirm('是否确认删除铸造计划编号为"' + id + '"的数据项？').then(function() {
        return delPlanExternalFoundry(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /**打开下发窗口*/
    openDistributeDialog(row){
      this.distributeDialog.open = true;
      //const externalFoundryPlanCode = row.externalFoundryPlanCode || this.codeArray[0];

    },
    hQDistributeInfo(){
      this.distributeDialog.loading = true;
      this.distributeDialog.infoList = [];
      listNoPageByDate(this.distributeDialog.qPs).then(response => {
        if(response.data){
          /*response.data.directDeliveryQuantity = this.directDeliveryForm.directDeliveryQuantity;
          this.directDeliveryDialog.rowNo = this.directDeliveryDialog.rowNo + 1;
          response.data.rowNo = this.directDeliveryDialog.rowNo;*/
          this.distributeDialog.infoList = response.data;
          //this.searchTechnology();
        }else{
          this.$modal.msgError("未查询到销售信息");
        }
      }).finally(()=>this.distributeDialog.loading = false);
    },
    /**验证下发数量*/
    validateDeliveryQuantity(val){

    },
    handleSpanMethod({ row, column, rowIndex, columnIndex }){
      debugger
      if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        // 获取当前单元格的值
        const currentValue = row.itemId;

        // 获取上一行相同列的值
        const preRow = this.distributeDialog.infoList[rowIndex - 1];
        const preValue = preRow ? preRow.itemId : null;

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (let i = rowIndex + 1; i < this.distributeDialog.infoList.length; i++) {
            const nextRow = this.distributeDialog.infoList[i];
            const nextValue = nextRow.itemId;
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
    selectTechnology(row){
      this.technologyListByItem = [];
      searchTechnologyListByItem(row.itemId).then(response => {
        this.technologyListByItem = response.data;
      });
    },
    /**下发*/
    handleDistribute(){
      const that = this;
      //验证与筛选数量
      const list = that.distributeDialog.infoList;
      debugger;
      let dataList = [];
      for(let i = 0; i < list.length; i++){
        const item = list[i];
        const foundryQuantity = isNaN(parseInt(item.foundryQuantity)) ? 0 : parseInt(item.foundryQuantity);
        const mpInvertoryQuantity = isNaN(parseInt(item.mpInvertoryQuantity)) ? 0 : parseInt(item.mpInvertoryQuantity);
        const cpInvertoryQuantity = isNaN(parseInt(item.cpInvertoryQuantity)) ? 0 : parseInt(item.cpInvertoryQuantity);
        const allDemandQuantity = isNaN(parseInt(item.allDemandQuantity)) ? 0 : parseInt(item.allDemandQuantity);
        const productQuantity = isNaN(parseInt(item.productQuantity)) ? 0 : parseInt(item.productQuantity);
        if(productQuantity <= 0){
          /*this.$modal.msgError(item.itemCode + "生产数量需为大于0的正整数");
          return false;*/
          continue;
        }
        /*if(productQuantity < allDemandQuantity - cpInvertoryQuantity){
          this.$modal.msgError(item.itemCode + "生产数量需大于等于(销售数量-成品库存");
          return false;
        }
        if(productQuantity > (foundryQuantity + mpInvertoryQuantity)){
          this.$modal.msgError(item.itemCode + "生产数量需小于等于(铸造数量 + 毛坯库存数量)");
          return false;
        }*/
        item.planExcuteDate = this.distributeDialog.qPs.planExcuteDate;
        dataList.push(item);
      }
      if(dataList.length == 0){
        this.$modal.msgError("未录入生产计划");
        return false;
      }
      this.$modal.confirm('是否确认生成生产计划').then(function() {
        that.distributeDialog.loading = true;
        return doDistribute(dataList);
      }).then(response => {
        if(response.code == 500){
          this.$modal.msgError(response.msg);
        }else {
          this.$modal.msgSuccess("下发成功");
          this.distributeDialog.open = false;
          this.getList();
        }
      }).catch((e) => {
        //this.$modal.msgError(e);
      }).finally(()=>this.distributeDialog.loading = false);
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('plan/planExternalFoundry/export', {
        ...this.queryParams
      }, `planExternalFoundry_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
        this.upload.title = "铸造计划导入";
        this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
        this.download('plan/planExternalFoundryInfo/importTemplate',{...this.queryParams}, '铸造计划导入模板.xlsx');
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

    // 文件上传成功处理
    handleBeforeUpload(file) {
      let bs = false;
      if(!file){
        this.$alert("请选择上传文件");
        return bs;
      }
      this.$refs["upload.fileForm"].validate(valid => {
        if (valid) {
          //this.upload.data = this.fileForm;
          bs = true;
        }
      })
      return bs;
    },
    // 提交上传文件
    submitFileForm() {
        this.$refs.upload.submit();
    },
    //打开下发弹窗
    /*openDistributeDialog(){
      this.distribute.open = true;
      this.loading = true;
    },
    //下发
    handleDistribute(){
      //验证时间是否选择
      const foundryPlanExcuteDate = this.distribute.form.foundryPlanExcuteDate;
      if(foundryPlanExcuteDate == null){
        this.$alert("请选择铸造计划执行日期");
        return false;
      }
      //验证时间是否选择
      const demandPlanExcuteDate = this.distribute.form.demandPlanExcuteDate;
      if(demandPlanExcuteDate == null){
        this.$alert("请选择需求计划需求日期");
        return false;
      }
      distributePlan(this.distribute.form).then(response=>{
        if(response.data != null ){
          this.distribute.open = false;
          this.dissatisfyDemand.open = true;
          this.dissatisfyDemand.lackData = response.data;
        }else{
          this.$modal.msg(response.msg);
          this.getList();
          //this.distribute.open = false;
        }
      }).catch(e=>{
        this.$alert(e);
      }).finally(()=>this.loading = false)
    }*/
  }
};
</script>
