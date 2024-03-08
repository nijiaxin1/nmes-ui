<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单号" prop="outboundNumber">
        <el-input
          v-model="queryParams.outboundNumber"
          placeholder="请输入单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父图号" prop="parentItemCode">
        <el-input
          v-model="queryParams.parentItemCode"
          placeholder="请输入父图号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图号" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入图号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入仓库编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入仓库名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目的仓库代码" prop="destinationCode">
        <el-input
          v-model="queryParams.destinationCode"
          placeholder="请输入目的仓库代码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目的仓库名称" prop="destinationName">
        <el-input
          v-model="queryParams.destinationName"
          placeholder="请输入目的仓库名称"
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
      <el-form-item label="条码号" prop="barcode">
        <el-input
          v-model="queryParams.barcode"
          placeholder="请输入条码号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商编码" prop="supplyId">
        <el-input
          v-model="queryParams.supplyId"
          placeholder="请输入供应商编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplyName">
        <el-input
          v-model="queryParams.supplyName"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库数量" prop="outboundQuantity">
        <el-input
          v-model="queryParams.outboundQuantity"
          placeholder="请输入出库数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料关联id" prop="itemInfoId">
        <el-input
          v-model="queryParams.itemInfoId"
          placeholder="请输入物料关联id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入批次号"
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
          v-hasPermi="['warehouse:outboundOrderInfo:add']"
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
          v-hasPermi="['warehouse:outboundOrderInfo:edit']"
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
          v-hasPermi="['warehouse:outboundOrderInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['warehouse:outboundOrderInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outboundOrderInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="单号" align="center" prop="outboundNumber" />
      <el-table-column label="父图号" align="center" prop="parentItemCode" />
      <el-table-column label="图号" align="center" prop="itemCode" />
      <el-table-column label="物料名称" align="center" prop="itemName" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="仓库编码" align="center" prop="warehouseCode" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="目的仓库代码" align="center" prop="destinationCode" />
      <el-table-column label="目的仓库名称" align="center" prop="destinationName" />
      <el-table-column label="库位编码" align="center" prop="storageSpaceCode" />
      <el-table-column label="库位名称" align="center" prop="storageSpaceName" />
      <el-table-column label="条码号" align="center" prop="barcode" />
      <el-table-column label="质量状态" align="center" prop="qualityStatus" />
      <el-table-column label="供应商编码" align="center" prop="supplyId" />
      <el-table-column label="供应商名称" align="center" prop="supplyName" />
      <el-table-column label="出库数量" align="center" prop="outboundQuantity" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="物料关联id" align="center" prop="itemInfoId" />
      <el-table-column label="批次号" align="center" prop="batchNumber" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['warehouse:outboundOrderInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['warehouse:outboundOrderInfo:remove']"
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

    <!-- 添加或修改出库单明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单号" prop="outboundNumber">
          <el-input v-model="form.outboundNumber" placeholder="请输入单号" />
        </el-form-item>
        <el-form-item label="父图号" prop="parentItemCode">
          <el-input v-model="form.parentItemCode" placeholder="请输入父图号" />
        </el-form-item>
        <el-form-item label="图号" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入图号" />
        </el-form-item>
        <el-form-item label="物料名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物料名称" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="仓库编码" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" placeholder="请输入仓库编码" />
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="目的仓库代码" prop="destinationCode">
          <el-input v-model="form.destinationCode" placeholder="请输入目的仓库代码" />
        </el-form-item>
        <el-form-item label="目的仓库名称" prop="destinationName">
          <el-input v-model="form.destinationName" placeholder="请输入目的仓库名称" />
        </el-form-item>
        <el-form-item label="库位编码" prop="storageSpaceCode">
          <el-input v-model="form.storageSpaceCode" placeholder="请输入库位编码" />
        </el-form-item>
        <el-form-item label="库位名称" prop="storageSpaceName">
          <el-input v-model="form.storageSpaceName" placeholder="请输入库位名称" />
        </el-form-item>
        <el-form-item label="条码号" prop="barcode">
          <el-input v-model="form.barcode" placeholder="请输入条码号" />
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplyId">
          <el-input v-model="form.supplyId" placeholder="请输入供应商编码" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplyName">
          <el-input v-model="form.supplyName" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="出库数量" prop="outboundQuantity">
          <el-input v-model="form.outboundQuantity" placeholder="请输入出库数量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="删除标记" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标记" />
        </el-form-item>
        <el-form-item label="物料关联id" prop="itemInfoId">
          <el-input v-model="form.itemInfoId" placeholder="请输入物料关联id" />
        </el-form-item>
        <el-form-item label="批次号" prop="batchNumber">
          <el-input v-model="form.batchNumber" placeholder="请输入批次号" />
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
import { listOutboundOrderInfo, getOutboundOrderInfo, delOutboundOrderInfo, addOutboundOrderInfo, updateOutboundOrderInfo } from "@/api/warehouse/outboundOrderInfo";

export default {
  name: "OutboundOrderInfo",
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
      // 出库单明细表格数据
      outboundOrderInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outboundNumber: null,
        parentItemCode: null,
        itemCode: null,
        itemName: null,
        unit: null,
        warehouseCode: null,
        warehouseName: null,
        destinationCode: null,
        destinationName: null,
        storageSpaceCode: null,
        storageSpaceName: null,
        barcode: null,
        qualityStatus: null,
        supplyId: null,
        supplyName: null,
        outboundQuantity: null,
        itemInfoId: null,
        batchNumber: null
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
  },
  methods: {
    /** 查询出库单明细列表 */
    getList() {
      this.loading = true;
      listOutboundOrderInfo(this.queryParams).then(response => {
        this.outboundOrderInfoList = response.rows;
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
        outboundNumber: null,
        parentItemCode: null,
        itemCode: null,
        itemName: null,
        unit: null,
        warehouseCode: null,
        warehouseName: null,
        destinationCode: null,
        destinationName: null,
        storageSpaceCode: null,
        storageSpaceName: null,
        barcode: null,
        qualityStatus: null,
        supplyId: null,
        supplyName: null,
        outboundQuantity: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null,
        itemInfoId: null,
        batchNumber: null
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
      this.title = "添加出库单明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOutboundOrderInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改出库单明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOutboundOrderInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOutboundOrderInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除出库单明细编号为"' + ids + '"的数据项？').then(function() {
        return delOutboundOrderInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('warehouse/outboundOrderInfo/export', {
        ...this.queryParams
      }, `outboundOrderInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
