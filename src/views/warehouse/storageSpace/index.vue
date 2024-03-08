<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88 px">
      <el-form-item label="仓库代码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入仓库代码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库位编码" prop="storageSpaceCode">
        <el-input
          v-model="queryParams.storageSpaceCode"
          placeholder="请输入库位编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库位名称" prop="storageSpaceName">
        <el-input
          v-model="queryParams.storageSpaceName"
          placeholder="请输入库位名称"
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
          v-hasPermi="['warehouse:storageSpace:add']"
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
          v-hasPermi="['warehouse:storageSpace:edit']"
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
          v-hasPermi="['warehouse:storageSpace:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['warehouse:storageSpace:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="storageSpaceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="仓库代码" align="center" prop="warehouseCode" />
      <el-table-column label="库位编码" align="center" prop="storageSpaceCode" />
      <el-table-column label="库位名称" align="center" prop="storageSpaceName" />
      <el-table-column label="停用状态" align="center" prop="deactivationStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.stop_using_flag" :value="scope.row.deactivationStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['warehouse:storageSpace:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['warehouse:storageSpace:remove']"
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

    <!-- 添加或修改库位表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓库代码" prop="warehouseCode">
          <el-select v-model="form.warehouseCode" :disabled="form.id!=null" placeholder="请选择仓库代码" clearable>
            <el-option
              v-for="warehouse in warehouseList"
              :key="warehouse.warehouseCode"
              :label="warehouse.warehouseName"
              :value="warehouse.warehouseCode"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="库位编码" prop="storageSpaceCode">
          <el-input v-model="form.storageSpaceCode" placeholder="请输入库位编码" />
        </el-form-item>
        <el-form-item label="库位名称" prop="storageSpaceName">
          <el-input v-model="form.storageSpaceName" placeholder="请输入库位名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>


        <el-form-item v-if="form.warehouseCode == 'ZZPCK'" label="绑定工序" prop="processId">
          <el-select  v-model="form.processId" placeholder="绑定工序" clearable>
            <el-option
              v-for="process in processList"
              :key="process.id"
              :label="process.processName"
              :value="process.id"
            />
          </el-select>
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
import { listStorageSpace, getStorageSpace, delStorageSpace, addStorageSpace, updateStorageSpace } from "@/api/warehouse/storageSpace";
import  {listAllWarehouse} from "@/api/warehouse/warehouse";
import {listProcess} from '@/api/base/process'
export default {
  name: "StorageSpace",
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
      // 库位表表格数据
      storageSpaceList: [],
      warehouseList:[],
      processList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseCode: null,
        storageSpaceCode: null,
        storageSpaceName: null,
        deactivationStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseCode: [
          { required: true, message: "仓库代码不能为空", trigger: "blur" }
        ],
        storageSpaceCode: [
          { required: true, message: "库位编码不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getWarehouses();
    this.getProcessList()
  },
  methods: {

    getProcessList() {
      this.loading = true;
      listProcess().then(response => {
        this.processList = response.rows;
      });
    },
    /** 查询库位表列表 */
    getList() {
      this.loading = true;
      listStorageSpace(this.queryParams).then(response => {
        this.storageSpaceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getWarehouses(){
      listAllWarehouse().then(response => {
        this.warehouseList = response.rows;
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
        warehouseCode: null,
        storageSpaceCode: null,
        storageSpaceName: null,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加库位表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStorageSpace(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库位表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStorageSpace(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStorageSpace(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库位表编号为"' + ids + '"的数据项？').then(function() {
        return delStorageSpace(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('warehouse/storageSpace/export', {
        ...this.queryParams
      }, `storageSpace_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
