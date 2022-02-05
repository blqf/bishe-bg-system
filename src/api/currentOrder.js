import request from "@/utils/request";

// 获取订单列表
export function findCurrentOrderList(pageSize = 0, currentPage = 0) {
  return request({
    url: `/api/current_order?page_size=${pageSize}&current_page=${currentPage}`,
    method: "get",
  });
}

// 完成订单
export function finishCurrentOrderById(id, data) {
  return request({
    url: `/api/current_order/${id}`,
    method: "post",
    data,
  });
}

// 删除订单
export function deleteCurrentOrderById(id) {
  return request({
    url: `/api/current_order/${id}`,
    method: "delete",
  });
}

// 添加订单
export function addCurrentOrder(data) {
  return request({
    url: `/api/current_order`,
    method: "post",
    data,
  });
}
