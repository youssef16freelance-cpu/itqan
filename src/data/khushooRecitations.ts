export interface KhushooRecitation {
  id: string;
  title: string;
  surahId: number;
  surahName: string;
  reciterId: string;
  reciterName: string;
  mood: string;
  description: string;
  recommendedRain: boolean;
  rainVolume?: number;
}

export const KHUSHOO_RECITATIONS: KhushooRecitation[] = [
  {
    id: 'taha_sherif',
    title: 'سورة طه — سكينة وهدوء استثنائي',
    surahId: 20,
    surahName: 'طه',
    reciterId: 'sherif_mostafa',
    reciterName: 'شريف مصطفى',
    mood: 'مطر وسكينة 🌧️',
    description: 'تلاوة خاشعة تأسر الفؤاد بنداء الله لموسى عليه السلام «وَأَنَا اخْتَرْتُكَ فَاسْتَمِعْ لِمَا يُوحَى»',
    recommendedRain: true,
    rainVolume: 0.25
  },
  {
    id: 'maryam_sherif',
    title: 'سورة مريم — راحة وطمأنينة النفس',
    surahId: 19,
    surahName: 'مريم',
    reciterId: 'sherif_mostafa',
    reciterName: 'شريف مصطفى',
    mood: 'طمأنينة ورجاء ✨',
    description: 'تلاوة دافئة ومؤثرة لآيات رحمة زكريا وبشارة يحيى وقصة مريم البتول',
    recommendedRain: true,
    rainVolume: 0.22
  },
  {
    id: 'mulk_sherif',
    title: 'سورة الملك — تلاوة ساكنة كسكون الليل',
    surahId: 67,
    surahName: 'الملك',
    reciterId: 'sherif_mostafa',
    reciterName: 'شريف مصطفى',
    mood: 'أمان وهدوء الليل 🌙',
    description: 'المانعة المنجية من عذاب القبر بتلاوة هادئة مريحة للأعصاب قبل النوم',
    recommendedRain: true,
    rainVolume: 0.2
  },
  {
    id: 'qaf_salimi',
    title: 'سورة ق — تلاوة مبكية تهز القلوب',
    surahId: 50,
    surahName: 'ق',
    reciterId: 'mansour_salimi',
    reciterName: 'منصور السالمي',
    mood: 'خشوع وتدبر 💧',
    description: '«وَجَاءَتْ سَكْرَةُ الْمَوْتِ بِالْحَقِّ» — من أبلغ التلاوات الخاشعة التي ترق لها القلوب',
    recommendedRain: false
  },
  {
    id: 'rahman_sherif',
    title: 'سورة الرحمن — عروس القرآن وجلاء الهم',
    surahId: 55,
    surahName: 'الرحمن',
    reciterId: 'sherif_mostafa',
    reciterName: 'شريف مصطفى',
    mood: 'بهجة وسكينة 🌿',
    description: '«فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ» بتلاوة عذبة تبعث الأمل وتجلي الهموم والضيق',
    recommendedRain: true,
    rainVolume: 0.22
  },
  {
    id: 'waqiah_sherif',
    title: 'سورة الواقعة — سورة الغنى وتثبيت اليقين',
    surahId: 56,
    surahName: 'الواقعة',
    reciterId: 'sherif_mostafa',
    reciterName: 'شريف مصطفى',
    mood: 'خشوع ويقين 🕊️',
    description: 'تلاوة مهيبة لآيات السابقين وأصحاب اليمين وخلق الإنسان والماء والزرع',
    recommendedRain: true,
    rainVolume: 0.2
  },
  {
    id: 'qiyamah_sobhi',
    title: 'سورة القيامة — وجل القلوب وهيبة الموقف',
    surahId: 75,
    surahName: 'القيامة',
    reciterId: 'islam_sobhi',
    reciterName: 'إسلام صبحي',
    mood: 'هيبة وخشوع ⚖️',
    description: 'تلاوة شجية تأخذك لمشاهد يوم القيامة مع نبرة مؤثرة تذيب القسوة من القلوب',
    recommendedRain: false
  },
  {
    id: 'insan_sherif',
    title: 'سورة الإنسان — وصف نعيم أهل الجنة',
    surahId: 76,
    surahName: 'الإنسان',
    reciterId: 'sherif_mostafa',
    reciterName: 'شريف مصطفى',
    mood: 'نعيم وسلام 🌸',
    description: '«وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ» ترتيل يلامس الفؤاد ويزيد الشوق لجنة الرحمن',
    recommendedRain: true,
    rainVolume: 0.2
  },
  {
    id: 'furqan_dosari',
    title: 'سورة الفرقان — ترتيل الحرم المكي الشريف',
    surahId: 25,
    surahName: 'الفرقان',
    reciterId: 'yasser_aldosari',
    reciterName: 'ياسر الدوسري',
    mood: 'خشوع الحرم 🕌',
    description: 'أواخر سورة الفرقان وصفات عباد الرحمن بتلاوة ندية آسرة من محراب الكعبة المشرفة',
    recommendedRain: false
  },
  {
    id: 'yusuf_alafasy',
    title: 'سورة يوسف — أحسن القصص وإتقان الترتيل',
    surahId: 12,
    surahName: 'يوسف',
    reciterId: 'mishary_alafasy',
    reciterName: 'مشاري راشد العفاسي',
    mood: 'صبر وجبر 🌟',
    description: 'تلاوة كويتية متقنة تفيض بالسكينة وجمال العبر في قصة يوسف الصديق',
    recommendedRain: true,
    rainVolume: 0.15
  },
  {
    id: 'fajr_sherif',
    title: 'سورة الفجر — نسائم الفجر وسكون الفؤاد',
    surahId: 89,
    surahName: 'الفجر',
    reciterId: 'sherif_mostafa',
    reciterName: 'شريف مصطفى',
    mood: 'نسائم الفجر 🌅',
    description: '«يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً»',
    recommendedRain: true,
    rainVolume: 0.25
  },
  {
    id: 'haqqah_abdulbasit',
    title: 'سورة الحاقة — هيبة التلاوة المصرية الخالدة',
    surahId: 69,
    surahName: 'الحاقة',
    reciterId: 'abdulbasit',
    reciterName: 'عبد الباسط عبد الصمد',
    mood: 'هيبة الترتيل 📖',
    description: 'صوت من عبق التاريخ المصري والإسلامي بخشوع يأسر الأسماع ويهز الوجدان',
    recommendedRain: false
  }
];
