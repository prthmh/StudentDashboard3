let selectedSemIds = [];
let editSemId;
$(document).ready(function () {
    loadSemList();

    $('#semesterForm').submit(function (e) {
        e.preventDefault();

        let romanNumeral = toRoman(parseInt($('#Name').val()));

        let semData = {
            Name: romanNumeral,
        };

        if ($(this).attr('data-editing') === 'true') {
            semData = {
                SemId: editSemId,
                Name: romanNumeral,
            }

            $.post('/Semester/Edit', semData, function (response) {
                if (response.success) {
                    alert('Semester updated successfully!');
                    loadSemList();

                    // Reset the form to "add mode"
                    $('#semesterForm').attr('data-editing', 'false');
                    $('#semesterFormHeading').text('Register');
                    $('#submitSemForm').text('Create');
                    $('#semesterForm')[0].reset();
                    selectedSemIds = [];
                } else {
                    alert('Failed to update semester');
                }
            });
        } else {
            $.post('/Semester/Create', semData, function (response) {
                if (response.success) {
                    alert("Semester registered successfully!");
                    loadSemList();
                    $('.form-control').val(''); // Clear form fields
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while submitting the form.");
            });
        }


    })

    // Handle checkbox selection for individual semester
    $('#semesterTable').on('change', '.sem-checkbox-item', function () {
        let semId = $(this).data('sem-id');

        if (this.checked) {
            selectedSemIds.push(semId);
        } else {
            selectedSemIds = selectedSemIds.filter(id => id !== semId);
        }

        // Check if all individual checkboxes are selected
        if ($('.sem-checkbox-item:checked').length === $('.sem-checkbox-item').length) {
            $('#selectAllSem').prop('checked', true);
        } else {
            $('#selectAllSem').prop('checked', false);
        }
        console.log(selectedSemIds);
    });

    // Handle "Select All" checkbox functionality
    $('#selectAllSem').click(function () {
        selectedSemIds = [];
        let isChecked = this.checked;

        $('#semesterTable .sem-checkbox-item').each(function () {
            $(this).prop('checked', isChecked);
            let semId = $(this).data('sem-id');

            if (isChecked) {
                selectedSemIds.push(semId);
            } else {
                selectedSemIds = selectedSemIds.filter(id => id !== semId);
            }
        });
        console.log(selectedSemIds);
    });
})

function loadSemList() {
    $.get('/Semester/GetAllSemesters', function (data) {
        var rows = '';

        data.forEach(function (sem) {

            rows += '<tr>' +
                '<td>' + `<input type="checkbox" class="sem-checkbox-item form-check-input" data-sem-id="${sem.SemId}" />` + '</td>' +
                '<td>' + sem.Name + '</td>' +
                '</tr>';
        });

        // Unchecking select all if it was checked previously
        $('#selectAllSem').prop('checked', false);

        // Insert the rows into the table body
        $('#semesterTable tbody').html(rows);
    }).fail(function () {
        alert("An error occurred while loading the semester list.");
    });
}

function deleteSemBasedOfSelect() {
    if (selectedSemIds.length > 0) {
        // Confirm deletion
        var confirmation = confirm("Are you sure you want to delete the selected semesters?");
        if (confirmation) {
            // Make the AJAX POST request
            $.post('/Semester/DeleteMultiple', { semIds: selectedSemIds }, function (response) {
                if (response.success) {
                    alert("Selected semesters deleted successfully!");
                    loadSemList(); // Reload the semester list
                    selectedSemIds = [];
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while deleting semesters.");
            });
        }
    } else {
        alert("Please select at least one semester to delete.");
    }
}

function copySemBasedOfSelect() {
    if (selectedSemIds.length >= 2) {
        alert("Please select only one semester at a time for copy operation.")
    } else {
        const idOfSemToCopy = selectedSemIds[0];
        copySemester(idOfSemToCopy);
    }
}

function copySemester(semId) {
    const copySemId = Number(semId);
    $.get('/Semester/GetAllSemesters', function (data) {
        let semester = data.find(sem => sem.SemId === copySemId);

        if (semester) {
            // Construct the new semester data object
            let newSemesterData = {
                Name: semester.Name
            };

            // Send the POST request to create a new semester
            $.post('/Semester/Create', newSemesterData, function (response) {
                console.log(response);
                if (response.success) { // Check for success
                    alert('Semester added successfully!');
                    loadSemList(); // Reload the semester list after adding
                    selectedSemIds = [];
                } else {
                    alert('Failed to add semester: ' + response.errorMessage); // Show error message from server
                }
            }).fail(function () {
                alert("An error occurred while adding the semester.");
            });
        } else {
            alert("Semester not found");
        }
    }).fail(function () {
        alert("An error occurred while loading semester data.");
    });
}

function editSemBasedOfSelect() {
    if (selectedSemIds.length >= 2) {
        alert("Please select only one semester at a time for edit operation.")
    } else {
        const idOfSemToEdit = selectedSemIds[0];
        editSemester(idOfSemToEdit);
    }
}

function editSemester(semId) {
    editSemId = Number(semId);

    $.get('/Semester/GetAllSemesters', function (data) {
        let semester = data.find(sem => sem.SemId === editSemId);

        if (semester) {
            // Populate the form fields with the semester details
            $('#Name').val(semester.Name);

            // Set form to "edit mode"
            $('#semesterForm').attr('data-editing', 'true'); // Custom attribute to indicate edit mode
            $('#semesterFormHeading').text('Edit Semester Details'); // Update form heading for edit mode
            $('#submitSemForm').text('Save'); // Change button text to 'Save' for editing

        } else {
            alert("Semester not found");
        }
    }).fail(function () {
        alert("An error occurred while loading semester data.");
    });
}

function toRoman(num) {
    const romanNumerals = [
        { value: 1000, symbol: "M" },
        { value: 900, symbol: "CM" },
        { value: 500, symbol: "D" },
        { value: 400, symbol: "CD" },
        { value: 100, symbol: "C" },
        { value: 90, symbol: "XC" },
        { value: 50, symbol: "L" },
        { value: 40, symbol: "XL" },
        { value: 10, symbol: "X" },
        { value: 9, symbol: "IX" },
        { value: 5, symbol: "V" },
        { value: 4, symbol: "IV" },
        { value: 1, symbol: "I" },
    ];

    let result = "";

    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i].value) {
            result += romanNumerals[i].symbol;
            num -= romanNumerals[i].value;
        }
    }

    return result;
}
