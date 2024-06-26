export function ConvertDateToUtc(dateString: string) {
  // Bước 1: Chuyển đổi chuỗi ngày "dd/MM/yyyy" thành đối tượng Date
  const [day, month, year] = dateString.split("/");
  const inputDate = new Date(`${year}-${month}-${day}`);

  // Bước 2: Lấy thời gian hiện tại
  const now = new Date();

  // Bước 3: Cộng thời gian hiện tại vào ngày đầu vào
  const combinedDate = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );

  // Bước 4: Chuyển đổi đối tượng Date đó sang giờ UTC
  const utcDate = new Date(
    combinedDate.getTime() + combinedDate.getTimezoneOffset() * 60000
  );

  // Bước 5: Chuyển đổi lại đối tượng Date từ UTC sang chuỗi định dạng dd/MM/yyyy
  const utcDay = String(utcDate.getUTCDate()).padStart(2, "0");
  const utcMonth = String(utcDate.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const utcYear = utcDate.getUTCFullYear();

  return `${utcDay}/${utcMonth}/${utcYear}`;
}
