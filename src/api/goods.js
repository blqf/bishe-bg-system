import request from "@/utils/request";

export function findGoodsList(pageSize = 0, currentPage = 0) {
  return request({
    url: `/api/goods?page_size=${pageSize}&current_page=${currentPage}`,
    method: "get",
  });
}

export function findGoodsById(id) {
  return request({
    url: `/api/goods/${id}`,
    method: "get",
  });
}

export function addNewGoods(newGoodsInfo) {
  return request({
    url: "/api/goods",
    method: "post",
    data: newGoodsInfo,
  });
}

export function updateGoods(id, newGoodsInfo) {
  return request({
    url: `/api/goods/${id}`,
    method: "put",
    data: newGoodsInfo,
  });
}

export function deleteGoodsById(id) {
  return request({
    url: `/api/goods/${id}`,
    method: "delete",
  });
}
