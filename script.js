/* ============================================================
   CV RIDHO — script.js
   ============================================================ */

/* ---------- 1. THEME SYSTEM ---------- */
(function(){
  var saved = null;
  try { saved = localStorage.getItem('cv-theme'); } catch(e){}
  if (saved === 'light') document.documentElement.setAttribute('data-theme','light');

  window.__toggleTheme = function(){
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'light' ? 'dark' : 'light';
    if (next === 'light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('cv-theme', next); } catch(e){}
    if (window.__cvMap && window.__cvBasemap){
      try {
        if (next === 'light'){
          window.__cvMap.removeLayer(window.__cvBasemap.darkBase);
          window.__cvMap.removeLayer(window.__cvBasemap.darkRef);
          window.__cvBasemap.lightBase.addTo(window.__cvMap);
          window.__cvBasemap.lightRef.addTo(window.__cvMap);
        } else {
          window.__cvMap.removeLayer(window.__cvBasemap.lightBase);
          window.__cvMap.removeLayer(window.__cvBasemap.lightRef);
          window.__cvBasemap.darkBase.addTo(window.__cvMap);
          window.__cvBasemap.darkRef.addTo(window.__cvMap);
        }
      } catch(e){}
    }
  };
  document.querySelectorAll('#theme-toggle, #theme-toggle-2').forEach(function(btn){
    btn.addEventListener('click', window.__toggleTheme);
  });
})();

/* ---------- 2. HERO SLIDESHOW (10 slot dari hero-img/) ---------- */
(function(){
  var container = document.getElementById('hero-slides');
  var dotsWrap = document.getElementById('hero-dots');
  var heroArt = document.getElementById('hero-art');
  if (!container) return;

  var TOTAL = 10;
  var EXT = ['jpg','jpeg','png','webp','avif'];
  var slides = [];
  var current = 0;
  var timer = null;
  var INTERVAL = 5000;

  function tryLoad(slot, extIdx){
    if (extIdx >= EXT.length) return;
    var url = 'hero-img/' + slot + '.' + EXT[extIdx];
    var img = new Image();
    img.onload = function(){
      var el = document.createElement('div');
      el.className = 'hero-slide';
      el.style.backgroundImage = 'url("' + url + '")';
      container.appendChild(el);
      slides.push(el);
    };
    img.onerror = function(){ tryLoad(slot, extIdx + 1); };
    img.src = url;
  }

  for (var i = 1; i <= TOTAL; i++) tryLoad(i, 0);

  function setup(){
    if (slides.length === 0) return;
    // Sembunyikan SVG art kalau ada minimal 1 gambar
    if (heroArt) heroArt.classList.add('is-hidden');

    // Buat dots
    if (dotsWrap){
      dotsWrap.innerHTML = '';
      slides.forEach(function(_, idx){
        var b = document.createElement('button');
        b.className = 'hero-dot' + (idx === 0 ? ' is-active' : '');
        b.type = 'button';
        b.setAttribute('aria-label','Slide ' + (idx + 1));
        b.addEventListener('click', function(){ goTo(idx); });
        dotsWrap.appendChild(b);
      });
    }

    slides[0].classList.add('is-active');

    function goTo(idx){
      slides[current].classList.remove('is-active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dotsWrap){
        dotsWrap.querySelectorAll('.hero-dot').forEach(function(d, i){
          d.classList.toggle('is-active', i === current);
        });
      }
      resetTimer();
    }
    function next(){ goTo(current + 1); }
    function resetTimer(){
      if (timer) clearInterval(timer);
      if (slides.length > 1) timer = setInterval(next, INTERVAL);
    }
    resetTimer();

    var hero = document.querySelector('.hero');
    hero && hero.addEventListener('mouseenter', function(){ if (timer) clearInterval(timer); });
    hero && hero.addEventListener('mouseleave', resetTimer);
  }

  // Setup cepat, tapi tunggu load selesai
  setTimeout(setup, 800);
  setTimeout(function(){ if (slides.length > 0 && !timer) setup(); }, 2500);
})();

/* ---------- 3. PUBLIKASI DATA (render dari JS) ---------- */
(function(){
  var pubs = [
    {y:'2026', n:1, t:'Strategi Coping Stres Dalam Mengatasi Problema Akademik Mahasiswa FTK Universitas Islam Negeri Antasari Banjarmasin', j:'Tarbiyah dan Keguruan', c:''},
    {y:'2026', n:2, t:'Analisis Career FOMO, Kepuasan Kerja dan Stres Kerja Terhadap Keinginan Pindah Kerja Karyawan Generasi Z Di BFI Finance', j:'Jurnal Manajemen Ekonomi dan Akuntansi', c:''},
    {y:'2025', n:3, t:'Modelling the impact of pneumonia influenced by air pollution and climate change: a numerical approach in South Sulawesi', j:'International Journal of Simulation and Process Modelling', c:''},
    {y:'2025', n:4, t:'SEIRS-SISII Modeling with RK8 (7) to Explore Local Wisdom in Combating Climate-Induced Dengue Spread through Wolbachia Vectors in South-West Sulawesi', j:'IAENG International Journal of Applied Mathematics', c:''},
    {y:'2025', n:5, t:'SMSEA Mathematical with MPH-RK Orde 6: Big Data-Driven Exploration of Dance and Counseling-Based Well-being Enhancement Strategies', j:'IAENG International Journal of Applied Mathematics', c:''},
    {y:'2025', n:6, t:'The Effect of Public Service Quality on Public Satisfaction with Administrative Services at the Palupi Village Head Office', j:'EKOMBIS REVIEW', c:''},
    {y:'2025', n:7, t:'The PKM: Enhancing the Capacity and Professionalism of the Merah Putih Cooperative through Business Proposal Writing Training', j:'Mattawang: Jurnal Pengabdian Masyarakat', c:''},
    {y:'2025', n:8, t:'The Optimization of Home Yard Utilization for Strengthening Household Economy Through the Mini Garden Program', j:'Mattawang: Jurnal Pengabdian Masyarakat', c:''},
    {y:'2025', n:9, t:'Simulating the Dynamics of Early Marriage and Marital Stability Using SERH Mathematical Models', j:'Jurnal Varian', c:''},
    {y:'2025', n:10, t:'The Analysis and Simulation of Consumer Behavior Towards Product Boycotts Using Mathematical Modeling in North Sangatta District', j:'Journal of Mathematics, Computations and Statistics', c:''},
    {y:'2025', n:11, t:'Exploring The Future Of Health Through The Selr Mathematical Model With The 4th Order Pertubation Homotopy Method', j:'Jurnal Ilmiah Ilmu Pengetahuan Alam', c:''},
    {y:'2025', n:12, t:'Exploring The Future of Health Through The SELR Mathematical Model with Time Delay', j:'Proximal: Jurnal Penelitian Matematika', c:''},
    {y:'2024', n:27, t:'Unveiling Ammotere Abbaji: Exploring Silariang Perpetrators With SEIR Mathematical Modeling Among The Bugis Community', j:'Journal of Mathematics, Computations and Statistics', c:''},
    {y:'2024', n:28, t:'PKM Meningkatkan Pengetahuan dan Keterampilan Mitra Tentang Kewirausahaan Bagi Kelompok Mitra Dusun Kanari', j:'—', c:''},
    {y:'2024', n:29, t:'Solusi masalah bullying menggunakan pemodelan matematika dengan bimbingan dan konseling pada pelajar madrasah', j:'Proximal: Jurnal Penelitian Matematika dan Pendidikan Matematika', c:'Sitasi 2'},
    {y:'2024', n:30, t:'Prosedur Pelaporan Dan Perhitungan Dalam Pengenaan Pajak Pertambahan Nilai (PPN)', j:'PEDAMAS', c:'Sitasi 1'},
    {y:'2023', n:31, t:"Majelis Taklim And Its Role In Women's Empowerment", j:'Ijtimaiyya: Jurnal Pengembangan Masyarakat Islam', c:'Sitasi 3'},
    {y:'2023', n:32, t:'Solusi Numerik Model SIRV Penyebaran Covid-19 dengan Menggunakan Metode Runge-Kutta di Kabupaten Pinrang', j:'Jurnal MSA', c:'Sitasi 4'},
    {y:'2023', n:33, t:'The Correlation Among Reading Habits, Reading Motivation, and Reading Comprehension', j:'Journal of English Education', c:'Sitasi 3'},
    {y:'2023', n:34, t:'Health Promotion Analysis And Simulation On Increasing Vaccination With Using The SRV Model', j:'BAREKENG: Jurnal Ilmu Matematika dan Terapan', c:''},
    {y:'2023', n:35, t:'The NADI Mathematical Model on the Danger Level of the Bili-Bili Dam', j:'Jurnal Varian', c:''},
    {y:'2023', n:36, t:'The Analysis of SEIR Mathematical Model Time Delay as The Solution of Tuberculosis Transmission', j:'E3S Web of Conferences', c:''},
    {y:'2023', n:37, t:'Implementasi Fungsi Manajemen Pemasaran Dalam Kesejahteraan Anggota Pada Koperasi Mina Jaya', j:'UIN Raden Intan Lampung', c:'Sitasi 2'},
    {y:'2022', n:38, t:'Analisis Tingkat Kepuasan Pasien Terhadap Pelayanan di RSUD Muntilan', j:'Universitas Islam Indonesia', c:'Sitasi 1'},
    {y:'2022', n:39, t:'Implementasi Enkripsi Dengan Vigenere Cipher Dan Reverse Cipher Menggunakan Python', j:'Jurnal Teknologi Informasi', c:'Sitasi 6'},
    {y:'2022', n:40, t:'Pengaruh Komunikasi, Disiplin Kerja, Dan Keterampilan Kerja Terhadap Produktivitas Karyawan', j:'Universitas Tridinanti Palembang', c:''},
    {y:'2022', n:41, t:'Manifestasi Electrical Resistivity Tomography Menggunakan Python Berbasis Website', j:'Teknik Geofisika', c:''},
    {y:'2021', n:42, t:'Klasifikasi Diagnosis Penyakit Covid-19 Menggunakan Metode Decision Tree', j:'Just IT', c:'Sitasi 19'},
    {y:'2021', n:43, t:"Komunikasi Profetik Dalam Mewujudkan Masyarakat Madani Perspektif Al-Qur'an", j:'Institut PTIQ Jakarta', c:'Sitasi 7'},
    {y:'2021', n:44, t:'Using SAPR model for solution of social poverty problem due to covid-19 in Makassar city', j:'Jurnal Varian', c:'Sitasi 5'},
    {y:'2021', n:45, t:'Pengembangan Sistem Konsultasi Gizi dan Konsumsi Harian berbasis Web', j:'Jurnal Pengembangan Teknologi Informasi dan Ilmu Komputer', c:'Sitasi 2'},
    {y:'2020', n:46, t:'Sebaran Pemukiman Pemerintahan Kerajaan Marusu', j:'Universitas Hasanuddin', c:'Sitasi 1'},
    {y:'2020', n:47, t:'Pengaruh Functional Quality Dan Corporate Image Terhadap Word Of Mouth Communication', j:'Universitas Putra Bangsa', c:''}
  ];

  var list = document.getElementById('pub-list');
  if (!list) return;

  pubs.forEach(function(p){
    var num = (p.n < 10 ? '0' : '') + p.n;
    var cite = p.c ? p.c : 'Sitasi —';
    var div = document.createElement('div');
    div.className = 'pub-item';
    div.dataset.year = p.y;
    div.innerHTML =
      '<div class="pub-year">' + p.y + '<span>' + num + '</span></div>' +
      '<div>' +
        '<p class="pub-title">' + p.t + '</p>' +
        '<p class="pub-journal"><b>' + p.j + '</b><span class="pub-cite">' + cite + '</span></p>' +
      '</div>';
    list.appendChild(div);
  });
})();

/* ---------- 4. PENGAJARAN DATA ---------- */
(function(){
  var courses = [
    ['Pemodelan Matematika','Matematika'],
    ['Pemodelan Statistika','Statistika'],
    ['Kalkulus Dasar','Matematika'],
    ['Matematika Dasar','Matematika'],
    ['Matematika Dasar','Geografi'],
    ['Sistem Dinamik','Matematika'],
    ['Persamaan Diferensial Biasa','Geografi'],
    ['Persamaan Diferensial Parsial','Geografi'],
    ['Kewirausahaan','Matematika'],
    ['Teori Peluang','Matematika'],
    ['Teori Penyampelan','Matematika'],
    ['Simulasi Komputer','Matematika'],
    ['Metode Penelitian','Matematika'],
    ['Matematika Aktuaria','Aktuarian'],
    ['Matematika Aktuaria','Matematika'],
    ['Pemodelan Matematika Ekonomi','Aktuaria'],
    ['Pemodelan Matematika','S2 Matematika'],
    ['Pemodelan Matematika','S2 Pendidikan Matematika'],
    ['Pemodelan Matematika dan Statistik','S2 Statistika'],
    ['Pemodelan Matematika dan Statistik','S2 Bahasa Indonesia'],
    ['Pemodelan Matematika dan Statistik','S2 Bahasa Inggris']
  ];
  var table = document.getElementById('teach-table');
  if (!table) return;
  courses.forEach(function(c, i){
    var num = (i + 1 < 10 ? '0' : '') + (i + 1);
    var row = document.createElement('div');
    row.className = 'teach-row';
    row.innerHTML =
      '<span class="teach-num">' + num + '</span>' +
      '<span class="teach-name">' + c[0] + '</span>' +
      '<span class="teach-prog">' + c[1] + '</span>' +
      '<span class="teach-role" data-i18n="teach.roleValue">Asisten Dosen</span>';
    table.appendChild(row);
  });
})();

/* ---------- 5. LANGUAGE SYSTEM ---------- */
var I18N = {
  id: {
    'topbar.role':'Asisten Dosen & Peneliti',
    'hero.tagline':'Pemodelan matematika, simulasi numerik, dan analisis data untuk masalah sosial, kesehatan, dan lingkungan — dari krisis moral Gen Z hingga konservasi mangrove di Sulawesi.',
    'hero.badge1':'17 Riset Kemendiktisaintek','hero.badge2':'47+ Artikel Ilmiah','hero.badge3':'6 HKI Software',
    'hero.cta':'Lihat Riwayat Hidup','hero.scroll':'Scroll',
    'hg.pill':'✦ Galeri Karya','hg.title':'Menelusuri <em>jejak riset</em><br>&amp; <em>kontribusi</em> akademik',
    'hg.sub':'Kumpulan visual dari penelitian, publikasi, pengabdian, dan momen akademik — geser untuk menjelajah.',
    'sg.pill':'✦ Jalan & Visual','sg.title':'Kumpulan <em>visual di jalan</em><br>&amp; momen perjalanan',
    'sg.sub':'Dokumentasi perjalanan, riset lapangan, dan momen visual — diklik untuk memperbesar.',
    'nav.profil':'Profil','nav.pendidikan':'Pendidikan','nav.riset':'Riset','nav.publikasi':'Publikasi',
    'nav.pengabdian':'Pengabdian','nav.pengajaran':'Pengajaran','nav.penghargaan':'Penghargaan','nav.kontak':'Kontak',
    'manifesto.title':'Matematika bukan sekadar angka —<br>ia cara membaca persoalan sosial',
    'manifesto.text':'Lulusan S1 dan S2 Matematika Universitas Negeri Makassar dengan fokus pemodelan matematika dan simulasi numerik. Selama lima tahun terakhir terlibat dalam 17 penelitian yang didanai Kemendiktisaintek, menulis 47+ artikel ilmiah, menghasilkan 6 HKI berupa software pemodelan, serta mendampingi mahasiswa sebagai asisten dosen untuk 18 mata kuliah lintas program studi di FMIPA UNM.',
    'map.tab.air':'Polusi Udara','map.tab.weather':'Cuaca & Hujan','map.tab.quake':'Gempa Bumi','map.tab.fire':'Kebakaran Hutan',
    'map.loading':'Memuat data…',
    'map.caption':'Peta interaktif per Kota/Kabupaten · Polusi Udara & Cuaca/Hujan (Open-Meteo) · Gempa (BMKG) · Kebakaran (NASA FIRMS) · Koordinat: BIG Gazeter · Basemap: Esri Dark Gray Canvas',
    'map.disabled.title':'Peta dinonaktifkan di perangkat mobile',
    'map.disabled.desc':'Silakan buka halaman ini di desktop/tablet untuk melihat peta interaktif.',
    'id.pill':'A · Identitas Diri','id.title':'Profil Singkat','id.desc':'Data pribadi dan domisili sesuai dokumen resmi.',
    'id.lockHint':'🔒 Data sensitif terkunci — klik untuk membuka',
    'id.name':'Nama Lengkap','id.job':'Pekerjaan','id.jobValue':'Asisten Dosen / Asisten Riset',
    'id.nik':'NIK 🔒','id.birth':'Tempat & Tanggal Lahir','id.phone':'Nomor Telepon 🔒','id.address':'Alamat Rumah',
    'id.addressValue':'Kec. Mamuju, Kabupaten Mamuju, Sulawesi Barat','id.email':'Alamat E-Mail',
    'edu.pill':'B · Riwayat Pendidikan','edu.title':'Pendidikan Formal','edu.desc':'Dua jenjang pendidikan tinggi di bidang Matematika di Universitas Negeri Makassar.',
    'edu.field':'Bidang Ilmu','edu.math':'Matematika','edu.program':'Program','edu.bachelor':'Sarjana (S1)','edu.master':'Magister (S2)',
    'edu.thesis':'Judul Skripsi','edu.thesisM':'Judul Tesis',
    'edu.thesis1':'Solusi Permasalahan Kasus Sosial Kemiskinan Akibat Covid-19 Menggunakan Permodelan Matematika Pada Wilayah Kota Makassar',
    'edu.thesis2':'Analisis Dan Simulasi Model Matematika SE2CFS Pada Kasus Krisis Moral Generasi Z Di Wilayah Kota Makassar',
    'edu.advisor':'Pembimbing',
    'cap.pill':'C · Pengalaman','cap.title':'Tiga Bidang Kontribusi','cap.desc':'Riset, pengabdian masyarakat, dan pengajaran — tiga pilar kegiatan akademik.',
    'cap.tab.research':'Riset','cap.tab.service':'Pengabdian','cap.tab.teaching':'Pengajaran',
    'cap.stat.research':'Penelitian','cap.stat.years':'Tahun Terakhir','cap.stat.pkm':'Program PKM','cap.stat.prov':'Provinsi','cap.stat.years2':'Tahun',
    'cap.stat.courses':'Mata Kuliah','cap.stat.prodi':'Program Studi','cap.stat.years3':'Tahun Terakhir',
    'cap.research.text':'Sebanyak 17 penelitian dalam lima tahun terakhir, seluruhnya didanai Kemendiktisaintek. Topiknya beragam: mitigasi degradasi mangrove, over-eksploitasi perikanan laut, pencegahan stunting, rekonsiliasi sosial polarisasi politik Gen-Z, eco-anxiety remaja pesisir, kecanduan game online, hingga penyebaran DBD lewat vektor Wolbachia.',
    'cap.research.cta':'Lihat daftar penelitian ↓',
    'cap.service.text':'Lima program pengabdian masyarakat di Sulawesi Barat dan Sulawesi Selatan — mulai dari optimalisasi pekarangan rumah, pelatihan penulisan proposal usaha, hingga pendampingan kewirausahaan dan pemasaran digital.',
    'cap.service.cta':'Lihat program pengabdian ↓',
    'cap.teaching.text':'Asisten dosen di Universitas Negeri Makassar untuk 18 mata kuliah lintas program studi — dari Kalkulus Dasar hingga Pemodelan Matematika & Statistik untuk mahasiswa S2.',
    'cap.teaching.cta':'Lihat daftar mata kuliah ↓',
    'res.pill':'C.1 · Penelitian','res.title':'Pengalaman Penelitian 5 Tahun Terakhir','res.desc':'17 judul penelitian yang didanai oleh Kemendiktisaintek.','res.count':'Penelitian',
    'pub.pill':'E · Artikel Ilmiah','pub.title':'Publikasi Jurnal 5 Tahun Terakhir','pub.desc':'47+ artikel ilmiah di jurnal nasional dan internasional.','pub.filter.all':'Semua','pub.citation':'Sitasi —',
    'srv.pill':'D · Pengabdian Masyarakat','srv.title':'Pengabdian Kepada Masyarakat','srv.desc':'Lima program pengabdian dalam lima tahun terakhir.',
    'hki.pill':'H · HKI','hki.title':'Hak Kekayaan Intelektual','hki.desc':'Enam pencatatan Hak Cipta software pemodelan matematika, 2021–2024.',
    'teach.pill':'I · Pengajaran','teach.title':'Pengalaman Mengajar 3 Tahun Terakhir','teach.desc':'Asisten dosen di Universitas Negeri Makassar untuk 18 mata kuliah lintas program studi.',
    'teach.no':'No','teach.course':'Mata Kuliah','teach.prodi':'Program Studi','teach.role':'Peran','teach.roleValue':'Asisten Dosen',
    'awd.pill':'J · Penghargaan','awd.title':'Penghargaan 10 Tahun Terakhir','awd.desc':'Dari pemerintah, asosiasi, dan institusi lainnya.',
    'awd.bestPresenter':'Presenter Terbaik','awd.silver':'Setara Medali Perak PKM-RSH 1 Kategori Presentasi','awd.pimnas':'Peserta PIMNAS 34',
    'awd.pkmsh':'Lolos Pendanaan PKM-RSH','awd.pkmre':'Lolos Pendanaan PKM-RE','awd.mascot':'Juara 2 Desain Maskot KPU',
    'awd.hipmi':'Harapan 1 Desain Logo MUNAS HIPMI XVI','awd.unibos':'Juara Desain Logo UNIBOS','awd.top10':'10 Besar Ujian Masuk Perguruan Tinggi',
    'awd.posterProv':'Juara 2 Desain Poster FLS2N Tingkat Provinsi','awd.posterKab':'Juara Desain Poster FLS2N Tingkat Kabupaten','awd.osn':'Harapan 1 OSN Biologi Tingkat Kabupaten',
    'book.pill':'G · Penulisan Buku','book.title':'PEMODELAN MATEMATIKA: Solusi Penyebaran Covid-19 dan Pneumonia Melalui Pendekatan Berbasis Intervensi Masyarakat',
    'book.desc':'Buku ini membahas pemodelan matematika untuk penyebaran Covid-19 dan pneumonia dengan pendekatan intervensi masyarakat.',
    'act.pill':'F · K · Seminar & Kegiatan','act.title':'Penyampaian Makalah & Kegiatan Ilmiah','act.desc':'Partisipasi dalam seminar, konferensi, dan kegiatan akademik lainnya.',
    'act.role.presenter':'Presenter','act.role.speaker':'Pemakalah','act.role.speaker2':'Pemateri','act.role.participant':'Peserta','act.role.committee':'Panitia',
    'ct.pill':'Kontak','ct.title':'Terbuka untuk kolaborasi<br>riset & pengabdian',
    'ct.desc':'Terbuka untuk kolaborasi penelitian, penulisan artikel ilmiah, pengabdian masyarakat, dan pengajaran. Berdomisili di Mamuju, Sulawesi Barat.',
    'ct.email':'Email','ct.phone':'Telepon 🔒','ct.domicile':'Domisili','ct.domicileValue':'Mamuju, Sulawesi Barat',
    'ct.sendEmail':'Kirim Email','ct.downloadCV':'Unduh CV (PDF)',
    'ft.related':'Terkait','ft.privacy':'Privasi',
    'pc.title':'Data Terkunci','pc.sub':'Masukkan kode akses untuk<br>membuka data sensitif','pc.error':'Kode akses salah','pc.submit':'Buka Akses','pc.hint':'Hanya untuk keperluan verifikasi resmi'
  },
  en: {
    'topbar.role':'Lecturer Assistant & Researcher',
    'hero.tagline':'Mathematical modeling, numerical simulation, and data analysis for social, health, and environmental problems — from Gen Z moral crisis to mangrove conservation in Sulawesi.',
    'hero.badge1':'17 Kemendiktisaintek Research','hero.badge2':'47+ Scientific Articles','hero.badge3':'6 Software IPRs',
    'hero.cta':'View Curriculum Vitae','hero.scroll':'Scroll',
    'hg.pill':'✦ Gallery of Works','hg.title':'Tracing <em>research paths</em><br>&amp; <em>academic</em> contributions',
    'hg.sub':'A visual collection of research, publications, community service, and academic moments — swipe to explore.',
    'sg.pill':'✦ Street & Visual','sg.title':'A collection of <em>street visuals</em><br>&amp; journey moments',
    'sg.sub':'Documentation of journeys, field research, and visual moments — click to enlarge.',
    'nav.profil':'Profile','nav.pendidikan':'Education','nav.riset':'Research','nav.publikasi':'Publications',
    'nav.pengabdian':'Service','nav.pengajaran':'Teaching','nav.penghargaan':'Awards','nav.kontak':'Contact',
    'manifesto.title':'Mathematics is not just numbers —<br>it is a way to read social problems',
    'manifesto.text':'Bachelor and Master of Mathematics from Universitas Negeri Makassar with a focus on mathematical modeling and numerical simulation.',
    'map.tab.air':'Air Pollution','map.tab.weather':'Weather & Rain','map.tab.quake':'Earthquakes','map.tab.fire':'Forest Fires',
    'map.loading':'Loading data…','map.caption':'Interactive map per City/Regency',
    'map.disabled.title':'Map is disabled on mobile','map.disabled.desc':'Please open on desktop/tablet.',
    'id.pill':'A · Personal Identity','id.title':'Short Profile','id.desc':'Personal data and domicile per official documents.',
    'id.lockHint':'🔒 Sensitive data locked — click to unlock',
    'id.name':'Full Name','id.job':'Occupation','id.jobValue':'Lecturer Assistant / Research Assistant',
    'id.nik':'National ID 🔒','id.birth':'Place & Date of Birth','id.phone':'Phone 🔒','id.address':'Home Address',
    'id.addressValue':'Mamuju District, Mamuju Regency, West Sulawesi','id.email':'Email Address',
    'edu.pill':'B · Education History','edu.title':'Formal Education','edu.desc':'Two higher education degrees in Mathematics at Universitas Negeri Makassar.',
    'edu.field':'Field','edu.math':'Mathematics','edu.program':'Program','edu.bachelor':"Bachelor's (S1)",'edu.master':"Master's (S2)",
    'edu.thesis':'Undergraduate Thesis','edu.thesisM':'Master Thesis','edu.thesis1':'Solutions to Social Poverty Problems Due to Covid-19',
    'edu.thesis2':'Analysis and Simulation of SE2CFS Mathematical Model on Gen Z Moral Crisis','edu.advisor':'Advisors',
    'cap.pill':'C · Experience','cap.title':'Three Areas of Contribution','cap.desc':'Research, service, and teaching.',
    'cap.tab.research':'Research','cap.tab.service':'Service','cap.tab.teaching':'Teaching',
    'cap.stat.research':'Research','cap.stat.years':'Last 5 Years','cap.stat.pkm':'PKM Programs','cap.stat.prov':'Provinces','cap.stat.years2':'Years',
    'cap.stat.courses':'Courses','cap.stat.prodi':'Study Programs','cap.stat.years3':'Last 3 Years',
    'cap.research.text':'17 research projects in the last five years.',
    'cap.research.cta':'View research list ↓','cap.service.text':'Five community service programs.',
    'cap.service.cta':'View service programs ↓','cap.teaching.text':'Lecturer assistant at UNM for 18 courses.',
    'cap.teaching.cta':'View course list ↓',
    'res.pill':'C.1 · Research','res.title':'Research Experience (Last 5 Years)','res.desc':'17 research titles funded by Kemendiktisaintek.','res.count':'Research',
    'pub.pill':'E · Scientific Articles','pub.title':'Journal Publications (Last 5 Years)','pub.desc':'47+ scientific articles.','pub.filter.all':'All','pub.citation':'Citations —',
    'srv.pill':'D · Community Service','srv.title':'Community Service','srv.desc':'Five service programs.',
    'hki.pill':'H · IPR','hki.title':'Intellectual Property Rights','hki.desc':'Six Copyright registrations of modeling software.',
    'teach.pill':'I · Teaching','teach.title':'Teaching Experience (Last 3 Years)','teach.desc':'Lecturer assistant at UNM for 18 courses.',
    'teach.no':'No','teach.course':'Course','teach.prodi':'Study Program','teach.role':'Role','teach.roleValue':'Lecturer Assistant',
    'awd.pill':'J · Awards','awd.title':'Awards (Last 10 Years)','awd.desc':'From government, associations, and others.',
    'awd.bestPresenter':'Best Presenter','awd.silver':'Silver Medal Equivalent PKM-RSH 1','awd.pimnas':'PIMNAS 34 Participant',
    'awd.pkmsh':'PKM-RSH Funding Recipient','awd.pkmre':'PKM-RE Funding Recipient','awd.mascot':'2nd Place KPU Mascot Design',
    'awd.hipmi':'Runner-up MUNAS HIPMI XVI','awd.unibos':'Winner UNIBOS Logo','awd.top10':'Top 10 University Entrance',
    'awd.posterProv':'2nd Place FLS2N Provincial','awd.posterKab':'Winner FLS2N Regency','awd.osn':'Runner-up Regency Biology Olympiad',
    'book.pill':'G · Book Writing','book.title':'MATHEMATICAL MODELING: Solutions for Covid-19 & Pneumonia','book.desc':'This book discusses mathematical modeling.',
    'act.pill':'F · K · Seminars & Activities','act.title':'Paper Presentations & Scientific Activities','act.desc':'Participation in seminars and conferences.',
    'act.role.presenter':'Presenter','act.role.speaker':'Speaker','act.role.speaker2':'Instructor','act.role.participant':'Participant','act.role.committee':'Committee',
    'ct.pill':'Contact','ct.title':'Open for research<br>& service collaboration',
    'ct.desc':'Open for research collaboration, article writing, community service, and teaching.',
    'ct.email':'Email','ct.phone':'Phone 🔒','ct.domicile':'Domicile','ct.domicileValue':'Mamuju, West Sulawesi',
    'ct.sendEmail':'Send Email','ct.downloadCV':'Download CV (PDF)',
    'ft.related':'Related','ft.privacy':'Privacy',
    'pc.title':'Locked Data','pc.sub':'Enter access code','pc.error':'Incorrect code','pc.submit':'Unlock','pc.hint':'Official verification only'
  },
  ja: {
    'topbar.role':'講師助手・研究者',
    'hero.tagline':'社会・健康・環境問題のための数理モデリング。',
    'hero.badge1':'ケメンディクティサインテック研究17件','hero.badge2':'学術論文47件以上','hero.badge3':'ソフトウェア知的財産6件',
    'hero.cta':'履歴書を見る','hero.scroll':'スクロール',
    'hg.pill':'✦ 作品ギャラリー','hg.title':'<em>研究の軌跡</em>と<br><em>学術的貢献</em>を辿る','hg.sub':'研究・出版物のビジュアルコレクション。',
    'sg.pill':'✦ ストリート＆ビジュアル','sg.title':'<em>ストリートビジュアル</em>のコレクション','sg.sub':'旅の記録、フィールド研究。',
    'nav.profil':'プロフィール','nav.pendidikan':'学歴','nav.riset':'研究','nav.publikasi':'出版物',
    'nav.pengabdian':'社会貢献','nav.pengajaran':'教育','nav.penghargaan':'受賞歴','nav.kontak':'お問い合わせ',
    'manifesto.title':'数学は単なる数字ではない','manifesto.text':'マカッサル国立大学で数学の学士号と修士号を取得。',
    'map.tab.air':'大気汚染','map.tab.weather':'天気・雨','map.tab.quake':'地震','map.tab.fire':'森林火災',
    'map.loading':'読み込み中…','map.caption':'市/県別マップ','map.disabled.title':'モバイル無効','map.disabled.desc':'デスクトップで開いてください',
    'id.pill':'A · 個人情報','id.title':'プロフィール','id.desc':'公式文書に基づく個人情報。','id.lockHint':'🔒 クリックで解除',
    'id.name':'氏名','id.job':'職業','id.jobValue':'講師助手 / 研究助手',
    'id.nik':'国民ID 🔒','id.birth':'出生地・生年月日','id.phone':'電話 🔒','id.address':'自宅住所',
    'id.addressValue':'西スラウェシ州マムジュ','id.email':'メール',
    'edu.pill':'B · 学歴','edu.title':'正規教育','edu.desc':'マカッサル国立大学で数学の2学位。',
    'edu.field':'専攻','edu.math':'数学','edu.program':'プログラム','edu.bachelor':'学士 (S1)','edu.master':'修士 (S2)',
    'edu.thesis':'学士論文','edu.thesisM':'修士論文','edu.thesis1':'Covid-19による貧困問題の解決','edu.thesis2':'SE2CFSモデルの分析','edu.advisor':'指導教員',
    'cap.pill':'C · 経験','cap.title':'3つの貢献分野','cap.desc':'研究・社会貢献・教育。',
    'cap.tab.research':'研究','cap.tab.service':'社会貢献','cap.tab.teaching':'教育',
    'cap.stat.research':'研究','cap.stat.years':'過去5年','cap.stat.pkm':'PKM','cap.stat.prov':'州','cap.stat.years2':'年',
    'cap.stat.courses':'科目','cap.stat.prodi':'専攻','cap.stat.years3':'過去3年',
    'cap.research.text':'過去5年で17件の研究。','cap.research.cta':'研究リスト ↓','cap.service.text':'5つの社会貢献プログラム。','cap.service.cta':'プログラム ↓',
    'cap.teaching.text':'18科目の講師助手。','cap.teaching.cta':'科目リスト ↓',
    'res.pill':'C.1 · 研究','res.title':'過去5年間の研究','res.desc':'17件の研究。','res.count':'研究',
    'pub.pill':'E · 学術論文','pub.title':'過去5年間の出版物','pub.desc':'47件以上の論文。','pub.filter.all':'すべて','pub.citation':'被引用 —',
    'srv.pill':'D · 社会貢献','srv.title':'社会貢献','srv.desc':'5つのプログラム。',
    'hki.pill':'H · 知的財産','hki.title':'知的財産権','hki.desc':'6件の著作権登録。',
    'teach.pill':'I · 教育','teach.title':'過去3年間の教育','teach.desc':'18科目の講師助手。',
    'teach.no':'No','teach.course':'科目','teach.prodi':'専攻','teach.role':'役割','teach.roleValue':'講師助手',
    'awd.pill':'J · 受賞歴','awd.title':'過去10年間の受賞歴','awd.desc':'政府・協会から。',
    'awd.bestPresenter':'最優秀発表者','awd.silver':'銀メダル相当','awd.pimnas':'PIMNAS 34参加','awd.pkmsh':'PKM-RSH資金獲得',
    'awd.pkmre':'PKM-RE資金獲得','awd.mascot':'KPUマスコット2位','awd.hipmi':'MUNAS HIPMI XVI準優勝','awd.unibos':'UNIBOS優勝',
    'awd.top10':'トップ10','awd.posterProv':'FLS2N州2位','awd.posterKab':'FLS2N県優勝','awd.osn':'県生物2位',
    'book.pill':'G · 書籍','book.title':'数理モデリング','book.desc':'Covid-19と肺炎拡散の解決策。',
    'act.pill':'F · K · セミナー','act.title':'論文発表','act.desc':'セミナー参加。',
    'act.role.presenter':'発表者','act.role.speaker':'講演者','act.role.speaker2':'講師','act.role.participant':'参加者','act.role.committee':'委員',
    'ct.pill':'お問い合わせ','ct.title':'協業を受付中','ct.desc':'研究協力を受け付けています。',
    'ct.email':'メール','ct.phone':'電話 🔒','ct.domicile':'居住地','ct.domicileValue':'マムジュ',
    'ct.sendEmail':'メール送信','ct.downloadCV':'CVダウンロード',
    'ft.related':'関連','ft.privacy':'プライバシー',
    'pc.title':'ロック','pc.sub':'アクセスコード','pc.error':'エラー','pc.submit':'解除','pc.hint':'公式認証のみ'
  },
  zh: {
    'topbar.role':'讲师助理与研究员',
    'hero.tagline':'面向社会、健康与环境问题的数学建模。',
    'hero.badge1':'17项研究','hero.badge2':'47+篇论文','hero.badge3':'6项软件知识产权',
    'hero.cta':'查看简历','hero.scroll':'滚动',
    'hg.pill':'✦ 作品画廊','hg.title':'追溯<em>研究足迹</em>与<em>学术贡献</em>','hg.sub':'研究与出版视觉合集。',
    'sg.pill':'✦ 街头与视觉','sg.title':'<em>街头视觉</em>合集','sg.sub':'旅程记录与田野研究。',
    'nav.profil':'简介','nav.pendidikan':'教育','nav.riset':'研究','nav.publikasi':'出版物',
    'nav.pengabdian':'社会服务','nav.pengajaran':'教学','nav.penghargaan':'荣誉','nav.kontak':'联系方式',
    'manifesto.title':'数学不仅仅是数字','manifesto.text':'望加锡国立大学数学学士和硕士。',
    'map.tab.air':'空气污染','map.tab.weather':'天气','map.tab.quake':'地震','map.tab.fire':'森林火灾',
    'map.loading':'加载中…','map.caption':'交互式地图','map.disabled.title':'移动端禁用','map.disabled.desc':'请在桌面打开',
    'id.pill':'A · 个人身份','id.title':'简介','id.desc':'官方文件数据。','id.lockHint':'🔒 点击解锁',
    'id.name':'姓名','id.job':'职业','id.jobValue':'讲师助理',
    'id.nik':'身份证 🔒','id.birth':'出生信息','id.phone':'电话 🔒','id.address':'家庭住址',
    'id.addressValue':'西苏拉威西马穆朱','id.email':'电子邮件',
    'edu.pill':'B · 教育','edu.title':'正规教育','edu.desc':'望加锡国立大学两个学位。',
    'edu.field':'领域','edu.math':'数学','edu.program':'课程','edu.bachelor':'学士','edu.master':'硕士',
    'edu.thesis':'本科论文','edu.thesisM':'硕士论文','edu.thesis1':'Covid-19贫困问题','edu.thesis2':'SE2CFS模型分析','edu.advisor':'导师',
    'cap.pill':'C · 经验','cap.title':'三个领域','cap.desc':'研究、服务与教学。',
    'cap.tab.research':'研究','cap.tab.service':'服务','cap.tab.teaching':'教学',
    'cap.stat.research':'研究','cap.stat.years':'过去5年','cap.stat.pkm':'PKM','cap.stat.prov':'省份','cap.stat.years2':'年',
    'cap.stat.courses':'课程','cap.stat.prodi':'专业','cap.stat.years3':'过去3年',
    'cap.research.text':'17项研究。','cap.research.cta':'研究列表 ↓','cap.service.text':'五个服务项目。','cap.service.cta':'服务项目 ↓',
    'cap.teaching.text':'18门课程讲师助理。','cap.teaching.cta':'课程列表 ↓',
    'res.pill':'C.1 · 研究','res.title':'过去5年研究','res.desc':'17项研究。','res.count':'研究',
    'pub.pill':'E · 论文','pub.title':'过去5年发表','pub.desc':'47+篇论文。','pub.filter.all':'全部','pub.citation':'引用 —',
    'srv.pill':'D · 社会服务','srv.title':'社区服务','srv.desc':'五个项目。',
    'hki.pill':'H · 知识产权','hki.title':'知识产权','hki.desc':'六项著作权登记。',
    'teach.pill':'I · 教学','teach.title':'过去3年教学','teach.desc':'18门课程讲师助理。',
    'teach.no':'序号','teach.course':'课程','teach.prodi':'专业','teach.role':'角色','teach.roleValue':'讲师助理',
    'awd.pill':'J · 荣誉','awd.title':'过去10年荣誉','awd.desc':'来自政府与协会。',
    'awd.bestPresenter':'最佳演讲者','awd.silver':'银牌同等','awd.pimnas':'PIMNAS 34参与','awd.pkmsh':'PKM-RSH资助',
    'awd.pkmre':'PKM-RE资助','awd.mascot':'KPU吉祥物第二名','awd.hipmi':'MUNAS HIPMI XVI亚军','awd.unibos':'UNIBOS冠军',
    'awd.top10':'前10名','awd.posterProv':'FLS2N省级第二','awd.posterKab':'FLS2N县级冠军','awd.osn':'县级生物第二',
    'book.pill':'G · 书籍','book.title':'数学建模','book.desc':'Covid-19与肺炎解决方案。',
    'act.pill':'F · K · 研讨会','act.title':'论文发表','act.desc':'参加研讨会。',
    'act.role.presenter':'演讲者','act.role.speaker':'报告人','act.role.speaker2':'讲师','act.role.participant':'参与者','act.role.committee':'委员会',
    'ct.pill':'联系方式','ct.title':'开放合作','ct.desc':'开放研究合作。',
    'ct.email':'电子邮件','ct.phone':'电话 🔒','ct.domicile':'居住地','ct.domicileValue':'马穆朱',
    'ct.sendEmail':'发送邮件','ct.downloadCV':'下载简历',
    'ft.related':'相关','ft.privacy':'隐私',
    'pc.title':'锁定','pc.sub':'输入访问代码','pc.error':'代码错误','pc.submit':'解锁','pc.hint':'仅供官方验证'
  }
};

var currentLang = 'id';

function applyLang(lang){
  if (!I18N[lang]) lang = 'id';
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k = el.getAttribute('data-i18n');
    if (I18N[lang][k] !== undefined) el.textContent = I18N[lang][k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){
    var k = el.getAttribute('data-i18n-html');
    if (I18N[lang][k] !== undefined) el.innerHTML = I18N[lang][k];
  });
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.classList.toggle('is-active', b.dataset.lang === lang);
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : (lang === 'ja' ? 'ja' : lang);
  try { localStorage.setItem('cv-lang', lang); } catch(e){}
}

document.querySelectorAll('.lang-btn').forEach(function(btn){
  btn.addEventListener('click', function(){ applyLang(btn.dataset.lang); });
});
try {
  var saved = localStorage.getItem('cv-lang');
  if (saved && I18N[saved]) applyLang(saved);
} catch(e){}

/* ---------- 6. HERO GALLERY SCROLL ---------- */
(function(){
  var track = document.getElementById('hg-track');
  if (!track) return;
  var prevBtn = document.querySelector('[data-hg-prev]');
  var nextBtn = document.querySelector('[data-hg-next]');
  var bar = document.getElementById('hg-progress-bar');
  var counterEl = document.getElementById('hg-counter');
  var totalEl = document.getElementById('hg-total');
  var cards = track.querySelectorAll('.hg-card');
  var rail = bar ? bar.parentElement : null;
  if (totalEl) totalEl.textContent = cards.length;

  function step(){
    var c = track.querySelector('.hg-card');
    if (!c) return 340;
    var gap = parseFloat(getComputedStyle(track).gap) || 20;
    return c.offsetWidth + gap;
  }
  function update(){
    var max = track.scrollWidth - track.clientWidth;
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 4;
    var ratio = max > 0 ? track.scrollLeft / max : 0;
    if (bar && rail){
      var railW = rail.clientWidth;
      var barW = Math.max(railW * (track.clientWidth / track.scrollWidth), 28);
      bar.style.width = barW + 'px';
      bar.style.transform = 'translateX(' + (ratio * (railW - barW)) + 'px)';
    }
    if (counterEl){
      var idx = Math.round(track.scrollLeft / step()) + 1;
      counterEl.textContent = Math.min(idx, cards.length);
    }
  }
  function go(d){ track.scrollBy({ left: d * step(), behavior:'smooth' }); }
  prevBtn && prevBtn.addEventListener('click', function(){ go(-1); });
  nextBtn && nextBtn.addEventListener('click', function(){ go(1); });
  track.addEventListener('scroll', function(){
    if (track._raf) return;
    track._raf = requestAnimationFrame(function(){ track._raf = null; update(); });
  }, { passive:true });
  var down = false, startX = 0, startScroll = 0;
  track.addEventListener('mousedown', function(e){
    down = true; startX = e.pageX; startScroll = track.scrollLeft; track.classList.add('is-dragging');
  });
  window.addEventListener('mouseup', function(){ down = false; track.classList.remove('is-dragging'); });
  window.addEventListener('mousemove', function(e){
    if (!down) return;
    e.preventDefault();
    track.scrollLeft = startScroll - (e.pageX - startX);
  });
  track.addEventListener('click', function(e){
    if (track.classList.contains('is-dragging')) e.preventDefault();
  }, true);
  window.addEventListener('resize', function(){ setTimeout(update, 120); });
  update();
})();

/* ---------- 7. STREET GALLERY (40 slot dinamis) ---------- */
(function(){
  var grid = document.getElementById('sg-grid');
  if (!grid) return;
  var TOTAL = parseInt(grid.getAttribute('data-total'), 10) || 40;
  var EXT = ['jpg','jpeg','png','webp','avif'];
  var loaded = [];

  function layoutClass(i){
    var pat = ['big','tall','normal','wide','normal','normal','tall','wide','normal','normal'];
    return pat[i % pat.length];
  }

  function tryLoad(slot, extIdx){
    if (extIdx >= EXT.length) return;
    var url = 'img/' + slot + '.' + EXT[extIdx];
    var img = new Image();
    img.onload = function(){
      var item = document.createElement('div');
      var cls = layoutClass(loaded.length);
      item.className = 'sg-item' + (cls !== 'normal' ? ' ' + cls : '');
      item.setAttribute('data-src', url);
      item.setAttribute('data-caption', 'Visual ' + slot);
      item.setAttribute('role','button');
      item.setAttribute('tabindex','0');
      var imgEl = document.createElement('img');
      imgEl.src = url;
      imgEl.alt = 'Visual ' + slot;
      imgEl.loading = 'lazy';
      var overlay = document.createElement('div');
      overlay.className = 'sg-overlay';
      overlay.innerHTML = '<span class="sg-label">Jalan</span><span class="sg-caption">Visual ' + slot + '</span>';
      item.appendChild(imgEl);
      item.appendChild(overlay);
      grid.appendChild(item);
      loaded.push(item);
    };
    img.onerror = function(){ tryLoad(slot, extIdx + 1); };
    img.src = url;
  }

  for (var i = 1; i <= TOTAL; i++) tryLoad(i, 0);

  // Lightbox
  var setupTimer = null;
  function scheduleSetup(){
    if (setupTimer) clearTimeout(setupTimer);
    setupTimer = setTimeout(setupLightbox, 800);
  }
  function setupLightbox(){
    var items = Array.prototype.slice.call(document.querySelectorAll('.sg-item'));
    if (!items.length) return;
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lb-img');
    var lbCaption = document.getElementById('lb-caption');
    var lbCounter = document.getElementById('lb-counter');
    var lbClose = document.getElementById('lb-close');
    var lbPrev = document.getElementById('lb-prev');
    var lbNext = document.getElementById('lb-next');
    var current = 0;

    function open(i){
      current = i;
      var item = items[current];
      lbImg.src = item.getAttribute('data-src');
      lbCaption.textContent = item.getAttribute('data-caption') || '';
      lbCounter.textContent = (current + 1) + ' / ' + items.length;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      lbImg.src = '';
    }
    function nav(d){
      current = (current + d + items.length) % items.length;
      var item = items[current];
      lbImg.src = item.getAttribute('data-src');
      lbCaption.textContent = item.getAttribute('data-caption') || '';
      lbCounter.textContent = (current + 1) + ' / ' + items.length;
    }

    items.forEach(function(item, idx){
      if (item._lbBound) return;
      item._lbBound = true;
      item.addEventListener('click', function(){ open(idx); });
    });

    if (!lb._lbBound){
      lb._lbBound = true;
      lbClose.addEventListener('click', close);
      lbPrev.addEventListener('click', function(e){ e.stopPropagation(); nav(-1); });
      lbNext.addEventListener('click', function(e){ e.stopPropagation(); nav(1); });
      lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
      document.addEventListener('keydown', function(e){
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') nav(1);
        if (e.key === 'ArrowLeft') nav(-1);
      });
      var tx = 0;
      lb.addEventListener('touchstart', function(e){ tx = e.changedTouches[0].screenX; }, { passive:true });
      lb.addEventListener('touchend', function(e){
        var d = e.changedTouches[0].screenX - tx;
        if (Math.abs(d) > 50) nav(d > 0 ? -1 : 1);
      }, { passive:true });
    }
  }
  scheduleSetup();
  // Re-scan setiap 2 detik sekali saja (untuk lazy load)
  var recheck = setInterval(function(){
    if (loaded.length > 0){ scheduleSetup(); clearInterval(recheck); }
  }, 2000);
})();

/* ---------- 8. CAPABILITY TABS ---------- */
(function(){
  var tabs = document.querySelectorAll('.cap-tab');
  var panels = document.querySelectorAll('.cap-panel');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var id = tab.dataset.target;
      panels.forEach(function(p){ p.classList.toggle('is-active', p.id === id); });
    });
  });
})();

/* ---------- 9. PUBLICATION FILTERS ---------- */
(function(){
  var filters = document.querySelectorAll('.pub-filter');
  var items = document.querySelectorAll('.pub-item');
  filters.forEach(function(btn){
    btn.addEventListener('click', function(){
      filters.forEach(function(f){ f.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var y = btn.dataset.filter;
      items.forEach(function(it){
        it.style.display = (y === 'all' || it.dataset.year === y) ? '' : 'none';
      });
    });
  });
})();

/* ---------- 10. LOCKED FIELDS (passcode: 210454) ---------- */
(function(){
  var PASSCODE = '210454';
  var REVEAL = { nik: '7313100107970042', phone: '0853 4212 7321' };
  var unlocked = { nik:false, phone:false };

  var modal = document.getElementById('passcode-modal');
  var input = document.getElementById('passcode-input');
  var errEl = document.getElementById('passcode-error');
  var submitBtn = document.getElementById('passcode-submit');
  var closeBtn = document.getElementById('passcode-close');
  var fields = document.querySelectorAll('.locked-field');
  if (!modal) return;

  function openModal(){ modal.classList.add('is-open'); input.value = ''; input.classList.remove('is-error'); errEl.classList.remove('is-visible'); setTimeout(function(){ input.focus(); }, 150); }
  function closeModal(){ modal.classList.remove('is-open'); input.value = ''; input.classList.remove('is-error'); errEl.classList.remove('is-visible'); }
  function unlockField(name){
    document.querySelectorAll('.locked-field[data-field="' + name + '"]').forEach(function(el){
      el.classList.add('is-unlocked');
      var t = el.querySelector('.locked-text');
      if (t) t.textContent = REVEAL[name];
    });
    unlocked[name] = true;
  }
  function verify(){
    var v = input.value.trim();
    if (v === PASSCODE){ unlockField('nik'); unlockField('phone'); closeModal(); }
    else {
      input.classList.add('is-error'); errEl.classList.add('is-visible'); input.value = '';
      setTimeout(function(){ input.classList.remove('is-error'); input.focus(); }, 500);
    }
  }
  fields.forEach(function(el){
    el.addEventListener('click', function(){
      var n = el.dataset.field;
      if (unlocked[n]) return;
      openModal();
    });
  });
  submitBtn.addEventListener('click', verify);
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter') verify(); });
  input.addEventListener('input', function(){ this.value = this.value.replace(/\D/g,''); errEl.classList.remove('is-visible'); });
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){ if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });
})();

/* ---------- 11. MAP (dengan tema) ---------- */
(function(){
  var MAP_DISABLED = window.matchMedia('(max-width: 900px)').matches
                  || (('ontouchstart' in window) && window.innerWidth < 1024 && window.innerHeight > window.innerWidth);
  if (MAP_DISABLED){
    var frame = document.querySelector('.media-frame');
    if (frame){
      frame.innerHTML =
        '<div class="map-disabled-msg">' +
          '<div class="mdm-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>' +
          '<div class="mdm-title">Peta dinonaktifkan di perangkat mobile</div>' +
          '<div class="mdm-desc">Silakan buka halaman ini di desktop/tablet.</div>' +
        '</div>';
    }
    return;
  }

  var FIRMS_KEY = 'c6a4b324efbcdc1a20c6ed7c447803b3';
  var map = L.map('aqi-map', { center:[-2.5,118.0], zoom:5, zoomControl:true });

  var darkBase = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution:'© Esri', maxZoom:16 });
  var darkRef  = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom:16, opacity:0.9 });
  var lightBase= L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution:'© Esri', maxZoom:16 });
  var lightRef = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom:16, opacity:0.9 });

  darkBase.addTo(map); darkRef.addTo(map);
  window.__cvMap = map;
  window.__cvBasemap = { darkBase:darkBase, darkRef:darkRef, lightBase:lightBase, lightRef:lightRef };

  if (document.documentElement.getAttribute('data-theme') === 'light'){
    map.removeLayer(darkBase); map.removeLayer(darkRef);
    lightBase.addTo(map); lightRef.addTo(map);
  }

  var cities = [
    {n:'Banda Aceh',p:'Aceh',la:5.5483,lo:95.3238},{n:'Medan',p:'Sumatera Utara',la:3.5952,lo:98.6722},
    {n:'Padang',p:'Sumatera Barat',la:-0.9471,lo:100.4172},{n:'Pekanbaru',p:'Riau',la:0.5071,lo:101.4478},
    {n:'Batam',p:'Kepulauan Riau',la:1.0863,lo:104.0348},{n:'Jambi',p:'Jambi',la:-1.6101,lo:103.6131},
    {n:'Palembang',p:'Sumatera Selatan',la:-2.9761,lo:104.7754},{n:'Bengkulu',p:'Bengkulu',la:-3.8004,lo:102.2655},
    {n:'Bandar Lampung',p:'Lampung',la:-5.3971,lo:105.2663},{n:'Jakarta Pusat',p:'DKI Jakarta',la:-6.1805,lo:106.8284},
    {n:'Jakarta Selatan',p:'DKI Jakarta',la:-6.2615,lo:106.8106},{n:'Bekasi',p:'Jawa Barat',la:-6.2383,lo:106.9756},
    {n:'Depok',p:'Jawa Barat',la:-6.4025,lo:106.7942},{n:'Bogor',p:'Jawa Barat',la:-6.5971,lo:106.8060},
    {n:'Bandung',p:'Jawa Barat',la:-6.9175,lo:107.6191},{n:'Cirebon',p:'Jawa Barat',la:-6.7320,lo:108.5523},
    {n:'Semarang',p:'Jawa Tengah',la:-6.9667,lo:110.4167},{n:'Surakarta',p:'Jawa Tengah',la:-7.5755,lo:110.8243},
    {n:'Yogyakarta',p:'DI Yogyakarta',la:-7.7956,lo:110.3695},{n:'Surabaya',p:'Jawa Timur',la:-7.2575,lo:112.7521},
    {n:'Malang',p:'Jawa Timur',la:-7.9666,lo:112.6326},{n:'Jember',p:'Jawa Timur',la:-8.1845,lo:113.6681},
    {n:'Denpasar',p:'Bali',la:-8.6705,lo:115.2126},{n:'Mataram',p:'NTB',la:-8.5833,lo:116.1167},
    {n:'Kupang',p:'NTT',la:-10.1772,lo:123.6070},{n:'Pontianak',p:'Kalimantan Barat',la:-0.0263,lo:109.3425},
    {n:'Banjarmasin',p:'Kalimantan Selatan',la:-3.3186,lo:114.5944},{n:'Samarinda',p:'Kalimantan Timur',la:-0.5022,lo:117.1536},
    {n:'Balikpapan',p:'Kalimantan Timur',la:-1.2379,lo:116.8529},{n:'Tarakan',p:'Kalimantan Utara',la:3.3273,lo:117.5756},
    {n:'Makassar',p:'Sulawesi Selatan',la:-5.1477,lo:119.4327},{n:'Parepare',p:'Sulawesi Selatan',la:-4.0135,lo:119.6255},
    {n:'Palu',p:'Sulawesi Tengah',la:-0.8917,lo:119.8707},{n:'Kendari',p:'Sulawesi Tenggara',la:-3.9450,lo:122.4989},
    {n:'Gorontalo',p:'Gorontalo',la:0.5435,lo:123.0568},{n:'Manado',p:'Sulawesi Utara',la:1.4748,lo:124.8421},
    {n:'Mamuju',p:'Sulawesi Barat',la:-2.6766,lo:118.8887},{n:'Majene',p:'Sulawesi Barat',la:-3.5403,lo:118.9707},
    {n:'Polewali',p:'Sulawesi Barat',la:-3.4322,lo:119.3436},{n:'Mamasa',p:'Sulawesi Barat',la:-2.9500,lo:119.3667},
    {n:'Ambon',p:'Maluku',la:-3.6954,lo:128.1814},{n:'Jayapura',p:'Papua',la:-2.5916,lo:140.6690},
    {n:'Sorong',p:'Papua Barat',la:-0.8762,lo:131.2558},{n:'Manokwari',p:'Papua Barat',la:-0.8615,lo:134.0620},
    {n:'Merauke',p:'Papua',la:-8.4932,lo:140.4018}
  ];

  var aqiCluster = L.markerClusterGroup({ maxClusterRadius:60, disableClusteringAtZoom:9 });
  var weatherCluster = L.markerClusterGroup({ maxClusterRadius:60, disableClusteringAtZoom:9 });
  var gempaLayer = L.layerGroup();
  var fireLayer = L.layerGroup();

  var HOME_LAT = -2.681803, HOME_LON = 118.859484;
  L.marker([HOME_LAT, HOME_LON], {
    icon: L.divIcon({
      className:'home-marker',
      html:'<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(140deg,#d7f36a,#a8e05f);border:2px solid #fff;box-shadow:0 0 0 3px rgba(10,10,10,.9),0 0 24px rgba(215,243,106,.7);display:grid;place-items:center;">🏠</div>',
      iconSize:[34,34], iconAnchor:[17,17]
    })
  }).addTo(map).bindPopup('◆ Rumah — Mamuju<br>Kec. Mamuju, Sulawesi Barat');

  function fmt(v){ return (v!=null && !isNaN(v)) ? Number(v).toFixed(1) : '—'; }

  // AQI
  function getAQIColor(aqi){ return aqi<=50?'#00e400':aqi<=100?'#ffff00':aqi<=150?'#ff7e00':aqi<=200?'#ff0000':aqi<=300?'#8f3f97':'#7e0023'; }
  function getAQILabel(aqi){ return aqi<=50?'Baik':aqi<=100?'Sedang':aqi<=150?'Tidak Sehat (Sensitif)':aqi<=200?'Tidak Sehat':aqi<=300?'Sangat Tidak Sehat':'Berbahaya'; }

  cities.forEach(function(city, idx){
    setTimeout(function(){
      fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude='+city.la+'&longitude='+city.lo+'&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide&timezone=Asia%2FMakassar')
        .then(function(r){ return r.json(); })
        .then(function(data){
          if (!data.current || data.current.us_aqi === undefined) return;
          var aqi = Math.round(data.current.us_aqi);
          var color = getAQIColor(aqi);
          var size = 12 + Math.min(aqi,250)/250*14;
          var marker = L.marker([city.la, city.lo], {
            icon: L.divIcon({
              className:'aqi-marker',
              html:'<div style="width:'+size+'px;height:'+size+'px;background:'+color+';border:2px solid rgba(255,255,255,.85);border-radius:50%;box-shadow:0 0 12px '+color+';"></div>',
              iconSize:[size,size], iconAnchor:[size/2,size/2]
            })
          }).bindPopup(
            '<span class="aqi-popup-title">'+city.n+'</span>' +
            '<span class="aqi-popup-label">'+city.p+'</span><br><br>' +
            '<span class="aqi-popup-value">'+aqi+'</span>' +
            '<span class="aqi-popup-label">US AQI — '+getAQILabel(aqi)+'</span><br>' +
            '<span class="aqi-popup-label">PM2.5: '+fmt(data.current.pm2_5)+' µg/m³</span>'
          );
          aqiCluster.addLayer(marker);
        })
        .catch(function(){});
    }, idx * 100);
  });

  // Cuaca
  function getRainColor(mm){ return mm<0.1?'#6bcb77':mm<1?'#7ce7ff':mm<5?'#4fc3f7':mm<20?'#2196f3':mm<50?'#1565c0':'#0d47a1'; }
  cities.forEach(function(city, idx){
    setTimeout(function(){
      fetch('https://api.open-meteo.com/v1/forecast?latitude='+city.la+'&longitude='+city.lo+'&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FMakassar')
        .then(function(r){ return r.json(); })
        .then(function(data){
          if (!data.current) return;
          var rain = data.current.precipitation || 0;
          var size = 12 + Math.min(rain*1.5, 14);
          var color = getRainColor(rain);
          var marker = L.marker([city.la, city.lo], {
            icon: L.divIcon({
              className:'weather-marker',
              html:'<div style="width:'+size+'px;height:'+size+'px;background:'+color+';border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px '+color+';"></div>',
              iconSize:[size,size], iconAnchor:[size/2,size/2]
            })
          }).bindPopup(
            '<span class="wx-popup-title">◆ Cuaca</span>' +
            '<span class="wx-popup-label">'+city.n+'</span><br>' +
            '<span class="wx-popup-temp">'+fmt(data.current.temperature_2m)+'°C</span>' +
            '<span class="wx-popup-label">Hujan: '+fmt(rain)+' mm</span><br>' +
            '<span class="wx-popup-label">Angin: '+fmt(data.current.wind_speed_10m)+' km/h</span>'
          );
          weatherCluster.addLayer(marker);
        })
        .catch(function(){});
    }, idx * 100);
  });

  // Gempa
  function getEqColor(m){ return m>=7?'#ff3d3d':m>=6?'#ff8c42':m>=5?'#ffd93d':m>=4?'#6bcb77':'#7ce7ff'; }
  function parseCoord(g){
    var p = (g.Coordinates||'').split(',');
    if (p.length !== 2) return null;
    var la = parseFloat(p[0]), lo = parseFloat(p[1]);
    return (isNaN(la)||isNaN(lo)) ? null : [la,lo];
  }
  Promise.all([
    fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json').then(function(r){return r.json();}).catch(function(){return null;}),
    fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json').then(function(r){return r.json();}).catch(function(){return null;})
  ]).then(function(results){
    var seen = {};
    results.forEach(function(data){
      if (!data || !data.Infogempa || !data.Infogempa.gempa) return;
      var arr = Array.isArray(data.Infogempa.gempa) ? data.Infogempa.gempa : [data.Infogempa.gempa];
      arr.forEach(function(g){
        var key = (g.DateTime||'') + '|' + (g.Coordinates||'');
        if (seen[key]) return; seen[key] = true;
        var c = parseCoord(g); if (!c) return;
        var mag = parseFloat(g.Magnitude)||0;
        var color = getEqColor(mag);
        var circle = L.circleMarker(c, { radius: Math.max(8,Math.min(28,mag*4)), fillColor:color, color:'#fff', weight:1.5, fillOpacity:0.55 });
        circle.bindPopup(
          '<span class="eq-popup-title">◆ Gempa</span>' +
          '<span class="eq-popup-mag">M '+mag.toFixed(1)+'</span>' +
          '<span class="eq-popup-label">'+(g.Wilayah||'—')+'</span>'
        );
        gempaLayer.addLayer(circle);
      });
    });
  });

  // Kebakaran
  function getFireColor(f){ return f>=100?'#ff1a1a':f>=50?'#ff6b00':f>=20?'#ffd93d':f>=5?'#6bcb77':'#7ce7ff'; }
  var bbox = '95,-11,141,6';
  ['VIIRS_SNPP_NRT','VIIRS_NOAA20_NRT','MODIS_NRT'].forEach(function(src){
    fetch('https://firms.modaps.eosdis.nasa.gov/api/area/csv/'+FIRMS_KEY+'/'+src+'/'+bbox+'/1')
      .then(function(r){ return r.text(); })
      .then(function(txt){
        var lines = txt.trim().split('\n');
        if (lines.length < 2) return;
        var h = lines[0].split(',');
        var latI = h.indexOf('latitude'), lonI = h.indexOf('longitude'), frpI = h.indexOf('frp');
        if (latI === -1 || lonI === -1) return;
        for (var i = 1; i < lines.length; i++){
          var cols = lines[i].split(',');
          var lat = parseFloat(cols[latI]), lon = parseFloat(cols[lonI]);
          if (isNaN(lat)||isNaN(lon)) continue;
          var frp = frpI !== -1 ? parseFloat(cols[frpI])||0 : 0;
          var color = getFireColor(frp);
          var circle = L.circleMarker([lat,lon], { radius: Math.max(5,Math.min(18,5+Math.log10(frp+1)*6)), fillColor:color, color:'#fff', weight:1.2, fillOpacity:0.5 });
          circle.bindPopup('<span class="fire-popup-title">◆ Titik Api</span><span class="fire-popup-frp">FRP '+frp.toFixed(1)+' MW</span>');
          fireLayer.addLayer(circle);
        }
      })
      .catch(function(){});
  });

  // Tab switching
  var mapTabs = document.querySelectorAll('.map-tab');
  var legendTitle = document.getElementById('legend-title');
  var legendContent = document.getElementById('legend-content');
  var mapWarning = document.getElementById('map-warning');

  function setTab(name){
    mapTabs.forEach(function(t){ t.classList.toggle('is-active', t.dataset.mapTab === name); });
    [aqiCluster, weatherCluster, gempaLayer, fireLayer].forEach(function(l){ if (map.hasLayer(l)) map.removeLayer(l); });
    if (mapWarning) mapWarning.style.display = 'none';

    if (name === 'aqi'){
      map.addLayer(aqiCluster);
      legendTitle.textContent = 'AQI Scale';
      legendContent.innerHTML = '<div class="legend-row"><span class="legend-dot" style="background:#00e400"></span> Baik (0–50)</div><div class="legend-row"><span class="legend-dot" style="background:#ffff00"></span> Sedang (51–100)</div><div class="legend-row"><span class="legend-dot" style="background:#ff7e00"></span> Sensitif (101–150)</div><div class="legend-row"><span class="legend-dot" style="background:#ff0000"></span> Tidak Sehat (151–200)</div>';
    } else if (name === 'cuaca'){
      map.addLayer(weatherCluster);
      legendTitle.textContent = 'Cuaca & Hujan';
      legendContent.innerHTML = '<div class="legend-row"><span class="legend-dot" style="background:#6bcb77"></span> Kering</div><div class="legend-row"><span class="legend-dot" style="background:#4fc3f7"></span> Ringan</div><div class="legend-row"><span class="legend-dot" style="background:#1565c0"></span> Lebat</div>';
    } else if (name === 'gempa'){
      map.addLayer(gempaLayer);
      legendTitle.textContent = 'Gempa BMKG';
      legendContent.innerHTML = '<div class="legend-row"><span class="legend-dot" style="background:#ff3d3d"></span> M ≥ 7.0</div><div class="legend-row"><span class="legend-dot" style="background:#ff8c42"></span> M 6.0–6.9</div><div class="legend-row"><span class="legend-dot" style="background:#ffd93d"></span> M 5.0–5.9</div><div class="legend-row"><span class="legend-dot" style="background:#6bcb77"></span> M 4.0–4.9</div>';
    } else if (name === 'kebakaran'){
      map.addLayer(fireLayer);
      legendTitle.textContent = 'Kebakaran NASA';
      legendContent.innerHTML = '<div class="legend-row"><span class="legend-dot" style="background:#ff1a1a"></span> FRP ≥ 100</div><div class="legend-row"><span class="legend-dot" style="background:#ff6b00"></span> FRP 50–99</div><div class="legend-row"><span class="legend-dot" style="background:#ffd93d"></span> FRP 20–49</div><div class="legend-row"><span class="legend-dot" style="background:#6bcb77"></span> FRP 5–19</div>';
      if (mapWarning) mapWarning.style.display = 'block';
    }
    setTimeout(function(){ map.invalidateSize(); }, 150);
  }

  mapTabs.forEach(function(t){
    t.addEventListener('click', function(){ setTab(t.dataset.mapTab); });
  });
  map.addLayer(aqiCluster);

  window.addEventListener('resize', function(){ setTimeout(function(){ map.invalidateSize(); }, 200); });
})();