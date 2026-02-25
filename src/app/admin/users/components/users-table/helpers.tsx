export function getInitials(firstName: string, lastName: string): string {
  return `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
