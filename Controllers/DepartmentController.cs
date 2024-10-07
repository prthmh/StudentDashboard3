using StudentDashboard3.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentDashboard3.Controllers
{
    public class DepartmentController : Controller
    {
        private DepartmentDBHandle deptDBHandle = new DepartmentDBHandle();
        // GET: Department
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JsonResult Create(DepartmentModel dmodel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (deptDBHandle.AddDepartment(dmodel))
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


        public JsonResult GetAllDepartments()
        {
            List<DepartmentModel> deptList = deptDBHandle.GetDepartments();
            return Json(deptList, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult DeleteMultiple(string[] deptIds)
        {
            try
            {
                if (deptIds != null && deptIds.Length > 0)
                {
                    string idList = string.Join(",", deptIds);
                    bool result = deptDBHandle.DeleteMultipleDepartments(idList);

                    if (result)
                    {
                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "No departments were deleted." });
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
        public JsonResult Edit(DepartmentModel dmodel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    bool isUpdated = deptDBHandle.UpdateDepartment(dmodel); 

                    if (isUpdated)
                    {
                        return Json(new { success = true, message = "Department updated successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "Failed to update department details." });
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