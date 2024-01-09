import Swal from 'sweetalert2';

export function convertISOString(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
export function calculateDaysBetweenDates(date1String, date2String) {
  const date1 = new Date(date1String);
  const date2 = new Date(date2String);

  // Đối tượng hóa ngày để loại bỏ phần thời gian và chỉ giữ lại ngày
  const strippedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const strippedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  // Tính số ngày giữa hai ngày
  const timeDifference = strippedDate2.getTime() - strippedDate1.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

export function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

export function notiSuccess(title) {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: `${title}`,
    showConfirmButton: false,
    timer: 3000,
  });
}

export function notiError(title, content) {
  Swal.fire({
    icon: 'error',
    title: `${title}`,
    text: `${content}`,
  });
}
