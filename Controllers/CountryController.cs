using StudentDashboard3.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StudentDashboard3.Controllers
{
    public class CountryController : Controller
    {
        private CountryDBHandle countryDBHandle = new CountryDBHandle();
        // GET: Country
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Create(CountryModel cmodel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (countryDBHandle.AddCountry(cmodel))
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

        public JsonResult GetAllCountries()
        {
            List<CountryModel> countryList = countryDBHandle.GetCountries();
            return Json(countryList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteMultiple(string[] countryIds)
        {
            try
            {
                if (countryIds != null && countryIds.Length > 0)
                {
                    string idList = string.Join(",", countryIds);
                    bool result = countryDBHandle.DeleteMultipleCountries(idList);

                    if (result)
                    {
                        return Json(new { success = true });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "No countries were deleted." });
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
        public JsonResult Edit(CountryModel cmodel)
        {
            Debug.WriteLine(cmodel.Name);
            Debug.WriteLine(ModelState.IsValid);
            try
            {
                if (ModelState.IsValid)
                {
                    bool isUpdated = countryDBHandle.UpdateCountry(cmodel);

                    if (isUpdated)
                    {
                        return Json(new { success = true, message = "Country updated successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, errorMessage = "Failed to update country details." });
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
