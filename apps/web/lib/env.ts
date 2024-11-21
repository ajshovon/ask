export default function getAPIUrl() {
  // unstable_noStore();
  let apiUrl = process.env['NEXT_PUBLIC_WORKER'] || '';

  if (!apiUrl.startsWith('http')) {
    apiUrl = `https://${apiUrl}`;
  }

  return apiUrl;
}
