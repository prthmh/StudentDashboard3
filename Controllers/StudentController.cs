using Newtonsoft.Json;
using StudentDashboard3.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentDashboard3.Controllers
{
    public class StudentController : Controller
    {
        private StudentDBHandle studDBHandle = new StudentDBHandle();
        // GET: Student View
        public ActionResult Index()
        {
            StudentDBHandle dbHandle = new StudentDBHandle();
            ModelState.Clear();
            List<StudentModel> studList = dbHandle.GetStudents();
            return View(studList);
        }

        //Return student list
        public ActionResult GetAllStudents()
        {
            List<StudentModel> studList = studDBHandle.GetStudents();
            return Json(studList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Create(StudentModel smodel)
        {
            try
            {
                Debug.WriteLine(smodel);
                Debug.WriteLine(ModelState.IsValid);
                if (ModelState.IsValid)
                {
                    StudentDBHandle dbHandler = new StudentDBHandle();
                    if (dbHandler.AddStudent(smodel))
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


        [HttpPost]
        public JsonResult Delete(int id)
        {
            try
            {
                // Use the StudentDBHandle to delete the student by ID
                if (studDBHandle.DeleteStudent(id))
                {
                    return Json(new { success = true, message = "Student deleted successfully." });
                }
                else
                {
                    return Json(new { success = false, errorMessage = "Student deletion failed." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteMultiple(string[] studentIds)
        {
            try
            {
                if (studentIds != null && studentIds.Length > 0)
                {
                    string idList = string.Join(",", studentIds);
                    bool result = studDBHandle.DeleteMultipleStudents(idList);

                    if (result)
                    {
                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "No students were deleted." });
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
        public JsonResult Edit(StudentModel smodel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    bool isUpdated = studDBHandle.UpdateDetails(smodel);

                    if (isUpdated)
                    {
                        // Stay on the same page and return a success message
                        return Json(new { success = true, message = "Student updated successfully!" });
                    }
                    else
                    {
                        // If updating failed, return a failure response
                        return Json(new { success = false, errorMessage = "Failed to update student details." });
                    }
                }
                else
                {
                    // If the model validation fails, return a failure response
                    return Json(new { success = false, errorMessage = "Validation failed." });
                }
            }
            catch (Exception ex)
            {
                // Return error in case of exception
                return Json(new { success = false, errorMessage = ex.Message });
            }
        }

    }
}