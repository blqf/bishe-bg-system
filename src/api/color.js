import request from "@/utils/request";

export function findAllColors() {
  return request({
    url: "/api/colors",
    method: "get",
  });
}

export function findColorById(id) {
  return request({
    url: `/api/colors/${id}`,
    method: "get",
  });
}

export function addNewColor(newColorInfo) {
  return request({
    url: "/api/colors",
    method: "post",
    data: newColorInfo,
  });
}

export function updateColor(id, newColorInfo) {
  return request({
    url: `/api/colors/${id}`,
    method: "put",
    data: newColorInfo,
  });
}

export function deleteColorById(id, newColorInfo) {
  return request({
    url: `/api/colors/${id}`,
    method: "delete",
  });
}
