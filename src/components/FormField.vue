<template>
  <div class="mb-4 draggable-card" :id="field.id" draggable="true" :data-field-type="field.type">
    <div class="card form-card" :class="{ 'border-primary selected': isSelected }" @click="selectField">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div class="w-100 me-3">
            <input 
              type="text" 
              class="form-control border-0 shadow-none field-label-input p-0 mb-1" 
              :value="field.label"
              @input="updateFieldProperty('label', $event.target.value)"
              placeholder="عنوان فیلد"
              style="font-size: 1.1rem; font-weight: 500;"
            >
            <input 
              type="text" 
              class="form-control border-0 shadow-none field-description-input p-0" 
              :value="field.description"
              @input="updateFieldProperty('description', $event.target.value)"
              placeholder="توضیحات (اختیاری)"
              style="font-size: 0.9rem;"
            >
          </div>
          <div class="field-actions">
            <button class="btn btn-sm btn-outline-secondary me-1" @click.stop="duplicateField">
              <i class="bi bi-files"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" @click.stop="deleteField">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        
        <!-- Field content based on type -->
        <div v-if="field.type === 'text'">
          <input 
            type="text" 
            class="form-control" 
            :placeholder="field.placeholder || 'متن کوتاه'"
            :value="field.defaultValue"
            @input="updateFieldProperty('defaultValue', $event.target.value)"
          >
        </div>
        
        <div v-else-if="field.type === 'textarea'">
          <textarea 
            class="form-control" 
            rows="3" 
            :placeholder="field.placeholder || 'متن بلند'"
            :value="field.defaultValue"
            @input="updateFieldProperty('defaultValue', $event.target.value)"
          ></textarea>
        </div>
        
        <div v-else-if="field.type === 'select'">
          <select class="form-select">
            <option value="" selected disabled>انتخاب کنید</option>
            <option v-for="(option, index) in field.options" :key="index" :value="option.value">
              {{ option.text }}
            </option>
          </select>
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-secondary" @click.stop="addOption">
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
            <button class="btn btn-sm btn-outline-secondary" @click.stop="addRadioOption">
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
            <button class="btn btn-sm btn-outline-secondary" @click.stop="addCheckboxOption">
              <i class="bi bi-plus"></i> افزودن گزینه
            </button>
          </div>
        </div>
        
        <div v-else-if="field.type === 'file'">
          <input class="form-control" type="file">
          <div class="form-text">حداکثر حجم فایل: 10MB</div>
          <div class="mt-2">
            <div class="form-check form-check-inline">
              <input 
                class="form-check-input" 
                type="checkbox" 
                :id="field.id + '_multiple'"
                :checked="field.multiple"
                @change="updateFieldProperty('multiple', $event.target.checked)"
              >
              <label class="form-check-label" :for="field.id + '_multiple'">آپلود چند فایل</label>
            </div>
          </div>
        </div>
        
        <div v-else-if="field.type === 'date'">
          <input type="date" class="form-control">
        </div>
        
        <div v-else-if="field.type === 'time'">
          <input type="time" class="form-control">
        </div>
        
        <div v-else-if="field.type === 'scale'">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span>1</span>
            <input type="range" class="form-range" style="width: 80%;" min="1" max="5" step="1">
            <span>5</span>
          </div>
          <div class="d-flex justify-content-between">
            <small class="text-muted">ضعیف</small>
            <small class="text-muted">عالی</small>
          </div>
        </div>
        
        <div v-else-if="field.type === 'section'">
          <!-- Section divider -->
          <div class="section-divider">
            <span class="section-divider-text">بخش جدید</span>
          </div>
        </div>
        
        <div class="mt-3 pt-2 border-top" v-if="field.type !== 'section'">
          <div class="form-check form-switch">
            <input 
              class="form-check-input required-checkbox" 
              type="checkbox" 
              :checked="field.required"
              @change="updateFieldProperty('required', $event.target.checked)"
              :id="field.id + '_required'"
            >
            <label class="form-check-label" :for="field.id + '_required'">اجباری</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormField',
  props: {
    field: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'delete', 'duplicate', 'update:field'],
  computed: {
    isSelected() {
      return this.selected;
    }
  },
  methods: {
    selectField() {
      this.$emit('select', this.field.id);
    },
    deleteField() {
      this.$emit('delete', this.field.id);
    },
    duplicateField() {
      this.$emit('duplicate', this.field.id);
    },
    updateFieldProperty(property, value) {
      // Create a new object to avoid mutating the prop directly
      const updatedField = {
        ...this.field,
        [property]: value
      };
      this.$emit('update:field', updatedField);
    },
    addOption() {
      const newOptions = this.field.options ? [...this.field.options] : [];
      const newOption = {
        value: `option${newOptions.length + 1}`,
        text: `گزینه ${newOptions.length + 1}`
      };
      newOptions.push(newOption);
      
      const updatedField = {
        ...this.field,
        options: newOptions
      };
      this.$emit('update:field', updatedField);
    },
    addRadioOption() {
      this.addOption();
    },
    addCheckboxOption() {
      this.addOption();
    }
  }
}
</script>

<style scoped>
.draggable-card {
  cursor: move;
  transition: all 0.2s;
}

.draggable-card.dragging {
  opacity: 0.8;
  border: 2px dashed var(--accent-color);
  background-color: rgba(124, 77, 255, 0.05);
}

.form-card {
  border-left: 6px solid var(--primary-color);
  border-radius: 8px;
}

.form-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.field-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.form-card:hover .field-actions {
  opacity: 1;
}

.section-divider {
  border-top: 2px dashed #ccc;
  position: relative;
  margin: 30px 0;
}

.section-divider-text {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 0 15px;
  color: #555;
  font-weight: bold;
}
</style>