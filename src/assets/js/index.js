function addNewField() {
    const fieldCount = document.querySelectorAll('.card').length;
    const newFieldId = `field_${fieldCount + 1}`;
    const newTitleId = `title_${fieldCount + 1}`;
    const switchId = `flexSwitchCheck_${fieldCount + 1}`; // Unique ID for each switch
    const submitButton = document.getElementById("submitButton");
    const form = document.getElementById("formArea");
    form.style = "";
    submitButton.style = "";

    let template = `
<div class="row mt-3">
    <div class="col">
        <div class="card">
            <div class="card-header">
                <h4 id="${newTitleId}">فیلد</h4>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-12 col-lg-6">
                        <div class="input-group mb-3 flex-row-reverse">
                            <input type="text" class="form-control" id="${newFieldId}" oninput="updateTitle(this)">
                            <span class="input-group-text" id="basic-addon1">لیبل</span>
                        </div>
                    </div>
                    <div class="col-1 order-0">
                        <button class="btn btn-info"><i class="bi bi-image"></i></button>
                    </div>

                    <div class="col">
                        <div class="input-group mb-3 flex-row-reverse">
                            <select name="" id="" class="form-select">
    <option value="">یک تایپ اینتخاب کنید</option>
    <option value="">متن</option>
    <option value="">ایمیل</option>
    <option value="">فایل</option>
</select>
                            <span class="input-group-text" id="basic-addon1">لیبل</span>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <div> <!-- This div is for potential other content on the left -->
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" role="switch" id="${switchId}">
                          <label class="form-check-label" for="${switchId}">اجباری</label>
                        </div>
                    </div>
                    <!-- The switch and label are now pushed to the right by justify-content-between -->
                    <!-- If you want only the switch and label on the right, remove the outer div and adjust -->
                </div>
                <button class="btn btn-danger mt-3 delete-btn">حذف فیلد<i class="bi bi-x-circle"></i></button>
            </div>
        </div>
    </div>
</div>`;
    document.getElementById("formArea").innerHTML += template;
}
