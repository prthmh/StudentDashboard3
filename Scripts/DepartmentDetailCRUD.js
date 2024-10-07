let selectedDeptDetailIds = [];
let editDeptDetailId;

$(document).ready(function () {
    loadDeptDetailList();

    $('#departmentDetailForm').submit(function (e) {
        e.preventDefault();

        let deptDetailData = {
            DeptId: $('#DeptId').val(),
            SemId: $('#SemId').val(),
            SubjectName: $('#SubjectName').val(),
            Marks: $('#Marks').val(),
        };

        if ($(this).attr('data-editing') === 'true') {
            deptDetailData = {
                DeptDetailId: editDeptDetailId,
                DeptId: $('#DeptId').val(),
                SemId: $('#SemId').val(),
                SubjectName: $('#SubjectName').val(),
                Marks: $('#Marks').val(),
            }

            $.post('/DepartmentDetail/Edit', deptDetailData, function (response) {
                if (response.success) {
                    alert('Department detail updated successfully!');
                    loadDeptDetailList();

                    // Reset the form to "add mode"
                    $('#departmentDetailForm').attr('data-editing', 'false');
                    $('#departmentDetailFormHeading').text('Register Department Detail');
                    $('#submitDeptDetailForm').text('Create');
                    $('#departmentDetailForm')[0].reset();
                    selectedDeptDetailIds = [];
                } else {
                    alert('Failed to update department detail');
                }
            });
        } else {
            $.post('/DepartmentDetail/Create', deptDetailData, function (response) {
                if (response.success) {
                    alert("Department detail registered successfully!");
                    loadDeptDetailList();
                    $('.form-control').val(''); // Clear form fields
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while submitting the form.");
            });
        }
    });

    // Handle checkbox selection for individual department detail
    $('#departmentDetailTable').on('change', '.dept-detail-checkbox-item', function () {
        let deptDetailId = $(this).data('dept-detail-id');

        if (this.checked) {
            selectedDeptDetailIds.push(deptDetailId);
        } else {
            selectedDeptDetailIds = selectedDeptDetailIds.filter(id => id !== deptDetailId);
        }

        // Check if all individual checkboxes are selected
        if ($('.dept-detail-checkbox-item:checked').length === $('.dept-detail-checkbox-item').length) {
            $('#selectAllDeptDetail').prop('checked', true);
        } else {
            $('#selectAllDeptDetail').prop('checked', false);
        }
        console.log(selectedDeptDetailIds);
    });

    // Handle "Select All" checkbox functionality
    $('#selectAllDeptDetail').click(function () {
        selectedDeptDetailIds = [];
        let isChecked = this.checked;

        $('#departmentDetailTable .dept-detail-checkbox-item').each(function () {
            $(this).prop('checked', isChecked);
            let deptDetailId = $(this).data('dept-detail-id');

            if (isChecked) {
                selectedDeptDetailIds.push(deptDetailId);
            } else {
                selectedDeptDetailIds = selectedDeptDetailIds.filter(id => id !== deptDetailId);
            }
        });
        console.log(selectedDeptDetailIds);
    });
});

function loadDeptDetailList() {
    $.get('/DepartmentDetail/GetAllDepartmentDetails', function (data) {
        var rows = '';

        data.forEach(function (detail) {
            rows += '<tr>' +
                '<td>' + `<input type="checkbox" class="dept-detail-checkbox-item form-check-input" data-dept-detail-id="${detail.DeptDetailId}" />` + '</td>' +
                '<td>' + detail.SubjectName + '</td>' +
                '<td>' + detail.Marks + '</td>' +
                '<td>' + detail.DeptName + '</td>' + // Display DeptId if necessary, otherwise use the department name
                '<td>' + detail.SemName + '</td>' + // Display SemId if necessary, otherwise use the semester name
                '</tr>';
        });

        // Unchecking select all if it was checked previously
        $('#selectAllDeptDetail').prop('checked', false);

        // Insert the rows into the table body
        $('#departmentDetailTable tbody').html(rows);
    }).fail(function () {
        alert("An error occurred while loading the department detail list.");
    });
}

function deleteDeptDetailBasedOnSelect() {
    if (selectedDeptDetailIds.length > 0) {
        // Confirm deletion
        var confirmation = confirm("Are you sure you want to delete the selected department details?");
        if (confirmation) {
            // Make the AJAX POST request
            $.post('/DepartmentDetail/DeleteMultiple', { deptDetailIds: selectedDeptDetailIds }, function (response) {
                if (response.success) {
                    alert("Selected department details deleted successfully!");
                    loadDeptDetailList(); // Reload the department detail list
                    selectedDeptDetailIds = [];
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while deleting department details.");
            });
        }
    } else {
        alert("Please select at least one department detail to delete.");
    }
}

function copyDeptDetailBasedOnSelect() {
    if (selectedDeptDetailIds.length >= 2) {
        alert("Please select only one department detail at a time for copy operation.");
    } else {
        const idOfDeptDetailToCopy = selectedDeptDetailIds[0];
        copyDepartmentDetail(idOfDeptDetailToCopy);
    }
}

function copyDepartmentDetail(deptDetailId) {
    const copyDeptDetailId = Number(deptDetailId);
    $.get('/DepartmentDetail/GetAllDepartmentDetails', function (data) {
        let departmentDetail = data.find(detail => detail.DeptDetailId === copyDeptDetailId);

        if (departmentDetail) {
            // Construct the new department detail data object
            let newDepartmentDetailData = {
                DeptId: departmentDetail.DeptId,
                SemId: departmentDetail.SemId,
                SubjectName: departmentDetail.SubjectName,
                Marks: departmentDetail.Marks
            };

            // Send the POST request to create a new department detail
            $.post('/DepartmentDetail/Create', newDepartmentDetailData, function (response) {
                console.log(response);
                if (response.success) { // Check for success
                    alert('Department detail added successfully!');
                    loadDeptDetailList(); // Reload the department detail list after adding
                    selectedDeptDetailIds = [];
                } else {
                    alert('Failed to add department detail: ' + response.errorMessage); // Show error message from server
                }
            }).fail(function () {
                alert("An error occurred while adding the department detail.");
            });
        } else {
            alert("Department detail not found");
        }
    }).fail(function () {
        alert("An error occurred while loading department detail data.");
    });
}

function editDeptDetailBasedOnSelect() {
    if (selectedDeptDetailIds.length >= 2) {
        alert("Please select only one department detail at a time for edit operation.");
    } else {
        const idOfDeptDetailToEdit = selectedDeptDetailIds[0];
        editDepartmentDetail(idOfDeptDetailToEdit);
    }
}

function editDepartmentDetail(deptDetailId) {
    editDeptDetailId = Number(deptDetailId);

    $.get('/DepartmentDetail/GetAllDepartmentDetails', function (data) {
        let departmentDetail = data.find(detail => detail.DeptDetailId === editDeptDetailId);

        if (departmentDetail) {
            // Populate the form fields with the department detail
            $('#DeptId').val(departmentDetail.DeptId);
            $('#SemId').val(departmentDetail.SemId);
            $('#SubjectName').val(departmentDetail.SubjectName);
            $('#Marks').val(departmentDetail.Marks);

            // Set form to "edit mode"
            $('#departmentDetailForm').attr('data-editing', 'true'); // Custom attribute to indicate edit mode
            $('#departmentDetailFormHeading').text('Edit Department Detail'); // Update form heading for edit mode
            $('#submitDeptDetailForm').text('Save'); // Change button text to 'Save' for editing

        } else {
            alert("Department detail not found");
        }
    }).fail(function () {
        alert("An error occurred while loading department detail data.");
    });
}
