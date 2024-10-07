let selectedStudentIds = [];
let editStudentId;

$(document).ready(function () {
    loadStudentList();

    $('#studentForm').submit(function (e) {
        e.preventDefault();
        let studentData = {
            FirstName: $('#FirstName').val(),
            MiddleName: $('#MiddleName').val(),
            LastName: $('#LastName').val(),
            Gender: $('#Gender').val(),
            DOB: $('#DOB').val(),
            Address: $('#Address').val(),
            PinCode: $('#PinCode').val()
        };

        console.log($(this).attr('data-editing') === 'true')

        if ($(this).attr('data-editing') === 'true') {
            studentData = {
                StudId: editStudentId,
                ...studentData
            }
            console.log(studentData);
            $.post('/Student/Edit', studentData, function (response) {
                if (response.success) {
                    alert('Student updated successfully!');
                    loadStudentList(); 

                    // Reset the form to "add mode"
                    $('#studentForm').attr('data-editing', 'false'); 
                    $('#studentFormHeading').text('Register'); 
                    $('#studentButton').text('Create'); 
                    $('#studentForm')[0].reset(); 
                } else {
                    alert('Failed to update student');
                }
            });

        } else {
            $.post('/Student/Create', studentData, function (response) {
                if (response.success) {
                    alert("Student registered successfully!");
                    loadStudentList();
                    $('.form-control').val(''); // Clear form fields
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while submitting the form.");
            });
        }
    });

    // Handle checkbox selection for individual students
    $('#studentTable').on('change', '.checkbox-item', function () {
        let studentId = $(this).data('student-id');

        if (this.checked) {
            selectedStudentIds.push(studentId);
        } else {
            selectedStudentIds = selectedStudentIds.filter(id => id !== studentId);
        }

        // Check if all individual checkboxes are selected
        if ($('.checkbox-item:checked').length === $('.checkbox-item').length) {
            $('#selectAll').prop('checked', true);
        } else {
            $('#selectAll').prop('checked', false);
        }
        console.log(selectedStudentIds);
    });

    // Handle "Select All" checkbox functionality
    $('#selectAll').click(function () {
        selectedStudentIds = [];
        let isChecked = this.checked;

        $('#studentTable .checkbox-item').each(function () {
            $(this).prop('checked', isChecked);
            let studentId = $(this).data('student-id');

            if (isChecked) {
                selectedStudentIds.push(studentId);
            } else {
                selectedStudentIds = selectedStudentIds.filter(id => id !== studentId);
            }
        });
        console.log(selectedStudentIds);
    });
});

function loadStudentList() {
    $.get('/Student/GetAllStudents', function (data) {
        var rows = '';

        // Loop through the student data and create rows for each entry
        data.forEach(function (student) {
            var formattedDOB = formatDOB(student.DOB); // Use the utility function to format DOB

            rows += '<tr>' +
                '<td>' + `<input type="checkbox" class="checkbox-item form-check-input" data-student-id="${student.StudId}" />` + '</td>' +
                '<td>' + student.FirstName + '</td>' +
                '<td>' + student.MiddleName + '</td>' +
                '<td>' + student.LastName + '</td>' +
                '<td>' + student.Gender + '</td>' +
                '<td>' + formattedDOB + '</td>' + // Use the formatted DOB here
                '<td>' + student.Address + '</td>' +
                '<td>' + student.PinCode + '</td>' +
                '</tr>';
        });

        // Unchecking select all if it was checked previously
        $('#selectAll').prop('checked', false);

        // Insert the rows into the table body
        $('#studentTable tbody').html(rows);
    }).fail(function () {
        alert("An error occurred while loading the student list.");
    });
}

function deleteBasedOfSelect() {
    if (selectedStudentIds.length > 0) {
        // Confirm deletion
        var confirmation = confirm("Are you sure you want to delete the selected students?");
        if (confirmation) {
            // Make the AJAX POST request
            $.post('/Student/DeleteMultiple', { studentIds: selectedStudentIds }, function (response) {
                if (response.success) {
                    alert("Selected students deleted successfully!");
                    loadStudentList(); // Reload the student list
                    selectedStudentIds = [];
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while deleting students.");
            });
        }
    } else {
        alert("Please select at least one student to delete.");
    }
}

function copyBasedOfSelect() {
    if (selectedStudentIds.length >= 2) {
        alert("Please select only one student at a time for copy operation.")
    } else {
        const idOfStudToCopy = selectedStudentIds[0];
        copyStudent(idOfStudToCopy);
    }
}

function copyStudent(studentId) {
    const copyStudId = Number(studentId);
    $.get('/Student/GetAllStudents', function (data) {
        let student = data.find(stud => stud.StudId === copyStudId);

        if (student) {
            // Construct the new student data object
            let newStudentData = {
                FirstName: student.FirstName,
                MiddleName: student.MiddleName,
                LastName: student.LastName,
                Gender: student.Gender,
                DOB: formatDOB(student.DOB), // Use the utility function for DOB
                Address: student.Address,
                PinCode: student.PinCode
            };

            // Send the POST request to create a new student
            $.post('/Student/Create', newStudentData, function (response) {
                console.log(response);
                if (response.success) { // Check for success
                    alert('Student added successfully!');
                    loadStudentList(); // Reload the student list after adding
                    selectedStudentIds = [];
                } else {
                    alert('Failed to add student: ' + response.errorMessage); // Show error message from server
                }
            }).fail(function () {
                alert("An error occurred while adding the student.");
            });
        } else {
            alert("Student not found");
        }
    }).fail(function () {
        alert("An error occurred while loading student data.");
    });
}

function editBasedOfSelect() {
    if (selectedStudentIds.length >= 2) {
        alert("Please select only one employee at a time for edit operation.")
    } else {
        const idOfStudToCopy = selectedStudentIds[0];
        editStudent(idOfStudToCopy);
    }
}

function editStudent(studentId) {
    editStudentId = Number(studentId);
    $.get('/Student/GetAllStudents', function (data) {
        let student = data.find(stud => stud.StudId === editStudentId);

        if (student) {
            $('#FirstName').val(student.FirstName);
            $('#MiddleName').val(student.MiddleName);
            $('#LastName').val(student.LastName);
            $('#Gender').val(student.Gender);
            $('#DOB').val(student.DOB);
            $('#Address').val(student.Address);
            $('#PinCode').val(student.PinCode);

            // Set form to "edit mode"
            $('#studentForm').attr('data-editing', 'true'); // Custom attribute to indicate edit mode
            $('#studentFormHeading').text('Edit Student Details'); // Update form heading for edit mode
            $('#submitForm').text('Save'); // Change button text to 'Save' for editing

        } else {
            alert("Student not found");
        }
    });
}


// Utility function to format DOB
function formatDOB(dob) {
    if (dob && dob.includes("/Date")) {
        // Extract the timestamp part from the /Date(1419532200000)/ format
        var timestamp = parseInt(dob.replace(/\/Date\((\d+)\)\//, '$1'));
        // Create a Date object from the timestamp
        var dateOfBirth = new Date(timestamp);
        // Format the date as MM/dd/yyyy
        var day = dateOfBirth.getDate();
        var month = dateOfBirth.getMonth() + 1; // Months are 0-based in JS
        var year = dateOfBirth.getFullYear();
        return month + '/' + day + '/' + year;
    } else {
        return 'N/A'; // Fallback for missing or invalid DOB
    }
}
