export const contact = {
  website: "hosseintalab.ir",
  websiteHref: "https://hosseintalab.ir",
  whatsappDisplay: "+46 70 452 56 46",
  whatsappHref: "https://wa.me/46704525646",
  callDisplay: "+98 938 787 7818",
  callHref: "tel:+989387877818",
  address: "تهران، خیابان خیام شمالی، جنب مترو خیام، ساختمان بازار فرش، طبقه‌ی اول، پلاک ۶۶",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=%D8%AA%D9%87%D8%B1%D8%A7%D9%86%D8%8C%20%D8%AE%DB%8C%D8%A7%D8%A8%D8%A7%D9%86%20%D8%AE%DB%8C%D8%A7%D9%85%20%D8%B4%D9%85%D8%A7%D9%84%DB%8C%D8%8C%20%D8%AC%D9%86%D8%A8%20%D9%85%D8%AA%D8%B1%D9%88%20%D8%AE%DB%8C%D8%A7%D9%85%D8%8C%20%D8%B3%D8%A7%D8%AE%D8%AA%D9%85%D8%A7%D9%86%20%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1%20%D9%81%D8%B1%D8%B4%D8%8C%20%D8%B7%D8%A8%D9%82%D9%87%20%D8%A7%D9%88%D9%84%D8%8C%20%D9%BE%D9%84%D8%A7%DA%A9%2066",
} as const;

export function whatsappProductHref(sku: string) {
  const message = `سلام، برای دریافت اطلاعات و تصاویر کامل فرش با کد ${sku} پیام می‌دهم.`;
  return `${contact.whatsappHref}?text=${encodeURIComponent(message)}`;
}
