<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="工序代码" prop="processCode">
        <el-input
          v-model="queryParams.processCode"
          placeholder="请输入工序代码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序名称" prop="processName">
        <el-input
          v-model="queryParams.processName"
          placeholder="请输入工序名称"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['base:process:add']"
        >新增
        </el-button>
      </el-col>


      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:process:export']"
        >导出
        </el-button>
      </el-col>

      <!--          icon="el-icon-edit"-->
      <el-col :span="1.5">
        <el-button
          :type="openSort ? 'primary' : 'success'"
          plain

          size="mini"
          @click="handleToUpdateOrder"
          v-hasPermi="['base:process:edit']">
          <span v-if="!openSort">调整顺序</span>
          <span v-else>保存</span>
        </el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-alert
      v-if="openSort"
      title="工序顺序调整"
      type="info"
      description="按住上下拖动工序即可调整顺序,调整完后请记得保存!"
      show-icon>
    </el-alert>

    <el-table row-key="id" v-loading="loading" :data="processList" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="index" width="55" align="center"/>-->
      <!--      <el-table-column label="序号" align="center" prop="serialNumber"/>-->
      <el-table-column label="工序代码" align="center" prop="processCode"/>
      <el-table-column label="工序名称" align="center" prop="processName"/>
      <el-table-column label="停用状态" align="center" prop="deactivationStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.stop_using_flag" :value="scope.row.deactivationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:process:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:process:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改工序表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工序代码" prop="processCode">
          <el-input v-model="form.processCode" placeholder="请输入工序代码"/>
        </el-form-item>

        <el-form-item label="工序名称" prop="processName">
          <el-input v-model="form.processName" placeholder="请输入工序名称"/>
        </el-form-item>

        <el-form-item label="状态" prop="deactivationStatus">

          <el-select v-model="form.deactivationStatus" placeholder="工序状态" clearable>
            <el-option
              v-for="dict in dict.type.stop_using_flag"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>

        </el-form-item>



        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import {listProcess, getProcess, delProcess, addProcess, updateProcess, updateProcessList} from "@/api/base/process";

import Sortable from "sortablejs";


export default {
  name: "Process",
  dicts: ['stop_using_flag'],
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
      // 工序表表格数据
      processList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openSort: false,
      sortable: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        processCode: null,
        processName: null,
        serialNumber: null,
        deactivationStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {

  },
  methods: {
    /*开启工序调整*/
    enableSort() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      this.sortable = Sortable.create(tbody, {
        animation: 180,
        delay: 0,
        onEnd: (event) => {
          const oldIndex = event.oldIndex; //初始位置
          const newIndex = event.newIndex; //拖拽后的位置
          let source = this.processList[oldIndex]
          this.processList.splice(oldIndex, 1)
          this.processList.splice(newIndex, 0, source);
          this.processList.forEach(process => {
            console.log(process.processCode)
          })
        },
      });
    },
    disableSort() {
      this.sortable.destroy()
    },

    /** 查询工序表列表 */
    getList() {
      this.loading = true;
      listProcess(this.queryParams).then(response => {
        this.processList = response.rows;
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
        id: null,
        processCode: null,
        processName: null,
        serialNumber: null,
        deactivationStatus: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工序表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProcess(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工序表";
      });
    },
    handleToUpdateOrder() {
      this.openSort = !this.openSort;
      if (this.openSort) {
        this.enableSort()
      } else {
        this.disableSort()
        //保存信息到后台
        updateProcessList(this.processList).then(res => {
          //调整完成
        })
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateProcess(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProcess(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工序表编号为"' + ids + '"的数据项？').then(function () {
        return delProcess(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('base/process/export', {
        ...this.queryParams
      }, `process_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
