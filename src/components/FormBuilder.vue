<template>
  <div class="form-builder">
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
      
      <div v-for="field in fields" :key="field.id" class="mb-4 draggable-card">
        <div class="card form-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="w-100 me-3">
                <input 
                  type="text" 
                  class="form-control border-0 shadow-none field-label-input p-0 mb-1" 
                  v-model="field.label"
                  placeholder="عنوان فیلد"
                  style="font-size: 1.1rem; font-weight: 500;"
                >
                <input 
                  type="text" 
                  class="form-control border-0 shadow-none field-description-input p-0" 
                  v-model="field.description"
                  placeholder="توضیحات (اختیاری)"
                  style="font-size: 0.9rem;"
                >
              </div>
              <div class="field-actions">
                <button class="btn btn-sm btn-outline-secondary me-1" @click="duplicateField(field)">
                  <i class="bi bi-files"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteField(field)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            
            <!-- Field content based on type -->
            <div v-if="field.type === 'text'">
              <input type="text" class="form-control" :placeholder="field.placeholder || 'متن کوتاه'">
            </div>
            
            <div v-else-if="field.type === 'textarea'">
              <textarea class="form-control" rows="3" :placeholder="field.placeholder || 'متن بلند'"></textarea>
            </div>
            
            <div v-else-if="field.type === 'select'">
              <select class="form-select">
                <option value="" selected disabled>انتخاب کنید</option>
                <option v-for="(option, index) in field.options" :key="index" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <div class="mt-2">
                <button class="btn btn-sm btn-outline-secondary" @click="addOption(field)">
                  <i class="bi bi-plus"></i> افزودن گزینه
                </button>
              </div>
            </div>
            
            <div v-else-if="field.type === 'radio'">
              <div v-for="(option, index) in field.options" :key="index" class="form-check">
                <input class="form-check-input" type="radio" :name="field.id + '_radio'" :id="field.id + '_radio' + index">
                <label class="form-check-label" :for="field.id + '_radio' + index">{{ option.text }}</label>
              </div>
              <div class="mt-2">
                <button class="btn btn-sm btn-outline-secondary" @click="addOption(field)">
                  <i class="bi bi-plus"></i> افزودن گزینه
                </button>
              </div>
            </div>
            
            <div v-else-if="field.type === 'checkbox'">
              <div v-for="(option, index) in field.options" :key="index" class="form-check">
                <input class="form-check-input" type="checkbox" :id="field.id + '_checkbox' + index">
                <label class="form-check-label" :for="field.id + '_checkbox' + index">{{ option.text }}</label>
              </div>
              <div class="mt-2">
                <button class="btn btn-sm btn-outline-secondary" @click="addOption(field)">
                  <i class="bi bi-plus"></i> افزودن گزینه
                </button>
              </div>
            </div>
            
            <div class="mt-3 pt-2 border-top">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="field.required" :id="field.id + '_required'">
                <label class="form-check-label" :for="field.id + '_required'">اجباری</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="fields.length > 0" class="mt-4 text-center">
      <button class="btn btn-success btn-lg" @click="goToNextTab">
        <i class="bi bi-arrow-right-circle"></i> مرحله بعدی
      </button>
    </div>
  </div>
</template>

<script>
import FieldTypes from './FieldTypes.vue'

export default {
  name: 'FormBuilder',
  components: {
    FieldTypes
  },
  data() {
    return {
      formTitle: '',
      formDescription: '',
      fields: [],
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
    deleteField(field) {
      this.fields = this.fields.filter(f => f.id !== field.id);
    },
    duplicateField(field) {
      this.fieldCounter++;
      const duplicatedField = JSON.parse(JSON.stringify(field));
      duplicatedField.id = `field_${this.fieldCounter}`;
      this.fields.push(duplicatedField);
    },
    addOption(field) {
      if (!field.options) {
        field.options = [];
      }
      const newOption = {
        value: `option${field.options.length + 1}`,
        text: `گزینه ${field.options.length + 1}`
      };
      field.options.push(newOption);
    },
    clearForm() {
      if (confirm('آیا از پاک کردن تمام فیلدهای فرم اطمینان دارید؟')) {
        this.fields = []
        this.formTitle = ''
        this.formDescription = ''
        this.fieldCounter = 0
      }
    },
    showExportModal() {
      console.log('Show export modal')
    },
    togglePreview() {
      console.log('Toggle preview')
    },
    goToNextTab() {
      this.$emit('go-to-design')
    }
  },
  mounted() {
    console.log('FormBuilder component mounted');
    // Add a sample field for testing
    this.addField('text');
  }
}
</script>

<style scoped>
.form-builder {
  padding: 20px;
}

.draggable-card {
  cursor: move;
  transition: all 0.2s;
}

.form-card {
  border-left: 6px solid var(--primary-color);
  border-radius: 8px;
}

.form-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.field-actions {
  opacity: 1;
  transition: opacity 0.2s;
}

.form-card:hover .field-actions {
  opacity: 1;
}
</style>