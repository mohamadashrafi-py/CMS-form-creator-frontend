<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-primary mb-3">فرم شما آماده انتشار است!</h2>
          <p class="lead text-muted">اکنون می‌توانید فرم خود را از طریق لینک مستقیم، شبکه‌های اجتماعی یا کد QR به اشتراک بگذارید.</p>
        </div>

        <div class="row g-4">
          <!-- Link Sharing Card -->
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-soft-primary rounded-circle p-3 d-inline-block mb-3">
                  <i class="bi bi-link-45deg fs-2 text-primary"></i>
                </div>
                <h4 class="mb-3">اشتراک گذاری لینک</h4>
                <p class="text-muted mb-4">این لینک را می‌توانید با دیگران به اشتراک بگذارید:</p>

                <div class="input-group mb-3">
                  <input type="text" class="form-control" :value="formLink" readonly>
                  <button class="btn btn-primary" type="button" @click="copyFormLink">
                    <i class="bi bi-clipboard"></i>
                  </button>
                </div>

                <button class="btn btn-outline-primary w-100 mt-2" @click="copyFormLink">
                  <i class="bi bi-code me-2"></i>کپی لینک
                </button>
              </div>
            </div>
          </div>

          <!-- Social Media Card -->
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-soft-info rounded-circle p-3 d-inline-block mb-3">
                  <i class="bi bi-share fs-2 text-info"></i>
                </div>
                <h4 class="mb-3">شبکه‌های اجتماعی</h4>
                <p class="text-muted mb-4">فرم خود را در پلتفرم‌های مختلف به اشتراک بگذارید:</p>

                <div class="d-flex flex-wrap justify-content-center gap-2">
                  <button class="btn btn-outline-primary btn-icon rounded-circle" @click="shareOnTelegram">
                    <i class="bi bi-telegram"></i>
                  </button>
                  <button class="btn btn-outline-success btn-icon rounded-circle" @click="shareOnWhatsApp">
                    <i class="bi bi-whatsapp"></i>
                  </button>
                  <button class="btn btn-outline-info btn-icon rounded-circle" @click="shareOnTwitter">
                    <i class="bi bi-twitter"></i>
                  </button>
                </div>

                <button class="btn btn-soft-info w-100 mt-3" @click="showEmailOptions">
                  <i class="bi bi-envelope me-2"></i>ارسال ایمیل
                </button>
              </div>
            </div>
          </div>

          <!-- QR Code Card -->
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-soft-warning rounded-circle p-3 d-inline-block mb-3">
                  <i class="bi bi-qr-code fs-2 text-warning"></i>
                </div>
                <h4 class="mb-3">کد QR</h4>
                <p class="text-muted mb-4">اسکن کنید یا چاپ نمایید:</p>

                <div class="bg-white p-3 rounded d-inline-block mb-3 border">
                  <img :src="qrCodeUrl" alt="QR Code" class="img-fluid" width="150">
                </div>

                <div class="d-flex gap-2 justify-content-center">
                  <button class="btn btn-outline-secondary" @click="downloadQRCode">
                    <i class="bi bi-download me-2"></i>دانلود
                  </button>
                  <button class="btn btn-warning" @click="printQRCode">
                    <i class="bi bi-printer me-2"></i>چاپ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Options -->
        <div class="card border-0 shadow-sm mt-4">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6">
                <h5 class="mb-3">گزینه‌های پیشرفته انتشار</h5>
                <ul class="list-unstyled">
                  <li class="mb-2">
                    <i class="bi bi-shield-lock text-success me-2"></i>
                    <a href="#" class="text-decoration-none">تنظیمات حریم خصوصی</a>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-people text-primary me-2"></i>
                    <a href="#" class="text-decoration-none">محدود کردن دسترسی</a>
                  </li>
                  <li class="mb-2">
                    <i class="bi bi-calendar-check text-info me-2"></i>
                    <a href="#" class="text-decoration-none">تعیین تاریخ انقضا</a>
                  </li>
                </ul>
              </div>
              <div class="col-md-6 border-start">
                <h5 class="mb-3">آمار و تحلیل‌ها</h5>
                <div class="d-flex align-items-center mb-2">
                  <div class="flex-shrink-0">
                    <i class="bi bi-eye-fill text-purple"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <small class="text-muted d-block">بازدیدها</small>
                    <h6 class="mb-0">0</h6>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-2">
                  <div class="flex-shrink-0">
                    <i class="bi bi-check-circle-fill text-success"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <small class="text-muted d-block">تکمیل‌شده</small>
                    <h6 class="mb-0">0</h6>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <i class="bi bi-clock-history text-warning"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <small class="text-muted d-block">میانگین زمان</small>
                    <h6 class="mb-0">0 ثانیه</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <button class="btn btn-primary btn-lg px-4 me-3" @click="publishForm">
            <i class="bi bi-send-check me-2"></i>انتشار نهایی
          </button>
          <button class="btn btn-outline-secondary btn-lg px-4" @click="saveAsDraft">
            <i class="bi bi-save me-2"></i>ذخیره پیش‌نویس
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublishSettings',
  data() {
    return {
      formLink: 'https://example.com/form/abc123',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/form/abc123'
    }
  },
  methods: {
    copyFormLink() {
      navigator.clipboard.writeText(this.formLink)
        .then(() => {
          alert('لینک کپی شد!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    },
    shareOnTelegram() {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(this.formLink)}`, '_blank');
    },
    shareOnWhatsApp() {
      window.open(`https://wa.me/?text=${encodeURIComponent(this.formLink)}`, '_blank');
    },
    shareOnTwitter() {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.formLink)}`, '_blank');
    },
    showEmailOptions() {
      // Implement email options
      console.log('Show email options');
    },
    downloadQRCode() {
      // Implement QR code download
      console.log('Download QR code');
    },
    printQRCode() {
      window.print();
    },
    publishForm() {
      // Implement publish form
      console.log('Publish form');
      alert('فرم شما با موفقیت منتشر شد!');
    },
    saveAsDraft() {
      // Implement save as draft
      console.log('Save as draft');
      alert('فرم شما به عنوان پیش‌نویس ذخیره شد.');
    }
  }
}
</script>

<style scoped>
.bg-soft-primary {
  background-color: rgba(103, 58, 183, 0.1);
}

.bg-soft-info {
  background-color: rgba(23, 162, 184, 0.1);
}

.bg-soft-warning {
  background-color: rgba(255, 193, 7, 0.1);
}

.btn-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>