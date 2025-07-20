function addNewField() {
    const fieldCount = document.querySelectorAll('.card').length;
    const newFieldId = `field_${fieldCount + 1}`;
    const newTitleId = `title_${fieldCount + 1}`;
    const submitButton = document.getElementById("submitButton");
    submitButton.style = "";

    let template = `
        <div class="row mt-3">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h4 id="${newTitleId}">Field</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-lg-6">
                                <label for="${newFieldId}" class="form-label">Label</label>
                                <input type="text" class="form-control" id="${newFieldId}" oninput="updateTitle(this)">
                            </div>
                            <div class="col">
                                <label for="field_2" class="form-label">Type</label>
                                <select class="form-select" name="" id="">
                            <option value="" class="">char</option>
                            <option value="" class="">text</option>
                            <option value="" class="">email</option>
                            <option value="" class="">file</option>
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-danger mt-3 delete-btn">Delete field</button>
                    </div>
                </div>
            </div>
        </div>`;
    document.getElementById("formArea").innerHTML += template;
}

function updateTitle(inputElement) {
    const newTitle = inputElement.value;
    document.title = newTitle;

    const cardElement = inputElement.closest('.card');
    if (cardElement) {
        const cardTitleElement = cardElement.querySelector('.card-header h4');
        if (cardTitleElement) {
            cardTitleElement.innerText = newTitle;
        }
    }
}
