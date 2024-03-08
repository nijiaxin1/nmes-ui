<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="出库单号" prop="outboundNumber">
        <el-input
          v-model="queryParams.outboundNumber"
          placeholder="请输入入库单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="出库仓库" prop="warehouseCode">
        <el-select v-model="queryParams.warehouseCode" placeholder="请选择仓库" clearable>
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.warehouseCode"
            :label="warehouse.warehouseName"
            :value="warehouse.warehouseCode"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="目的仓库" prop="destinationName">
        <el-select v-model="queryParams.destinationName" placeholder="请选择目的仓库" clearable>
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.warehouseCode"
            :label="warehouse.warehouseName"
            :value="warehouse.warehouseCode"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="出库单状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择" clearable>
          <el-option key="0" label="初始化" value="0"/>
          <el-option key="1" label="完成" value="1"/>
          <el-option key="2" label="入库完成" value="2"/>
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="queryParams.createTimeStart"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime" placeholder="开始时间">
        </el-date-picker>

        <el-date-picker
          v-model="queryParams.createTimeEnd"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime" placeholder="结束时间">
        </el-date-picker>
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
          v-hasPermi="['warehouse:outbound:add']"
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
          v-hasPermi="['warehouse:outbound:export']"
        >导出
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          size="mini"
          type="warning"
          plain
          icon="el-icon-edit"
          @click="openDeliveryDialog()"
          v-hasPermi="['plan:planCompanySale:edit']"
        >发交</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          size="mini"
          type="warning"
          plain
          icon="el-icon-edit"
          @click="openDirectDeliveryDialog()"
          v-hasPermi="['plan:planCompanySale:edit']"
        >直送</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      :cell-style="tableCellStyle"
      v-loading="loading" :data="outboundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="出库单号" align="center" prop="outboundNumber"/>
      <el-table-column label="出库单类型" align="center" prop="outboundType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.outbound_order_type" :value="scope.row.outboundType"/>
        </template>
      </el-table-column>
      <el-table-column label="计划单据号" align="center" prop="relatedNumber"/>
      <el-table-column label="出库仓库" align="center" prop="warehouseName"/>
      <!--      <el-table-column label="目的仓库" align="center" prop="destinationCode"/>-->
      <el-table-column label="目的仓库名称" align="center" prop="destinationName"/>


      <el-table-column label="出库单状态" align="center" prop="state">
        <template slot-scope="scope">
          <span v-if="scope.row.state == '0'">初始化</span>
          <span v-if="scope.row.state == '1'">出库完成</span>
          <span v-if="scope.row.state == '2'">入库已完成</span>
        </template>
      </el-table-column>

      <el-table-column label="结算单状态" align="center" prop="isSettle">
        <template slot-scope="scope">
          <span v-if="scope.row.isSettle == '0' && [ '2','3'].indexOf( scope.row.outboundType)!=-1">未生成</span>
          <span v-if="scope.row.isSettle == '1' && [ '2','3'].indexOf( scope.row.outboundType)!=-1">已生成</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="showDetail(scope.row)"
            v-hasPermi="['warehouse:inbound:edit']"
          >查看
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="(scope.row.state =='0' && [ '2','3', '5'].indexOf(scope.row.outboundType)!=-1)"
            @click="handleState(scope.row)"
            v-hasPermi="['warehouse:outbound:edit']"
          >确认出库
          </el-button>
          <!-- 直送 发交 销售 返仓-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.isSettle=='0' && [ '2','3','6','7'].indexOf(scope.row.outboundType)!=-1 && scope.row.state !='0'"
            @click="handleSettleOrder(scope.row)"
            v-hasPermi="['warehouse:outbound:edit']"
          >生成结算
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['warehouse:outbound:remove']"-->
          <!--          >删除</el-button>-->
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

    <!-- 添加或修改出库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1500px" append-to-body>
      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="88px">

        <el-form-item label="业务类型" prop="outboundType">
          <el-select :disabled="type=='show'" v-model="form.outboundType">
            <el-option
              v-for="dict in dict.type.outbound_order_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="出库仓库" prop="warehouseCode">
          <el-select :disabled="type=='show'" @change="changeWarehouse($event)" v-model="form.warehouseCode"
                     placeholder="请选择出库仓库" clearable>
            <el-option
              v-for="warehouse in warehouseList"
              :key="warehouse.warehouseCode"
              :label="warehouse.warehouseName"
              :value="warehouse.warehouseCode"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="目的仓库" prop="destinationCode" v-if="form.outboundType != '5'">
          <el-select :disabled="type=='show'" v-model="form.destinationCode" placeholder="请选择目的仓库" clearable>
            <el-option
              v-for="warehouse in warehouseList"
              :key="warehouse.warehouseCode"
              :label="warehouse.warehouseName"
              :value="warehouse.warehouseCode"
            />
          </el-select>
        </el-form-item>


        <!--        <el-button type="primary" @click="addItem" v-if="form.warehouseCode != '' && form.warehouseCode!=null">新增明细</el-button>-->

        <el-card v-if="type=='add'">
          <div slot="header">
            <span style="margin-right: 10px">库存列表</span>
            <!--            @change="selectItem($event,row)"-->
            <span style="margin-left: 10px">图号：
            <el-select v-model="inventorySearch.itemId" filterable remote
                       :remote-method="remoteSearchItem"
                       placeholder="请输入物料图号检索">
              <el-option
                v-for="dict in itemList"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.desc"
              ></el-option>
            </el-select>
          </span>
            <span style="margin-left: 10px">库位：
            <el-select v-model="inventorySearch.storageSpaceCode" filterable
                       placeholder="请输入库位编码检索">
              <el-option
                v-for="dict in storageSpaceList"
                :key="dict.code"
                :label="dict.desc"
                :value="dict.code"
              ></el-option>
            </el-select>
          </span>
            <span style="margin-left: 10px">质量状态：
            <el-select v-model="inventorySearch.qualityStatus" filterable clearable
                       placeholder="请输入质量状态">
              <el-option label="待检测" value="0"></el-option>
              <el-option label="合格" value="1"></el-option>
              <el-option label="不合格" value="2"></el-option>
            </el-select>
          </span>
            <el-button style="margin-left: 20px" type="primary" @click="searchInventory">搜索</el-button>
            <el-button style="margin-left: 20px" type="primary" @click="addItem">添加到出库明细</el-button>
            <!--            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
          <el-table ref="inventoryTable" row-key="id" :border="true"
                    @selection-change="handleSelectionChangeInner"
                    :data="inventoryList">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="图号" align="center" prop="itemId"></el-table-column>
            <el-table-column label="物料名称" align="center" prop="itemName"></el-table-column>
            <el-table-column label="质量状态" align="center">
              <template scope="{row}">
                <span v-if="row.qualityStatus=='0'">待检测</span>
                <span v-if="row.qualityStatus=='1'">合格</span>
                <span v-if="row.qualityStatus=='2'">不合格</span>
              </template>
            </el-table-column>
            <el-table-column label="供应商" align="center" prop="supplyName"></el-table-column>
            <el-table-column label="库位" align="center" prop="storageSpaceCode"></el-table-column>
            <el-table-column label="库存数量" align="center" prop="inventoryQuantity"></el-table-column>
            <el-table-column label="锁帐数量" align="center" prop="lockQuantity"></el-table-column>
            <el-table-column label="出库数量" align="center">
              <template slot-scope="{row}">
                  <el-input-number size="10"  v-model="row.outboundQuantity" :min="1"
                                 :max="row.inventoryQuantity - row.lockQuantity"
                                 label="出库数量"></el-input-number>
              </template>
            </el-table-column>

          </el-table>
        </el-card>
        <el-card style="margin-top: 20px">
          <div slot="header">
            <span>出库单明细列表</span>
          </div>

          <el-table ref="outboundInfoListTable" row-key="id" :border="true"
                    :data="form.outboundOrderInfoList">

            <el-table-column label="图号" align="center" prop="itemCode"></el-table-column>
            <el-table-column label="库位" align="center" prop="storageSpaceCode"></el-table-column>
            <el-table-column label="出库数量" align="center" prop="outboundQuantity"></el-table-column>
            <el-table-column label="质量状态" align="center">
              <template slot-scope="{row}">
                <span v-if="row.qualityStatus=='0'">待检测</span>
                <span v-if="row.qualityStatus=='1'">合格</span>
                <span v-if="row.qualityStatus=='2'">不合格</span>
              </template>
            </el-table-column>
            <el-table-column label="物料名称" align="center" prop="itemName"></el-table-column>
            <el-table-column label="供应商名称" align="center" prop="supplyName"></el-table-column>
            <el-table-column label="单位" align="center" prop="unit"></el-table-column>
            <el-table-column label="材质" align="center" prop="materialType"></el-table-column>
            <el-table-column label="单价" align="center" prop="effectPrice"></el-table-column>
            <el-table-column label="结算状态" align="center" prop="isSettle"
                             v-if=" [ '2','3','6','7'].indexOf(form.outboundType) != -1">
              <template slot-scope="scope">
                <span v-if="scope.row.isSettle == '0' && [  '2','3','6','7'].indexOf( form.outboundType)!=-1">未生成</span>
                <span v-if="scope.row.isSettle == '1' && [  '2','3','6','7'].indexOf( form.outboundType)!=-1">已生成</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">

                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-if="type=='show' && scope.row.isSettle=='0' && [  '2','3','6','7'].indexOf( form.outboundType)!=-1"
                  @click="handleSettleOrderInfo(scope.row)"
                  v-hasPermi="['warehouse:outbound:edit']">生成结算
                </el-button>

                <el-button
                  v-if="type=='add'"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleRowDelete(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="display: flex;margin-top: 10px;align-items: flex-end;justify-content: flex-end">
            <div>总计：</div>
            <div>{{ totalMoney }}</div>
          </div>
        </el-card>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>





    <!-- 销售计划发交对话框 -->
    <el-dialog
      :title="deliveryDialog.title"
      v-loading.fullscreen.lock="deliveryDialog.loading"
      :visible.sync="deliveryDialog.open"
      fullscreen
      center
    >
      <el-form
        v-model="deliveryDialog.queryDeliveryParams"
        ref="deliveryDialog.queryDeliveryParams"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="物料图号" prop="itemId">
          <el-select
            v-model="deliveryDialog.queryDeliveryParams.itemId"
            filterable
            remote
            :remote-method="remoteSearchItem"
            placeholder="请输入物料图号"
            clearable
          >
            <el-option
              v-for="dict in itemList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="机加工单位" prop="abuttingJointManufacturerId">
          <el-select v-model="deliveryDialog.queryDeliveryParams.abuttingJointManufacturerId" placeholder="请选择机加工单位" filterable  remote
                     :remote-method="remoteSearchCustomer">
            <el-option
              v-for="dict in customerList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleDeliveryQuery"
          >搜索</el-button>
          <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
        </el-form-item>
      </el-form>
      <el-table
        :data="deliveryDialog.planCompanySaleInfoList"
        @selection-change="handleSelectionChangeDelivery"
        ref="planCompanySaleInfoListRef"
        height="500"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="销售计划号" align="center" prop="companySalePlanCode" />
        <el-table-column label="物料图号" align="center" prop="itemCode" />
        <el-table-column label="行号" align="center" prop="rowNo" />
        <el-table-column label="需求配送时间" align="center" prop="distributionTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.distributionTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求数量" align="center" prop="demandQuantity" />
        <el-table-column label="销售数量" align="center" prop="auditedQuantity" />
        <el-table-column label="可用库存数量" align="center" prop="usedQuantity" />
        <el-table-column label="发交数量" align="center" prop="deliveryQuantity">
          <template slot-scope="{ row }">
            <el-input v-model="row.deliveryQuantity" @change="validateDeliveryQuantity(row,$event)"></el-input>
          </template>
        </el-table-column>
        <!--<el-table-column label="已生成出库数量" align="center" prop="issuedQuantity" />-->
        <el-table-column label="已发交数量" align="center" prop="distributedQuantity" />
        <!--<el-table-column label="已结算数量" align="center" prop="settlementQuantity" />-->
        <el-table-column label="状态" align="center" prop="planStatusName" />
        <el-table-column label="机加工单位" align="center" prop="abuttingJointManufacturer" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDelivery">确 定</el-button>
        <el-button @click="deliveryDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 销售计划直送对话框 -->
    <el-dialog
      :title="directDeliveryDialog.title"
      v-loading.fullscreen.lock="directDeliveryDialog.loading"
      :visible.sync="directDeliveryDialog.open"
      fullscreen
      center
    >
      <el-form
        v-model="directDeliveryDialog.queryDirectDeliveryParams"
        ref="directDeliveryDialog.queryDirectDeliveryParams"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="物料图号" prop="itemId">
          <el-select
            v-model="deliveryDialog.queryDeliveryParams.itemId"
            filterable
            remote
            :remote-method="remoteSearchItem"
            placeholder="请输入物料图号"
            clearable
          >
            <el-option
              v-for="dict in itemList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机加工单位" prop="abuttingJointManufacturerId">
          <el-select v-model="deliveryDialog.queryDeliveryParams.abuttingJointManufacturerId" placeholder="请选择机加工单位" filterable  remote
                     :remote-method="remoteSearchCustomer">
            <el-option
              v-for="dict in customerList"
              :key="dict.code"
              :label="dict.desc"
              :value="dict.code+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleDeliveryQuery"
          >搜索</el-button>
          <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
        </el-form-item>
      </el-form>
      <el-table
        :data="directDeliveryDialog.planCompanySaleInfoList"
        ref="DeliveryRef"
        @selection-change="handleSelectionChangeDirectDelivery"
        height="500"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="销售计划号" align="center" prop="companySalePlanCode" />
        <el-table-column label="物料图号" align="center" prop="itemCode" />
        <el-table-column label="行号" align="center" prop="rowNo" />
        <el-table-column label="需求配送时间" align="center" prop="distributionTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.distributionTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求数量" align="center" prop="demandQuantity" />
        <el-table-column label="销售数量" align="center" prop="auditedQuantity" />
        <el-table-column label="发交数量" align="center" prop="deliveryQuantity">
          <template slot-scope="{ row }">
            <el-input v-model="row.deliveryQuantity" @change="SaleDeliveryQuantity(row,$event)"></el-input>
          </template>
        </el-table-column>
        <!--<el-table-column label="已生成出库数量" align="center" prop="issuedQuantity" />-->
        <el-table-column label="已发交数量" align="center" prop="distributedQuantity" />
        <!--<el-table-column label="已结算数量" align="center" prop="settlementQuantity" />-->
        <el-table-column label="状态" align="center" prop="planStatusName" />
        <el-table-column label="机加工单位" align="center" prop="abuttingJointManufacturer" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDirectDelivery">确 定</el-button>
        <el-button @click="directDeliveryDialog.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOutbound,
  getOutbound,
  delOutbound,
  addOutbound,
  updateOutbound,
  updateOrderSettle,
  updateOrderState
} from "@/api/warehouse/outbound";
import {listAllWarehouse} from "@/api/warehouse/warehouse";
import {searchItemInfoList, searchStorageSpaceList, searchCustomerList} from '@/api/enumsSelect';
import {listAllInventory} from "@/api/warehouse/inventory";
import {
  listPlanCompanySale,
  getPlanCompanySale,
  delPlanCompanySale,
  addPlanCompanySale,
  updatePlanCompanySale,
  doDelivery,
  directDelivery,
  saveDirectDelivery,
  goAudited
} from "@/api/plan/planCompanySale";
import {
  findSaleInfoForDirectDelivery,
  listNoAuditedPageByCode,
  listNoPageHaveInventoryByCode,
  listNoPageNoInventoryByCode
} from "@/api/plan/planCompanySaleInfo";
import Math from '@/utils/math.js'

export default {
  name: "Outbound",
  dicts: ['outbound_order_type', 'quality_status_type'],
  data() {
    return {
      totalMoney: 0,
      type: '',
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
      // 出库单表格数据
      inventoryList: [],
      warehouseList: [],
      outboundList: [],
      itemList: [],
      storageSpaceList: [],
      inventoryIds: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      itemSearchLoading: true,
      warehouseCodeLoading: true,
      inventorySearch: {
        itemId: null,
        qualityStatus: null,
        warehouseCode: null,
        storageSpaceCode: null
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outboundNumber: null,
        outboundType: null,
        relatedNumber: null,
        destinationCode: null,
        destinationName: null,
        warehouseCode: null,
        warehouseName: null,
        state: null,
      },
      // 表单参数
      form: {
        outboundOrderInfoList: []
      },
      // 表单校验
      rules: {},


      // 直送
      directDeliveryDialog: {
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "销售计划直送",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //明细数据
        planCompanySaleInfoList: [],
        //明细数据
        selectPlanCompanySaleInfoList: [],
        //行号
        queryDirectDeliveryParams: 0
      },

      // 发交
      deliveryDialog: {
        // 遮罩层
        loading: false,
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "销售计划发交",
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //明细数据
        planCompanySaleInfoList: [],
        //明细数据
        selectPlanCompanySaleInfoList: [],
        queryDeliveryParams: {}
      },
      //客户信息
      customerList: [],
      customerSearchLoading: true,
    };
  },
  created() {
    this.getList();
    this.getWarehouses();
  },
  methods: {
    tableCellStyle(row, rowIndex) {
      if (['2', '3'].indexOf(row.row.outboundType) != -1 && row.row.isSettle == '0') {
        return 'background-color:#ffba00'
      } else if (['2', '3'].indexOf(row.row.outboundType) != -1 && row.row.isSettle == '1') {
        return 'background-color:#e8f4ff'
      }
    },
    handleSelectionChangeInner(selection) {
      this.inventoryIds = selection.map(item => item.id)
    },
    showDetail(row) {
      this.reset();
      const id = row.id
      getOutbound(id).then(response => {
        this.form = response.data;
        let sum = 0;
        if (this.form.outboundOrderInfoList != null && this.form.outboundOrderInfoList.length > 0) {
          this.form.outboundOrderInfoList.forEach(outOrderInfo => {
            sum = Math.add(sum, Math.multiply(outOrderInfo.effectPrice, outOrderInfo.outboundQuantity));
          })
        }
        this.totalMoney = sum
        this.open = true;
        this.title = "查看出库单明细";
        this.type = "show"
      });
    },
    addItem() {
      //获取库存列表
      if (this.inventoryList == null || this.inventoryList == undefined || this.inventoryList.length == 0) {
        return this.$modal.msgError("没有待出库的明细!!!");
      }


      if (this.inventoryIds == null || this.inventoryIds == undefined || this.inventoryIds.length == 0) {
        return this.$modal.msgError("没有选中该待出库的明细!!!");
      }

      let hadOutbound = this.form.outboundOrderInfoList.length > 0

      let canAdd = true;

      //遍历获取选中的待出库明细
      this.inventoryList.forEach(inventory => {
        let id = inventory.id;
        let canUse = inventory.inventoryQuantity - inventory.lockQuantity

        //被选中
        if (this.inventoryIds.includes(id)) {
          //判断出库数量是否 > 0
          if (inventory.outboundQuantity > 0) {

            //如果已有出库数据
            if (hadOutbound) {
              //需要出库数据里面重复的条数
              this.form.outboundOrderInfoList.forEach(outboundInfo => {
                //相同的
                if (outboundInfo.id == id) {
                  //数量相加
                  let count = outboundInfo.outboundQuantity + inventory.outboundQuantity;
                  //可用数量
                  if (count > canUse) {
                    //报错 一条都不能加
                    canAdd = false;
                  }
                }
              })
            }
          } else {
            canAdd = false;
          }
        }
      })
      if (!canAdd) {
        return this.$modal.msgError("出库数量不正确!!!");
      }
      this.inventoryList.forEach(inventory => {
        let id = inventory.id;
        // let canUse = inventory.inventoryQuantity - inventory.lockQuantity

        //被选中
        if (this.inventoryIds.includes(id)) {
          //判断出库数量是否 > 0
          if (inventory.outboundQuantity > 0) {
            let newItem = true;
            //如果已有出库数据
            if (hadOutbound) {
              //需要出库数据里面重复的条数
              this.form.outboundOrderInfoList.forEach(outboundInfo => {
                //相同的
                if (outboundInfo.id == id) {
                  newItem = false;
                  //数量相加
                  outboundInfo.outboundQuantity = outboundInfo.outboundQuantity + inventory.outboundQuantity;
                }
              })
            }

            if (newItem) {
              inventory.itemCode = inventory.itemId

              this.form.outboundOrderInfoList.splice(0, 0, inventory)
            }
          }
        }
      })
      //清空
      this.inventoryList = []
    },
    searchInventory() {
      this.inventorySearch.warehouseCode = this.form.warehouseCode
      listAllInventory(this.inventorySearch).then(response => {
        this.inventoryList = response.rows;
      });
    },
    getWarehouses() {
      listAllWarehouse().then(response => {
        this.warehouseList = response.rows;
      });
    },
    /** 查询出库单列表 */
    getList() {
      this.loading = true;
      listOutbound(this.queryParams).then(response => {
        this.outboundList = response.rows;
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
        outboundType: null,
        relatedNumber: null,
        destinationCode: null,
        destinationName: null,
        warehouseCode: null,
        warehouseName: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        outboundOrderInfoList: []
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
      this.title = "添加出库单";
      this.type = "add"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOutbound(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改出库单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            // updateOutbound(this.form).then(response => {
            //   this.$modal.msgSuccess("修改成功");
            //   this.open = false;
            //   this.getList();
            // });

            this.open = false;
            this.getList();
          } else {
            addOutbound(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除出库单编号为"' + ids + '"的数据项？').then(function () {
        return delOutbound(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    handleRowDelete(row) {
      //页面删除
      this.form.outboundOrderInfoList.forEach((outboundOrderInfo, index, arr) => {
        if (row.id == outboundOrderInfo.id) {
          arr.splice(index, 1,)
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('warehouse/outbound/export', {
        ...this.queryParams
      }, `outbound_${new Date().getTime()}.xlsx`)
    },
    remoteSearchItem(itemCode) {
      if (itemCode !== '' && this.itemSearchLoading) {
        this.itemSearchLoading = false;
        setTimeout(() => {
          this.itemSearchLoading = true;
          searchItemInfoList(itemCode).then(response => {
            this.itemList = response.data;
            //这个地方还要名字 和 供应商
          });
        }, 300);
      } else {
        this.itemList = [];
      }
    },
    changeWarehouse(value) {
      if (value !== '') {
        this.remoteStorageSpaceList(value);
        this.warehouseList.forEach(wl => {
          if (wl.warehouseCode == value) {
            this.form.warehouseName = wl.warehouseName
          }
        });
      }
    },
    remoteStorageSpaceList(warehouseCode) {
      if (warehouseCode !== '' && this.warehouseCodeLoading) {
        this.warehouseCodeLoading = false;
        setTimeout(() => {
          this.warehouseCodeLoading = true;
          searchStorageSpaceList(warehouseCode).then(response => {
            this.storageSpaceList = response.data;
            //这个地方还要名字 和 供应商
            console.log(this.storageSpaceList)
          });
        }, 300);
      } else {
        this.storageSpaceList = [];
      }
    },
    handleSettleOrder(row) {
      //结算
      updateOrderSettle(row).then(response => {
        this.getList();
      });

    },
    handleState(row) {
      updateOrderState(row).then(response => {
        this.getList();
      });
    },
    handleSettleOrderInfo(row) {
      // this.form.outboundOrderInfoList = []
      let obj = {
        id: this.form.id,
        outboundNumber: this.form.outboundNumber,
        outboundOrderInfoList: []
      }

      obj.outboundOrderInfoList.push(row);

      //结算
      updateOrderSettle(obj).then(response => {
        this.getList();
        row.isSettle = '1';
      });

    },




    /**打开发交窗口*/
    openDeliveryDialog(row) {
      this.deliveryDialog.open = true;
      this.handleDeliveryQuery();
    },
    handleDeliveryQuery() {
      this.deliveryDialog.loading = true;
      listNoPageHaveInventoryByCode(this.deliveryDialog.queryDeliveryParams)
        .then(response => {
          if (response.data) {
            this.deliveryDialog.planCompanySaleInfoList = response.data;
            /*this.$nextTick(() => {
              this.deliveryDialog.planCompanySaleInfoList.forEach(row => {
                if (row.deliveryQuantity > 0) {
                  this.$refs.planCompanySaleInfoListRef.toggleRowSelection(row);
                }
              });
            });*/
          } else {
            this.$modal.msgError("未查询到销售信息");
          }
        })
        .finally(() => (this.deliveryDialog.loading = false));
    },
    // 发交input事件
    validateDeliveryQuantity(row, e) {
      if (e > 0) {
        this.$refs.planCompanySaleInfoListRef.toggleRowSelection(row);
      }
    },
    // 直送
    SaleDeliveryQuantity(row, e) {
      if (e > 0) {
        this.$refs.DeliveryRef.toggleRowSelection(row);
      }
    },
    // 多选框选中数据
    handleSelectionChangeDelivery(selection) {
      this.deliveryDialog.selectPlanCompanySaleInfoList = selection;
    },
    /**发交*/
    handleDelivery() {
      const that = this;
      //验证与筛选数量
      const list = that.deliveryDialog.selectPlanCompanySaleInfoList;
      if (list.length == 0) {
        this.$modal.msgError("请选择");
        return false;
      }
      let data = [];
      debugger;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const usedQuantity = isNaN(parseInt(item.usedQuantity))
          ? 0
          : parseInt(item.usedQuantity);
        const deliveryQuantity = isNaN(parseInt(item.deliveryQuantity))
          ? 0
          : parseInt(item.deliveryQuantity);
        if (deliveryQuantity <= 0) {
          //不管不大于0的
          continue;
        }
        //发交数量不能超过销售数量
        if (
          //parseInt(item.auditedQuantity) - parseInt(item.issuedQuantity) <
          parseInt(item.auditedQuantity) - parseInt(item.distributedQuantity) <
          deliveryQuantity
        ) {
          this.$modal.msgError(
            //item.itemCode + "发交数量超出（销售数量-已生成出库数量）"
            item.itemCode + "发交数量超出（销售数量-已发交数量）"
          );
          return false;
        }
        //发交数量不能超过可用库存
        if (usedQuantity < deliveryQuantity) {
          this.$modal.msgError(item.itemCode + "发交数量超出可用库存数量");
          return false;
        }
        data.push(item);
      }
      if (data.length == 0) {
        this.$modal.msgError("请选择");
        return false;
      }
      this.$modal
        .confirm("是否确认生成发交单")
        .then(function() {
          that.deliveryDialog.loading = true;
          return doDelivery(data);
        })
        .then(response => {
          if (response.code == 500) {
            this.$modal.msgError(response.msg);
          } else {
            this.$modal.msgSuccess("发交成功");
            this.deliveryDialog.open = false;
            this.getList();
          }
        })
        .catch(e => {
          this.$modal.msgError(e);
        })
        .finally(() => (this.deliveryDialog.loading = false));
    },
    /**打开发交窗口*/
    openDirectDeliveryDialog(row) {
      this.directDeliveryDialog.open = true;
      this.handleDirectDeliveryQuery();
    },
    handleDirectDeliveryQuery() {
      this.directDeliveryDialog.loading = true;
      listNoPageNoInventoryByCode(
        this.directDeliveryDialog.queryDirectDeliveryParams
      )
        .then(response => {
          if (response.data) {
            /*response.data.directDeliveryQuantity = this.directDeliveryForm.directDeliveryQuantity;
          this.directDeliveryDialog.rowNo = this.directDeliveryDialog.rowNo + 1;
          response.data.rowNo = this.directDeliveryDialog.rowNo;*/
            this.directDeliveryDialog.planCompanySaleInfoList = response.data;
          } else {
            this.$modal.msgError("未查询到销售信息");
          }
        })
        .finally(() => (this.directDeliveryDialog.loading = false));
    },
    // 多选框选中数据
    handleSelectionChangeDirectDelivery(selection) {
      this.directDeliveryDialog.selectPlanCompanySaleInfoList = selection;
    },
    /**发交*/
    handleDirectDelivery() {
      const that = this;
      //验证与筛选数量
      const list = that.directDeliveryDialog.selectPlanCompanySaleInfoList;
      if (list.length == 0) {
        this.$modal.msgError("请选择");
        return false;
      }
      let data = [];
      debugger;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const deliveryQuantity = isNaN(parseInt(item.deliveryQuantity))
          ? 0
          : parseInt(item.deliveryQuantity);
        if (deliveryQuantity <= 0) {
          //不管不大于0的
          continue;
        }
        //发交数量不能超过销售数量
        if (
          //parseInt(item.auditedQuantity) - parseInt(item.issuedQuantity) <
          parseInt(item.auditedQuantity) - parseInt(item.distributedQuantity) <
          deliveryQuantity
        ) {
          this.$modal.msgError(
            //item.itemCode + "发交数量超出（销售数量-已生成出库数量）"
            item.itemCode + "发交数量超出（销售数量-已发交数量）"
          );
          return false;
        }
        data.push(item);
      }
      if (data.length == 0) {
        this.$modal.msgError("请选择");
        return false;
      }
      this.$modal
        .confirm("是否确认生成直送发交单")
        .then(function() {
          that.directDeliveryDialog.loading = true;
          return saveDirectDelivery(data);
        })
        .then(response => {
          if (response.code == 500) {
            this.$modal.msgError(response.msg);
          } else {
            this.$modal.msgSuccess("发交成功");
            this.directDeliveryDialog.open = false;
            this.getList();
          }
        })
        .catch(e => {
          this.$modal.msgError(e);
        })
        .finally(() => (this.directDeliveryDialog.loading = false));
    },
    //远程搜索客户信息
    remoteSearchCustomer(customerName) {
      if (customerName !== '' && this.customerSearchLoading) {
        this.customerSearchLoading = false;
        setTimeout(() => {
          this.customerSearchLoading = true;
          searchCustomerList(customerName).then(response => {
            this.customerList = response.data;
          });
        }, 300);
      } else {
        this.customerList = [];
      }
    },
  }
}
</script>
