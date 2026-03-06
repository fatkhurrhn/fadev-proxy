# 🚀 Fadev Proxy

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)
![License](https://img.shields.io/badge/license-MIT-green)

**Fadev Proxy** adalah server proxy sederhana namun powerful yang dibangun di atas Cloudflare Workers. Proxy ini dirancang untuk mengatasi masalah CORS, melakukan web scraping, dan mengakses resource dari berbagai API dengan mudah.

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Demo](#-demo)
- [Cara Penggunaan](#-cara-penggunaan)
- [Panduan Scraping](#-panduan-scraping)
- [Instalasi Lokal](#-instalasi-lokal)
- [Deploy ke Cloudflare](#-deploy-ke-cloudflare)
- [API Reference](#-api-reference)
- [Contoh Kode](#-contoh-kode)
- [Tips & Trik](#-tips--trik)
- [Lisensi](#-lisensi)

## ✨ Fitur

- ✅ **Proxy Sederhana** - Forward request ke URL target dengan mudah
- ✅ **CORS Enabled** - Semua response memiliki header CORS lengkap
- ✅ **Support Semua Method** - GET, POST, PUT, DELETE, OPTIONS
- ✅ **Scraping Ready** - Bisa meneruskan headers untuk kebutuhan scraping
- ✅ **Halaman Informasi** - Landing page yang informatif dan user-friendly
- ✅ **Error Handling** - Penanganan error yang baik
- ✅ **Deploy Mudah** - Siap deploy ke Cloudflare Workers dalam hitungan menit

## 🎯 Demo

**Base URL:** `https://fadev.proxyyy.workers.dev/?url=`

Coba langsung:
- [Ambil Post #1](https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/posts/1)
- [Ambil Semua Users](https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/users)
- [Ambil Comments](https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/comments?postId=1)

### Contoh
```bash
# GET request
curl "https://fadev.proxyyy.workers.dev/?url=https://api.example.com/data"

# Dengan headers kustom
curl -H "User-Agent: Mozilla/5.0" \
     "https://fadev.proxyyy.workers.dev/?url=https://api.example.com/data"
