<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班制ID" prop="scheduleId" v-if="false">
        <el-input v-model="queryParams.scheduleId" placeholder="请输入班制ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="时段" prop="periodTimeRange" v-if="false">
        <el-input v-model="queryParams.periodTimeRange" placeholder="请输入时段" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="时段名称" prop="periodName">
        <el-input v-model="queryParams.periodName" placeholder="请输入时段名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum" v-if="false">
        <el-input v-model="queryParams.orderNum" placeholder="请输入显示顺序" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['work:class:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['work:class:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['work:class:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['work:class:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="70" align="left">
        <template slot-scope="scope">
          {{ (scope.$index + 1) + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="班次ID" align="center" prop="periodId" v-if="false" />
      <el-table-column label="班制ID" align="center" prop="scheduleId" v-if="false" />
      <el-table-column label="班制" align="center" prop="scheduleName" v-if="false" />
      <el-table-column label="时段" align="center" prop="periodTime" />
      <el-table-column label="时段名称" align="center" prop="periodName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['work:class:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['work:class:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改生产班次对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="45%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="时段名称" prop="periodName">
                <el-input v-model="form.periodName" placeholder="请输入时段名称" />
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="时段" prop="beginPeriodTime">
              <el-time-picker  v-model="form.beginPeriodTime" format='HH:mm' value-format="HH:mm"
                placeholder="开始时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1" :offset="2"><el-form-item label="至"></el-form-item></el-col>
          <el-col :span="8">
            <el-form-item prop="endPeriodTime">
              <el-time-picker  v-model="form.endPeriodTime" format='HH:mm' value-format="HH:mm"
                placeholder="结束时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
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
  </div>
</template>

<script>
import { listClass, getClass, delClass, addClass, updateClass, listByScheduleId } from "@/api/system/workscheduleclass";

export default {
  name: "Class",
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
      // 生产班次表格数据
      classList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        periodTimeRange: null,
        periodName: null,
        orderNum: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        beginPeriodTime: [
          { required: true, message: "开始时段不能为空", trigger: "blur" }
        ],
        endPeriodTime: [
          { required: true, message: "结束时段不能为空", trigger: "blur" }
        ],
        periodName: [
          { required: true, message: "时段名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询生产班次列表 */
    getList() {
      this.loading = true;
      listClass(this.queryParams).then(response => {
        this.classList = response.rows;
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
        periodId: null,
        scheduleId: null,
        scheduleName: null,
        periodTimeRange: [],
        beginPeriodTime: null,
        endPeriodTime: null,
        periodName: null,
        orderNum: null,
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
      this.ids = selection.map(item => item.periodId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加生产班次";
      this.form.beginPeriodTime = '8:30';
      this.form.endPeriodTime = '12:30';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const periodId = row.periodId || this.ids
      getClass(periodId).then(response => {
        this.form = response.data;
        this.form.beginPeriodTime = this.form.periodTimeRange[0];
        this.form.endPeriodTime = this.form.periodTimeRange[1];
        this.open = true;
        this.open = true;
        this.title = "修改生产班次";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.periodTimeRange = [this.form.beginPeriodTime, this.form.endPeriodTime];
          if (this.form.periodId != null) {
            updateClass(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClass(this.form).then(response => {
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
      const periodIds = row.periodId || this.ids;
      this.$modal.confirm('是否确认删除生产班次编号为"' + periodIds + '"的数据项？').then(function () {
        return delClass(periodIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('work/schedule/class/export', {
        ...this.queryParams
      }, `class_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
