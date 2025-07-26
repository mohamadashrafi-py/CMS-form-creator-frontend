let fieldCounter = 0;
let currentTheme = '#673ab7';
let selectedField = null;
let draggedItem = null;

document.addEventListener("DOMContentLoaded", function () {
    initializeDragAndDrop();
    setupFieldSelection();
    updateLivePreview();

    // Link form title and description to live preview
    document.getElementById('formTitle').addEventListener('input', updateLivePreview);
    document.getElementById('formDescription').addEventListener('input', updateLivePreview);

    // Fixed click handler for the entire document
    document.addEventListener('click', function (e) {
        const clickedElement = e.target;
        const isFieldCard = clickedElement.closest('.form-card');
        const isSettingsPanel = clickedElement.closest('#fieldSettings');
        const isSettingsInput = clickedElement.closest('#fieldSettings input, #fieldSettings select, #fieldSettings textarea, #fieldSettings button');

        if (isFieldCard) {
            selectField(isFieldCard);
            e.stopPropagation();
        }
        else if (!isSettingsPanel && !isSettingsInput) {
            deselectAllFields();
        }
    });
});

function initializeDragAndDrop() {
    const formArea = document.getElementById("formArea");

    formArea.addEventListener("dragstart", function (e) {
        if (e.target.closest(".draggable-card")) {
            draggedItem = e.target.closest(".draggable-card");
            setTimeout(() => {
                draggedItem.classList.add("dragging");
            }, 0);
        }
    });

    formArea.addEventListener("dragend", function () {
        if (draggedItem) {
            draggedItem.classList.remove("dragging");
            draggedItem = null;
            updateLivePreview();
        }
    });

    formArea.addEventListener("dragover", function (e) {
        e.preventDefault();
        if (!draggedItem) return;

        const afterElement = getDragAfterElement(formArea, e.clientY);
        if (afterElement) {
            formArea.insertBefore(draggedItem, afterElement);
        } else {
            formArea.appendChild(draggedItem);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function setupFieldSelection() {
    // This can now be empty or used for additional setup
}


function selectField(fieldElement) {
    // Deselect all fields first
    deselectAllFields();

    // Select the clicked field
    fieldElement.classList.add('border-primary', 'selected');
    selectedField = fieldElement;

    // Show settings for this field
    showFieldSettings(fieldElement);
}

function deselectAllFields() {
    document.querySelectorAll('.form-card').forEach(card => {
        card.classList.remove('border-primary', 'selected');
    });
    selectedField = null;
    showDefaultFieldSettings();
}

function showDefaultFieldSettings() {
    document.getElementById('fieldSettings').innerHTML = `
        <div class="card-body">
            <p class="text-muted small text-center">فیلدی را انتخاب کنید</p>
        </div>
    `;
}


function showFieldSettings(fieldElement) {
    if (!fieldElement) {
        showDefaultFieldSettings();
        return;
    }

    const fieldId = fieldElement.closest('.draggable-card').id;
    const fieldType = fieldElement.closest('.draggable-card').dataset.fieldType;
    const fieldLabel = fieldElement.querySelector('.field-label-input')?.value || 'فیلد بدون عنوان';
    const fieldDescription = fieldElement.querySelector('.field-description-input')?.value || '';
    const isRequired = fieldElement.querySelector('.required-checkbox')?.checked || false;
    const conditionalLogic = fieldElement.closest('.draggable-card').dataset.conditionalLogic;

    let settingsHTML = `
    <div class="card-body">
        <h6 class="mb-3">تنظیمات فیلد</h6>
        
        <div class="mb-3">
            <label class="form-label">عنوان فیلد</label>
            <input type="text" class="form-control field-label-update settings-input" 
                   value="${fieldLabel}" data-field="${fieldId}">
        </div>
        
        <div class="mb-3">
            <label class="form-label">توضیحات</label>
            <input type="text" class="form-control field-description-update settings-input" 
                   placeholder="توضیحات اختیاری" data-field="${fieldId}" value="${fieldDescription}">
        </div>`;

    // Field type specific settings
    if (fieldType === 'text' || fieldType === 'textarea') {
        const defaultValue = fieldElement.querySelector('input, textarea')?.placeholder || '';
        const maxLength = fieldElement.querySelector('input, textarea')?.maxLength || '';

        settingsHTML += `
            <div class="mb-3">
                <label class="form-label">متن پیش‌فرض</label>
                <input type="text" class="form-control field-default-update settings-input" 
                       placeholder="مقدار پیش‌فرض" data-field="${fieldId}" value="${defaultValue}">
            </div>
            <div class="mb-3">
                <label class="form-label">حداکثر طول</label>
                <input type="number" class="form-control field-maxlength-update settings-input" 
                       placeholder="حداکثر کاراکتر" data-field="${fieldId}" value="${maxLength}">
            </div>`;
    }

    settingsHTML += `
        <div class="form-check form-switch mb-3">
            <input class="form-check-input required-checkbox-update" type="checkbox" 
                   ${isRequired ? 'checked' : ''} data-field="${fieldId}">
            <label class="form-check-label">اجباری</label>
        </div>
        
        <hr class="my-3">
        
        <button class="btn btn-outline-secondary btn-sm w-100 mb-2" 
                onclick="setupConditionalLogic(this.closest('.form-card'))">
            <i class="bi bi-diagram-2 me-1"></i> ${conditionalLogic ? 'ویرایش' : 'افزودن'} منطق شرطی
        </button>
        
        <button class="btn btn-outline-danger btn-sm w-100" onclick="deleteField('${fieldId}')">
            <i class="bi bi-trash me-1"></i> حذف فیلد
        </button>
    </div>`;

    document.getElementById('fieldSettings').innerHTML = settingsHTML;

    // Add event listeners for live updates
    setupSettingsInputListeners(fieldId);
}


function setupSettingsInputListeners(fieldId) {
    // Label update
    document.querySelector('.field-label-update')?.addEventListener('input', function (e) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.querySelector('.field-label-input').value = this.value;
            updateLivePreview();
        }
    });

    // Description update
    document.querySelector('.field-description-update')?.addEventListener('input', function (e) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.querySelector('.field-description-input').value = this.value;
            updateLivePreview();
        }
    });

    // Required checkbox
    document.querySelector('.required-checkbox-update')?.addEventListener('change', function (e) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.querySelector('.required-checkbox').checked = this.checked;
            updateLivePreview();
        }
    });

    // Field-specific settings
    if (document.querySelector('.field-default-update')) {
        document.querySelector('.field-default-update').addEventListener('input', function (e) {
            const field = document.getElementById(fieldId);
            if (field) {
                const input = field.querySelector('input[type="text"], textarea');
                if (input) input.placeholder = this.value || "پاسخ شما";
                updateLivePreview();
            }
        });
    }

    if (document.querySelector('.field-maxlength-update')) {
        document.querySelector('.field-maxlength-update').addEventListener('input', function (e) {
            const field = document.getElementById(fieldId);
            if (field) {
                const input = field.querySelector('input[type="text"], textarea');
                if (input) input.maxLength = this.value ? parseInt(this.value) : null;
            }
        });
    }
}

function deleteField(fieldId) {
    document.getElementById(fieldId)?.remove();
    checkEmptyState();
    updateLivePreview();
    deselectAllFields();
}

function setupFieldDuplication(fieldId) {
    const duplicateBtn = document.querySelector(`#${fieldId} .btn-outline-secondary`);
    if (duplicateBtn) {
        duplicateBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            duplicateField(fieldId);
        });
    }
}

function duplicateField(fieldId) {
    const fieldToDuplicate = document.getElementById(fieldId);
    if (fieldToDuplicate) {
        const clonedField = fieldToDuplicate.cloneNode(true);
        const newId = `field_${++fieldCounter}`;
        clonedField.id = newId;

        // Update all IDs in the cloned field
        clonedField.querySelectorAll('[id]').forEach(element => {
            const oldId = element.id;
            element.id = oldId.replace(new RegExp(fieldId + '(_|$)'), newId + '$1');

            if (element.tagName === 'LABEL' && element.htmlFor) {
                element.htmlFor = element.htmlFor.replace(new RegExp(fieldId + '(_|$)'), newId + '$1');
            }
        });

        // Update radio/checkbox names
        clonedField.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            if (input.name) {
                input.name = input.name.replace(new RegExp(fieldId + '(_|$)'), newId + '$1');
            }
        });

        fieldToDuplicate.after(clonedField);
        setupFieldDuplication(newId);
        updateLivePreview();
    }
}

function setupConditionalLogic(fieldElement) {
    const modal = new bootstrap.Modal(document.getElementById('conditionalLogicModal'));
    const fieldSelect = document.getElementById('conditionalFieldSelect');

    // Clear existing options
    fieldSelect.innerHTML = '<option value="">انتخاب فیلد...</option>';

    // Add all previous fields as options
    document.querySelectorAll('.form-card').forEach(card => {
        if (card !== fieldElement && !card.closest('.draggable-card').dataset.fieldType.includes('section')) {
            const fieldId = card.closest('.draggable-card').id;
            const fieldLabel = card.querySelector('.field-label-input')?.value || 'فیلد بدون عنوان';
            fieldSelect.innerHTML += `<option value="${fieldId}">${fieldLabel}</option>`;
        }
    });

    // Show existing conditional logic if any
    const existingLogic = fieldElement.closest('.draggable-card').dataset.conditionalLogic;
    if (existingLogic) {
        const logic = JSON.parse(existingLogic);
        document.getElementById('conditionalFieldSelect').value = logic.field;
        document.getElementById('conditionalOperator').value = logic.operator;
        document.getElementById('conditionalValue').value = logic.value;
        document.getElementById('conditionalAction').value = logic.action;
    }

    modal.show();
}

function saveConditionalLogic() {
    if (!selectedField) return;

    const fieldId = document.getElementById('conditionalFieldSelect').value;
    const operator = document.getElementById('conditionalOperator').value;
    const value = document.getElementById('conditionalValue').value;
    const action = document.getElementById('conditionalAction').value;

    if (!fieldId) {
        alert('لطفا یک فیلد را انتخاب کنید');
        return;
    }

    const logic = {
        field: fieldId,
        operator: operator,
        value: value,
        action: action
    };

    selectedField.closest('.draggable-card').dataset.conditionalLogic = JSON.stringify(logic);
    bootstrap.Modal.getInstance(document.getElementById('conditionalLogicModal')).hide();

    // Update settings panel to show logic is active
    showFieldSettings(selectedField);
    updateLivePreview();
}

function addNewField(fieldType) {
    fieldCounter++;
    const newFieldId = `field_${fieldCounter}`;
    const actionButtons = document.getElementById("actionButtons");
    const formArea = document.getElementById("formArea");
    const emptyMessage = document.getElementById("emptyMessage");

    actionButtons.style.display = "block";
    emptyMessage.style.display = "none";

    let fieldContent = '';
    let fieldLabel = 'فیلد';
    let fieldClass = '';

    switch (fieldType) {
        case 'text':
            fieldLabel = 'متن کوتاه';
            fieldContent = `
                <input type="text" class="form-control" placeholder="متن کوتاه">
            `;
            break;

        case 'textarea':
            fieldLabel = 'متن بلند';
            fieldContent = `
                <textarea class="form-control" rows="3" placeholder="متن بلند"></textarea>
            `;
            break;

        case 'select':
            fieldLabel = 'انتخاب از لیست';
            fieldContent = `
                <select class="form-select">
                    <option value="" selected disabled>انتخاب کنید</option>
                    <option value="option1">گزینه ۱</option>
                    <option value="option2">گزینه ۲</option>
                </select>
                <div class="mt-2">
                    <button class="btn btn-sm btn-outline-secondary" onclick="addOption('${newFieldId}')">
                        <i class="bi bi-plus"></i> افزودن گزینه
                    </button>
                </div>
            `;
            break;

        case 'radio':
            fieldLabel = 'چند گزینه‌ای';
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
                    <button class="btn btn-sm btn-outline-secondary" onclick="addRadioOption('${newFieldId}')">
                        <i class="bi bi-plus"></i> افزودن گزینه
                    </button>
                </div>
            `;
            break;

        case 'checkbox':
            fieldLabel = 'چک باکس';
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
                    <button class="btn btn-sm btn-outline-secondary" onclick="addCheckboxOption('${newFieldId}')">
                        <i class="bi bi-plus"></i> افزودن گزینه
                    </button>
                </div>
            `;
            break;

        case 'file':
            fieldLabel = 'آپلود فایل';
            fieldContent = `
                <input class="form-control" type="file">
                <div class="form-text">حداکثر حجم فایل: 10MB</div>
                <div class="mt-2">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="${newFieldId}_multiple">
                        <label class="form-check-label" for="${newFieldId}_multiple">آپلود چند فایل</label>
                    </div>
                </div>
            `;
            break;

        case 'date':
            fieldLabel = 'تاریخ';
            fieldContent = `
                <input type="date" class="form-control">
            `;
            break;

        case 'time':
            fieldLabel = 'زمان';
            fieldContent = `
                <input type="time" class="form-control">
            `;
            break;

        case 'scale':
            fieldLabel = 'مقیاس';
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
            `;
            break;

        default:
            fieldLabel = 'فیلد متنی';
            fieldContent = `
                <input type="text" class="form-control" placeholder="متن خود را وارد کنید">
            `;
    }

    const template = `
<div class="mb-4 draggable-card" id="${newFieldId}" draggable="true" data-field-type="${fieldType}">
    <div class="card form-card">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="w-100 me-3">
                    <input type="text" class="form-control border-0 shadow-none field-label-input p-0 mb-1" 
                           value="${fieldLabel}" style="font-size: 1.1rem; font-weight: 500;">
                    <input type="text" class="form-control border-0 shadow-none field-description-input p-0" 
                           placeholder="توضیحات (اختیاری)" style="font-size: 0.9rem;">
                </div>
                <div class="field-actions">
                    <button class="btn btn-sm btn-outline-secondary me-1 duplicate-btn">
                        <i class="bi bi-files"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            
            ${fieldContent}
            
            <div class="mt-3 pt-2 border-top">
                <div class="form-check form-switch">
                    <input class="form-check-input required-checkbox" type="checkbox" id="${newFieldId}_required">
                    <label class="form-check-label" for="${newFieldId}_required">اجباری</label>
                </div>
            </div>
        </div>
    </div>
</div>`;

    formArea.insertAdjacentHTML('beforeend', template);
    setupFieldDuplication(newFieldId);

    // Add delete button handler
    document.querySelector(`#${newFieldId} .delete-btn`).addEventListener('click', function (e) {
        e.stopPropagation();
        document.getElementById(newFieldId).remove();
        checkEmptyState();
        updateLivePreview();
    });

    updateLivePreview();
}

function addNewSection() {
    fieldCounter++;
    const newSectionId = `section_${fieldCounter}`;

    const template = `
<div class="mb-4 draggable-card" id="${newSectionId}" draggable="true" data-field-type="section">
    <div class="section-divider">
        <span class="section-divider-text">بخش جدید</span>
    </div>
    <div class="card form-card">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="w-100 me-3">
                    <input type="text" class="form-control border-0 shadow-none field-label-input p-0 mb-1" 
                           value="عنوان بخش" style="font-size: 1.3rem; font-weight: 600;">
                    <textarea class="form-control border-0 shadow-none field-description-input p-0" 
                              rows="2" placeholder="توضیحات بخش (اختیاری)" style="font-size: 0.9rem;"></textarea>
                </div>
                <div class="field-actions">
                    <button class="btn btn-sm btn-outline-danger delete-btn">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`;

    document.getElementById("formArea").insertAdjacentHTML('beforeend', template);

    // Add delete button handler
    document.querySelector(`#${newSectionId} .delete-btn`).addEventListener('click', function (e) {
        e.stopPropagation();
        document.getElementById(newSectionId).remove();
        checkEmptyState();
        updateLivePreview();
    });

    updateLivePreview();
}

function updateLivePreview() {
    const livePreview = document.getElementById('livePreview');
    const formTitle = document.getElementById('formTitle').value || 'فرم بدون عنوان';
    const formDescription = document.getElementById('formDescription').value || '';

    let previewHTML = `
        <h6 class="mb-3">${formTitle}</h6>
        ${formDescription ? `<p class="text-muted small mb-3">${formDescription}</p>` : ''}
    `;

    document.querySelectorAll('.draggable-card').forEach(card => {
        const fieldType = card.dataset.fieldType;
        const fieldLabel = card.querySelector('.field-label-input')?.value || 'فیلد بدون عنوان';
        const fieldDescription = card.querySelector('.field-description-input')?.value || '';
        const isRequired = card.querySelector('.required-checkbox')?.checked || false;
        const conditionalLogic = card.dataset.conditionalLogic;

        if (fieldType === 'section') {
            previewHTML += `
                <div class="mb-4">
                    <h6 class="mt-4 mb-2">${fieldLabel}</h6>
                    ${fieldDescription ? `<p class="text-muted small mb-3">${fieldDescription}</p>` : ''}
                </div>
            `;
            return;
        }

        previewHTML += `
            <div class="mb-3" ${conditionalLogic ? 'data-conditional="true"' : ''}>
                <label class="form-label small">
                    ${fieldLabel} ${isRequired ? '<span class="required-star">*</span>' : ''}
                </label>
                ${fieldDescription ? `<p class="text-muted small mb-2">${fieldDescription}</p>` : ''}
        `;

        // Add the appropriate input based on field type
        if (fieldType === 'text') {
            const placeholder = card.querySelector('input[type="text"]')?.placeholder || 'پاسخ شما';
            previewHTML += `<input type="text" class="form-control form-control-sm" placeholder="${placeholder}">`;
        }
        else if (fieldType === 'textarea') {
            const placeholder = card.querySelector('textarea')?.placeholder || 'پاسخ شما';
            previewHTML += `<textarea class="form-control form-control-sm" rows="2" placeholder="${placeholder}"></textarea>`;
        }
        else if (fieldType === 'select') {
            previewHTML += `<select class="form-select form-select-sm">`;
            card.querySelectorAll('option').forEach(option => {
                previewHTML += `<option value="${option.value}" ${option.disabled ? 'disabled' : ''}>${option.textContent}</option>`;
            });
            previewHTML += `</select>`;
        }
        else if (fieldType === 'radio') {
            card.querySelectorAll('.form-check-input[type="radio"]').forEach((radio, index) => {
                const id = `preview_${radio.id}`;
                const label = radio.nextElementSibling.textContent;
                previewHTML += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="preview_${card.id}" id="${id}">
                        <label class="form-check-label" for="${id}">${label}</label>
                    </div>
                `;
            });
        }
        else if (fieldType === 'checkbox') {
            card.querySelectorAll('.form-check-input[type="checkbox"]').forEach((checkbox, index) => {
                const id = `preview_${checkbox.id}`;
                const label = checkbox.nextElementSibling.textContent;
                previewHTML += `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${id}">
                        <label class="form-check-label" for="${id}">${label}</label>
                    </div>
                `;
            });
        }
        else if (fieldType === 'file') {
            const multiple = card.querySelector('[id$="_multiple"]')?.checked || false;
            previewHTML += `<input class="form-control form-control-sm" type="file" ${multiple ? 'multiple' : ''}>`;
        }
        else if (fieldType === 'date') {
            previewHTML += `<input type="date" class="form-control form-control-sm">`;
        }
        else if (fieldType === 'time') {
            previewHTML += `<input type="time" class="form-control form-control-sm">`;
        }
        else if (fieldType === 'scale') {
            previewHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>1</span>
                    <input type="range" class="form-range" style="width: 80%;" min="1" max="5" step="1">
                    <span>5</span>
                </div>
                <div class="d-flex justify-content-between">
                    <small class="text-muted">ضعیف</small>
                    <small class="text-muted">عالی</small>
                </div>
            `;
        }

        previewHTML += `</div>`;
    });

    livePreview.innerHTML = previewHTML;
}

function togglePreview() {
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
    const previewContent = document.getElementById('previewContent');

    // Get form title and description
    const formTitle = document.getElementById('formTitle').value || 'فرم بدون عنوان';
    const formDescription = document.getElementById('formDescription').value || '';

    // Start building preview HTML
    let previewHTML = `
        <div class="form-preview p-4">
            <h3 class="mb-4" style="color: ${currentTheme}">${formTitle}</h3>
            ${formDescription ? `<p class="text-muted mb-4">${formDescription}</p>` : ''}
            <form>
    `;

    // Add all fields to preview
    document.querySelectorAll('.draggable-card').forEach(card => {
        const fieldType = card.dataset.fieldType;
        const fieldLabel = card.querySelector('.field-label-input')?.value || 'فیلد بدون عنوان';
        const fieldDescription = card.querySelector('.field-description-input')?.value || '';
        const isRequired = card.querySelector('.required-checkbox')?.checked || false;
        const conditionalLogic = card.dataset.conditionalLogic;

        if (fieldType === 'section') {
            previewHTML += `
                <div class="mb-4 pt-3">
                    <h4 class="mb-2">${fieldLabel}</h4>
                    ${fieldDescription ? `<p class="text-muted mb-3">${fieldDescription}</p>` : ''}
                </div>
            `;
            return;
        }

        previewHTML += `
            <div class="mb-4" ${conditionalLogic ? `data-conditional="${encodeURIComponent(conditionalLogic)}"` : ''}>
                <label class="form-label">
                    ${fieldLabel} ${isRequired ? '<span class="required-star">*</span>' : ''}
                </label>
                ${fieldDescription ? `<small class="text-muted d-block mb-2">${fieldDescription}</small>` : ''}
        `;

        // Add the appropriate input based on field type
        if (fieldType === 'text') {
            const placeholder = card.querySelector('input[type="text"]')?.placeholder || 'پاسخ شما';
            previewHTML += `<input type="text" class="form-control" placeholder="${placeholder}">`;
        }
        else if (fieldType === 'textarea') {
            const placeholder = card.querySelector('textarea')?.placeholder || 'پاسخ شما';
            previewHTML += `<textarea class="form-control" rows="3" placeholder="${placeholder}"></textarea>`;
        }
        else if (fieldType === 'select') {
            previewHTML += `<select class="form-select">`;
            card.querySelectorAll('option').forEach(option => {
                previewHTML += `<option value="${option.value}" ${option.disabled ? 'disabled' : ''}>${option.textContent}</option>`;
            });
            previewHTML += `</select>`;
        }
        else if (fieldType === 'radio') {
            card.querySelectorAll('.form-check-input[type="radio"]').forEach((radio, index) => {
                const id = `preview_${radio.id}`;
                const label = radio.nextElementSibling.textContent;
                previewHTML += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="preview_${card.id}" id="${id}">
                        <label class="form-check-label" for="${id}">${label}</label>
                    </div>
                `;
            });
        }
        else if (fieldType === 'checkbox') {
            card.querySelectorAll('.form-check-input[type="checkbox"]').forEach((checkbox, index) => {
                const id = `preview_${checkbox.id}`;
                const label = checkbox.nextElementSibling.textContent;
                previewHTML += `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${id}">
                        <label class="form-check-label" for="${id}">${label}</label>
                    </div>
                `;
            });
        }
        else if (fieldType === 'file') {
            const multiple = card.querySelector('[id$="_multiple"]')?.checked || false;
            previewHTML += `<input class="form-control" type="file" ${multiple ? 'multiple' : ''}>`;
        }
        else if (fieldType === 'date') {
            previewHTML += `<input type="date" class="form-control">`;
        }
        else if (fieldType === 'time') {
            previewHTML += `<input type="time" class="form-control">`;
        }
        else if (fieldType === 'scale') {
            previewHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>1</span>
                    <input type="range" class="form-range" style="width: 80%;" min="1" max="5" step="1">
                    <span>5</span>
                </div>
                <div class="d-flex justify-content-between">
                    <small class="text-muted">ضعیف</small>
                    <small class="text-muted">عالی</small>
                </div>
            `;
        }

        previewHTML += `</div>`;
    });

    previewHTML += `
            <div class="mt-4">
                <button type="submit" class="btn" style="background-color: ${currentTheme}; color: white;">ارسال</button>
            </div>
        </form>
        </div>
    `;

    previewContent.innerHTML = previewHTML;
    previewModal.show();
}

function changeTheme(color) {
    currentTheme = color;
    document.querySelectorAll('.theme-selector').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--accent-color', lightenColor(color, 20));
    updateLivePreview();
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
}

function checkEmptyState() {
    const emptyMessage = document.getElementById("emptyMessage");
    const actionButtons = document.getElementById("actionButtons");
    const fields = document.querySelectorAll('.draggable-card');

    if (fields.length === 0) {
        emptyMessage.style.display = "block";
        actionButtons.style.display = "none";
    } else {
        emptyMessage.style.display = "none";
        actionButtons.style.display = "block";
    }
}

function clearForm() {
    if (confirm('آیا از پاک کردن تمام فیلدهای فرم اطمینان دارید؟')) {
        document.getElementById('formArea').innerHTML = `
            <p class="text-muted text-center py-5" id="emptyMessage">
                <i class="bi bi-plus-circle display-6 d-block mb-3"></i>
                برای شروع، فیلدی به فرم اضافه کنید
            </p>`;
        document.getElementById('actionButtons').style.display = 'none';
        document.getElementById('formTitle').value = '';
        document.getElementById('formDescription').value = '';
        fieldCounter = 0;
        updateLivePreview();
    }
}

function showExportModal() {
    const exportModal = new bootstrap.Modal(document.getElementById('exportModal'));
    document.getElementById('exportFormName').value = document.getElementById('formTitle').value || 'فرم-بی-نام';
    exportModal.show();
}

function exportForm() {
    const formName = document.getElementById('exportFormName').value || 'فرم-بی-نام';
    const includeBootstrap = document.getElementById('includeBootstrap').checked;

    // Generate HTML form
    const formTitle = document.getElementById('formTitle').value || 'فرم بدون عنوان';
    const formDescription = document.getElementById('formDescription').value || '';

    let html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formTitle}</title>`;

    if (includeBootstrap) {
        html += `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">`;
    }

    html += `
    <style>
        body { padding: 20px; background-color: #f8f9fa; }
        .form-container { max-width: 800px; margin: 0 auto; }
        .form-header { color: ${currentTheme}; margin-bottom: 30px; }
        .required-star { color: #d32f2f; }
        .conditional-field { display: none; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1 class="form-header">${formTitle}</h1>
        ${formDescription ? `<p class="lead">${formDescription}</p>` : ''}
        <form onsubmit="return validateForm()">
            <div id="form-fields">`;

    // Add all fields
    document.querySelectorAll('.draggable-card').forEach(card => {
        const fieldType = card.dataset.fieldType;
        const fieldLabel = card.querySelector('.field-label-input')?.value || 'فیلد بدون عنوان';
        const fieldDescription = card.querySelector('.field-description-input')?.value || '';
        const isRequired = card.querySelector('.required-checkbox')?.checked || false;
        const conditionalLogic = card.dataset.conditionalLogic;

        if (fieldType === 'section') {
            html += `
            <div class="mb-4 pt-4 border-top">
                <h3>${fieldLabel}</h3>
                ${fieldDescription ? `<p class="text-muted">${fieldDescription}</p>` : ''}
            </div>`;
            return;
        }

        html += `
            <div class="mb-4" ${conditionalLogic ? `data-conditional="${encodeURIComponent(conditionalLogic)}"` : ''}>
                <label class="form-label">
                    ${fieldLabel} ${isRequired ? '<span class="required-star">*</span>' : ''}
                </label>
                ${fieldDescription ? `<small class="text-muted d-block mb-2">${fieldDescription}</small>` : ''}
        `;

        // Add the appropriate input based on field type
        if (fieldType === 'text') {
            const placeholder = card.querySelector('input[type="text"]')?.placeholder || 'پاسخ شما';
            const maxLength = card.querySelector('input[type="text"]')?.maxLength || '';
            html += `<input type="text" class="form-control" placeholder="${placeholder}" ${isRequired ? 'required' : ''} ${maxLength ? `maxlength="${maxLength}"` : ''}>`;
        }
        else if (fieldType === 'textarea') {
            const placeholder = card.querySelector('textarea')?.placeholder || 'پاسخ شما';
            const maxLength = card.querySelector('textarea')?.maxLength || '';
            html += `<textarea class="form-control" rows="3" placeholder="${placeholder}" ${isRequired ? 'required' : ''} ${maxLength ? `maxlength="${maxLength}"` : ''}></textarea>`;
        }
        else if (fieldType === 'select') {
            html += `<select class="form-select" ${isRequired ? 'required' : ''}>`;
            card.querySelectorAll('option').forEach(option => {
                html += `<option value="${option.value}" ${option.disabled ? 'disabled' : ''}>${option.textContent}</option>`;
            });
            html += `</select>`;
        }
        else if (fieldType === 'radio') {
            card.querySelectorAll('.form-check-input[type="radio"]').forEach((radio, index) => {
                const id = `export_${radio.id}`;
                const label = radio.nextElementSibling.textContent;
                html += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="export_${card.id}" id="${id}" ${isRequired ? 'required' : ''}>
                        <label class="form-check-label" for="${id}">${label}</label>
                    </div>
                `;
            });
        }
        else if (fieldType === 'checkbox') {
            card.querySelectorAll('.form-check-input[type="checkbox"]').forEach((checkbox, index) => {
                const id = `export_${checkbox.id}`;
                const label = checkbox.nextElementSibling.textContent;
                html += `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${id}" ${isRequired ? 'required' : ''}>
                        <label class="form-check-label" for="${id}">${label}</label>
                    </div>
                `;
            });
        }
        else if (fieldType === 'file') {
            const multiple = card.querySelector('[id$="_multiple"]')?.checked || false;
            html += `<input class="form-control" type="file" ${multiple ? 'multiple' : ''} ${isRequired ? 'required' : ''}>`;
        }
        else if (fieldType === 'date') {
            html += `<input type="date" class="form-control" ${isRequired ? 'required' : ''}>`;
        }
        else if (fieldType === 'time') {
            html += `<input type="time" class="form-control" ${isRequired ? 'required' : ''}>`;
        }
        else if (fieldType === 'scale') {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>1</span>
                    <input type="range" class="form-range" style="width: 80%;" min="1" max="5" step="1" ${isRequired ? 'required' : ''}>
                    <span>5</span>
                </div>
                <div class="d-flex justify-content-between">
                    <small class="text-muted">ضعیف</small>
                    <small class="text-muted">عالی</small>
                </div>
            `;
        }

        html += `</div>`;
    });

    html += `
            </div>
            <div class="mt-4">
                <button type="submit" class="btn" style="background-color: ${currentTheme}; color: white;">ارسال</button>
            </div>
        </form>
    </div>
    
    <script>
        function validateForm() {
            // Validate required fields
            const requiredFields = document.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                alert('لطفا تمام فیلدهای اجباری را پر کنید');
                return false;
            }
            
            // Process conditional logic
            processConditionalLogic();
            return true;
        }
        
        function processConditionalLogic() {
            const conditionalFields = document.querySelectorAll('[data-conditional]');
            
            conditionalFields.forEach(field => {
                const condition = JSON.parse(decodeURIComponent(field.getAttribute('data-conditional')));
                const targetField = document.getElementById(condition.field);
                
                if (targetField) {
                    const targetValue = targetField.value;
                    let conditionMet = false;
                    
                    switch (condition.operator) {
                        case 'equals':
                            conditionMet = targetValue === condition.value;
                            break;
                        case 'not_equals':
                            conditionMet = targetValue !== condition.value;
                            break;
                        case 'contains':
                            conditionMet = targetValue.includes(condition.value);
                            break;
                        case 'not_contains':
                            conditionMet = !targetValue.includes(condition.value);
                            break;
                    }
                    
                    if (condition.action === 'show') {
                        field.style.display = conditionMet ? 'block' : 'none';
                    } else {
                        field.style.display = conditionMet ? 'none' : 'block';
                    }
                }
            });
        }
        
        // Add event listeners for conditional fields
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('change', processConditionalLogic);
        });
        
        // Initial processing
        processConditionalLogic();
    </script>
</body>
</html>`;

    // Create download link
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
}

function publishForm() {
    const publishModal = new bootstrap.Modal(document.getElementById('publishModal'));
    const randomId = Math.random().toString(36).substring(2, 10);
    const formLink = `https://example.com/forms/${randomId}`;

    document.getElementById('formLink').value = formLink;
    publishModal.show();
}

function copyFormLink() {
    const formLink = document.getElementById('formLink');
    formLink.select();
    document.execCommand('copy');
    alert('لینک کپی شد!');
}

function shareOnTelegram() {
    const formLink = document.getElementById('formLink').value;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(formLink)}`, '_blank');
}

function shareOnWhatsApp() {
    const formLink = document.getElementById('formLink').value;
    window.open(`https://wa.me/?text=${encodeURIComponent(formLink)}`, '_blank');
}

function shareOnTwitter() {
    const formLink = document.getElementById('formLink').value;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(formLink)}`, '_blank');
}

function addOption(fieldId) {
    const selectElement = document.querySelector(`#${fieldId} select`);
    if (selectElement) {
        const optionCount = selectElement.querySelectorAll('option:not([disabled])').length;
        const newOptionValue = `option${optionCount + 1}`;
        const newOptionText = `گزینه ${optionCount + 1}`;

        const newOption = document.createElement('option');
        newOption.value = newOptionValue;
        newOption.textContent = newOptionText;

        selectElement.appendChild(newOption);
        updateLivePreview();
    }
}

function addRadioOption(fieldId) {
    const container = document.getElementById(fieldId);
    if (container) {
        const radioCount = container.querySelectorAll('input[type="radio"]').length;
        const newRadioId = `${fieldId}_radio${radioCount + 1}`;

        const newRadioDiv = document.createElement('div');
        newRadioDiv.className = 'form-check';
        newRadioDiv.innerHTML = `
            <input class="form-check-input" type="radio" name="${fieldId}_radio" id="${newRadioId}">
            <label class="form-check-label" for="${newRadioId}">گزینه ${radioCount + 1}</label>
        `;

        const addButton = container.querySelector('button');
        if (addButton) {
            addButton.before(newRadioDiv);
            updateLivePreview();
        }
    }
}

function addCheckboxOption(fieldId) {
    const container = document.getElementById(fieldId);
    if (container) {
        const checkboxCount = container.querySelectorAll('input[type="checkbox"]').length;
        const newCheckboxId = `${fieldId}_checkbox${checkboxCount + 1}`;

        const newCheckboxDiv = document.createElement('div');
        newCheckboxDiv.className = 'form-check';
        newCheckboxDiv.innerHTML = `
            <input class="form-check-input" type="checkbox" id="${newCheckboxId}">
            <label class="form-check-label" for="${newCheckboxId}">گزینه ${checkboxCount + 1}</label>
        `;

        const addButton = container.querySelector('button');
        if (addButton) {
            addButton.before(newCheckboxDiv);
            updateLivePreview();
        }
    }
}

function changeTheme(color) {
    currentTheme = color;
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--accent-color', lightenColor(color, 20));

    // Update color value display
    document.getElementById('primaryColorValue').textContent = color;
    document.getElementById('customPrimaryColor').value = color;

    updateDesignPreview();
}

function changeFormLayout(layout) {
    const preview = document.getElementById('designPreview');
    if (layout === 'centered') {
        preview.classList.add('centered-form');
    } else {
        preview.classList.remove('centered-form');
    }
}

function updateTextColor(color) {
    document.documentElement.style.setProperty('--text-color', color);
    document.getElementById('textColorValue').textContent = color;
    updateDesignPreview();
}

function updateBackgroundColor(color) {
    document.documentElement.style.setProperty('--bg-color', color);
    document.getElementById('bgColorValue').textContent = color;
    updateDesignPreview();
} function updateButtonTextColor(color) {
    document.documentElement.style.setProperty('--button-text-color', color);
    document.getElementById('buttonTextColorValue').textContent = color;
    updateDesignPreview();
}
function updateButtonHoverColor(color) {
    document.documentElement.style.setProperty('--button-hover-color', color);
    document.getElementById('buttonHoverColorValue').textContent = color;
    updateDesignPreview();
}
function updateFontFamily(font) {
    document.documentElement.style.setProperty('--font-family', font);
    updateDesignPreview();
}

function updateDesignPreview() {
    const preview = document.getElementById('designPreview');
    const formTitle = document.getElementById('formTitle').value || 'فرم بدون عنوان';
    const formDescription = document.getElementById('formDescription').value || '';

    let previewHTML = `
        <h3 style="color: ${currentTheme}">${formTitle}</h3>
        ${formDescription ? `<p class="text-muted mb-4">${formDescription}</p>` : ''}
        <form>
    `;

    // Add form fields to preview
    document.querySelectorAll('.draggable-card').forEach(card => {
        const fieldType = card.dataset.fieldType;
        const fieldLabel = card.querySelector('.field-label-input')?.value || 'فیلد بدون عنوان';
        const isRequired = card.querySelector('.required-checkbox')?.checked || false;

        if (fieldType === 'section') {
            previewHTML += `
                <div class="mb-4 pt-3">
                    <h4>${fieldLabel}</h4>
                </div>
            `;
            return;
        }

        previewHTML += `
            <div class="mb-3">
                <label class="form-label">
                    ${fieldLabel} ${isRequired ? '<span class="required-star">*</span>' : ''}
                </label>
        `;

        // Add field input based on type
        if (fieldType === 'text') {
            previewHTML += `<input type="text" class="form-control">`;
        } else if (fieldType === 'textarea') {
            previewHTML += `<textarea class="form-control" rows="3"></textarea>`;
        } else if (fieldType === 'select') {
            previewHTML += `<select class="form-select"><option>انتخاب کنید</option></select>`;
        } else if (fieldType === 'radio') {
            previewHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="previewRadio">
                    <label class="form-check-label">گزینه ۱</label>
                </div>
            `;
        }

        previewHTML += `</div>`;
    });

    previewHTML += `
            <button type="submit" class="btn mt-3" style="background-color: ${currentTheme}; color: white;">
                ارسال
            </button>
        </form>
    `; ``

    preview.innerHTML = previewHTML;
}

function goToSettingsTab() {
    // Get the current active tab
    const currentTab = document.querySelector('.nav-pills .nav-link.active');

    // Find the next tab in sequence
    const nextTab = currentTab.parentElement.nextElementSibling?.querySelector('.nav-link');

    if (nextTab) {
        // Show the next tab
        const tabInstance = new bootstrap.Tab(nextTab);
        tabInstance.show();
    } else {
        // If we're on the last tab, show the first one (circular navigation)
        const firstTab = document.querySelector('.nav-pills .nav-link:first-child');
        const tabInstance = new bootstrap.Tab(firstTab);
        tabInstance.show();
    }
}

// Initialize design preview when tab is shown
document.getElementById('pills-tab9').addEventListener('shown.bs.tab', function () {
    updateDesignPreview();
});


function updateTitleFontSize(size) {
    document.documentElement.style.setProperty('--title-font-size', size);
    updateDesignPreview();
}

function updateFontWeight(weight) {
    document.documentElement.style.setProperty('--font-weight', weight);
    updateDesignPreview();
}

function updateCardShadow(show) {
    if (show) {
        document.documentElement.style.setProperty('--card-shadow', '0 4px 12px rgba(0, 0, 0, 0.1)');
    } else {
        document.documentElement.style.setProperty('--card-shadow', 'none');
    }
    updateDesignPreview();
}

function updateRoundedCorners(rounded) {
    if (rounded) {
        document.documentElement.style.setProperty('--border-radius', '8px');
    } else {
        document.documentElement.style.setProperty('--border-radius', '0');
    }
    updateDesignPreview();
}

function updateFieldSpacing(value) {
    document.documentElement.style.setProperty('--field-spacing', `${value}rem`);
    updateDesignPreview();
}