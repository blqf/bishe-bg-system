import request from "@/utils/request";

export function findCommentList(pageSize = 0, currentPage = 0) {
  return request({
    url: `/api/comment?page_size=${pageSize}&current_page=${currentPage}`,
    method: "get",
  });
}

export function deleteCommentById(id) {
  return request({
    url: `/api/comment/${id}`,
    method: "delete",
  });
}
