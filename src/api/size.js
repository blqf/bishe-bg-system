import request from "@/utils/request";

export function findAllSize() {
  return request({
    url: '/api/size',
    method: "get",
  });
}

export function findSizeById(id) {
  return request({
    url: `/api/size/${id}`,
    method: "get",
  });
}

export function addNewSize(newSizeInfo) {
  return request({
    url: "/api/size",
    method: "post",
    data: newSizeInfo,
  });
}

export function updateSize(id, newSizeInfo) {
  return request({
    url: `/api/size/${id}`,
    method: "put",
    data: newSizeInfo,
  });
}

export function deleteSizeById(id, newSizeInfo) {
  return request({
    url: `/api/size/${id}`,
    method: "delete",
  });
}
