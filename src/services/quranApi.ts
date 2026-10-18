import { PRELOADED_SURAHS } from '../data/curatedQuranData';
import { ALL_SURAHS, RECITERS } from '../data/quranSurahs';
import { Ayah, Reciter, SurahMeta } from '../types';

export function pad3(num: number): string {
  return num.toString().padStart(3, '0');
}

export function getSurahMeta(surahId: number): SurahMeta | undefined {
  return ALL_SURAHS.find(s => s.id === surahId);
}

export function getReciterById(reciterId: string): Reciter {
  const found = RECITERS.find(r => r.id === reciterId);
  return found || RECITERS[0];
}

export const SHERIF_MOSTAFA_AVAILABLE_SURAHS = [
  13, 15, 19, 20, 31, 32, 53, 55, 56, 57, 60, 61, 62, 63, 64, 65, 66, 67, 71, 76, 77, 89
];

export function isSurahAvailableForReciter(reciterId: string, surahId: number): boolean {
  if (reciterId === 'sherif_mostafa') {
    return SHERIF_MOSTAFA_AVAILABLE_SURAHS.includes(surahId);
  }
  return true;
}

export function getSurahAudioUrl(reciterId: string, surahId: number): string {
  const reciter = getReciterById(reciterId);
  const formattedSurah = pad3(surahId);
  if (reciterId === 'sherif_mostafa') {
    return `https://dn721605.ca.archive.org/0/items/Sherif-Mostafa/${formattedSurah}.mp3`;
  }
  return `${reciter.serverUrl}${formattedSurah}.mp3`;
}

export function getSurahAudioFallbackUrls(reciterId: string, surahId: number): string[] {
  const formattedSurah = pad3(surahId);
  const list: string[] = [];

  if (reciterId === 'sherif_mostafa') {
    // Only real Sherif Mostafa audio
    list.push(`https://dn721605.ca.archive.org/0/items/Sherif-Mostafa/${formattedSurah}.mp3`);
    list.push(`https://archive.org/download/Sherif-Mostafa/${formattedSurah}.mp3`);
  } else if (reciterId === 'mansour_salimi') {
    list.push(`https://cdn.mp3quran.net/audio/mansour-salimi/r1/${formattedSurah}.mp3`);
    list.push(`https://server14.mp3quran.net/mansor/${formattedSurah}.mp3`);
  } else if (reciterId === 'islam_sobhi') {
    list.push(`https://cdn.mp3quran.net/audio/islam-sobhi/r1/${formattedSurah}.mp3`);
    list.push(`https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/${formattedSurah}.mp3`);
  } else if (reciterId === 'mishary_alafasy') {
    list.push(`https://server8.mp3quran.net/afs/${formattedSurah}.mp3`);
    list.push(`https://cdn.mp3quran.net/audio/mishary-alafasy/r1/${formattedSurah}.mp3`);
  } else if (reciterId === 'abdulbasit') {
    list.push(`https://server7.mp3quran.net/basit/${formattedSurah}.mp3`);
  } else if (reciterId === 'maher_almuaiqly') {
    list.push(`https://server12.mp3quran.net/maher/${formattedSurah}.mp3`);
  } else if (reciterId === 'yasser_aldosari') {
    list.push(`https://server11.mp3quran.net/yasser/${formattedSurah}.mp3`);
  } else if (reciterId === 'fares_abbad') {
    list.push(`https://server8.mp3quran.net/frs_a/${formattedSurah}.mp3`);
  } else {
    list.push(getSurahAudioUrl(reciterId, surahId));
  }

  return Array.from(new Set(list));
}

export function getAyahAudioUrl(reciterId: string, surahId: number, ayahNumberInSurah: number): string | null {
  const sStr = pad3(surahId);
  const aStr = pad3(ayahNumberInSurah);

  switch (reciterId) {
    case 'mishary_alafasy':
      return `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;
    case 'abdulbasit':
      return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${sStr}${aStr}.mp3`;
    case 'maher_almuaiqly':
      return `https://everyayah.com/data/MaherAlMuaiqly128kbps/${sStr}${aStr}.mp3`;
    case 'yasser_aldosari':
      return `https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/${sStr}${aStr}.mp3`;
    case 'sherif_mostafa':
    case 'islam_sobhi':
    case 'mansour_salimi':
    case 'fares_abbad':
      // For reciters with full-surah MP3 only, return full surah url
      return getSurahAudioUrl(reciterId, surahId);
    default:
      return `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;
  }
}

export async function fetchSurahAyahs(surahId: number): Promise<Ayah[]> {
  // 1. Check local preloaded curated data
  if (PRELOADED_SURAHS[surahId] && PRELOADED_SURAHS[surahId].length > 0) {
    // If it's a complete short Surah, return directly
    const meta = getSurahMeta(surahId);
    if (meta && PRELOADED_SURAHS[surahId].length >= meta.versesCount) {
      return PRELOADED_SURAHS[surahId];
    }
  }

  // 2. Check localStorage cache
  const cacheKey = `itqan_surah_${surahId}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Cache read error', e);
  }

  // 3. Fetch from Al-Quran Cloud API with both Uthmani text and Tafseer Al-Muyassar in one call
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,ar.muyassar`
    );

    if (!response.ok) {
      throw new Error(`API HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
      const textEdition = json.data[0];
      const tafseerEdition = json.data[1];

      const ayahs: Ayah[] = textEdition.ayahs.map((item: any, index: number) => {
        const tafseerItem = tafseerEdition.ayahs[index];
        return {
          number: item.number,
          numberInSurah: item.numberInSurah,
          text: item.text,
          juz: item.juz,
          page: item.page,
          tafseer: tafseerItem?.text || 'التفسير متاح في المراجع المعتمدة.'
        };
      });

      // Cache in localStorage
      try {
        localStorage.setItem(cacheKey, JSON.stringify(ayahs));
      } catch (storageErr) {
        console.warn('Storage quota exceeded or error', storageErr);
      }

      return ayahs;
    }
  } catch (networkErr) {
    console.warn(`Failed to fetch surah ${surahId} from API, checking fallback`, networkErr);
  }

  // Fallback to preloaded if exists or generate structured placeholders with meta
  if (PRELOADED_SURAHS[surahId]) {
    return PRELOADED_SURAHS[surahId];
  }

  const meta = getSurahMeta(surahId);
  const fallbackAyahs: Ayah[] = [];
  const count = meta ? Math.min(meta.versesCount, 10) : 5;
  for (let i = 1; i <= count; i++) {
    fallbackAyahs.push({
      number: i,
      numberInSurah: i,
      text: i === 1 ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : `آية كريمة رقم ${i} من سورة ${meta?.name || ''}`,
      juz: meta?.juz || 1,
      page: meta?.page || 1,
      tafseer: 'يرجى التأكد من اتصال الإنترنت لتحميل النص الكامل والتفسير الميسر.'
    });
  }

  return fallbackAyahs;
}
