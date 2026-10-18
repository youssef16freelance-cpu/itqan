/**
 * Egypt Time & Prayer Calculation Service
 * توقيت جمهورية مصر العربية ومواقيت الصلاة وفق الهيئة المصرية العامة للمساحة
 */

export interface EgyptCity {
  id: string;
  name: string;
  nameEn: string;
  region: 'القاهرة الكبرى' | 'الوجه البحري والدلتا' | 'مدن القناة وسيناء' | 'صعيد مصر' | 'المحافظات الحدودية';
  lat: number;
  lng: number;
  popular?: boolean;
}

export const EGYPT_CITIES: EgyptCity[] = [
  { id: 'giza', name: 'الجيزة', nameEn: 'Giza', region: 'القاهرة الكبرى', lat: 30.0131, lng: 31.2089, popular: true },
  { id: 'cairo', name: 'القاهرة (العاصمة)', nameEn: 'Cairo', region: 'القاهرة الكبرى', lat: 30.0444, lng: 31.2357, popular: true },
  { id: 'alexandria', name: 'الإسكندرية', nameEn: 'Alexandria', region: 'الوجه البحري والدلتا', lat: 31.2001, lng: 29.9187, popular: true },
  { id: 'benha', name: 'القليوبية (بنها)', nameEn: 'Benha', region: 'القاهرة الكبرى', lat: 30.4660, lng: 31.1853 },
  { id: 'mansoura', name: 'الدقهلية (المنصورة)', nameEn: 'Mansoura', region: 'الوجه البحري والدلتا', lat: 31.0409, lng: 31.3785, popular: true },
  { id: 'tanta', name: 'الغربية (طنطا)', nameEn: 'Tanta', region: 'الوجه البحري والدلتا', lat: 30.7865, lng: 31.0004, popular: true },
  { id: 'zagazig', name: 'الشرقية (الزقازيق)', nameEn: 'Zagazig', region: 'الوجه البحري والدلتا', lat: 30.5877, lng: 31.5020 },
  { id: 'shibin', name: 'المنوفية (شبين الكوم)', nameEn: 'Shibin El Kom', region: 'الوجه البحري والدلتا', lat: 30.5522, lng: 31.0090 },
  { id: 'damanhour', name: 'البحيرة (دمنهور)', nameEn: 'Damanhour', region: 'الوجه البحري والدلتا', lat: 31.0400, lng: 30.4700 },
  { id: 'kafr_el_sheikh', name: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', region: 'الوجه البحري والدلتا', lat: 31.1107, lng: 30.9388 },
  { id: 'damietta', name: 'دمياط', nameEn: 'Damietta', region: 'الوجه البحري والدلتا', lat: 31.4175, lng: 31.8144 },
  { id: 'port_said', name: 'بورسعيد', nameEn: 'Port Said', region: 'مدن القناة وسيناء', lat: 31.2653, lng: 32.3019, popular: true },
  { id: 'ismailia', name: 'الإسماعيلية', nameEn: 'Ismailia', region: 'مدن القناة وسيناء', lat: 30.5965, lng: 32.2715 },
  { id: 'suez', name: 'السويس', nameEn: 'Suez', region: 'مدن القناة وسيناء', lat: 29.9668, lng: 32.5498, popular: true },
  { id: 'arish', name: 'شمال سيناء (العريش)', nameEn: 'Arish', region: 'مدن القناة وسيناء', lat: 31.1321, lng: 33.8033 },
  { id: 'sharm', name: 'جنوب سيناء (شرم الشيخ)', nameEn: 'Sharm El Sheikh', region: 'مدن القناة وسيناء', lat: 27.9158, lng: 34.3299 },
  { id: 'fayoum', name: 'الفيوم', nameEn: 'Fayoum', region: 'صعيد مصر', lat: 29.3084, lng: 30.8428 },
  { id: 'beni_suef', name: 'بني سويف', nameEn: 'Beni Suef', region: 'صعيد مصر', lat: 29.0661, lng: 31.0994 },
  { id: 'minya', name: 'المنيا (عروس الصعيد)', nameEn: 'Minya', region: 'صعيد مصر', lat: 28.1099, lng: 30.7503 },
  { id: 'asyut', name: 'أسيوط', nameEn: 'Asyut', region: 'صعيد مصر', lat: 27.1783, lng: 31.1859, popular: true },
  { id: 'sohag', name: 'سوهاج', nameEn: 'Sohag', region: 'صعيد مصر', lat: 26.5569, lng: 31.6948 },
  { id: 'qena', name: 'قنا', nameEn: 'Qena', region: 'صعيد مصر', lat: 26.1551, lng: 32.7160 },
  { id: 'luxor', name: 'الأقصر', nameEn: 'Luxor', region: 'صعيد مصر', lat: 25.6872, lng: 32.6396, popular: true },
  { id: 'aswan', name: 'أسوان (جوهرة النيل)', nameEn: 'Aswan', region: 'صعيد مصر', lat: 24.0889, lng: 32.8998, popular: true },
  { id: 'hurghada', name: 'البحر الأحمر (الغردقة)', nameEn: 'Hurghada', region: 'المحافظات الحدودية', lat: 27.2579, lng: 33.8116 },
  { id: 'matruh', name: 'مرسى مطروح', nameEn: 'Marsa Matruh', region: 'المحافظات الحدودية', lat: 31.3543, lng: 27.2373 },
  { id: 'kharga', name: 'الوادي الجديد (الخارجة)', nameEn: 'Kharga', region: 'المحافظات الحدودية', lat: 25.4514, lng: 30.5464 }
];

export interface EgyptPrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  time: string; // HH:mm (24h)
  time12h: string; // HH:mm ص / م
  passed: boolean;
}

export interface EgyptPrayerCalculationResult {
  city: EgyptCity;
  currentTimeInEgypt: string; // HH:mm:ss
  currentTimeInEgypt12h: string; // h:mm:ss a
  time12WithoutSeconds: string; // h:mm a
  nowFormattedFull: string;
  isGiza: boolean;
  currentHour24: number;
  currentMinute: number;
  currentSecond: number;
  gregorianDateStr: string;
  hijriDateStr: string;
  prayers: EgyptPrayerTimeItem[];
  nextPrayerIndex: number;
  nextPrayer: EgyptPrayerTimeItem;
  timeRemainingStr: string; // HH:mm:ss
  remainingSeconds: number;
  sourceAuthority: string;
  isOnlineSynced: boolean;
}

const STORAGE_CITY_KEY = 'itqan_egypt_selected_city_v3';
const STORAGE_PRAYER_CACHE_KEY = 'itqan_egypt_prayer_cache_';

class EgyptTimeService {
  private selectedCityId: string = 'giza';
  private cachedApiTimings: Record<string, Record<string, string>> = {}; // cityId -> timings
  private listeners: Set<() => void> = new Set();
  private timerId: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_CITY_KEY);
        // Force Giza as default if unset or old default 'cairo'
        if (saved && saved !== 'cairo' && EGYPT_CITIES.some(c => c.id === saved)) {
          this.selectedCityId = saved;
        } else {
          this.selectedCityId = 'giza';
          localStorage.setItem(STORAGE_CITY_KEY, 'giza');
        }
      } catch (e) {
        console.warn('Storage read error for Egypt city', e);
        this.selectedCityId = 'giza';
      }

      this.fetchOnlinePrayerTimes(this.selectedCityId);

      // Start global 1-second tick to ensure all subscribers get precise Egypt seconds
      this.timerId = window.setInterval(() => {
        this.notifyListeners();
      }, 1000);
    }
  }

  public getSelectedCity(): EgyptCity {
    return EGYPT_CITIES.find(c => c.id === this.selectedCityId) || EGYPT_CITIES[0];
  }

  public setSelectedCity(cityId: string) {
    if (EGYPT_CITIES.some(c => c.id === cityId)) {
      this.selectedCityId = cityId;
      try {
        localStorage.setItem(STORAGE_CITY_KEY, cityId);
      } catch {}
      this.fetchOnlinePrayerTimes(cityId);
      this.notifyListeners();
    }
  }

  public resetToGiza() {
    this.setSelectedCity('giza');
  }

  public isGiza(): boolean {
    return this.selectedCityId === 'giza';
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * Returns current Date & wall-clock components adjusted to Africa/Cairo
   */
  public getEgyptNow() {
    const rawNow = new Date();
    
    // Format parts in Egypt timezone with 24-hour cycle to avoid midnight 24:00 edge case
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Cairo',
      hour12: false,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });

    const parts = formatter.formatToParts(rawNow);
    const getPart = (type: string) => Number(parts.find(p => p.type === type)?.value || 0);

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');

    // Create a normalized date representing Egypt time
    const egyptDate = new Date(year, month - 1, day, hour, minute, second);

    // Gregorian Arabic string
    const arGregorianFormatter = new Intl.DateTimeFormat('ar-EG', {
      timeZone: 'Africa/Cairo',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const gregorianDateStr = arGregorianFormatter.format(rawNow);

    // Hijri Arabic string
    let hijriDateStr = '';
    try {
      const arHijriFormatter = new Intl.DateTimeFormat('ar-EG-u-ca-islamic-umalqura', {
        timeZone: 'Africa/Cairo',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      hijriDateStr = arHijriFormatter.format(rawNow);
    } catch {
      hijriDateStr = 'شعبان / رمضان المبارك';
    }

    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    const ss = String(second).padStart(2, '0');
    const time24 = `${hh}:${mm}:${ss}`;

    const isPM = hour >= 12;
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const periodArabic = isPM ? 'م' : 'ص';
    const time12 = `${String(hour12).padStart(2, '0')}:${mm}:${ss} ${periodArabic}`;
    const time12WithoutSeconds = `${String(hour12).padStart(2, '0')}:${mm} ${periodArabic}`;

    return {
      rawNow,
      egyptDate,
      year,
      month,
      day,
      hour,
      minute,
      second,
      time24,
      time12,
      time12WithoutSeconds,
      gregorianDateStr,
      hijriDateStr
    };
  }

  /**
   * Calculate prayer times for Egypt using the official Egyptian General Authority of Survey
   * الهيئة المصرية العامة للمساحة (Fajr 19.5°, Isha 17.5°, Shafi'i Asr)
   */
  private calculateAstronomicalEgyptianTimes(date: Date, lat: number, lng: number): Record<string, string> {
    // Determine timezone offset for Egypt on this date (UTC+2 or UTC+3 during daylight saving)
    const cairoDate = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzOffset = Math.round((cairoDate.getTime() - utcDate.getTime()) / (3600 * 1000));

    // Day of year calculation
    const start = new Date(Date.UTC(date.getFullYear(), 0, 0));
    const diff = date.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Fractional year in radians
    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

    // Equation of time in minutes
    const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
      - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

    // Solar declination in radians
    const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
      - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
      - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);

    const rad = (d: number) => d * Math.PI / 180;
    const deg = (r: number) => r * 180 / Math.PI;
    const phi = rad(lat);

    // Solar noon in hours (with +1 min buffer for meridian transit)
    const noon = 12 + tzOffset - (lng / 15) - (eqtime / 60);

    const hourAngle = (angleDeg: number): number => {
      const a = rad(angleDeg);
      const cosHA = (Math.sin(a) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl));
      if (cosHA > 1) return 0;
      if (cosHA < -1) return 12;
      return deg(Math.acos(cosHA)) / 15;
    };

    // Egyptian General Authority of Survey parameters:
    // Fajr angle: 19.5°
    // Sunrise/Sunset standard angle: -0.8333° (accounting for atmospheric refraction and semi-diameter)
    // Isha angle: 17.5°
    const haSunrise = hourAngle(-0.8333);
    const haFajr = hourAngle(-19.5);
    const haIsha = hourAngle(-17.5);

    // Asr Shafi'i / Standard: angle = arccot(1 + tan(|phi - decl|))
    const asrAngleRad = Math.atan(1 / (1 + Math.tan(Math.abs(phi - decl))));
    const haAsr = hourAngle(deg(asrAngleRad));

    const toHHMM = (hrs: number) => {
      let totalMins = Math.round(hrs * 60);
      const h = Math.floor(totalMins / 60) % 24;
      const m = totalMins % 60;
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    };

    return {
      fajr: toHHMM(noon - haFajr),
      sunrise: toHHMM(noon - haSunrise),
      dhuhr: toHHMM(noon + 1 / 60), // +1 minute past true solar noon
      asr: toHHMM(noon + haAsr),
      maghrib: toHHMM(noon + haSunrise),
      isha: toHHMM(noon + haIsha)
    };
  }

  /**
   * Fetch online timings asynchronously from Aladhan (Method 5 = Egyptian General Authority of Survey)
   */
  public async fetchOnlinePrayerTimes(cityId: string) {
    const city = EGYPT_CITIES.find(c => c.id === cityId) || EGYPT_CITIES[0];
    const todayKey = new Date().toISOString().slice(0, 10);
    const cacheStorageKey = `${STORAGE_PRAYER_CACHE_KEY}${cityId}_${todayKey}`;

    // Check localStorage cache first
    try {
      const cached = localStorage.getItem(cacheStorageKey);
      if (cached) {
        this.cachedApiTimings[cityId] = JSON.parse(cached);
        this.notifyListeners();
        return;
      }
    } catch {}

    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city.nameEn)}&country=Egypt&method=5`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.timings) {
          const t = json.data.timings;
          // Format into lowercase 24h
          const cleanTimings: Record<string, string> = {
            fajr: t.Fajr?.slice(0, 5),
            sunrise: t.Sunrise?.slice(0, 5),
            dhuhr: t.Dhuhr?.slice(0, 5),
            asr: t.Asr?.slice(0, 5),
            maghrib: t.Maghrib?.slice(0, 5),
            isha: t.Isha?.slice(0, 5)
          };

          this.cachedApiTimings[cityId] = cleanTimings;
          try {
            localStorage.setItem(cacheStorageKey, JSON.stringify(cleanTimings));
          } catch {}

          this.notifyListeners();
        }
      }
    } catch (err) {
      console.warn('Aladhan fetch offline/fallback', err);
    }
  }

  /**
   * Get full calculation result for Egypt
   */
  public getCalculation(cityId?: string): EgyptPrayerCalculationResult {
    const activeCityId = cityId || this.selectedCityId;
    const city = EGYPT_CITIES.find(c => c.id === activeCityId) || EGYPT_CITIES[0];
    const nowInfo = this.getEgyptNow();

    // Check if we have online cached timings, else use accurate astronomical formulas
    let rawTimes = this.cachedApiTimings[activeCityId];
    let isOnlineSynced = true;

    if (!rawTimes) {
      // Check local storage for today's cache
      const todayKey = new Date().toISOString().slice(0, 10);
      try {
        const saved = localStorage.getItem(`${STORAGE_PRAYER_CACHE_KEY}${activeCityId}_${todayKey}`);
        if (saved) {
          rawTimes = JSON.parse(saved);
        }
      } catch {}
    }

    if (!rawTimes) {
      isOnlineSynced = false;
      rawTimes = this.calculateAstronomicalEgyptianTimes(nowInfo.rawNow, city.lat, city.lng);
    }

    const currentMinutes = nowInfo.hour * 60 + nowInfo.minute;
    const currentSeconds = nowInfo.second;

    const to12h = (time24: string) => {
      const [hStr, mStr] = time24.split(':');
      let h = Number(hStr);
      const isPM = h >= 12;
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${String(h12).padStart(2, '0')}:${mStr} ${isPM ? 'م' : 'ص'}`;
    };

    const prayerDefs: { id: EgyptPrayerTimeItem['id']; name: string; key: string }[] = [
      { id: 'fajr', name: 'الفجر', key: 'fajr' },
      { id: 'sunrise', name: 'الشروق', key: 'sunrise' },
      { id: 'dhuhr', name: 'الظهر', key: 'dhuhr' },
      { id: 'asr', name: 'العصر', key: 'asr' },
      { id: 'maghrib', name: 'المغرب', key: 'maghrib' },
      { id: 'isha', name: 'العشاء', key: 'isha' }
    ];

    const prayers: EgyptPrayerTimeItem[] = prayerDefs.map(p => {
      const time = rawTimes[p.key] || '12:00';
      const [h, m] = time.split(':').map(Number);
      const prayerMins = h * 60 + m;
      return {
        id: p.id,
        name: p.name,
        time,
        time12h: to12h(time),
        passed: prayerMins <= currentMinutes
      };
    });

    // Determine next prayer
    const minuteValues = prayers.map(p => {
      const [h, m] = p.time.split(':').map(Number);
      return h * 60 + m;
    });

    let nextIdx = 0;
    let found = false;
    for (let i = 0; i < minuteValues.length; i++) {
      if (minuteValues[i] > currentMinutes) {
        nextIdx = i;
        found = true;
        break;
      }
    }

    let diffSeconds = 0;
    if (!found) {
      nextIdx = 0; // Fajr next day
      const tomorrowFajrMinutes = 24 * 60 + minuteValues[0];
      diffSeconds = (tomorrowFajrMinutes - currentMinutes) * 60 - currentSeconds;
    } else {
      diffSeconds = (minuteValues[nextIdx] - currentMinutes) * 60 - currentSeconds;
    }

    if (diffSeconds < 0) diffSeconds = 0;

    const remainingHours = Math.floor(diffSeconds / 3600);
    const remainingMins = Math.floor((diffSeconds % 3600) / 60);
    const remainingSecs = diffSeconds % 60;

    const timeRemainingStr = `${String(remainingHours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

    const isGiza = city.id === 'giza';
    const nowFormattedFull = `الساعة الآن: ${nowInfo.time12} (توقيت ${city.name}، جمهورية مصر العربية)`;

    return {
      city,
      currentTimeInEgypt: nowInfo.time24,
      currentTimeInEgypt12h: nowInfo.time12,
      time12WithoutSeconds: nowInfo.time12WithoutSeconds,
      nowFormattedFull,
      isGiza,
      currentHour24: nowInfo.hour,
      currentMinute: nowInfo.minute,
      currentSecond: nowInfo.second,
      gregorianDateStr: nowInfo.gregorianDateStr,
      hijriDateStr: nowInfo.hijriDateStr,
      prayers,
      nextPrayerIndex: nextIdx,
      nextPrayer: prayers[nextIdx],
      timeRemainingStr,
      remainingSeconds: diffSeconds,
      sourceAuthority: 'الهيئة المصرية العامة للمساحة',
      isOnlineSynced
    };
  }
}

export const egyptTimeService = new EgyptTimeService();
