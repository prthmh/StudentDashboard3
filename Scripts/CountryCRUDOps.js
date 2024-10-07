let selectedCountryIds = [];
let editCountryId;
$(document).ready(function () {
    loadCountryList();

    $('#countryForm').submit(function (e) {
        e.preventDefault();

        let countryData = {
            Name: $('#Name').val(),
        };

        if ($(this).attr('data-editing') === 'true') {
            countryData = {
                CountryId: editCountryId,
                Name: $('#Name').val(),
            }

            $.post('/Country/Edit', countryData, function (response) {
                if (response.success) {
                    alert('Country updated successfully!');
                    loadCountryList();

                    // Reset the form to "add mode"
                    $('#countryForm').attr('data-editing', 'false');
                    $('#countryFormHeading').text('Register Country');
                    $('#submitCountryForm').text('Create');
                    $('#countryForm')[0].reset();
                    selectedCountryIds = [];
                } else {
                    alert('Failed to update country');
                }
            });
        } else {
            $.post('/Country/Create', countryData, function (response) {
                if (response.success) {
                    alert("Country registered successfully!");
                    loadCountryList();
                    $('.form-control').val(''); // Clear form fields
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while submitting the form.");
            });
        }
    });

    // Handle checkbox selection for individual country
    $('#countryTable').on('change', '.country-checkbox-item', function () {
        let countryId = $(this).data('country-id');

        if (this.checked) {
            selectedCountryIds.push(countryId);
        } else {
            selectedCountryIds = selectedCountryIds.filter(id => id !== countryId);
        }

        // Check if all individual checkboxes are selected
        if ($('.country-checkbox-item:checked').length === $('.country-checkbox-item').length) {
            $('#selectAllCountry').prop('checked', true);
        } else {
            $('#selectAllCountry').prop('checked', false);
        }
        console.log(selectedCountryIds);
    });

    // Handle "Select All" checkbox functionality
    $('#selectAllCountry').click(function () {
        selectedCountryIds = [];
        let isChecked = this.checked;

        $('#countryTable .country-checkbox-item').each(function () {
            $(this).prop('checked', isChecked);
            let countryId = $(this).data('country-id');

            if (isChecked) {
                selectedCountryIds.push(countryId);
            } else {
                selectedCountryIds = selectedCountryIds.filter(id => id !== countryId);
            }
        });
        console.log(selectedCountryIds);
    });
});

function loadCountryList() {
    $.get('/Country/GetAllCountries', function (data) {
        var rows = '';

        data.forEach(function (country) {
            rows += '<tr>' +
                '<td>' + `<input type="checkbox" class="country-checkbox-item form-check-input" data-country-id="${country.CountId}" />` + '</td>' +
                '<td>' + country.Name + '</td>' +
                '</tr>';
        });

        // Unchecking select all if it was checked previously
        $('#selectAllCountry').prop('checked', false);

        // Insert the rows into the table body
        $('#countryTable tbody').html(rows);
    }).fail(function () {
        alert("An error occurred while loading the country list.");
    });
}

function deleteCountryBasedOfSelect() {
    if (selectedCountryIds.length > 0) {
        // Confirm deletion
        var confirmation = confirm("Are you sure you want to delete the selected countries?");
        if (confirmation) {
            // Make the AJAX POST request
            $.post('/Country/DeleteMultiple', { countryIds: selectedCountryIds }, function (response) {
                if (response.success) {
                    alert("Selected countries deleted successfully!");
                    loadCountryList(); // Reload the country list
                    selectedCountryIds = [];
                } else {
                    alert("Error: " + response.errorMessage);
                }
            }).fail(function () {
                alert("An error occurred while deleting countries.");
            });
        }
    } else {
        alert("Please select at least one country to delete.");
    }
}

function copyCountryBasedOfSelect() {
    if (selectedCountryIds.length >= 2) {
        alert("Please select only one country at a time for copy operation.")
    } else {
        const idOfCountryToCopy = selectedCountryIds[0];
        copyCountry(idOfCountryToCopy);
    }
}

function copyCountry(countryId) {
    const copyCountryId = Number(countryId);
    $.get('/Country/GetAllCountries', function (data) {
        let country = data.find(country => country.CountId === copyCountryId);

        if (country) {
            // Construct the new country data object
            let newCountryData = {
                Name: country.Name
            };

            // Send the POST request to create a new country
            $.post('/Country/Create', newCountryData, function (response) {
                console.log(response);
                if (response.success) { // Check for success
                    alert('Country added successfully!');
                    loadCountryList(); // Reload the country list after adding
                    selectedCountryIds = [];
                } else {
                    alert('Failed to add country: ' + response.errorMessage); // Show error message from server
                }
            }).fail(function () {
                alert("An error occurred while adding the country.");
            });
        } else {
            alert("Country not found");
        }
    }).fail(function () {
        alert("An error occurred while loading country data.");
    });
}

function editCountryBasedOfSelect() {
    if (selectedCountryIds.length >= 2) {
        alert("Please select only one country at a time for edit operation.")
    } else {
        const idOfCountryToEdit = selectedCountryIds[0];
        editCountry(idOfCountryToEdit);
    }
}

function editCountry(countryId) {
    editCountryId = Number(countryId);

    $.get('/Country/GetAllCountries', function (data) {
        let country = data.find(country => country.CountId === editCountryId);

        if (country) {
            // Populate the form fields with the country details
            $('#Name').val(country.Name);

            // Set form to "edit mode"
            $('#countryForm').attr('data-editing', 'true'); // Custom attribute to indicate edit mode
            $('#countryFormHeading').text('Edit Country Details'); // Update form heading for edit mode
            $('#submitCountryForm').text('Save'); // Change button text to 'Save' for editing

        } else {
            alert("Country not found");
        }
    }).fail(function () {
        alert("An error occurred while loading country data.");
    });
}
