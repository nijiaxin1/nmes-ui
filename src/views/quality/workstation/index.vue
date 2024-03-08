<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="searchRules"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="78px"
    >
      <el-form-item label="报告者ID" prop="reporterId" v-if="false">
        <el-input
          v-model="queryParams.reporterId"
          placeholder="请输入报告者"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车间" prop="workshopId" v-if="false">
        <el-input
          v-model="queryParams.workshopId"
          placeholder="请输入车间"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产线" prop="productionLineId" v-if="false">
        <el-input
          v-model="queryParams.productionLineId"
          placeholder="请输入产线"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序" prop="processId">
        <el-select
          v-model="queryParams.processId"
          placeholder="请选择工序"
          clearable
        >
          <el-option
            v-for="p in processList"
            :key="p.id"
            :label="p.processName"
            :value="p.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="废品类型" prop="defectType">
        <el-select
          v-model="queryParams.defectType"
          placeholder="请选择废品类型"
          clearable
          @change="handleDefectTypeSelectChange"
        >
          <el-option
            v-for="dict in dict.type.defect_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="responseId">
        <el-select
          v-model="queryParams.responseId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入姓名"
          :remote-method="getUserByFuzzyNickName"
          :loading="userLoading"
          v-if="showResponse"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="queryParams.responseId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入供应商"
          :remote-method="getCustomerByFuzzyName"
          :loading="customerLoading"
          v-else
        >
          <el-option
            v-for="item in customerList"
            :key="item.id"
            :label="item.customerName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物料" prop="itemId">
        <el-select
          v-model="queryParams.itemId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入物料"
          :remote-method="getItemByFuzzyName"
          :loading="itemLoading"
        >
          <el-option
            v-for="item in itemList"
            :key="item.id"
            :label="item.itemName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="质检时间" prop="reportDate">
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
      <el-form-item label="班次" prop="periodId" v-if="false">
        <el-select
          v-model="queryParams.periodId"
          clearable
          placeholder="请选择班次"
        >
          <el-option
            v-for="item in workClassList"
            :key="item.periodId"
            :label="item.periodName"
            :value="item.periodId"
          >
            <span style="float: left">{{ item.periodName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.periodTime
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合格数量" prop="productionQuantity" v-if="false">
        <el-input
          v-model="queryParams.productionQuantity"
          placeholder="请输入合格数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="废品数量" prop="defectsQuantity" v-if="false">
        <el-input
          v-model="queryParams.defectsQuantity"
          placeholder="请输入废品数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="废品说明" prop="defectDetail" v-if="false">
        <el-input
          v-model="queryParams.defectDetail"
          placeholder="请输入废品说明"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键质量指标1" prop="cto1" v-if="false">
        <el-input
          v-model="queryParams.cto1"
          placeholder="请输入关键质量指标1"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键质量指标2" prop="cto2" v-if="false">
        <el-input
          v-model="queryParams.cto2"
          placeholder="请输入关键质量指标2"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-col :span="1.5" v-if="false">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['quality:workstation:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['quality:workstation:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['quality:workstation:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['quality:workstation:export']"
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
      :data="workstationList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="报告ID"
        align="center"
        prop="reportId"
        v-if="false"
      />
      <el-table-column
        label="质检时间"
        align="center"
        prop="reportDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reportDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报告者" align="center" prop="reporterName" />
      <el-table-column
        label="班次"
        align="center"
        prop="periodId"
        width="180px"
        v-if="false"
      >
        <template slot-scope="scope">
          {{ scope.row.periodName + "(" + scope.row.periodTime + ")" }}
        </template>
      </el-table-column>
      <el-table-column
        label="车间"
        align="center"
        prop="workshopId"
        v-if="false"
      />
      <el-table-column
        label="产线"
        align="center"
        prop="productionLineId"
        v-if="false"
      />
      <el-table-column
        label="器具码"
        align="center"
        prop="utensilCode"
        width="180px"
      />
      <el-table-column label="当前工序" align="center" prop="processName" />
      <el-table-column
        label="责任工序"
        align="center"
        prop="responseProcessName"
      />
      <el-table-column
        label="责任人"
        align="center"
        prop="responseName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="库"
        align="center"
        prop="warehouseName"
        width="180px"
      />
      <el-table-column
        label="库位"
        align="center"
        prop="storageSpaceName"
        width="180px"
      />
      <el-table-column
        label="物料"
        align="center"
        prop="itemName"
        :show-overflow-tooltip="true"
        width="180px"
      />
      <el-table-column
        label="合格数量"
        align="center"
        prop="productionQuantity"
      />
      <el-table-column label="废品数量" align="center" prop="defectsQuantity" />
      <el-table-column label="废品类型" align="center" prop="defectType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.defect_type"
            :value="scope.row.defectType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="废品说明"
        align="center"
        prop="defectDetail"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="关键质量指标1"
        align="center"
        prop="cto1"
        width="120px"
        v-if="false"
      />
      <el-table-column
        label="关键质量指标2"
        align="center"
        prop="cto2"
        width="120px"
        v-if="false"
      />
      <el-table-column label="备注" align="center" prop="remark" v-if="false" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="120px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['quality:workstation:query']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['quality:workstation:edit']"
            v-if="false"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['quality:workstation:remove']"
            v-if="false"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改质检记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="35%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="质检时间" prop="reportDate" v-if="false">
          <el-date-picker
            clearable
            v-model="form.reportDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择报告时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报告者" prop="reporterId" v-if="false">
          <el-input v-model="form.reporterId" placeholder="请输入报告者" />
        </el-form-item>
        <el-form-item label="班次" prop="periodId">
          <el-input v-model="form.periodId" placeholder="请输入班次" />
        </el-form-item>
        <el-form-item label="车间" prop="workshopId" v-if="false">
          <el-input v-model="form.workshopId" placeholder="请输入车间" />
        </el-form-item>
        <el-form-item label="产线" prop="productionLineId" v-if="false">
          <el-input v-model="form.productionLineId" placeholder="请输入产线" />
        </el-form-item>
        <el-form-item label="工序" prop="processId" v-if="false">
          <el-input v-model="form.processId" placeholder="请输入工序" />
        </el-form-item>
        <el-form-item label="责任人" prop="responseId">
          <el-input v-model="form.responseId" placeholder="请输入责任人" />
        </el-form-item>
        <el-form-item label="物料" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入物料" />
        </el-form-item>
        <el-form-item label="合格数量" prop="productionQuantity">
          <el-input
            v-model="form.productionQuantity"
            placeholder="请输入合格数量"
          />
        </el-form-item>
        <el-form-item label="废品数量" prop="defectsQuantity">
          <el-input
            v-model="form.defectsQuantity"
            placeholder="请输入废品数量"
          />
        </el-form-item>
        <el-form-item label="废品说明" prop="defectDetail">
          <el-input
            v-model="form.defectDetail"
            type="textarea"
            placeholder="请输入废品说明"
          />
        </el-form-item>
        <el-form-item label="关键质量指标1" prop="cto1" v-if="false">
          <el-input v-model="form.cto1" placeholder="请输入关键质量指标1" />
        </el-form-item>
        <el-form-item label="关键质量指标2" prop="cto2" v-if="false">
          <el-input v-model="form.cto2" placeholder="请输入关键质量指标2" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag" v-if="false">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="false">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="openView"
      width="75%"
      append-to-body
    >
      <el-divider content-position="left"
        ><span style="font-weight: bold">质检信息</span></el-divider
      >
      <el-descriptions border>
        <el-descriptions-item label="质检时间">{{
          form.reportDate
        }}</el-descriptions-item>
        <el-descriptions-item label="质检人">{{
          form.reporterName
        }}</el-descriptions-item>
        <el-descriptions-item label="器具码">{{
          form.utensilCode
        }}</el-descriptions-item>
        <el-descriptions-item label="当前工序">{{
          form.processName
        }}</el-descriptions-item>
        <el-descriptions-item label="责任工序">{{
          form.responseProcessName
        }}</el-descriptions-item>
        <el-descriptions-item label="责任人">{{
          form.responseName
        }}</el-descriptions-item>
        <el-descriptions-item label="库">{{
          form.warehouseName
        }}</el-descriptions-item>
        <el-descriptions-item label="库位">{{
          form.storageSpaceName
        }}</el-descriptions-item>
        <el-descriptions-item label="物料">{{
          form.itemName
        }}</el-descriptions-item>
        <el-descriptions-item label="合格数量">{{
          form.productionQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="废品数量">{{
          form.defectsQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="废品类型">
          <template>
            <dict-tag
              :options="dict.type.defect_type"
              :value="form.defectType"
            />
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="废品说明">{{
          form.defectDetail
        }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left" v-if="fileList.length > 0"
        ><span style="font-weight: bold">采集照片</span></el-divider
      >
      <div>
        <el-image
          v-for="(file, index) in fileList"
          style="width: 100px; height: 100px; margin: 5px"
          :src="file.url"
          :alt="file.name"
          :preview-src-list="fileUrlList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listWorkstation,
  getWorkstation,
  delWorkstation,
  addWorkstation,
  updateWorkstation,
  listCustomerByFuzzyName,
  listItemByFuzzyQuery,
} from "@/api/quality/workstation";
import { listClass } from "@/api/system/workscheduleclass";
import { listProcess } from "@/api/base/process";
import { listUserByFuzzyNickName } from "@/api/dt/user";
export default {
  name: "Workstation",
  dicts: ["defect_type"],
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
      // 质检记录表格数据
      workstationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reportDate: null,
        startDate: null,
        endDate: null,
        reporterId: null,
        periodId: null,
        workshopId: null,
        productionLineId: null,
        processId: null,
        responseId: null,
        itemId: null,
        qualityInspectMethod: null,
        productionQuantity: null,
        defectsQuantity: null,
        defectType: null,
        defectDetail: null,
        cto1: null,
        cto2: null,
      },
      // 表单校验
      searchRules: {
        defectType: [
          { required: true, message: "废品类型不能为空", trigger: "change" },
        ],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 查询时间范围
      dateRange: [],
      // 生产班次表格数据
      workClassList: [],
      //工序列表
      processList: [],
      showResponse: true,
      //员工列表
      userList: [],
      userLoading: false,
      //供应商列表
      customerList: [],
      customerLoading: false,
      //物料列表
      itemList: [],
      itemLoading: false,
      //打开详情页
      openView: false,
      //文件列表
      fileList: [],
      //大图预览
      fileUrlList: [],
    };
  },
  created() {
    this.queryParams.qualityInspectMethod =
      this.$route.params && this.$route.query.qualityInspectMethod;
    this.getworkClassList();
    this.getProcessList();
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
    /** 查询质检记录列表 */
    getList() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          listWorkstation(this.queryParams).then((response) => {
            this.workstationList = response.rows;
            this.total = response.total;
            this.loading = false;
          });
        }
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
        reportId: null,
        reportDate: null,
        reporterId: null,
        periodId: null,
        workshopId: null,
        productionLineId: null,
        processId: null,
        responseId: null,
        itemId: null,
        productionQuantity: null,
        defectsQuantity: null,
        defectType: null,
        defectDetail: null,
        cto1: null,
        cto2: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
      this.fileList = [];
      this.fileUrlList = [];
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
      this.ids = selection.map((item) => item.reportId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加质检记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const reportId = row.reportId || this.ids;
      getWorkstation(reportId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改质检记录";
      });
    },
    /** 查看详情按钮操作 */
    handleView(row) {
      this.reset();
      const reportId = row.reportId || this.ids;
      getWorkstation(reportId).then((response) => {
        this.form = response.data;
        if (response.data.sysFileInfos) {
          response.data.sysFileInfos.forEach((f) => {
            this.fileList.push({
              name: f.originFileName,
              url: process.env.VUE_APP_BASE_API + f.filePath,
              fileId: f.fileId,
            });
            this.fileUrlList.push(process.env.VUE_APP_BASE_API + f.filePath);
          });
        }
        this.openView = true;
        this.title = "质检详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.reportId != null) {
            updateWorkstation(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWorkstation(this.form).then((response) => {
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
      const reportIds = row.reportId || this.ids;
      this.$modal
        .confirm('是否确认删除质检记录编号为"' + reportIds + '"的数据项？')
        .then(function () {
          return delWorkstation(reportIds);
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
        "quality/workstation/export",
        {
          ...this.queryParams,
        },
        `workstation_${new Date().getTime()}.xlsx`
      );
    },
    /** 获取班次 */
    getworkClassList() {
      listClass().then((r) => {
        this.workClassList = r.rows;
      });
    },
    /** 查询工序表列表 */
    getProcessList() {
      listProcess().then((response) => {
        this.processList = response.rows;
      });
    },
    /**废品类型选择时间 */
    handleDefectTypeSelectChange(select) {
      this.showResponse = select == 1 ? true : false;
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
    /** 供应商模糊查询 */
    getCustomerByFuzzyName(query) {
      if (query !== "") {
        this.customerLoading = true;
        listCustomerByFuzzyName(query).then((r) => {
          this.customerList = r.rows;
          this.customerLoading = false;
        });
      }
    },
    /** 物料模糊查询 */
    getItemByFuzzyName(query) {
      if (query !== "") {
        this.itemLoading = true;
        listItemByFuzzyQuery(query).then((r) => {
          this.itemList = r.rows;
          this.itemLoading = false;
        });
      }
    },
  },
};
</script>
