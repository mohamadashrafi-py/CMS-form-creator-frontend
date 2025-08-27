<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">سازنده فرم</h3>
      <div>
        <button class="btn btn-outline-secondary me-2" @click="clearForm">
          <i class="bi bi-trash me-1"></i> پاک کردن
        </button>
        <button class="btn btn-primary me-2" @click="showExportModal">
          <i class="bi bi-save me-1"></i> ذخیره
        </button>
        <button class="btn btn-success" @click="togglePreview">
          <i class="bi bi-eye me-1"></i> پیش نمایش
        </button>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <div class="mb-3">
          <input 
            type="text" 
            class="form-control form-control-lg border-0 shadow-none"
            v-model="formTitle" 
            placeholder="عنوان فرم" 
            style="font-size: 1.75rem;"
          >
        </div>
        <div class="mb-3">
          <textarea 
            class="form-control border-0 shadow-none" 
            v-model="formDescription" 
            rows="2" 
            placeholder="توضیحات فرم"
          ></textarea>
        </div>
      </div>
    </div>

    <div id="formArea">
      <p v-if="fields.length === 0" class="text-muted text-center py-5">
        <i class="bi bi-plus-circle display-6 d-block mb-3"></i>
        برای شروع، فیلدی به فرم اضافه کنید
      </p>
      
      <FormField 
        v-for="field in fields" 
        :key="field.id" 
        :field="field" 
        :selected="selectedFieldId === field.id"
        @select="selectField"
        @delete="deleteField"
        @duplicate="duplicateField"
        @update:field="updateField"
      />
    </div>

    <div v-if="fields.length > 0" class="mt-4 text-center">
      <button class="btn btn-success btn-lg" @click="goToNextTab">
        <i class="bi bi-arrow-right-circle"></i> مرحله بعدی
      </button>
    </div>
  </div>
</template>

<script>
import FormField from './FormField.vue'

export default {
  name: 'FormArea',
  components: {
    FormField
  },
  data() {
    return {
      formTitle: '',
      formDescription: '',
      fields: [],
      selectedFieldId: null,
      fieldCounter: 0
    }
  },
  methods: {
    addField(type) {
      this.fieldCounter++;
      const newField = {
        id: `field_${this.fieldCounter}`,
        type: type,
        label: this.getDefaultLabel(type),
        description: '',
        required: false,
        placeholder: this.getDefaultPlaceholder(type)
      };
      
      if (type === 'select' || type === 'radio' || type === 'checkbox') {
        newField.options = [
          { value: 'option1', text: 'گزینه ۱' },
          { value: 'option2', text: 'گزینه ۲' }
        ];
      }
      
      this.fields.push(newField);
    },
    getDefaultLabel(type) {
      const labels = {
        'text': 'متن کوتاه',
        'textarea': 'متن بلند',
        'select': 'انتخاب از لیست',
        'radio': 'چند گزینه‌ای',
        'checkbox': 'چک باکس',
        'file': 'آپلود فایل',
        'date': 'تاریخ',
        'time': 'زمان',
        'scale': 'مقیاس',
        'section': 'عنوان بخش'
      };
      return labels[type] || 'فیلد جدید';
    },
    getDefaultPlaceholder(type) {
      const placeholders = {
        'text': 'متن کوتاه',
        'textarea': 'متن بلند'
      };
      return placeholders[type] || '';
    },
    selectField(fieldId) {
      this.selectedFieldId = fieldId;
    },
    deleteField(fieldId) {
      this.fields = this.fields.filter(field => field.id !== fieldId);
      if (this.selectedFieldId === fieldId) {
        this.selectedFieldId = null;
      }
    },
    duplicateField(fieldId) {
      const fieldToDuplicate = this.fields.find(field => field.id === fieldId);
      if (fieldToDuplicate) {
        this.fieldCounter++;
        const duplicatedField = JSON.parse(JSON.stringify(fieldToDuplicate));
        duplicatedField.id = `field_${this.fieldCounter}`;
        this.fields.push(duplicatedField);
      }
    },
    updateField(updatedField) {
      const index = this.fields.findIndex(field => field.id === updatedField.id);
      if (index !== -1) {
        this.fields.splice(index, 1, updatedField);
      }
    },
    clearForm() {
      if (confirm('آیا از پاک کردن تمام فیلدهای فرم اطمینان دارید؟')) {
        this.fields = []
        this.formTitle = ''
        this.formDescription = ''
        this.selectedFieldId = null
        this.fieldCounter = 0
      }
    },
    showExportModal() {
      // Implementation for export modal
      console.log('Show export modal')
    },
    togglePreview() {
      // Implementation for preview
      console.log('Toggle preview')
    },
    goToNextTab() {
      this.$emit('go-to-next-tab')
    }
  }
}
</script>