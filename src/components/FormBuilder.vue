<template>
  <div class="container-fluid py-3">
    <div class="row">
      <!-- Toolbox Sidebar -->
      <div class="col-lg-2 d-none d-lg-block bg-light py-3 border-end">
        <div class="sticky-top pt-3">
          <h5 class="mb-4">عناصر فرم</h5>
          <div class="d-grid gap-2">
            <button class="btn btn-outline-primary text-start" @click="addNewField('text')">
              <i class="bi bi-text-paragraph me-2"></i> متن کوتاه
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('textarea')">
              <i class="bi bi-textarea-t me-2"></i> متن بلند
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('select')">
              <i class="bi bi-menu-button me-2"></i> انتخاب از لیست
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('radio')">
              <i class="bi bi-ui-radios me-2"></i> چند گزینه‌ای
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('checkbox')">
              <i class="bi bi-check2-square me-2"></i> چک باکس
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('file')">
              <i class="bi bi-upload me-2"></i> آپلود فایل
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('date')">
              <i class="bi bi-calendar me-2"></i> تاریخ
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('time')">
              <i class="bi bi-clock me-2"></i> زمان
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewField('scale')">
              <i class="bi bi-list-stars me-2"></i> مقیاس
            </button>
            <button class="btn btn-outline-primary text-start" @click="addNewSection">
              <i class="bi bi-layers me-2"></i> بخش جدید
            </button>
          </div>
        </div>
      </div>

      <!-- Main Form Area -->
      <div class="col-lg-8 py-3">
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
          
          <draggable 
            v-model="fields" 
            item-key="id"
            @start="onDragStart"
            @end="onDragEnd"
            class="drag-area"
          >
            <template #item="{ element }">
              <div 
                class="mb-4 draggable-card" 
                :class="{ 'dragging': element.dragging }"
                :data-field-type="element.type"
              >
                <div 
                  class="card form-card" 
                  :class="{ 'border-primary selected': selectedFieldId === element.id }"
                  @click="selectField(element.id)"
                >
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="w-100 me-3">
                        <input 
                          type="text" 
                          class="form-control border-0 shadow-none field-label-input p-0 mb-1" 
                          v-model="element.label"
                          placeholder="عنوان فیلد"
                          style="font-size: 1.1rem; font-weight: 500;"
                        >
                        <input 
                          type="text" 
                          class="form-control border-0 shadow-none field-description-input p-0" 
                          v-model="element.description"
                          placeholder="توضیحات (اختیاری)"
                          style="font-size: 0.9rem;"
                        >
                      </div>
                      <div class="field-actions">
                        <button class="btn btn-sm btn-outline-secondary me-1" @click.stop="duplicateField(element.id)">
                          <i class="bi bi-files"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click.stop="deleteField(element.id)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Field content based on type -->
                    <div v-if="element.type === 'text'">
                      <input 
                        type="text" 
                        class="form-control" 
                        :placeholder="element.placeholder || 'متن کوتاه'"
                        v-model="element.defaultValue"
                      >
                    </div>
                    
                    <div v-else-if="element.type === 'textarea'">
                      <textarea 
                        class="form-control" 
                        rows="3" 
                        :placeholder="element.placeholder || 'متن بلند'"
                        v-model="element.defaultValue"
                      ></textarea>
                    </div>
                    
                    <div v-else-if="element.type === 'select'">
                      <select class="form-select">
                        <option value="" selected disabled>انتخاب کنید</option>
                        <option 
                          v-for="(option, index) in element.options" 
                          :key="index" 
                          :value="option.value"
                        >
                          {{ option.text }}
                        </option>
                      </select>
                      <div class="mt-2">
                        <button class="btn btn-sm btn-outline-secondary" @click.stop="addOption(element.id)">
                          <i class="bi bi-plus"></i> افزودن گزینه
                        </button>
                      </div>
                    </div>
                    
                    <div v-else-if="element.type === 'radio'">
                      <div 
                        v-for="(option, index) in element.options" 
                        :key="index" 
                        class="form-check"
                      >
                        <input 
                          class="form-check-input" 
                          type="radio" 
                          :name="element.id + '_radio'" 
                          :id="element.id + '_radio' + index"
                        >
                        <label 
                          class="form-check-label" 
                          :for="element.id + '_radio' + index"
                        >
                          {{ option.text }}
                        </label>
                      </div>
                      <div class="mt-2">
                        <button class="btn btn-sm btn-outline-secondary" @click.stop="addRadioOption(element.id)">
                          <i class="bi bi-plus"></i> افزودن گزینه
                        </button>
                      </div>
                    </div>
                    
                    <div v-else-if="element.type === 'checkbox'">
                      <div 
                        v-for="(option, index) in element.options" 
                        :key="index" 
                        class="form-check"
                      >
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :id="element.id + '_checkbox' + index"
                        >
                        <label 
                          class="form-check-label" 
                          :for="element.id + '_checkbox' + index"
                        >
                          {{ option.text }}
                        </label>
                      </div>
                      <div class="mt-2">
                        <button class="btn btn-sm btn-outline-secondary" @click.stop="addCheckboxOption(element.id)">
                          <i class="bi bi-plus"></i> افزودن گزینه
                        </button>
                      </div>
                    </div>
                    
                    <div v-else-if="element.type === 'file'">
                      <input class="form-control" type="file">
                      <div class="form-text">حداکثر حجم فایل: 10MB</div>
                      <div class="mt-2">
                        <div class="form-check form-check-inline">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            :id="element.id + '_multiple'"
                            v-model="element.multiple"
                          >
                          <label 
                            class="form-check-label" 
                            :for="element.id + '_multiple'"
                          >
                            آپلود چند فایل
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div v-else-if="element.type === 'date'">
                      <input type="date" class="form-control">
                    </div>
                    
                    <div v-else-if="element.type === 'time'">
                      <input type="time" class="form-control">
                    </div>
                    
                    <div v-else-if="element.type === 'scale'">
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
                    
                    <div v-else-if="element.type === 'section'">
                      <div class="section-divider">
                        <span class="section-divider-text">بخش جدید</span>
                      </div>
                    </div>
                    
                    <div class="mt-3 pt-2 border-top" v-if="element.type !== 'section'">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="element.required" 
                          :id="element.id + '_required'"
                        >
                        <label 
                          class="form-check-label" 
                          :for="element.id + '_required'"
                        >
                          اجباری
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <div v-if="fields.length > 0" class="mt-4 text-center" id="actionButtons">
          <button class="btn btn-success btn-lg" @click="goToNextTab">
            <i class="bi bi-arrow-right-circle"></i> مرحله بعدی
          </button>
        </div>
      </div>

      <!-- Preview Sidebar -->
      <div class="col-lg-2 d-none d-lg-block bg-light py-3 border-start">
        <div class="sticky-top pt-3">
          <h5 class="mb-3">پیش نمایش زنده</h5>
          <div class="card mb-3">
            <div class="card-body p-2">
              <div id="livePreview" class="p-2">
                <h6 class="mb-3">{{ formTitle || 'فرم بدون عنوان' }}</h6>
                <p v-if="formDescription" class="text-muted small mb-3">{{ formDescription }}</p>
                
                <div v-for="field in fields" :key="field.id" class="mb-3">
                  <label class="form-label small">
                    {{ field.label }} <span v-if="field.required" class="required-star">*</span>
                  </label>
                  <p v-if="field.description" class="text-muted small mb-2">{{ field.description }}</p>
                  
                  <!-- Preview fields based on type -->
                  <input 
                    v-if="field.type === 'text'" 
                    type="text" 
                    class="form-control form-control-sm" 
                    :placeholder="field.placeholder || 'پاسخ شما'"
                  >
                  
                  <textarea 
                    v-else-if="field.type === 'textarea'" 
                    class="form-control form-control-sm" 
                    rows="2" 
                    :placeholder="field.placeholder || 'پاسخ شما'"
                  ></textarea>
                  
                  <select v-else-if="field.type === 'select'" class="form-select form-select-sm">
                    <option 
                      v-for="(option, index) in field.options" 
                      :key="index" 
                      :value="option.value"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                  
                  <div v-else-if="field.type === 'radio'">
                    <div 
                      v-for="(option, index) in field.options" 
                      :key="index" 
                      class="form-check"
                    >
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        :name="'preview_' + field.id" 
                        :id="'preview_' + field.id + '_' + index"
                      >
                      <label 
                        class="form-check-label" 
                        :for="'preview_' + field.id + '_' + index"
                      >
                        {{ option.text }}
                      </label>
                    </div>
                  </div>
                  
                  <div v-else-if="field.type === 'checkbox'">
                    <div 
                      v-for="(option, index) in field.options" 
                      :key="index" 
                      class="form-check"
                    >
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :id="'preview_' + field.id + '_' + index"
                      >
                      <label 
                        class="form-check-label" 
                        :for="'preview_' + field.id + '_' + index"
                      >
                        {{ option.text }}
                      </label>
                    </div>
                  </div>
                  
                  <input 
                    v-else-if="field.type === 'file'" 
                    class="form-control form-control-sm" 
                    type="file" 
                    :multiple="field.multiple"
                  >
                  
                  <input 
                    v-else-if="field.type === 'date'" 
                    type="date" 
                    class="form-control form-control-sm"
                  >
                  
                  <input 
                    v-else-if="field.type === 'time'" 
                    type="time" 
                    class="form-control form-control-sm"
                  >
                  
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
                    <h6 class="mt-4 mb-2">{{ field.label }}</h6>
                    <p v-if="field.description" class="text-muted small mb-3">{{ field.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h5 class="mb-3 mt-4">تنظیمات فیلد</h5>
          <div id="fieldSettings" class="card">
            <div class="card-body" v-if="!selectedFieldId">
              <p class="text-muted small text-center">فیلدی را انتخاب کنید</p>
            </div>
            <div class="card-body" v-else>
              <h6 class="mb-3">تنظیمات فیلد</h6>
              
              <div class="mb-3">
                <label class="form-label">عنوان فیلد</label>
                <input 
                  type="text" 
                  class="form-control field-label-update settings-input" 
                  v-model="selectedField.label"
                >
              </div>
              
              <div class="mb-3">
                <label class="form-label">توضیحات</label>
                <input 
                  type="text" 
                  class="form-control field-description-update settings-input" 
                  placeholder="توضیحات اختیاری"
                  v-model="selectedField.description"
                >
              </div>
              
              <div class="mb-3" v-if="selectedField.type === 'text' || selectedField.type === 'textarea'">
                <label class="form-label">متن پیش‌فرض</label>
                <input 
                  type="text" 
                  class="form-control field-default-update settings-input" 
                  placeholder="مقدار پیش‌فرض"
                  v-model="selectedField.defaultValue"
                >
              </div>
              
              <div class="mb-3" v-if="selectedField.type === 'text' || selectedField.type === 'textarea'">
                <label class="form-label">حداکثر طول</label>
                <input 
                  type="number" 
                  class="form-control field-maxlength-update settings-input" 
                  placeholder="حداکثر کاراکتر"
                  v-model="selectedField.maxLength"
                >
              </div>
              
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input required-checkbox-update" 
                  type="checkbox" 
                  v-model="selectedField.required"
                >
                <label class="form-check-label">اجباری</label>
              </div>
              
              <hr class="my-3">
              
              <button class="btn btn-outline-secondary btn-sm w-100 mb-2" @click="setupConditionalLogic">
                <i class="bi bi-diagram-2 me-1"></i> افزودن منطق شرطی
              </button>
              
              <button class="btn btn-outline-danger btn-sm w-100" @click="deleteField(selectedFieldId)">
                <i class="bi bi-trash me-1"></i> حذف فیلد
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'

export default {
  name: 'FormBuilder',
  components: {
    draggable: VueDraggableNext
  },
  data() {
    return {
      formTitle: '',
      formDescription: '',
      fields: [],
      selectedFieldId: null,
      fieldCounter: 0,
      draggedItem: null
    }
  },
  computed: {
    selectedField() {
      return this.fields.find(field => field.id === this.selectedFieldId) || {}
    }
  },
  methods: {
    addNewField(fieldType) {
      this.fieldCounter++
      const newFieldId = `field_${this.fieldCounter}`
      
      let fieldContent = ''
      let fieldLabel = 'فیلد'
      
      switch (fieldType) {
        case 'text':
          fieldLabel = 'متن کوتاه'
          fieldContent = `<input type="text" class="form-control" placeholder="متن کوتاه">`
          break
        case 'textarea':
          fieldLabel = 'متن بلند'
          fieldContent = `<textarea class="form-control" rows="3" placeholder="متن بلند"></textarea>`
          break
        case 'select':
          fieldLabel = 'انتخاب از لیست'
          fieldContent = `
            <select class="form-select">
              <option value="" selected disabled>انتخاب کنید</option>
              <option value="option1">گزینه ۱</option>
              <option value="option2">گزینه ۲</option>
            </select>
            <div class="mt-2">
              <button class="btn btn-sm btn-outline-secondary" @click="addOption('${newFieldId}')">
                <i class="bi bi-plus"></i> افزودن گزینه
              </button>
            </div>
          `
          break
        case 'radio':
          fieldLabel = 'چند گزینه‌ای'
          fieldContent = `
            <div class="form-check">
              <input class="form-check-input" type="radio" name="${newFieldId}_radio" id="${newFieldId}_radio1">
              <label class="form-check-label" for="${newFieldId}_radio1">گزینه ۱</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="${newFieldId}_radio" id="${newFieldId}_radio2">
              <label class="form-check-label" for="${newFieldId}_radio2">گزینه ۲</label>
            </div>
            <div class="mt-2">
              <button class="btn btn-sm btn-outline-secondary" @click="addRadioOption('${newFieldId}')">
                <i class="bi bi-plus"></i> افزودن گزینه
              </button>
            </div>
          `
          break
        case 'checkbox':
          fieldLabel = 'چک باکس'
          fieldContent = `
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="${newFieldId}_checkbox1">
              <label class="form-check-label" for="${newFieldId}_checkbox1">گزینه ۱</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="${newFieldId}_checkbox2">
              <label class="form-check-label" for="${newFieldId}_checkbox2">گزینه ۲</label>
            </div>
            <div class="mt-2">
              <button class="btn btn-sm btn-outline-secondary" @click="addCheckboxOption('${newFieldId}')">
                <i class="bi bi-plus"></i> افزودن گزینه
              </button>
            </div>
          `
          break
        case 'file':
          fieldLabel = 'آپلود فایل'
          fieldContent = `
            <input class="form-control" type="file">
            <div class="form-text">حداکثر حجم فایل: 10MB</div>
            <div class="mt-2">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="${newFieldId}_multiple">
                <label class="form-check-label" for="${newFieldId}_multiple">آپلود چند فایل</label>
              </div>
            </div>
          `
          break
        case 'date':
          fieldLabel = 'تاریخ'
          fieldContent = `<input type="date" class="form-control">`
          break
        case 'time':
          fieldLabel = 'زمان'
          fieldContent = `<input type="time" class="form-control">`
          break
        case 'scale':
          fieldLabel = 'مقیاس'
          fieldContent = `
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span>1</span>
              <div class="form-range" style="width: 80%;" min="1" max="5" step="1">
              <span>5</span>
            </div>
            <div class="d-flex justify-content-between">
              <small class="text-muted">ضعیف</small>
              <small class="text-muted">عالی</small>
            </div>
          `
          break
        default:
          fieldLabel = 'فیلد متنی'
          fieldContent = `<input type="text" class="form-control" placeholder="متن خود را وارد کنید">`
      }
      
      const newField = {
        id: newFieldId,
        type: fieldType,
        label: fieldLabel,
        description: '',
        required: false,
        placeholder: '',
        defaultValue: '',
        maxLength: null,
        multiple: false,
        options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? [
          { value: 'option1', text: 'گزینه ۱' },
          { value: 'option2', text: 'گزینه ۲' }
        ] : [],
        dragging: false
      }
      
      this.fields.push(newField)
      this.checkEmptyState()
    },
    
    addNewSection() {
      this.fieldCounter++
      const newSectionId = `section_${this.fieldCounter}`
      
      const newSection = {
        id: newSectionId,
        type: 'section',
        label: 'عنوان بخش',
        description: '',
        dragging: false
      }
      
      this.fields.push(newSection)
    },
    
    selectField(fieldId) {
      this.selectedFieldId = fieldId
    },
    
    deleteField(fieldId) {
      this.fields = this.fields.filter(field => field.id !== fieldId)
      if (this.selectedFieldId === fieldId) {
        this.selectedFieldId = null
      }
      this.checkEmptyState()
    },
    
    duplicateField(fieldId) {
      const fieldToDuplicate = this.fields.find(field => field.id === fieldId)
      if (fieldToDuplicate) {
        this.fieldCounter++
        const duplicatedField = JSON.parse(JSON.stringify(fieldToDuplicate))
        duplicatedField.id = `field_${this.fieldCounter}`
        this.fields.push(duplicatedField)
      }
    },
    
    addOption(fieldId) {
      const field = this.fields.find(f => f.id === fieldId)
      if (field && field.options) {
        const optionCount = field.options.length
        const newOption = {
          value: `option${optionCount + 1}`,
          text: `گزینه ${optionCount + 1}`
        }
        field.options.push(newOption)
      }
    },
    
    addRadioOption(fieldId) {
      this.addOption(fieldId)
    },
    
    addCheckboxOption(fieldId) {
      this.addOption(fieldId)
    },
    
    checkEmptyState() {
      // This method is for handling empty state UI
      // In Vue, we can use v-if directives instead
    },
    
    clearForm() {
      if (confirm('آیا از پاک کردن تمام فیلدهای فرم اطمینان دارید؟')) {
        this.fields = []
        this.formTitle = ''
        this.formDescription = ''
        this.fieldCounter = 0
        this.selectedFieldId = null
      }
    },
    
    showExportModal() {
      // Implement export modal functionality
      console.log('Show export modal')
    },
    
    togglePreview() {
      // Implement preview functionality
      console.log('Toggle preview')
    },
    
    goToNextTab() {
      this.$emit('go-to-next-tab')
    },
    
    setupConditionalLogic() {
      // Implement conditional logic setup
      console.log('Setup conditional logic')
    },
    
    onDragStart(event) {
      event.item.dragging = true
    },
    
    onDragEnd(event) {
      event.item.dragging = false
    }
  },
  watch: {
    fields: {
      handler() {
        // Update live preview when fields change
      },
      deep: true
    },
    formTitle() {
      // Update live preview when title changes
    },
    formDescription() {
      // Update live preview when description changes
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

.form-card.selected {
  box-shadow: 0 0 0 2px var(--primary-color);
}

.field-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.form-card:hover .field-actions {
  opacity: 1;
}

.required-star {
  color: #d32f2f;
  margin-right: 4px;
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

.settings-input {
  border: 1px solid #ddd !important;
  background-color: #fff !important;
}

.settings-input:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 0.25rem rgba(103, 58, 183, 0.25) !important;
}

.drag-area {
  min-height: 100px;
}
</style>