// generate-data.mjs
// Usage: node generate-data.mjs
// Fetches real SVG shapes from Mapsicon (djaiss/mapsicon on GitHub)
// No npm dependencies needed — uses Node.js built-in fetch (Node 18+)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Compact country/territory data ──
// Format: [name, isoAlpha2, lat, lng, difficulty]
// difficulty: 1=easy, 2=medium, 3=hard
const COUNTRY_META = [
  // ── TIER 1: Easy (well-known world powers & major countries) ──
  ["United States", "us", 37.0902, -95.7129, 1],
  ["Canada", "ca", 56.1304, -106.3468, 1],
  ["Mexico", "mx", 23.6345, -102.5528, 1],
  ["Brazil", "br", -14.2350, -51.9253, 1],
  ["Argentina", "ar", -38.4161, -63.6167, 1],
  ["United Kingdom", "gb", 55.3781, -3.4360, 1],
  ["France", "fr", 46.6034, 1.8883, 1],
  ["Germany", "de", 51.1657, 10.4515, 1],
  ["Italy", "it", 41.8719, 12.5674, 1],
  ["Spain", "es", 40.4637, -3.7492, 1],
  ["Portugal", "pt", 39.3999, -8.2245, 1],
  ["Russia", "ru", 61.5240, 105.3188, 1],
  ["China", "cn", 35.8617, 104.1954, 1],
  ["India", "in", 20.5937, 78.9629, 1],
  ["Japan", "jp", 36.2048, 138.2529, 1],
  ["South Korea", "kr", 35.9078, 127.7669, 1],
  ["Australia", "au", -25.2744, 133.7751, 1],
  ["South Africa", "za", -30.5595, 22.9375, 1],
  ["Egypt", "eg", 26.8206, 30.8025, 1],
  ["Nigeria", "ng", 9.0820, 8.6753, 1],
  ["Saudi Arabia", "sa", 23.8859, 45.0792, 1],
  ["Turkey", "tr", 38.9637, 35.2433, 1],
  ["Indonesia", "id", -0.7893, 113.9213, 1],
  ["Thailand", "th", 15.8700, 100.9925, 1],
  ["Vietnam", "vn", 14.0583, 108.2772, 1],
  ["Switzerland", "ch", 46.8182, 8.2275, 1],
  ["Netherlands", "nl", 52.1326, 5.2913, 1],
  ["Sweden", "se", 60.1282, 18.6435, 1],
  ["Norway", "no", 60.4720, 8.4689, 1],
  ["Greece", "gr", 39.0742, 21.8243, 1],

  // ── TIER 2: Medium (recognizable but less prominent) ──
  ["Colombia", "co", 4.5709, -74.2973, 2],
  ["Chile", "cl", -35.6751, -71.5430, 2],
  ["Peru", "pe", -9.1900, -75.0152, 2],
  ["Venezuela", "ve", 6.4238, -66.5897, 2],
  ["Cuba", "cu", 21.5218, -77.7812, 2],
  ["Dominican Republic", "do", 18.7357, -70.1627, 2],
  ["Puerto Rico", "pr", 18.2208, -66.5901, 2],
  ["Belgium", "be", 50.5039, 4.4699, 2],
  ["Austria", "at", 47.5162, 14.5501, 2],
  ["Poland", "pl", 51.9194, 19.1451, 2],
  ["Czech Republic", "cz", 49.8175, 15.4730, 2],
  ["Hungary", "hu", 47.1625, 19.5033, 2],
  ["Romania", "ro", 45.9432, 24.9668, 2],
  ["Bulgaria", "bg", 42.7339, 25.4858, 2],
  ["Serbia", "rs", 44.0165, 21.0059, 2],
  ["Croatia", "hr", 45.1000, 15.2000, 2],
  ["Denmark", "dk", 56.2639, 9.5018, 2],
  ["Finland", "fi", 61.9241, 25.7482, 2],
  ["Iceland", "is", 64.9631, -19.0208, 2],
  ["Ireland", "ie", 53.1424, -7.6921, 2],
  ["New Zealand", "nz", -40.9006, 174.8860, 2],
  ["Philippines", "ph", 12.8797, 121.7740, 2],
  ["Malaysia", "my", 4.2105, 101.9758, 2],
  ["Singapore", "sg", 1.3521, 103.8198, 2],
  ["Bangladesh", "bd", 23.6850, 90.3563, 2],
  ["Pakistan", "pk", 30.3753, 69.3451, 2],
  ["Afghanistan", "af", 33.9391, 67.7100, 2],
  ["Iran", "ir", 32.4279, 53.6880, 2],
  ["Iraq", "iq", 33.2232, 43.6793, 2],
  ["Syria", "sy", 34.8021, 38.9968, 2],
  ["Jordan", "jo", 30.5852, 36.2384, 2],
  ["Israel", "il", 31.0461, 34.8516, 2],
  ["Lebanon", "lb", 33.8547, 35.8623, 2],
  ["United Arab Emirates", "ae", 23.4241, 53.8478, 2],
  ["Qatar", "qa", 25.3548, 51.1839, 2],
  ["Kuwait", "kw", 29.3117, 47.4818, 2],
  ["Oman", "om", 21.4735, 55.9754, 2],
  ["Yemen", "ye", 15.5527, 48.5164, 2],
  ["Bahrain", "bh", 25.9304, 50.6378, 2],
  ["Morocco", "ma", 31.7917, -7.0926, 2],
  ["Algeria", "dz", 28.0339, 1.6596, 2],
  ["Tunisia", "tn", 33.8869, 9.5375, 2],
  ["Libya", "ly", 26.3351, 17.2283, 2],
  ["Sudan", "sd", 12.8628, 30.2176, 2],
  ["Ethiopia", "et", 9.1450, 40.4897, 2],
  ["Kenya", "ke", -0.0236, 37.9062, 2],
  ["Tanzania", "tz", -6.3690, 34.8888, 2],
  ["Ghana", "gh", 7.9465, -1.0232, 2],
  ["Angola", "ao", -11.2027, 17.8739, 2],
  ["Mozambique", "mz", -18.6657, 35.5296, 2],
  ["Zimbabwe", "zw", -19.0154, 29.1549, 2],
  ["Zambia", "zm", -13.1339, 27.8493, 2],
  ["Madagascar", "mg", -18.7669, 46.8691, 2],
  ["Nepal", "np", 28.3949, 84.1240, 2],
  ["Sri Lanka", "lk", 7.8731, 80.7718, 2],
  ["Kazakhstan", "kz", 48.0196, 66.9237, 2],
  ["Uzbekistan", "uz", 41.3775, 64.5853, 2],
  ["Mongolia", "mn", 46.8625, 103.8467, 2],
  ["Panama", "pa", 8.5380, -80.7821, 2],
  ["Costa Rica", "cr", 9.7489, -83.7534, 2],
  ["Guatemala", "gt", 15.7835, -90.2308, 2],
  ["Uruguay", "uy", -32.5228, -55.7658, 2],
  ["Paraguay", "py", -23.4425, -58.4438, 2],
  ["Bolivia", "bo", -14.2350, -64.2530, 2],
  ["Ecuador", "ec", -1.8312, -78.1834, 2],
  ["Jamaica", "jm", 18.1096, -77.2975, 2],
  ["Bahamas", "bs", 25.0343, -71.8747, 2],
  ["Trinidad and Tobago", "tt", 10.6918, -61.2225, 2],
  ["Barbados", "bb", 13.1939, -59.5432, 2],
  ["Myanmar", "mm", 21.9162, 95.9560, 2],
  ["Cambodia", "kh", 12.5657, 104.9907, 2],
  ["Laos", "la", 19.8563, 102.4955, 2],
  ["Albania", "al", 41.1533, 20.1683, 2],
  ["Armenia", "am", 40.0691, 45.0382, 2],
  ["Azerbaijan", "az", 40.1431, 47.5769, 2],
  ["Belarus", "by", 53.7098, 27.9534, 2],
  ["Bosnia and Herzegovina", "ba", 43.9159, 17.6791, 2],
  ["Cyprus", "cy", 35.1264, 33.4299, 2],
  ["Estonia", "ee", 58.5953, 25.0136, 2],
  ["Georgia", "ge", 42.3154, 43.3566, 2],
  ["Latvia", "lv", 56.8796, 24.6032, 2],
  ["Lithuania", "lt", 54.6872, 25.2797, 2],
  ["Malta", "mt", 35.9375, 14.3754, 2],
  ["Moldova", "md", 47.4116, 28.3699, 2],
  ["Montenegro", "me", 42.7087, 19.3744, 2],
  ["North Macedonia", "mk", 41.5124, 21.7453, 2],
  ["Slovenia", "si", 46.1512, 14.9955, 2],
  ["Slovakia", "sk", 48.6690, 19.6990, 2],
  ["Luxembourg", "lu", 49.8153, 6.1296, 2],
  ["Chad", "td", 15.4542, 18.7322, 2],
  ["Niger", "ne", 17.6078, 8.0817, 2],
  ["Mali", "ml", 17.5707, -3.9962, 2],
  ["Mauritania", "mr", 21.0080, -10.9408, 2],
  ["Burkina Faso", "bf", 12.2383, -1.5616, 2],
  ["Benin", "bj", 9.3077, 2.3158, 2],
  ["Togo", "tg", 8.6195, 0.8248, 2],
  ["Ivory Coast", "ci", 7.5400, -5.5471, 2],
  ["Liberia", "lr", 6.4281, -9.4295, 2],
  ["Sierra Leone", "sl", 8.4606, -11.7799, 2],
  ["Guinea", "gn", 9.9456, -9.6966, 2],
  ["Guinea-Bissau", "gw", 11.8037, -15.1804, 2],
  ["Senegal", "sn", 14.4974, -14.4524, 2],
  ["Gambia", "gm", 13.4432, -15.3101, 2],
  ["Rwanda", "rw", -1.9403, 29.8739, 2],
  ["Burundi", "bi", -3.4264, 29.9856, 2],
  ["Uganda", "ug", 1.3733, 32.2903, 2],
  ["Djibouti", "dj", 11.8251, 42.5903, 2],
  ["Somalia", "so", 5.1521, 46.1996, 2],
  ["Comoros", "km", -11.6455, 43.3333, 2],
  ["Mauritius", "mu", -20.3484, 57.5522, 2],
  ["Seychelles", "sc", -4.6796, 55.4920, 2],
  ["Cape Verde", "cv", 16.5388, -22.9373, 2],
  ["São Tomé and Príncipe", "st", 0.2060, 6.6131, 2],
  ["Equatorial Guinea", "gq", 1.6508, 10.2679, 2],
  ["Gabon", "ga", -0.8037, 11.6094, 2],
  ["Republic of the Congo", "cg", -0.2280, 15.8277, 2],
  ["Democratic Republic of the Congo", "cd", -4.0384, 21.7587, 2],
  ["Central African Republic", "cf", 6.6111, 20.9394, 2],
  ["South Sudan", "ss", 6.8770, 31.3070, 2],
  ["Suriname", "sr", 3.9193, -56.0278, 2],
  ["Guyana", "gy", 4.8604, -58.9302, 2],
  ["Belize", "bz", 17.1899, -88.4976, 2],
  ["Haiti", "ht", 18.9712, -72.2852, 2],
  ["El Salvador", "sv", 13.7942, -88.8965, 2],
  ["Honduras", "hn", 15.1999, -86.2419, 2],
  ["Nicaragua", "ni", 12.8654, -85.2072, 2],
  ["Saint Lucia", "lc", 13.9094, -60.9789, 2],
  ["Saint Vincent and the Grenadines", "vc", 12.9843, -61.2872, 2],
  ["Grenada", "gd", 12.1165, -61.6790, 2],
  ["Dominica", "dm", 15.4150, -61.3710, 2],
  ["Antigua and Barbuda", "ag", 17.0608, -61.7964, 2],
  ["Saint Kitts and Nevis", "kn", 17.3578, -62.7580, 2],
  ["Papua New Guinea", "pg", -6.3150, 143.9555, 2],
  ["Fiji", "fj", -17.7134, 178.0650, 2],
  ["Timor-Leste", "tl", -8.8742, 125.7275, 2],
  ["Bhutan", "bt", 27.5142, 90.4336, 2],
  ["Brunei", "bn", 4.5353, 114.7277, 2],

  // ── TIER 3: Hard (small nations, obscure islands, non-sovereign territories) ──
  // Sovereign microstates and dependencies
  ["Palau", "pw", 7.5150, 134.5825, 3],
  ["Micronesia", "fm", 7.4256, 150.5508, 3],
  ["Marshall Islands", "mh", 7.1315, 171.1845, 3],
  ["Kiribati", "ki", -3.3704, -168.7340, 3],
  ["Nauru", "nr", -0.5228, 166.9315, 3],
  ["Tuvalu", "tv", -8.5167, 179.1982, 3],
  ["Vanuatu", "vu", -15.3767, 166.9592, 3],
  ["Solomon Islands", "sb", -9.6457, 160.1562, 3],
  ["Samoa", "ws", -13.7590, -172.1046, 3],
  ["Tonga", "to", -21.1790, -175.1982, 3],
  ["Monaco", "mc", 43.7384, 7.4246, 3],
  ["Liechtenstein", "li", 47.1660, 9.5554, 3],
  ["San Marino", "sm", 43.9424, 12.4578, 3],
  ["Andorra", "ad", 42.5063, 1.5218, 3],
  ["Vatican City", "va", 41.9029, 12.4534, 3],
  ["Greenland", "gl", 71.7069, -42.6043, 3],
  ["Faroe Islands", "fo", 61.8926, -6.9118, 3],
  ["Cayman Islands", "ky", 19.3133, -81.2546, 3],
  ["British Virgin Islands", "vg", 18.4207, -64.6403, 3],
  ["US Virgin Islands", "vi", 18.3358, -64.8963, 3],
  ["Aruba", "aw", 12.5211, -69.9683, 3],
  ["Curaçao", "cw", 12.1696, -68.9900, 3],
  ["Sint Maarten", "sx", 18.0425, -63.0548, 3],
  ["Guam", "gu", 13.4443, 144.7937, 3],
  ["American Samoa", "as", -14.2950, -170.6955, 3],
  ["Northern Mariana Islands", "mp", 15.1775, 145.7500, 3],
  ["Palestine", "ps", 31.9522, 35.2332, 3],
  ["Taiwan", "tw", 25.0330, 121.5654, 3],
  ["Hong Kong", "hk", 22.3193, 114.1694, 3],
  ["Macau", "mo", 22.1987, 113.5439, 3],
  ["Maldives", "mv", 3.2028, 73.2207, 3],
  ["Lesotho", "ls", -29.6100, 28.2336, 3],
  ["Eswatini", "sz", -26.5225, 31.4659, 3],
  ["Botswana", "bw", -22.3285, 24.6849, 3],
  ["Namibia", "na", -22.9576, 18.4904, 3],
  ["Eritrea", "er", 15.1794, 39.7823, 3],
  ["Kosovo", "xk", 42.5590, 20.3652, 3],
  // Arctic & Antarctic
  ["Svalbard and Jan Mayen", "sj", 77.5536, 23.6703, 3],
  ["Åland Islands", "ax", 60.1167, 19.9333, 3],
  ["Antarctica", "aq", -82.8620, 135.0000, 3],
  // Remote Atlantic islands
  ["Bouvet Island", "bv", -54.4200, 3.3800, 3],
  ["Saint Helena", "sh", -15.9650, -5.7080, 3],
  ["South Georgia and the South Sandwich Islands", "gs", -54.3001, -36.5080, 3],
  ["Falkland Islands", "fk", -51.7963, -59.5231, 3],
  ["Bermuda", "bm", 32.3078, -64.7505, 3],
  // Caribbean micro-territories
  ["Anguilla", "ai", 18.2206, -63.0686, 3],
  ["Montserrat", "ms", 16.7425, -62.2134, 3],
  ["Turks and Caicos Islands", "tc", 21.6940, -71.7979, 3],
  ["Bonaire", "bq", 12.2014, -68.2628, 3],
  ["Saint Barthélemy", "bl", 17.9003, -62.8336, 3],
  ["Saint Martin", "mf", 18.0826, -63.0524, 3],
  ["Saint Pierre and Miquelon", "pm", 46.9419, -56.3807, 3],
  // Indian Ocean remote territories
  ["Christmas Island", "cx", -10.4475, 105.6904, 3],
  ["Cocos (Keeling) Islands", "cc", -12.1640, 96.8709, 3],
  ["British Indian Ocean Territory", "io", -6.3432, 71.5195, 3],
  ["French Southern Territories", "tf", -43.0000, 67.0000, 3],
  ["Heard Island and McDonald Islands", "hm", -53.0818, 73.2500, 3],
  // Pacific remote islands & territories
  ["Pitcairn Islands", "pn", -24.3767, -128.3244, 3],
  ["Tokelau", "tk", -9.2000, -172.0000, 3],
  ["Niue", "nu", -19.0544, -169.8672, 3],
  ["Cook Islands", "ck", -21.2360, -159.7770, 3],
  ["Norfolk Island", "nf", -29.0408, 167.9547, 3],
  ["Wallis and Futuna", "wf", -14.2938, -178.1165, 3],
  // French overseas territories
  ["French Polynesia", "pf", -17.6797, -149.4068, 3],
  ["New Caledonia", "nc", -20.9043, 165.6180, 3],
  ["Guadeloupe", "gp", 16.2650, -61.5510, 3],
  ["Martinique", "mq", 14.6415, -61.0242, 3],
  ["Réunion", "re", -21.1151, 55.5364, 3],
  ["Mayotte", "yt", -12.8275, 45.1662, 3],
  ["French Guiana", "gf", 3.9339, -53.1258, 3],
  // European crown dependencies & territories
  ["Isle of Man", "im", 54.2361, -4.5481, 3],
  ["Jersey", "je", 49.2144, -2.1312, 3],
  ["Guernsey", "gg", 49.4657, -2.5762, 3],
  ["Gibraltar", "gi", 36.1408, -5.3536, 3],
  // Other non-sovereign / disputed
  ["Western Sahara", "eh", 24.2155, -12.8858, 3],
];

async function fetchSVG(code) {
  const url = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${code}/vector.svg`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.text();
  } catch (e) {
    return null;
  }
}

function parseSVG(svgText) {
  const viewBoxMatch = svgText.match(/viewBox="([^"]+)"/);
  const gTransformMatch = svgText.match(/<g[^>]*transform="([^"]+)"/);
  const pathMatches = [...svgText.matchAll(/<path.*?d="([^"]+)"/g)];

  if (pathMatches.length === 0) return null;

  let viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 1024 1024";
  viewBox = viewBox.replace(/\.0+(?=\s|$)/g, '.0').replace(/(\d+\.\d{1,3})\d+/g, '$1');

  let transform = gTransformMatch ? gTransformMatch[1] : "";
  transform = transform.replace(/\.0+(?=[,\s\)])/g, '.0');

  const allPaths = pathMatches.map(m => m[1]).filter(p => p.length > 20).join(' ');

  return {
    svg: allPaths,
    svgTransform: transform,
    svgViewBox: viewBox
  };
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Fetching SVGs for ${COUNTRY_META.length} countries...\n`);

  const seen = new Set();
  const results = [];
  let skipped = 0;
  let fetched = 0;

  for (let i = 0; i < COUNTRY_META.length; i++) {
    const [name, code, lat, lng, difficulty] = COUNTRY_META[i];
    const key = `${name.toLowerCase()}_${code}`;
    if (seen.has(key)) continue;
    seen.add(key);

    process.stdout.write(`[${i + 1}/${COUNTRY_META.length}] ${name} (${code})... `);

    await sleep(150);

    const svgText = await fetchSVG(code);
    if (!svgText) {
      console.log('SKIP (fetch failed)');
      skipped++;
      continue;
    }

    const parsed = parseSVG(svgText);
    if (!parsed || !parsed.svg) {
      console.log('SKIP (no path data)');
      skipped++;
      continue;
    }

    results.push({
      name,
      iso: code,
      svg: parsed.svg,
      svgTransform: parsed.svgTransform,
      svgViewBox: parsed.svgViewBox,
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
      difficulty
    });

    fetched++;
    console.log('OK');
  }

  const output = `// Auto-generated by generate-data.mjs - ${new Date().toISOString()}
// ${fetched} countries with real SVG shapes from Mapsicon
const COUNTRIES = ${JSON.stringify(results)};
`;

  fs.writeFileSync(path.join(__dirname, 'data.js'), output);

  console.log(`\nDone! ${fetched} fetched, ${skipped} skipped (total entries: ${results.length})`);
  console.log('data.js written. Run `pnpm dev` to start the game.');
}

main().catch(e => { console.error(e); process.exit(1); });
