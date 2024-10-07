using StudentDashboard3.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentDashboard3.Controllers
{
    public class DepartmentDetailController : Controller
    {
        private DepartmentDetailDBHandle detailDBHandle = new DepartmentDetailDBHandle();
        private DepartmentDBHandle deptDBHandle = new DepartmentDBHandle();
        private SemesterDBHandle semDBHandle = new SemesterDBHandle();

        // GET: DepartmentDetail
        public ActionResult Index()
        {
            ViewBag.Departments = new SelectList(deptDBHandle.GetDepartments(), "DeptId", "Name");
            ViewBag.Semesters = new SelectList(semDBHandle.GetSemesters(), "SemId", "Name");
            return View();
        }

        [HttpPost]
        public JsonResult Create(DepartmentDetailModel detailModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (detailDBHandle.AddDepartmentDetail(detailModel))
                    {
                        return Json(new { success = true });
                    }
                }
                return Json(new { success = false, errorMessage = "Validation failed." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }

        public JsonResult GetAllDepartmentDetails()
        {
            // Fetch the list of department details from the database
            List<DepartmentDetailModel> detailsList = detailDBHandle.GetDepartmentDetails();

            // Fetch the departments and semesters
            var departments = deptDBHandle.GetDepartments(); // This should return a list of department objects
            var semesters = semDBHandle.GetSemesters();   // This should return a list of semester objects

            // Create a new list to hold the modified details
            var modifiedDetailsList = detailsList.Select(detail => new
            {
                DeptDetailId = detail.DeptDetailId,
                DeptName = departments.FirstOrDefault(d => d.DeptId == detail.DeptId)?.Name, // Replace DeptId with DeptName
                SemName = semesters.FirstOrDefault(s => s.SemId == detail.SemId)?.Name,     // Replace SemId with SemName
                SubjectName = detail.SubjectName,
                Marks = detail.Marks
            }).ToList();

            // Return the modified list as JSON
            return Json(modifiedDetailsList, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult DeleteMultiple(string[] deptDetailIds)
        {
            Debug.WriteLine(deptDetailIds[0]);
            try
            {
                Debug.WriteLine(deptDetailIds[0]);
                if (deptDetailIds != null && deptDetailIds.Length > 0)
                {
                    string idList = string.Join(",", deptDetailIds);
                    bool result = detailDBHandle.DeleteMultipleDepartmentDetails(idList);

                    if (result)
                    {
                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "No department details were deleted." });
                    }
                }
                return Json(new { success = false, errorMessage = "No IDs provided." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult Edit(DepartmentDetailModel detailModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    bool isUpdated = detailDBHandle.UpdateDepartmentDetail(detailModel);

                    if (isUpdated)
                    {
                        return Json(new { success = true, message = "Department detail updated successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "Failed to update department detail." });
                    }
                }
                else
                {
                    return Json(new { success = false, errorMessage = "Validation failed." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }
    }
}
