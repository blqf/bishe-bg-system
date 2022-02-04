import request from "@/utils/request";

export function findCurrentOrderList(pageSize = 0, currentPage = 0) {
  return request({
    url: `/api/current_order?page_size=${pageSize}&current_page=${currentPage}`,
    method: "get",
  });
}

export function deleteCurrentOrderById(id) {
  return request({
    url: `/api/current_order/${id}`,
    method: "delete",
  });
}
