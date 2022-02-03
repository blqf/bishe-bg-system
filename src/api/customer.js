import request from "@/utils/request";

export function findCustomerList(pageSize = 0, currentPage = 0) {
  return request({
    url: `/api/user?page_size=${pageSize}&current_page=${currentPage}`,
    method: "get",
  });
}

export function findCustomerById(id) {
  return request({
    url: `/api/user/${id}`,
    method: "get",
  });
}

export function addNewCustomer(newCustomerInfo) {
  return request({
    url: "/api/user",
    method: "post",
    data: newCustomerInfo,
  });
}

export function updateCustomer(id, newCustomerInfo) {
  return request({
    url: `/api/user/${id}`,
    method: "put",
    data: newCustomerInfo,
  });
}

export function deleteCustomerById(id) {
  return request({
    url: `/api/user/${id}`,
    method: "delete",
  });
}
