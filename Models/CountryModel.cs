using System.ComponentModel.DataAnnotations;

namespace StudentDashboard3.Models
{
    public class CountryModel
    {
        public int CountId { get; set; } // Primary key

        [Required]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        [Display(Name = "Country Name")]
        public string Name { get; set; } // Country name
    }
}
