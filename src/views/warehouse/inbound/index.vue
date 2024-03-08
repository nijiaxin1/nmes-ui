<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="入库单单号" prop="inboundNumber">
        <el-input
          v-model="queryParams.inboundNumber"
          placeholder="请输入入库单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联单据号" prop="relatedNumber">
        <el-input
          v-model="queryParams.relatedNumber"
          placeholder="请输入关联单据号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库" prop="warehouseCode">
        <el-select v-model="queryParams.warehouseCode" placeholder="请选择仓库" clearable>
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.warehouseCode"
            :label="warehouse.warehouseName"
            :value="warehouse.warehouseCode"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="结算单" prop="isSettle">
        <el-select v-model="queryParams.isSettle" placeholder="请选择" clearable>
          <el-option key="0" label="未生成" value="0"/>
          <el-option key="1" label="已生成" value="1"/>
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
          v-hasPermi="['warehouse:inbound:add']"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['warehouse:inbound:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['warehouse:inbound:remove']"
              >删除
              </el-button>
            </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['warehouse:inbound:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="inboundList"
              :cell-style="tableCellStyle"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="入库单号" align="center" prop="inboundNumber"/>
      <el-table-column label="入库单类型" align="center" prop="inboundType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.inbound_order_type" :value="scope.row.inboundType"/>
        </template>
      </el-table-column>
      <el-table-column label="关联单据号" align="center" prop="relatedNumber"/>
      <!--      <el-table-column label="仓库代码" align="center" prop="warehouseCode"/>-->
      <el-table-column label="仓库名称" align="center" prop="warehouseName"/>

      <el-table-column label="入库单状态" align="center" prop="state">
        <template slot-scope="scope">
          <span v-if="scope.row.state == '0'">初始化</span>
          <span v-if="scope.row.state == '1'">已完成</span>
        </template>
      </el-table-column>

      <el-table-column label="结算单状态" align="center" prop="isSettle">
        <template slot-scope="scope">
          <span v-if="scope.row.isSettle == '0' &&[ '2'].indexOf( scope.row.inboundType)!=-1">未生成</span>
          <span v-if="scope.row.isSettle == '1' &&[ '2'].indexOf( scope.row.inboundType)!=-1 ">已生成</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createTime"/>
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
            v-if="scope.row.isSettle=='0' && scope.row.inboundType == '2'"
            @click="handleSettleOrder(scope.row)"
            v-hasPermi="['warehouse:outbound:edit']"
          >生成
          </el-button>
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


    <el-dialog title="查看明细" :visible.sync="show" width="1200px" append-to-body>
      <el-card>
        <el-form ref="form" :model="form" :inline="true" label-width="100px">

          <el-form-item label-width="50" label="入库单号" prop="inboundNumber">
            <el-input v-model="form.inboundNumber" placeholder="入库单号" readonly/>
          </el-form-item>

          <el-form-item label-width="50" label="仓库" prop="warehouseCode">
            <el-input v-model="form.warehouseCode" placeholder="仓库" readonly/>
          </el-form-item>

          <el-form-item label-width="50" label="业务类型" prop="inboundType">
            <el-select v-model="form.inboundType" disabled>
              <el-option
                v-for="dict in dict.type.inbound_order_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label-width="50" label="关联单据号" prop="relatedNumber">
            <el-input v-model="form.relatedNumber" placeholder="关联单据号" readonly/>
          </el-form-item>

          <el-table ref="innerTable" row-key="id" :border="true"
                    :data="form.inboundOrderInfoList">
            <el-table-column label="图号" align="center" prop="itemCode"></el-table-column>
            <el-table-column label="库位" align="center" prop="storageSpaceCode"></el-table-column>
            <el-table-column label="入库数量" align="center" prop="inboundQuantity"></el-table-column>
            <el-table-column label="质量状态" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.qualityStatus" placeholder="质量状态" disabled>
                  <el-option
                    v-for="dict in dict.type.quality_status_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="物料名称" align="center" prop="itemName"></el-table-column>
            <el-table-column label="厂家" align="center" prop="supplyName"></el-table-column>
            <el-table-column label="单位" align="center" prop="unit"></el-table-column>
            <el-table-column label="材质" align="center" prop="materialType"></el-table-column>
            <el-table-column label="单价" align="center" prop="effectPrice"></el-table-column>
            <el-table-column label="结算状态" align="center" prop="isSettle" v-if="form.inboundType  == '2'">
              <template slot-scope="scope">
                <span v-if="scope.row.isSettle == '0' &&[ '2'].indexOf( scope.row.inboundType)!=-1">未生成</span>
                <span v-if="scope.row.isSettle == '1' &&[ '2'].indexOf( scope.row.inboundType)!=-1">已生成</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-if="form.inboundType=='2' && scope.row.isSettle=='0'"
                  @click="handleSettleOrderInfo(scope.row)"
                  v-hasPermi="['warehouse:outbound:edit']"
                >生成结算单
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelShow">取 消</el-button>
        </div>
        <div style="display: flex;margin-top: 10px;align-items: flex-end;justify-content: flex-end">
          <div>总计：</div>
          <div>{{ totalMoney }}</div>
        </div>
      </el-card>
    </el-dialog>

    <!-- 添加或修改入库单主表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="100px">
        <el-form-item label-width="50" label="业务类型" prop="warehouseCode">
          <el-select v-model="form.inboundType" placeholder="请输入业务代码" clearable>
            <el-option
              v-for="dict in dict.type.inbound_order_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label-width="50" label="仓库" prop="warehouseCode">
          <el-select
            :disabled="form.inboundType=='1'"
            @change="changeWarehouse($event)" v-model="form.warehouseCode" placeholder="请选择仓库代码" clearable>
            <el-option
              v-for="warehouse in usableWarehouseList"
              :key="warehouse.warehouseCode"
              :label="warehouse.warehouseName"
              :value="warehouse.warehouseCode"
            />
          </el-select>
        </el-form-item>


        <el-form-item label="关联单据号" prop="relatedNumber" v-if="form.inboundType== '1'">
          <el-input v-model="form.relatedNumber" placeholder="请输入关联单据号"/>
        </el-form-item>


        <el-button type="primary" @click="getItems" v-if="form.inboundType=='1'">查询明细</el-button>
        <el-button type="primary" @click="addItem" v-if="form.inboundType=='2'">新增明细</el-button>
        <el-card v-if="outboundOrderInfoList.length > 0">

          <div slot="header">
            <span style="margin-right: 10px">出库列表</span>
            <el-button style="margin-left: 20px;float:right" type="primary" @click="addNewItem">添加到入库明细</el-button>
          </div>


          <el-table ref="outboundTable" row-key="id"
                    :border="true" @selection-change="handleSelectionChangeOutbound" v-loading="loading"
                    :data="outboundOrderInfoList">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="图号" align="center" prop="itemCode"></el-table-column>
            <el-table-column label="物料名称" align="center" prop="itemName"></el-table-column>
            <el-table-column label="质量状态" align="center" prop="qualityStatus">
              <template slot-scope="{row}">
                <span v-if="row.qualityStatus=='0'">待检测</span>
                <span v-if="row.qualityStatus=='1'">合格</span>
                <span v-if="row.qualityStatus=='2'">不合格</span>
              </template>
            </el-table-column>
            <el-table-column label="本次入库数量" width="200">
              <template slot-scope="{row}">
                <el-input-number size="10" v-model="row.inboundQuantity" :min="0"
                                 :max="row.outboundQuantity - row.hasOutboundQuantity"
                                 label="入库数量"></el-input-number>
              </template>
            </el-table-column>

            <el-table-column label="库位" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.storageSpaceCode" filterable @change="changeStorageSpaceO($event,row)"
                           placeholder="请输入库位编码检索">
                  <el-option
                    v-for="dict in storageSpaceList"
                    :key="dict.code"
                    :label="dict.desc"
                    :value="dict.code"
                  ></el-option>
                </el-select>

              </template>
            </el-table-column>

            <el-table-column label="出库数量" align="center" prop="outboundQuantity"></el-table-column>
            <el-table-column label="已出库数量" align="center" prop="hasOutboundQuantity"></el-table-column>
            <el-table-column label="供应商名称" align="center" prop="supplyName"></el-table-column>


          </el-table>
        </el-card>
        <el-card style="margin-top: 10px">
          <div slot="header">
            <span style="margin-right: 10px">入库列表</span>
          </div>

          <el-table ref="innerTable" row-key="id" v-show="form.inboundType=='2'"
                    :border="true" @selection-change="handleSelectionChangeInner" v-loading="loading"
                    :data="form.inboundOrderInfoList">

            <el-table-column type="selection" :reserve-selection="true" width="55" align="center"/>
            <el-table-column label="图号" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.itemCode" filterable remote @change="selectItem($event,row)"
                           :remote-method="remoteSearchItem"
                           placeholder="请输入物料图号检索">
                  <el-option
                    v-for="dict in itemList"
                    :key="dict.code"
                    :label="dict.desc"
                    :value="dict.code"
                  ></el-option>
                </el-select>


              </template>
            </el-table-column>

            <el-table-column label="库位" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.storageSpaceCode" filterable @change="changeStorageSpace($event,row)"
                           placeholder="请输入库位编码检索">
                  <el-option
                    v-for="dict in storageSpaceList"
                    :key="dict.code"
                    :label="dict.desc"
                    :value="dict.code"
                  ></el-option>
                </el-select>

              </template>
            </el-table-column>

            <el-table-column label="入库数量" width="200">
              <template slot-scope="{row}">
                <el-input-number size="10" v-model="row.inboundQuantity" :min="1" :max="10000"
                                 label="入库数量"></el-input-number>
              </template>
            </el-table-column>

            <el-table-column label="质量状态" align="center">
              <template slot-scope="{row}">
                <el-select v-model="row.qualityStatus" placeholder="质量状态" clearable>
                  <el-option
                    v-for="dict in dict.type.quality_status_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </template>
            </el-table-column>


            <el-table-column label="物料名称" align="center" prop="itemName">
            </el-table-column>

            <el-table-column label="供应商" align="center" prop="supplyId">
              <template slot-scope="{row}">
                <el-select v-model="row.supplyId" filterable @change="selectSupply($event,row)"
                           :remote-method="getCustomerInfos" remote
                           placeholder="请输供应商名称">
                  <el-option
                    v-for="customerInfo in customerInfoList"
                    :key=" customerInfo.id"
                    :label=" customerInfo.customerName"
                    :value=" customerInfo.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteRow(scope.row)"
                  v-hasPermi="['warehouse:outbound:edit']"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>


          <el-table ref="innerTable1" row-key="id" v-show="form.inboundType=='1'"
                    :border="true" @selection-change="handleSelectionChangeInner" v-loading="loading"
                    :data="form.inboundOrderInfoList">

            <el-table-column label="图号" align="center" prop="itemCode">

            </el-table-column>

            <el-table-column label="库位" align="center" prop="storageSpaceCode">
            </el-table-column>

            <el-table-column label="入库数量" width="200" prop="inboundQuantity">
            </el-table-column>

            <el-table-column label="质量状态" align="center">
              <template slot-scope="{row}">
                <span v-if="row.qualityStatus=='0'">待检测</span>
                <span v-if="row.qualityStatus=='1'">合格</span>
                <span v-if="row.qualityStatus=='2'">不合格</span>
              </template>
            </el-table-column>


            <el-table-column label="物料名称" align="center" prop="itemName">
            </el-table-column>

            <el-table-column label="供应商名称" align="center" prop="supplyId">

            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteRowA(scope.row)"
                  v-hasPermi="['warehouse:outbound:edit']"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
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
  listInbound,
  getInbound,
  getInboundByRelatedNumber,
  delInbound,
  addInbound,
  updateInbound,
  updateOrderSettle
} from "@/api/warehouse/inbound";
import {
  getOutboundOrder
} from "@/api/warehouse/outbound";

import {listAllWarehouse} from "@/api/warehouse/warehouse";
import {searchItemInfoList, searchStorageSpaceList} from '@/api/enumsSelect';
import {listAllBaseCustomerInfo} from '@/api/base/baseCustomerInfo'
import Math from '@/utils/math.js'

export default {
  name: "Inbound",
  dicts: ['inbound_order_type', 'quality_status_type'],
  data() {
    return {
      totalMoney: 0,
      isCircul: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      outboundIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      itemSearchLoading: true,
      warehouseCodeLoading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 入库单主表表格数据
      inboundList: [],
      outboundOrderInfoList: [],
      warehouseList: [],
      storageSpaceList: [],
      itemList: [],
      customerInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      show: false,
      addOrShow: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inboundNumber: null,
        inboundType: null,
        relatedNumber: null,
        warehouseCode: null,
        warehouseName: null,
        state: null,
        createTimeStart: null,
        createTimeEnd: null
      },
      // 表单参数
      form: {
        inboundOrderInfoList: []
      },
      // 表单校验
      rules: {}
    };
  },
  computed: {

    usableWarehouseList() {
      let list = []
      //流转
      if (this.form.inboundType == '1') {
        list = this.warehouseList
      }
      //采购
      if (this.form.inboundType == '2') {
        this.warehouseList.forEach(
          warehouse => {
            if (warehouse.warehouseType == '5') {
              list.push(warehouse)
            }
          }
        )
      }
      return list;
    }
  },
  created() {
    this.getList();
    this.getWarehouses();
    // this.getCustomerInfos()
  },
  methods: {
    tableCellStyle(row, rowIndex) {
      if (row.row.inboundType == '2' && row.row.isSettle == '0') {
        return 'background-color:#ffba00'
      } else if (row.row.inboundType == '2' && row.row.isSettle == '1') {
        return 'background-color:#e8f4ff'
      }
    },
    deleteRowA(row) {
      let number = this.form.inboundOrderInfoList.indexOf(row);
      if (number >= 0) {
        this.form.inboundOrderInfoList.splice(number, 1)
      }
      //在
      this.outboundOrderInfoList.forEach(outboundOrderInfo => {
        if (outboundOrderInfo.id == row.id) {
          outboundOrderInfo.hasOutboundQuantity = outboundOrderInfo.hasOutboundQuantity - row.inboundQuantity
        }
      });
    },
    deleteRow(row) {
      let number = this.form.inboundOrderInfoList.indexOf(row);
      if (number >= 0) {
        this.form.inboundOrderInfoList.splice(number, 1)
      }
      console.log(number)
    },
    handleSettleOrder(row) {
      //结算
      updateOrderSettle(row).then(response => {
        this.getList();
      });
    },
    handleSettleOrderInfo(row) {
      // this.form.outboundOrderInfoList = []
      let obj = {
        id: this.form.id,
        inboundNumber: this.form.outboundNumber,
        inboundOrderInfoList: []
      }

      obj.inboundOrderInfoList.push(row);

      //结算
      updateOrderSettle(obj).then(response => {
        this.getList();
        row.isSettle = '1';
      });

    },
    getCustomerInfos(supplyName) {
      if (supplyName !== '') {
        setTimeout(() => {
          this.itemSearchLoading = true;
          listAllBaseCustomerInfo({customerName: supplyName}).then(response => {
            this.customerInfoList = response.rows;
          });
        }, 300);

      } else {
        this.customerInfoList = [];
      }
      // listAllBaseCustomerInfo({}).then(res => {
      //
      //   this.customerInfoList = res.rows;
      //   this.loading = false;
      // })
    },
    changeStorageSpace(event, item) {
      this.storageSpaceList.forEach(sp => {
        if (sp.code == event) {
          item.storageSpaceName = sp.desc
        }
      })
    },
    changeStorageSpaceO(event, item) {
      this.storageSpaceList.forEach(sp => {
        if (sp.code == event) {
          item.storageSpaceName = sp.desc
        }
      })
    },
    selectSupply(event, item) {
      this.customerInfoList.forEach(customerInfo => {
        if (customerInfo.id == event) {
          item.supplyName = customerInfo.customerName
        }
      })
    },

    selectItem(event, item) {
      //反找到
      this.itemList.forEach(it => {

        if (it.code == event) {
          item.itemInfoId = it.code
          item.itemCode = it.desc
          item.parentItemCode = it.parentItemCode
          item.itemName = it.itemName
          // item.supplyId = it.supplyId
          // item.supplyName = it.supplyName
        }
      })
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
    remoteSearchItem(itemCode) {
      if (itemCode !== '' && this.itemSearchLoading) {
        this.itemSearchLoading = false;
        setTimeout(() => {
          this.itemSearchLoading = true;
          searchItemInfoList(itemCode).then(response => {
            this.itemList = response.data;
            //这个地方还要名字 和 供应商
            console.log(this.itemList)
          });
        }, 300);
      } else {
        this.itemList = [];
      }
    },
    getWarehouses() {
      listAllWarehouse().then(response => {
        this.warehouseList = response.rows;
      });
    },
    /** 查询入库单主表列表 */
    getList() {
      this.loading = true;
      listInbound(this.queryParams).then(response => {
        this.inboundList = response.rows;
        //遍历总量
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelShow() {
      this.show = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.outboundOrderInfoList = []
      this.form = {
        id: null,
        inboundNumber: null,
        inboundType: null,
        relatedNumber: null,
        warehouseCode: null,
        warehouseName: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        inboundOrderInfoList: []
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
      this.queryParams.createTimeEnd = null;
      this.queryParams.createTimeStart = null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleSelectionChangeInner(selection) {

    },
    handleSelectionChangeOutbound(selection) {
      this.outboundIds = selection.map(item => item.id)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加入库单主表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInbound(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看入库单明细";
      });
    },
    showDetail(row) {
      this.reset();
      const id = row.id || this.ids
      getInbound(id).then(response => {

        this.form = response.data;
        let sum = 0;
        if (this.form.inboundOrderInfoList != null && this.form.inboundOrderInfoList.length > 0) {

          this.form.inboundOrderInfoList.forEach(inboundOrderInfo => {
            sum = Math.add(sum, Math.multiply(inboundOrderInfo.effectPrice, inboundOrderInfo.inboundQuantity));
          })
        }
        this.totalMoney = sum

        this.show = true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInbound(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let inboundTypes = ['0', '2'];
            if (this.form.inboundOrderInfoList.size <= 0) {
              this.$modal.msgSuccess("未添加入库明细!!!");
              return;
            }
            let canAdd = true;
            this.form.inboundOrderInfoList.forEach(inboundOrderInfo => {
              if (inboundOrderInfo.itemCode == undefined || inboundOrderInfo.itemCode == null || inboundOrderInfo.itemCode == '') {
                canAdd = false;
                return;
              }

              if (inboundOrderInfo.storageSpaceCode == undefined || inboundOrderInfo.storageSpaceCode == null || inboundOrderInfo.storageSpaceCode == '') {
                canAdd = false;
                return;
              }

              if (inboundOrderInfo.inboundQuantity <= 0) {
                canAdd = false;
                return;
              }

              if (inboundTypes.indexOf(this.form.inboundType)) {
                if (inboundOrderInfo.supplyId == undefined || inboundOrderInfo.supplyId == null || inboundOrderInfo.supplyId == '') {
                  canAdd = false;
                  return;
                }
              }
            })

            if (!canAdd) {
              this.$modal.msgSuccess("入库明细详细数据出错!!!");
              return;
            }

            addInbound(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              // console.log(this.form)
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除入库单主表编号为"' + ids + '"的数据项？').then(function () {
        return delInbound(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('warehouse/inbound/export', {
        ...this.queryParams
      }, `inbound_${new Date().getTime()}.xlsx`)
    },
    addNewItem() {
      if (this.outboundIds == null || this.outboundIds == undefined || this.outboundIds.length == 0) {
        return this.$modal.msgError("没有选中入库明细!!!");
      }

      let hadInbound = this.form.inboundOrderInfoList.length > 0

      let canAdd = true;

      this.outboundOrderInfoList.forEach(outboundOrderInfo => {
        let id = outboundOrderInfo.id;

        if (this.outboundIds.includes(id)) {
          //判断入库数量大于0
          if (outboundOrderInfo.inboundQuantity > 0) {
            //判断入库数量 + 已入库数量大于0  这个地方就做了判断了
            if (outboundOrderInfo.inboundQuantity + outboundOrderInfo.hasOutboundQuantity > outboundOrderInfo.outboundQuantity) {
              canAdd = false;
            }
          } else {
            canAdd = false;
          }
          if (outboundOrderInfo.storageSpaceCode == null || outboundOrderInfo.storageSpaceCode == '') {
            canAdd = false;
          }
        }
      })
      if (!canAdd) {
        return this.$modal.msgError("入库数据不正确!!!");
      }

      this.outboundOrderInfoList.forEach(outboundOrderInfo => {
        let id = outboundOrderInfo.id;

        if (this.outboundIds.includes(id)) {
          //生成入库数据
          let row = {
            id: outboundOrderInfo.id,
            itemCode: outboundOrderInfo.itemCode,
            storageSpaceCode: outboundOrderInfo.storageSpaceCode,
            storageSpaceName: outboundOrderInfo.storageSpaceName,
            inboundQuantity: outboundOrderInfo.inboundQuantity,
            qualityStatus: outboundOrderInfo.qualityStatus,
            itemName: outboundOrderInfo.itemName,
            supplyId: outboundOrderInfo.supplyId,
            supplyName: outboundOrderInfo.supplyName,
            itemInfoId: outboundOrderInfo.itemInfoId
          }
          outboundOrderInfo.hasOutboundQuantity = outboundOrderInfo.inboundQuantity + outboundOrderInfo.hasOutboundQuantity
          outboundOrderInfo.storageSpaceCode = null;
          outboundOrderInfo.storageSpaceName = null;
          outboundOrderInfo.inboundQuantity = 0;

          //对比是否有重复的 有的话直接增加数量
          if (hadInbound) {
            this.form.inboundOrderInfoList.forEach(inboundOrderInfo => {
              //相同id
              if (inboundOrderInfo.id == row.id
                && inboundOrderInfo.itemCode == row.itemCode
                && inboundOrderInfo.qualityStatus == row.qualityStatus
                && inboundOrderInfo.supplyId == row.supplyId
                && inboundOrderInfo.storageSpaceCode == row.storageSpaceCode
              ) {
                //数量增加
                inboundOrderInfo.inboundQuantity = inboundOrderInfo.inboundQuantity + row.inboundQuantity

              } else {
                this.form.inboundOrderInfoList.push(row)
              }
            })
          } else {
            this.form.inboundOrderInfoList.push(row)
          }

        }
      })

    },
    addItem() {

      let row = {
        itemCode: '',
        storageSpaceCode: '',
        inboundQuantity: '',
        qualityStatus: '1',
        itemName: '',
        supplyId: '',
        supplyName: ''
      }
      this.form.inboundOrderInfoList.push(row)
    }, getItems() {
      this.outboundOrderInfoList = []
      this.form.inboundOrderInfoList = []
      //根据需求查询流转单据
      let relatedNumber = this.form.relatedNumber
      if (relatedNumber == null || relatedNumber == "") {
        this.$modal.msgSuccess("先输入关联出库单号!!!");

        return;
      }
      getOutboundOrder({outboundNumber: relatedNumber}).then(response => {
          this.form.warehouseCode = response.data.destinationCode
          this.form.warehouseName = response.data.destinationName
          //原本的库位不要了
          this.outboundOrderInfoList = response.data.outboundOrderInfoList;
          this.outboundOrderInfoList.forEach(outboundOrderInfo => {
            outboundOrderInfo.storageSpaceCode = null;
            outboundOrderInfo.storageSpaceName = null;
          })
          //查询库位
          this.changeWarehouse(this.form.warehouseCode);

          this.open = true;
          this.title = "创建入库单";
        }
      )
    }
  }
};
</script>
