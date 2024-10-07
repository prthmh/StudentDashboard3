let selectedDeptIds = [];
let editDeptId;
$(document).ready(function () {
    loadDeptList();

    $('#departmentForm').submit(function (e) {
        e.preventDefault();

        let deptData = {
            Name: $('#Name').val(),
        };

        if ($(this).attr('data-editing') === 'true') {
            deptData = {
                DeptId: editDeptId,
                Name: $('#Name').val(),
            }

            $.post('/Department/Edit', deptData, function (response) {
                if (response.success) {
                    alert('Department updated successfully!');
                    loadDeptList();

                    // Reset the form to "add mode"
                    $('#departmentForm').attr('data-editing', 'false');
                    $('#departmentFormHeading').text('Register');
                    $('#submitDeptForm').text('Create');
                    $('#departmentForm')[0].reset();
                    selectedDeptIds = [];
                } else {
                    alert('Failed to update department');
                }
            });
        } else {
            $.post('/Department/Create', deptData, function (response) {
                if (response.success) {
                    alert("Department registered successfully!");
                    loadDeptList();
                    $('.form-control').val(''); // Clear form fields
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while submitting the form.");
            });
        }

       
    })


    // Handle checkbox selection for individual department
    $('#departmentTable').on('change', '.dept-checkbox-item', function () {
        let dpId = $(this).data('dept-id');

        if (this.checked) {
            selectedDeptIds.push(dpId);
        } else {
            selectedDeptIds = selectedDeptIds.filter(id => id !== dpId);
        }

        // Check if all individual checkboxes are selected
        if ($('.dept-checkbox-item:checked').length === $('.dept-checkbox-item').length) {
            $('#selectAllDept').prop('checked', true);
        } else {
            $('#selectAllDept').prop('checked', false);
        }
        console.log(selectedDeptIds);
    });

    // Handle "Select All" checkbox functionality
    $('#selectAllDept').click(function () {
        selectedDeptIds = [];
        let isChecked = this.checked;

        $('#departmentTable .dept-checkbox-item').each(function () {
            $(this).prop('checked', isChecked);
            let deptId = $(this).data('dept-id');

            if (isChecked) {
                selectedDeptIds.push(deptId);
            } else {
                selectedDeptIds = selectedDeptIds.filter(id => id !== deptId);
            }
        });
        console.log(selectedDeptIds);
    });
}) 

function loadDeptList() {
    $.get('/Department/GetAllDepartments', function (data) {
        var rows = '';

        data.forEach(function (dept) {

            rows += '<tr>' +
                '<td>' + `<input type="checkbox" class="dept-checkbox-item form-check-input" data-dept-id="${dept.DeptId}" />` + '</td>' +
                '<td>' + dept.Name + '</td>' +
                '</tr>';
        });

        // Unchecking select all if it was checked previously
        $('#selectAll').prop('checked', false);

        // Insert the rows into the table body
        $('#departmentTable tbody').html(rows);
    }).fail(function () {
        alert("An error occurred while loading the department list.");
    });
}

function deleteDeptBasedOfSelect() {
    if (selectedDeptIds.length > 0) {
        // Confirm deletion
        var confirmation = confirm("Are you sure you want to delete the selected departments?");
        if (confirmation) {
            // Make the AJAX POST request
            $.post('/Department/DeleteMultiple', { deptIds: selectedDeptIds }, function (response) {
                if (response.success) {
                    alert("Selected departments deleted successfully!");
                    loadDeptList(); // Reload the department list
                    selectedDeptIds = [];
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while deleting departments.");
            });
        }
    } else {
        alert("Please select at least one department to delete.");
    }
}

function copyDeptBasedOfSelect() {
    if (selectedDeptIds.length >= 2) {
        alert("Please select only one department at a time for copy operation.")
    } else {
        const idOfDeptToCopy = selectedDeptIds[0];
        copyDepartment(idOfDeptToCopy);
    }
}

function copyDepartment(deptId) {
    const copyDeptId = Number(deptId);
    $.get('/Department/GetAllDepartments', function (data) {
        let department = data.find(dept => dept.DeptId === copyDeptId);

        if (department) {
            // Construct the new department data object
            let newDepartmentData = {
                Name: department.Name
            };

            // Send the POST request to create a new department
            $.post('/Department/Create', newDepartmentData, function (response) {
                console.log(response);
                if (response.success) { // Check for success
                    alert('Department added successfully!');
                    loadDeptList(); // Reload the department list after adding
                    selectedDeptIds = [];
                } else {
                    alert('Failed to add department: ' + response.errorMessage); // Show error message from server
                }
            }).fail(function () {
                alert("An error occurred while adding the department.");
            });
        } else {
            alert("Department not found");
        }
    }).fail(function () {
        alert("An error occurred while loading department data.");
    });
}


function editDeptBasedOfSelect() {
    if (selectedDeptIds.length >= 2) {
        alert("Please select only one employee at a time for edit operation.")
    } else {
        const idOfDeptToCopy = selectedDeptIds[0];
        editDepartment(idOfDeptToCopy); 
    }
}

function editDepartment(deptId) {
    editDeptId = Number(deptId);

    $.get('/Department/GetAllDepartments', function (data) {
        let department = data.find(dept => dept.DeptId === editDeptId);

        if (department) {
            // Populate the form fields with the department details
            $('#Name').val(department.Name);

            // Set form to "edit mode"
            $('#departmentForm').attr('data-editing', 'true'); // Custom attribute to indicate edit mode
            $('#departmentFormHeading').text('Edit Department Details'); // Update form heading for edit mode
            $('#submitDeptForm').text('Save'); // Change button text to 'Save' for editing

        } else {
            alert("Department not found");
        }
    }).fail(function () {
        alert("An error occurred while loading department data.");
    });
}
