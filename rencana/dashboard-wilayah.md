# Rencana: Dashboard Wilayah

Disusun 4 November 2026. Status: rencana, belum ada kode.

## Gagasan

Peta Ilham's Journey sekarang menunjukkan ke mana Ilham pergi. Dashboard Wilayah
menambahkan lapisan kedua: saat sebuah wilayah dibuka, pengunjung melihat
(1) angka ringkas wilayah itu dari data yang sudah Ilham olah dan
(2) daftar analisis Ilham yang pernah mencakup wilayah itu.

Urutan bukaannya provinsi → kabupaten/kota → desa. Karakter pixel art tetap
menjadi cara berjalan di peta; dashboard adalah apa yang muncul ketika ia
berhenti di suatu tempat.

## Data yang sudah ada (di luar repo, `~/05_Research_Data/`)

| Sumber | Bentuk yang siap | Level terkecil yang boleh tampil | Catatan |
|---|---|---|---|
| PODES 2008–2024 | `13-PODES/PANEL/podes_panel_desa_6wave.dta` (487.864 baris), `turunan-kabkot/` | desa (lihat aturan lisensi di bawah) | 8 konsep belum aman lintas gelombang (`PANEL/BACA-DULU.md`); jangan dipakai |
| Susenas Kor 2000–2025 | `11_Susenas/08_Susenas_CR/sus_kabkot_2000_2025.dta` | kabupaten/kota | sampel tidak mewakili desa |
| Sakernas | `12_Sakernas/04_Sakernas_CR/` | kabupaten/kota | idem |
| Statistik Industri (IBS) 2000–2015 | `14-Statistik-Industri-IBS/03-SI-IBS-Panel/` | kabupaten/kota, minimal 3 perusahaan per sel | data perusahaan rahasia |
| Kabkot lain (IPM, PDRB, VIIRS, Sentinel-5P, GHSL, KEK, KI) | `01_Clean_Data/*.dta` | kabupaten/kota | sumber publik, aman |
| Desa lain (GEE, infrastruktur) | `01_Clean_Data/02-Village-Level-Data/` | desa | turunan citra, aman |
| Peta desa | `31_Geopackage/01_Map_Indonesia/10-VLV3-*` (±470 MB) | desa | harus disederhanakan dan dipecah |

## Aturan isi (mengikuti batas situs publik)

1. **Mikrodata BPS tidak pernah masuk repo.** Skrip membaca `.dta` dari
   `~/05_Research_Data/` dan hanya menulis JSON agregat ke `data/dashboard/`.
2. **Desa:** hanya indikator turunan (ada/tidak, kategori, kuintil, indeks),
   bukan nilai mentah per butir kuesioner PODES. Sebelum tahap desa tayang,
   Ilham memeriksa syarat pemakaian data BPS yang ia tanda tangani.
3. **Susenas dan Sakernas** berhenti di kabupaten/kota.
4. **IBS** hanya agregat kabupaten/kota; sel dengan kurang dari 3 perusahaan
   dikosongkan.
5. Tidak ada hasil sementara proyek yang masih berjalan. Analisis baru masuk
   daftar hanya kalau halaman ringkasannya sudah tayang di `riset/` atau `proyek/`.
6. Semua teks di halaman berbahasa Inggris gaya World Bank; setiap angka
   bersumber (nama survei, tahun, BPS).

## Bagian yang dibangun

### 1. Daftar analisis per wilayah (`data/analisis-wilayah.json`)

Satu sumber untuk pertanyaan "analisis apa saja yang pernah dilakukan di sini".
Menggantikan `PAPER` dan `paperWilayah()` di `perjalanan.js` serta melengkapi
`data/lokasi-paper.json`.

```json
{
  "slug": "trans-java-toll-road",
  "judul": "The Trans-Java Toll Road and East Java's economy",
  "halaman": "riset/trans-java-toll-road.html",
  "tahun": 2025,
  "data": ["PDRB", "VIIRS"],
  "level": "kab",
  "cakupan": ["35"]
}
```

`cakupan` berisi kode BPS: 2 digit = seluruh provinsi, 4 digit (`35.78`) =
kabupaten/kota, 10 digit = desa (untuk survei PENSAR dan kerja lapangan
Semarang). Wilayah mewarisi analisis dari tingkat di atasnya, jadi desa di
Surabaya otomatis menampilkan paper Jawa Timur.

### 2. Halaman `dashboard.html`

- Peta memakai ulang `peta-data.js` (514 kabupaten/kota) dan gaya peta Journey.
- Panel samping: nama wilayah, kartu indikator, grafik garis lintas gelombang,
  daftar analisis dari bagian 1.
- Pilihan indikator di atas peta untuk mewarnai kabupaten/kota (choropleth).
- Alamat bisa dibagikan: `dashboard.html#w=35.78`.
- Masuk menu situs sebagai "Dashboard".

### 3. Data kabupaten/kota (`data/dashboard/kab.json`)

Satu berkas, 514 baris, ±10–15 indikator per gelombang. Usulan awal:

- PODES: desa dengan pasar, bank/agen, SMA, puskesmas, jalan aspal, BUMDes,
  rawan banjir (persen desa).
- Susenas: rata-rata lama sekolah, akses air minum layak, sanitasi, listrik PLN.
- Kabkot lain: IPM, PDRB per kapita, cahaya malam (VIIRS), status KEK/KI.
- IBS: jumlah perusahaan dan tenaga kerja industri besar dan sedang.

### 4. Data desa (`data/dashboard/desa/{kode-kab}.json`)

- Satu berkas per kabupaten/kota, dimuat hanya saat kabupaten itu dibuka.
- Poligon disederhanakan (target ≤150 KB per berkas); kalau terlalu berat,
  mulai dengan titik pusat desa dari `10-VLV3-Centroid-*.gpkg`.
- Batas dan kode desa mengikuti `turunan-kabkot/xw_desa_podes_ke_kab2022`
  supaya cocok dengan batas kabupaten 2022 di `peta-data.js`.

### 5. Sambungan ke Ilham's Journey

- Kartu kota di Journey mendapat tombol "Explore the data" ke
  `dashboard.html#w=<kode>`.
- Kabupaten yang belum dikunjungi tetap menampilkan paper dari bagian 1.
- Nanti: karakter pixel art bisa diperbesar sampai tingkat desa, dan desa
  survei PENSAR (Malioboro, Tabanan, Bangka Tengah) diberi penanda khusus.

### 6. Skrip pembangun (`alat/buat_data_dashboard.py`)

Membaca `.dta` dan `.gpkg` dari `~/05_Research_Data/` (pandas, geopandas),
menerapkan aturan isi di atas (termasuk sensor sel IBS < 3), lalu menulis JSON.
Dijalankan ulang setiap kali panel dibangun ulang. Daftar indikator dan
sumbernya ditulis di `alat/indikator-dashboard.csv` supaya mudah ditambah.

## Tahapan

| Tahap | Isi | Selesai bila |
|---|---|---|
| 0 | `analisis-wilayah.json`; `perjalanan.js` membaca dari situ | Journey tampil sama seperti sekarang |
| 1 | `dashboard.html` tingkat kabupaten/kota dengan data publik (IPM, PDRB, VIIRS, KEK) dan daftar analisis | halaman bisa dibuka dari menu dan dari kartu Journey |
| 2 | tambah indikator PODES dan Susenas tingkat kabupaten/kota | angka cocok dengan tabel di paper yang sudah terbit |
| 3 | lapisan desa untuk kabupaten yang punya analisis (Kota Semarang, Kendal, Demak, Yogyakarta, Tabanan, Bangka Tengah) | ukuran berkas desa sesuai target; Ilham sudah cek lisensi PODES |
| 4 | lapisan desa seluruh Indonesia dan perbandingan dua wilayah | semua 514 berkas desa terbangun |

## Keputusan yang menunggu Ilham

1. Indikator PODES tingkat desa apa yang boleh tampil menurut perjanjian data BPS.
2. Daftar 10–15 indikator kabupaten/kota final (usulan di bagian 3).
3. Apakah proyek KOMITMEN dan proyek lain yang masih menunggu laporan publik
   masuk daftar analisis setelah laporannya terbit.
