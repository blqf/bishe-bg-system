import request from "@/utils/request";

export function findStoreInfo() {
  return request({
    url: "/api/store_info",
    method: "get",
  });
}

export function updateStoreInfo(newStoreInfo) {
  return request({
    url: "/api/store_info",
    method: "put",
    data: newStoreInfo,
  });
}
