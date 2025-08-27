<template>
  <div class="container-fluid py-3">
    <div class="row">
      <!-- Design Preview Area -->
      <div class="col-lg-8 order-lg-2 py-3">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">پیش نمایش فرم</h5>
          </div>
          <div class="card-body">
            <div id="designPreview" class="p-4">
              <h3 :style="{ color: currentTheme }">{{ formTitle || 'فرم بدون عنوان' }}</h3>
              <p v-if="formDescription" class="text-muted mb-4">{{ formDescription }}</p>
              
              <div v-for="field in formFields" :key="field.id" class="mb-3">
                <label class="form-label">
                  {{ field.label }} <span v-if="field.required" class="text-danger">*</span>
                </label>
                
                <!-- Text field -->
                <input 
                  v-if="field.type === 'text'" 
                  type="text" 
                  class="form-control" 
                  :placeholder="field.placeholder || 'پاسخ شما'"
                >
                
                <!-- Textarea field -->
                <textarea 
                  v-else-if="field.type === 'textarea'" 
                  class="form-control" 
                  rows="3" 
                  :placeholder="field.placeholder || 'پاسخ شما'"
                ></textarea>
                
                <!-- Select field -->
                <select v-else-if="field.type === 'select'" class="form-select">
                  <option v-for="(option, index) in field.options" :key="index" :value="option.value">
                    {{ option.text }}
                  </option>
                </select>
                
                <!-- Radio buttons -->
                <template v-else-if="field.type === 'radio'">
                <div v-for="(option, index) in field.options" :key="'radio-' + field.id + '-' + index" class="form-check">
                    <input class="form-check-input" type="radio" :name="field.id" :id="field.id + '_' + index">
                    <label class="form-check-label" :for="field.id + '_' + index">{{ option.text }}</label>
                </div>
                <div class="mt-2">
                    <button class="btn btn-sm btn-outline-secondary" @click.stop="addRadioOption">
                    <i class="bi bi-plus"></i> افزودن گزینه
                    </button>
                </div>
                </template>

                <!-- Checkboxes -->
                <template v-else-if="field.type === 'checkbox'">
                <div v-for="(option, index) in field.options" :key="'checkbox-' + field.id + '-' + index" class="form-check">
                    <input class="form-check-input" type="checkbox" :id="field.id + '_' + index">
                    <label class="form-check-label" :for="field.id + '_' + index">{{ option.text }}</label>
                </div>
                <div class="mt-2">
                    <button class="btn btn-sm btn-outline-secondary" @click.stop="addCheckboxOption">
                    <i class="bi bi-plus"></i> افزودن گزینه
                    </button>
                </div>
                </template>
                            
                <!-- File upload -->
                <input v-else-if="field.type === 'file'" type="file" class="form-control">
                
                <!-- Date field -->
                <input v-else-if="field.type === 'date'" type="date" class="form-control">
                
                <!-- Time field -->
                <input v-else-if="field.type === 'time'" type="time" class="form-control">
                
                <!-- Section divider -->
                <div v-else-if="field.type === 'section'" class="section-divider">
                  <h4>{{ field.label }}</h4>
                  <p v-if="field.description" class="text-muted">{{ field.description }}</p>
                </div>
              </div>
              
              <button class="btn mt-3" :style="{ backgroundColor: currentTheme, color: 'white' }">
                ارسال
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Design Controls Sidebar -->
      <div class="col-lg-4 order-lg-1 py-3">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-pills nav-pill-soft" id="designTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="theme-tab" data-bs-toggle="pill" 
                        data-bs-target="#theme-tab-pane" type="button" role="tab" 
                        aria-controls="theme-tab-pane" aria-selected="true">
                  <i class="bi bi-palette me-1"></i> تم‌ها
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="custom-tab" data-bs-toggle="pill" 
                        data-bs-target="#custom-tab-pane" type="button" role="tab" 
                        aria-controls="custom-tab-pane" aria-selected="false">
                  <i class="bi bi-sliders me-1"></i> سفارشی
                </button>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <div class="tab-content" id="designTabsContent">
              <!-- Themes Tab -->
              <div class="tab-pane fade show active" id="theme-tab-pane" role="tabpanel" aria-labelledby="theme-tab">
                <h6 class="mb-3">رنگ اصلی فرم</h6>
                <div class="row g-2 mb-4">
                  <div class="col-6" v-for="theme in themes" :key="theme.color">
                    <div class="theme-option p-3 rounded text-center" 
                         :style="{ backgroundColor: theme.color }"
                         @click="changeTheme(theme.color)">
                      <span :style="{ color: theme.textColor }">{{ theme.name }}</span>
                    </div>
                  </div>
                </div>

                <h6 class="mb-3">طرح‌بندی</h6>
                <div class="row g-2">
                  <div class="col-6">
                    <div class="theme-option p-3 rounded text-center border" @click="changeLayout('default')">
                      <i class="bi bi-layout-text-sidebar display-5 d-block mb-2"></i>
                      <span>پیش‌فرض</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="theme-option p-3 rounded text-center border" @click="changeLayout('centered')">
                      <i class="bi bi-layout-centered display-5 d-block mb-2"></i>
                      <span>متمرکز</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom Tab -->
              <div class="tab-pane fade" id="custom-tab-pane" role="tabpanel" aria-labelledby="custom-tab">
                <h6 class="mb-3">رنگ اصلی فرم</h6>
                <div class="color-picker-wrapper mb-3">
                  <input type="color" class="form-control form-control-color w-100" 
                         v-model="currentTheme" title="انتخاب رنگ اصلی">
                  <label class="form-label small text-muted mt-1 d-block">
                    رنگ اصلی: <span>{{ currentTheme }}</span>
                  </label>
                </div>

                <div class="mb-3">
                  <h6 class="mb-3">فونت فرم</h6>
                  <select class="form-select" v-model="fontFamily">
                    <option value="Vazir, sans-serif" selected>Vazir (پیش‌فرض)</option>
                    <option value="Tahoma, sans-serif">Tahoma</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Segoe UI', sans-serif">Segoe UI</option>
                  </select>
                </div>

                <div class="mb-3">
                  <h6 class="mb-3">اندازه فونت عنوان</h6>
                  <input type="range" class="form-range" min="1" max="3" step="0.1" v-model="titleFontSize">
                  <div class="d-flex justify-content-between">
                    <small class="text-muted">کوچک</small>
                    <small class="text-muted">بزرگ</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 text-center">
      <button class="btn btn-success btn-lg" @click="goToPublishTab">
        <i class="bi bi-arrow-right-circle"></i> مرحله بعدی
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesignSettings',
  props: {
    formTitle: String,
    formDescription: String,
    formFields: Array
  },
  data() {
    return {
      currentTheme: '#673ab7',
      fontFamily: 'Vazir, sans-serif',
      titleFontSize: 1.5,
      themes: [
        { color: '#673ab7', name: 'بنفش', textColor: 'white' },
        { color: '#3f51b5', name: 'نیلی', textColor: 'white' },
        { color: '#2196f3', name: 'آبی', textColor: 'white' },
        { color: '#03a9f4', name: 'فیروزه‌ای', textColor: 'white' },
        { color: '#00bcd4', name: 'سیان', textColor: 'white' },
        { color: '#009688', name: 'سبز آبی', textColor: 'white' },
        { color: '#4caf50', name: 'سبز', textColor: 'white' },
        { color: '#8bc34a', name: 'سبز روشن', textColor: 'black' }
      ]
    }
  },
  methods: {
    changeTheme(color) {
      this.currentTheme = color;
      document.documentElement.style.setProperty('--primary-color', color);
    },
    changeLayout(layout) {
      // Implement layout change logic
      console.log('Layout changed to:', layout);
    },
    goToPublishTab() {
      this.$emit('go-to-publish');
    }
  },
  mounted() {
    // Apply initial theme
    document.documentElement.style.setProperty('--primary-color', this.currentTheme);
  }
}
</script>

<style scoped>
.theme-option {
  cursor: pointer;
  transition: all 0.2s;
}

.theme-option:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-picker-wrapper {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-divider {
  border-top: 2px dashed #ccc;
  padding-top: 1rem;
  margin-top: 1rem;
}
</style>