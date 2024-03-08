import request from '@/utils/request'

const api_name = 'enumsSelect'

//获取当天日期字符串
export function getNowDateStr() {
  var date = new Date();

// 获取年、月、日
  var year = date.getFullYear(); // 四位数表示的完整年份（如2019）
  var month = date.getMonth() + 1; // 从0开始计算月份，所以需要加1（如3表示三月）
  var day = date.getDate(); // 获取当前日期（如5表示第五天）

// 将年、月、日转换为两位数格式并连接起来形成日期字符串
  return  year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}

//获取当天日期字符串
export function getBeforeMonthDateStr(i) {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - i);
  //const oneMonthAgo = currentDate.toDateString(); // 获取一个月前当前日期
// 获取年、月、日
  var year = currentDate.getFullYear(); // 四位数表示的完整年份（如2019）
  var month = currentDate.getMonth() + 1; // 从0开始计算月份，所以需要加1（如3表示三月）
  var day = currentDate.getDate(); // 获取当前日期（如5表示第五天）

// 将年、月、日转换为两位数格式并连接起来形成日期字符串
  return  year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}
//获取月份
export function getMonthDateStr(i) {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - i);
  //const oneMonthAgo = currentDate.toDateString(); // 获取一个月前当前日期
// 获取年、月、日
  var year = currentDate.getFullYear(); // 四位数表示的完整年份（如2019）
  var month = currentDate.getMonth() + 1; // 从0开始计算月份，所以需要加1（如3表示三月）
  var day = currentDate.getDate(); // 获取当前日期（如5表示第五天）

// 将年、月、日转换为两位数格式并连接起来形成日期字符串
  return  year + '-' + (month < 10 ? '0' : '') + month;
}

// 是否选择下拉
export function getYesOrNo() {
  return request({
    url: `/${api_name}/getYesOrNo`,
    method: 'get'
  })
}

// 设备状态
export function getEquipmentStatus() {
  return request({
    url: `/${api_name}/getEquipmentStatus`,
    method: 'get'
  })
}

// 设备类型
export function getEquipmentType() {
  return request({
    url: `/${api_name}/getEquipmentType`,
    method: 'get'
  })
}

// 个人计划状态
export function getPlanPersonalStatusList() {
  return request({
    url: `/${api_name}/getPlanPersonalStatusList`,
    method: 'get'
  })
}

// 物料类型
export function getItemType() {
  return request({
    url: `/${api_name}/getItemType`,
    method: 'get'
  })
}

// 物料拣货方式
export function getItemPickType() {
  return request({
    url: `/${api_name}/getItemPickType`,
    method: 'get'
  })
}

// 物料远程搜索
export function searchItemList(itemCode) {
  return request({
    url: `/${api_name}/searchItemList/` + itemCode,
    method: 'get'
  })
}
// 工艺远程搜索
export function searchTechnologyListByItem(itemId) {
  return request({
    url: `/${api_name}/searchTechnologyListByItem/`+itemId,
    method: 'get'
  })
}

// 物料远程搜索
export function searchItemInfoList(itemCode) {
  return request({
    url: `/${api_name}/searchItemInfoList/` + itemCode,
    method: 'get'
  })
}

// 货位远程搜索
export function searchStorageSpaceList(warehouseCode) {
  return request({
    url: `/${api_name}/searchStorageSpaceList/` + warehouseCode,
    method: 'get'
  })
}


// 工艺远程搜索
export function searchTechnologyList(technologyCode) {
  return request({
    url: `/${api_name}/searchTechnologyList/` + technologyCode,
    method: 'get'
  })
}
// 工艺远程搜索
export function searchTechnologyList2() {
  return request({
    url: `/${api_name}/searchTechnologyList`,
    method: 'get'
  })
}

// 获取工序列表
export function getProcessesList() {
  return request({
    url: `/${api_name}/getProcessesList`,
    method: 'get'
  })
}
// 获取工序列表
export function getProcessesListByTechnology(technologyId) {
  return request({
    url: `/${api_name}/getProcessesListByTechnology/` + technologyId,
    method: 'get'
  })
}

// 获取外来需求计划状态列表
export function getPlanExternalDemandStatus() {
  return request({
    url: `/${api_name}/getPlanExternalDemandStatus`,
    method: 'get'
  })
}
// 获取外来铸造计划状态列表
export function getPlanExternalFoundryStatus() {
  return request({
    url: `/${api_name}/getPlanExternalFoundryStatus`,
    method: 'get'
  })
}
// 获取销售计划状态列表
export function getSalePlanStatus() {
  return request({
    url: `/${api_name}/getSalePlanStatus`,
    method: 'get'
  })
}

// 获取设备列表
export function getEquipmentListByProcesses(processesId) {
  return request({
    url: `/${api_name}/getEquipmentListByProcesses/` + processesId,
    method: 'get'
  })
}
// 获取设备列表
export function getEquipmentList() {
  return request({
    url: `/${api_name}/getEquipmentList`,
    method: 'get'
  })
}

// 获取班次列表
export function getWorkScheduleClassList() {
  return request({
    url: `/${api_name}/getWorkScheduleClassList`,
    method: 'get'
  })
}

// 获取班组列表
export function getWorkTeamList() {
  return request({
    url: `/${api_name}/getWorkTeamList`,
    method: 'get'
  })
}

// 根据班组获取组员列表
export function getWorkMemberListByTeam(teamId) {
  return request({
    url: `/${api_name}/getWorkMemberListByTeam/` + teamId,
    method: 'get'
  })
}
// 根据名称模糊查询用户信息数据
export function searchUserListByName(userName) {
  return request({
    url: `/${api_name}/getUserListByName/` + userName,
    method: 'get'
  })
}
// 根据班组获取组员列表
export function searchMemberList(memberName) {
  return request({
    url: `/${api_name}/getMemberListByName/` + memberName,
    method: 'get'
  })
}
// 根据客户简称查询
export function searchCustomerList(customerName) {
  return request({
    url: `/${api_name}/searchCustomerList/` + customerName,
    method: 'get'
  })
}


// 获取财务合同状态
export function getFinanceContractStatus() {
  return request({
    url: `/${api_name}/getFinanceContractStatus`,
    method: 'get'
  })
}
// 获取财务合同类型
export function getFinanceContractType() {
  return request({
    url: `/${api_name}/getFinanceContractType`,
    method: 'get'
  })
}
// 获取财务结算类型
export function getFinanceSettlementType() {
  return request({
    url: `/${api_name}/getFinanceSettlementType`,
    method: 'get'
  })
}
// 获取财务结算状态
export function getFinanceSettlementStatus() {
  return request({
    url: `/${api_name}/getFinanceSettlementStatus`,
    method: 'get'
  })
}

//器具码动作
export function getUtensilCodeActionList() {
  return request({
    url: `/${api_name}/getUtensilCodeActionList`,
    method: 'get'
  })
}
