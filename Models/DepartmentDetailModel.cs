using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StudentDashboard3.Models
{
    public class DepartmentDetailModel
    {
        public int DeptDetailId { get; set; }

        [Required]
        [Display(Name = "Department")]
        public int DeptId { get; set; }

        [Required]
        [Display(Name = "Semester")]
        public int SemId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Subject Name")]
        public string SubjectName { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal Marks { get; set; }
    }
}
