const countryMap = {
  AF: "افغانستان",
  AX: "Åland",
  AL: "Shqipëri",
  DZ: "الجزائر",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Հայաստան",
  AW: "Aruba",
  AU: "Australia",
  AT: "Österreich",
  AZ: "Azərbaycan",
  BS: "Bahamas",
  BH: "البحرين",
  BD: "বাংলাদেশ",
  BB: "Barbados",
  BY: "Беларусь",
  BE: "België",
  BZ: "Belize",
  BJ: "Bénin",
  BM: "Bermuda",
  BT: "འབྲུག",
  BO: "Bolivia",
  BA: "Bosna i Hercegovina",
  BW: "Botswana",
  BV: "Bouvetøya",
  BR: "Brasil",
  IO: "British Indian Ocean Territory",
  BN: "Negara Brunei Darussalam",
  BG: "България",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "កម្ពុជា",
  CM: "Cameroun",
  CA: "Canada",
  CV: "Cabo Verde",
  KY: "Cayman Islands",
  CF: "République centrafricaine",
  TD: "تشاد",
  CL: "Chile",
  CN: "中国",
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands",
  CO: "Colombia",
  KM: "Komori",
  CG: "Congo",
  CD: "République démocratique du Congo",
  CK: "Cook Islands",
  CR: "Costa Rica",
  CI: "Côte d'Ivoire",
  HR: "Hrvatska",
  CU: "Cuba",
  CY: "Κύπρος",
  CZ: "Česká republika",
  DK: "Danmark",
  DJ: "جيبوتي",
  DM: "Dominica",
  DO: "República Dominicana",
  EC: "Ecuador",
  EG: "مصر",
  SV: "El Salvador",
  GQ: "Guinea Ecuatorial",
  ER: "ኤርትራ",
  EE: "Eesti",
  ET: "ኢትዮጵያ",
  FK: "Falkland Islands (Malvinas)",
  FO: "Føroyar",
  FJ: "Fiji",
  FI: "Suomi",
  FR: "France",
  GF: "Guyane française",
  PF: "Polynésie française",
  TF: "Terres australes françaises",
  GA: "Gabon",
  GM: "Gambia",
  GE: "საქართველო",
  DE: "Deutschland",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Ελλάδα",
  GL: "Kalaallit Nunaat",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinée",
  GW: "Guiné-Bissau",
  GY: "Guyana",
  HT: "Haïti",
  HM: "Heard Island and McDonald Islands",
  VA: "Città del Vaticano",
  HN: "Honduras",
  HK: "香港",
  HU: "Magyarország",
  IS: "Ísland",
  IN: "भारत",
  ID: "Indonesia",
  IR: "ایران",
  IQ: "العراق",
  IE: "Éire",
  IM: "Isle of Man",
  IL: "ישראל",
  IT: "Italia",
  JM: "Jamaica",
  JP: "日本",
  JE: "Jersey",
  JO: "الأردن",
  KZ: "Қазақстан",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "조선민주주의인민공화국",
  KR: "대한민국",
  KW: "الكويت",
  KG: "Кыргызстан",
  LA: "ສປປລາວ",
  LV: "Latvija",
  LB: "لبنان",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "ليبيا",
  LI: "Liechtenstein",
  LT: "Lietuva",
  LU: "Luxembourg",
  MO: "澳門",
  MK: "Македонија",
  MG: "Madagasikara",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "ދިވެހިރާއްޖެ",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "موريتانيا",
  MU: "Maurice",
  YT: "Mayotte",
  MX: "México",
  FM: "Micronesia, Federated States of",
  MD: "Republica Moldova",
  MC: "Monaco",
  MN: "Монгол улс",
  MS: "Montserrat",
  MA: "المغرب",
  MZ: "Moçambique",
  MM: "မြန်မာ",
  NA: "Namibia",
  NR: "Nauru",
  NP: "नेपाल",
  NL: "Nederland",
  AN: "Netherlands Antilles",
  NC: "Nouvelle-Calédonie",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MP: "Northern Mariana Islands",
  NO: "Norge",
  OM: "عمان",
  PK: "پاکستان",
  PW: "Palau",
  PS: "فلسطين",
  PA: "Panamá",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Perú",
  PH: "Pilipinas",
  PN: "Pitcairn",
  PL: "Polska",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "قطر",
  RE: "La Réunion",
  RO: "România",
  RU: "Россия",
  RW: "Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  PM: "Saint-Pierre-et-Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé e Príncipe",
  SA: "المملكة العربية السعودية",
  SN: "Sénégal",
  CS: "Србија и Црна Гора",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapura",
  SK: "Slovensko",
  SI: "Slovenija",
  SB: "Solomon Islands",
  SO: "Soomaaliya",
  ZA: "South Africa",
  GS: "South Georgia and the South Sandwich Islands",
  ES: "España",
  LK: "ශ්‍රී ලංකාව",
  SD: "السودان",
  SR: "Suriname",
  SJ: "Svalbard og Jan Mayen",
  SZ: "eSwatini",
  SE: "Sverige",
  CH: "Schweiz",
  SY: "سوريا",
  TW: "台灣",
  TJ: "Тоҷикистон",
  TZ: "Tanzania",
  TH: "ประเทศไทย",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "تونس",
  TR: "Türkiye",
  TM: "Türkmenistan",
  TC: "Turks and Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Україна",
  AE: "الإمارات العربية المتحدة",
  GB: "United Kingdom",
  US: "United States",
  UM: "United States Minor Outlying Islands",
  UY: "Uruguay",
  UZ: "Oʻzbekiston",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Việt Nam",
  VG: "British Virgin Islands",
  VI: "U.S. Virgin Islands",
  WF: "Wallis et Futuna",
  EH: "الصحراء الغربية",
  YE: "اليمن",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

export default countryMap;