<template>
  <div class="field-types-sidebar">
    <h5 class="mb-4">عناصر فرم</h5>
    <div class="d-grid gap-2">
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'text')">
        <i class="bi bi-text-paragraph me-2"></i> متن کوتاه
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'textarea')">
        <i class="bi bi-textarea-t me-2"></i> متن بلند
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'select')">
        <i class="bi bi-menu-button me-2"></i> انتخاب از لیست
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'radio')">
        <i class="bi bi-ui-radios me-2"></i> چند گزینه‌ای
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'checkbox')">
        <i class="bi bi-check2-square me-2"></i> چک باکس
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'file')">
        <i class="bi bi-upload me-2"></i> آپلود فایل
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'date')">
        <i class="bi bi-calendar me-2"></i> تاریخ
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'time')">
        <i class="bi bi-clock me-2"></i> زمان
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'scale')">
        <i class="bi bi-list-stars me-2"></i> مقیاس
      </button>
      <button class="btn btn-outline-primary text-start" @click="$emit('add-field', 'section')">
        <i class="bi bi-layers me-2"></i> بخش جدید
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldTypes',
  emits: ['add-field']
}
</script>

<style scoped>
.field-types-sidebar {
  padding: 20px;
  background-color: #f8f9fa;
  height: 100%;
  border-right: 1px solid #dee2e6;
}
</style>