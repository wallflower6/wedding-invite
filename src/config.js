// ============================================================
// CONFIG — edit this file to customise the invitation.
// Everything on the page reads from here.
// ============================================================
export const CONFIG = {
  namesEn: 'Andrea Gangemi & Lindy Lim Li Wen',
  namesCn: '王偉明 · 林丽雯',
  footerNames: 'Andrea Gangemi & Lindy Lim Li Wen',
  heroNames: 'Andrea Gangemi · Lindy Lim Li Wen',

  dateEn: 'Saturday, January 23, 2027',
  dateCn: '農曆 二〇二六年 十一月十四日 星期六',
  rsvpDeadline: 'December 1, 2026',

  storyEn:
    "From a chance meeting to a lifetime promise — we're so happy to finally celebrate this new chapter with the people who mean the most to us. Your presence would make our day complete.",
  storyCn: '從相遇到相守，感謝一路陪伴的你們。誠邀您見證我們人生中最重要的時刻。',

  venueNameCn: '大港 (Pavillion Bukit Jalil)',
  venueNameEn: 'Grand Harbour Restaurant, Pavillion Bukit Jalil',
  venueAddress: 'Lot 5.86.00, Level 5 Pavilion Bukit Jalil Mall No 2, Persiaran Jalil 8 Bandar, Bukit Jalil, 57000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
  venueMapUrl: 'https://maps.app.goo.gl/xEuoWYPsP82fiHPu6',

  events: [
    // { time: '10:00', cn: '迎親 · 敲門', en: "Door games & the groom's procession" },
    // { time: '11:30', cn: '茶禮', en: 'Tea ceremony with both families' },
    { time: '17:00', cn: '茶礼', en: 'Tea ceremony with family' },
    { time: '18:30', cn: '婚宴開始', en: 'Banquet begins' },
    // { time: '20:00', cn: '敬酒', en: 'Toasting & table rounds' },
    { time: '21:30', cn: '送客', en: 'End' },
  ],

  // A unique key namespace so this invitation's RSVPs don't collide
  // with any other invitation built from this template.
  storageNamespace: 'wedding-wm-ml-2026',

  // Simple gate on the host/guest-list view — not high security (it
  // ships in the built JS bundle, so anyone who really wants to can
  // find it), but stops guests from casually tapping into it.
  // Set to "" to disable the prompt entirely.
  hostPasscode: 'double-happiness',
}
