using StudentDashboard3.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentDashboard3.Controllers
{
    public class SemesterController : Controller
    {
        private SemesterDBHandle semDBHandle = new SemesterDBHandle();
        // GET: Semester
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Create(SemesterModel smodel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (semDBHandle.AddSemester(smodel))
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

        public JsonResult GetAllSemesters()
        {
            List<SemesterModel> semList = semDBHandle.GetSemesters();
            return Json(semList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteMultiple(string[] semIds)
        {
            Debug.WriteLine(semIds[0]);
            try
            {
                if (semIds != null && semIds.Length > 0)
                {
                    string idList = string.Join(",", semIds);
                    bool result = semDBHandle.DeleteMultipleSemesters(idList);

                    if (result)
                    {
                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "No semesters were deleted." });
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
        public JsonResult Edit(SemesterModel smodel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    bool isUpdated = semDBHandle.UpdateSemester(smodel);

                    if (isUpdated)
                    {
                        return Json(new { success = true, message = "Semester updated successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "Failed to update semester details." });
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
