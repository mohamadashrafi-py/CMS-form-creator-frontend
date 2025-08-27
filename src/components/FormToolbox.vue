<template>
  <div class="sticky-top pt-3">
    <h5 class="mb-4">عناصر فرم</h5>
    <div class="d-grid gap-2">
      <button 
        v-for="field in fieldTypes" 
        :key="field.type"
        class="btn btn-outline-primary text-start"
        @click="addField(field.type)"
      >
        <i :class="field.icon + ' me-2'"></i> {{ field.label }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormToolbox',
  data() {
    return {
      fieldTypes: [
        { type: 'text', label: 'متن کوتاه', icon: 'bi bi-text-paragraph' },
        { type: 'textarea', label: 'متن بلند', icon: 'bi bi-textarea-t' },
        { type: 'select', label: 'انتخاب از لیست', icon: 'bi bi-menu-button' },
        { type: 'radio', label: 'چند گزینه‌ای', icon: 'bi bi-ui-radios' },
        { type: 'checkbox', label: 'چک باکس', icon: 'bi bi-check2-square' },
        { type: 'file', label: 'آپلود فایل', icon: 'bi bi-upload' },
        { type: 'date', label: 'تاریخ', icon: 'bi bi-calendar' },
        { type: 'time', label: 'زمان', icon: 'bi bi-clock' },
        { type: 'scale', label: 'مقیاس', icon: 'bi bi-list-stars' },
        { type: 'section', label: 'بخش جدید', icon: 'bi bi-layers' }
      ]
    }
  },
  methods: {
    addField(type) {
      this.$emit('add-field', type)
    }
  }
}
</script>