# 🚀 Fadev Proxy

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)
![License](https://img.shields.io/badge/license-MIT-green)

**Fadev Proxy** is a simple yet powerful proxy server built on Cloudflare Workers. This proxy is designed to bypass CORS issues, perform web scraping, and access resources from various APIs with ease.

## ✨ Features

- ✅ **Simple Proxy** - Forward requests to target URLs easily
- ✅ **CORS Enabled** - All responses include complete CORS headers
- ✅ **All Methods Supported** - GET, POST, PUT, DELETE, OPTIONS
- ✅ **Scraping Ready** - Forward headers for scraping needs
- ✅ **Information Page** - User-friendly landing page
- ✅ **Error Handling** - Proper error management
- ✅ **Easy Deploy** - Ready to deploy to Cloudflare Workers in minutes

## 🎯 Demo

**Base URL:** `https://fadev.proxyyy.workers.dev/?url=`

Try it now:
- [Get Post #1](https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/posts/1)
- [Get All Users](https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/users)
- [Get Comments](https://fadev.proxyyy.workers.dev/?url=https://jsonplaceholder.typicode.com/comments?postId=1)

### Examples
```bash
# GET request
curl "https://fadev.proxyyy.workers.dev/?url=https://api.example.com/data"

# With custom headers
curl -H "User-Agent: Mozilla/5.0" \
     "https://fadev.proxyyy.workers.dev/?url=https://api.example.com/data"