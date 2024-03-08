<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">

<!--      <el-form-item label="仓库" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入仓库"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->

      <el-form-item label="仓库" prop="warehouseCode" label-width="50px">
        <el-select v-model="queryParams.warehouseCode" placeholder="请选择仓库" clearable>
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.warehouseCode"
            :label="warehouse.warehouseName"
            :value="warehouse.warehouseCode"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="图号" prop="itemId">

        <el-select clearable v-model="queryParams.itemInfoId" filterable remote
                   :remote-method="remoteSearchItem"
                   placeholder="请输入物料图号检索">
          <el-option
            v-for="dict in itemList"
            :key="dict.code"
            :label="dict.desc"
            :value="dict.code"
          ></el-option>
        </el-select>

      </el-form-item>

<!--
      <el-form-item label="物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
-->

<!--      <el-form-item label="供应商" prop="supplyId">
        <el-input
          v-model="queryParams.supplyId"
          placeholder="请输入供应商编码"
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['warehouse:inventory:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inventoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="父图号" align="center" prop="parentItemId" />-->
      <el-table-column label="图号" align="center" prop="itemId" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="质量状态" align="center" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.quality_status_type" :value="scope.row.qualityStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="仓库代码" align="center" prop="warehouseCode" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="库位代码" align="center" prop="storageSpaceCode" />
      <el-table-column label="库位名称" align="center" prop="storageSpaceName" />
      <el-table-column label="库存数量" align="center" prop="inventoryQuantity" />
      <el-table-column label="锁帐数量" align="center" prop="lockQuantity" />
      <el-table-column label="在途数量" align="center" prop="inTransitQuantity" />
<!--      <el-table-column label="批次号" align="center" prop="batchNumber" />-->
<!--      <el-table-column label="单位" align="center" prop="unit" />-->
<!--      <el-table-column label="条码" align="center" prop="barcode" />-->
<!--      <el-table-column label="大类" align="center" prop="classId" />-->
<!--      <el-table-column label="供应商编码" align="center" prop="supplyId" />-->
      <el-table-column label="供应商名称" align="center" prop="supplyName" />

      <el-table-column label="备注" align="center" prop="remark" />
<!--      <el-table-column label="版本号" align="center" prop="versionNo" />-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['warehouse:inventory:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['warehouse:inventory:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


  </div>
</template>

<script>
import { listInventory, getInventory, delInventory, addInventory, updateInventory } from "@/api/warehouse/inventory";
import {listAllWarehouse} from "@/api/warehouse/warehouse";
import {searchItemList} from '@/api/enumsSelect';
export default {
  name: "Inventory",
  dicts: ['quality_status_type'],
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
      // 库存管理表格数据
      inventoryList: [],
      warehouseList:[],
      itemList: [],
      itemSearchLoading: true,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentItemId: null,
        itemId: null,
        itemName: null,
        qualityStatus: null,
        unit: null,
        barcode: null,
        classId: null,
        supplyId: null,
        supplyName: null,
        warehouseCode: null,
        warehouseName: null,
        storageSpaceCde: null,
        storageSpaceName: null,
        inventoryQuantity: null,
        versionNo: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getWarehouses()
  },
  methods: {
    getWarehouses() {
      listAllWarehouse().then(response => {
        this.warehouseList = response.rows;
      });
    },
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
    /** 查询库存管理列表 */
    getList() {
      this.loading = true;
      listInventory(this.queryParams).then(response => {
        this.inventoryList = response.rows;
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
        parentItemId: null,
        itemId: null,
        itemName: null,
        qualityStatus: null,
        unit: null,
        barcode: null,
        classId: null,
        supplyId: null,
        supplyName: null,
        warehouseCode: null,
        warehouseName: null,
        storageSpaceCde: null,
        storageSpaceName: null,
        inventoryQuantity: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        versionNo: null
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
      this.title = "添加库存管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInventory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInventory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventory(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库存管理编号为"' + ids + '"的数据项？').then(function() {
        return delInventory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('warehouse/inventory/export', {
        ...this.queryParams
      }, `inventory_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
