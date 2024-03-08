<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="78px"
    >
      <el-form-item label="客户" prop="customerId">
        <el-select
          v-model="queryParams.customerId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入客户"
          :remote-method="getCustomerByFuzzyName"
          :loading="customerLoading"
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
      <el-form-item label="问题类型" prop="issueType">
        <el-select
          v-model="queryParams.issueType"
          placeholder="请选择问题类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sale_issue_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" prop="description" v-if="false">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入问题描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开启日期" prop="openDate">
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
      <el-form-item label="问题状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择问题状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sale_issue_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="问题解决方案" prop="resolution" v-if="false">
        <el-input
          v-model="queryParams.resolution"
          placeholder="请输入问题解决方案"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['quality:issue:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['quality:issue:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['quality:issue:remove']"
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
          v-hasPermi="['quality:issue:export']"
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
      :data="issueList"
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
        label="问题ID"
        align="center"
        prop="issueId"
        v-if="false"
      />
      <el-table-column
        label="客户"
        align="center"
        prop="customerId"
        width="180"
        v-if="false"
      />
      <el-table-column
        label="客户"
        align="center"
        prop="customerName"
        width="160"
      />
      <el-table-column
        label="物料图号"
        align="center"
        prop="itemCode"
        width="200px"
      />
      <el-table-column
        label="物料名称"
        align="center"
        prop="itemName"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column label="问题类型" align="center" prop="issueType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sale_issue_type"
            :value="scope.row.issueType"
          />
        </template>
      </el-table-column>
      <el-table-column label="次品数量" align="center" prop="defectsQuantity" />
      <el-table-column
        label="问题描述"
        align="center"
        prop="description"
        show-overflow-tooltip
      />
      <el-table-column
        label="开启日期"
        align="center"
        prop="openDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.openDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="关闭日期"
        align="center"
        prop="closedDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.closedDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sale_issue_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="解决方案"
        align="center"
        prop="resolution"
        show-overflow-tooltip
      />
      <el-table-column label="备注" align="center" prop="remark" v-if="false" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['quality:issue:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['quality:issue:remove']"
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

    <!-- 添加或修改售后问题对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="65%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col span="8">
            <el-form-item label="客户" prop="customerId">
              <el-select
                v-model="form.customerId"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请输入客户"
                :remote-method="getCustomerByFuzzyName"
                :loading="customerLoading"
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
          </el-col>
          <el-col span="8">
            <el-form-item label="物料图号" prop="itemCode">
              <el-select
                value-key="id"
                v-model="form.itemCode"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请输入物料图号"
                :remote-method="getItemByFuzzyName"
                :loading="itemLoading"
                @change="handleItemSelectChange"
              >
                <el-option
                  v-for="item in itemList"
                  :key="item.id"
                  :label="item.itemCode"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="物料名称" prop="itemName">
              <el-input
                v-model="form.itemName"
                placeholder="请输入物料名称"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="问题类型" prop="issueType">
              <el-select v-model="form.issueType" placeholder="请选择问题类型">
                <el-option
                  v-for="dict in dict.type.sale_issue_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="次品数量" prop="defectsQuantity">
              <el-input-number
                v-model="form.defectsQuantity"
                :min="1"
                :precision="0"
                label="请输入次品数量"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="问题描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              placeholder="请输入问题描述"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="开启日期" prop="openDate">
              <el-date-picker
                clearable
                v-model="form.openDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开启日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="关闭日期" prop="closedDate">
              <el-date-picker
                clearable
                v-model="form.closedDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择关闭日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="问题状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择问题状态">
              <el-option
                v-for="dict in dict.type.sale_issue_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="解决方案" prop="resolution">
            <el-input
              v-model="form.resolution"
              type="textarea"
              placeholder="请输入问题解决方案"
            />
          </el-form-item>
        </el-row>
        <el-form-item label="删除标识" prop="delFlag" v-if="false">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="false">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
  listIssue,
  getIssue,
  delIssue,
  addIssue,
  updateIssue,
} from "@/api/quality/issue";
import {
  listCustomerByFuzzyName,
  listItemByFuzzyQuery,
} from "@/api/quality/workstation";

export default {
  name: "Issue",
  dicts: ["sale_issue_status", "sale_issue_type"],
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
      // 售后问题表格数据
      issueList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerId: null,
        itemCode: null,
        itemName: null,
        issueType: null,
        description: null,
        openDate: null,
        closedDate: null,
        status: null,
        resolution: null,
        startDate: null,
        endDate: null,
      },
      // 查询时间范围
      dateRange: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        customerId: [
          { required: true, message: "客户不能为空", trigger: "blur" },
        ],
        itemCode: [
          { required: true, message: "物料图号不能为空", trigger: "blur" },
        ],
        issueType: [
          { required: true, message: "问题类型不能为空", trigger: "blur" },
        ],
        defectsQuantity: [
          { required: true, message: "次品数量不能为空", trigger: "change" },
        ],
        description: [
          { required: true, message: "问题描述不能为空", trigger: "change" },
        ],
        openDate: [
          { required: true, message: "问题开启时间不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "问题状态不能为空", trigger: "blur" },
        ],
      },
      // 物料列表
      itemList: [],
      itemLoading: false,
      // 供应商列表
      customerList: [],
      customerLoading: false,
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
    /** 查询售后问题列表 */
    getList() {
      this.loading = true;
      listIssue(this.queryParams).then((response) => {
        this.issueList = response.rows;
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
        issueId: null,
        customerId: null,
        itemCode: null,
        itemName: null,
        issueType: null,
        defectsQuantity: null,
        description: null,
        openDate: null,
        closedDate: null,
        status: null,
        resolution: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
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
      this.ids = selection.map((item) => item.issueId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加售后问题";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const issueId = row.issueId || this.ids;
      getIssue(issueId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改售后问题";
        this.getCustomerByFuzzyName(row.customerName);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.issueId != null) {
            updateIssue(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addIssue(this.form).then((response) => {
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
      const issueIds = row.issueId || this.ids;
      this.$modal
        .confirm('是否确认删除售后问题编号为"' + issueIds + '"的数据项？')
        .then(function () {
          return delIssue(issueIds);
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
        "quality/issue/export",
        {
          ...this.queryParams,
        },
        `issue_${new Date().getTime()}.xlsx`
      );
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
    /** 物料选择事件 */
    handleItemSelectChange(item) {
      if (item) {
        this.form.itemName = item.itemName;
        this.form.itemCode = item.itemCode;
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
  },
};
</script>
<style lang="css">
.el-tooltip__popper {
  font-size: 14px;
  max-width: 50%;
}
</style>
