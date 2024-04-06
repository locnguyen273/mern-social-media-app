export const GLOBAL_TYPES = {
  AUTH: "AUTH",
  ALERT: "ALERT",
  THEME: "THEME",
  STATUS: "STATUS",
  MODAL: "MODAL",
  USER_TYPE: "USER_TYPE",
  SOCKET: "SOCKET",
  USER_INFO: "USER_INFO",
};

export const EditData = (data, id, post) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return newData;
};

export const DeleteData = (data, id) => {
  const newData = data.filter((item) => item._id !== id);
  return newData;
};