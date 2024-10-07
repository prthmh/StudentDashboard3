using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace StudentDashboard3.Models
{
    public class DepartmentDetailDBHandle
    {
        private SqlConnection con;

        // Method to initialize the connection
        private void connection()
        {
            string constring = ConfigurationManager.ConnectionStrings["studentconn"].ToString();
            con = new SqlConnection(constring);
        }

        // Add a new Department Detail
        public bool AddDepartmentDetail(DepartmentDetailModel deptDetail)
        {
            connection();
            SqlCommand cmd = new SqlCommand("AddDepartmentDetail", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@DeptId", deptDetail.DeptId);
            cmd.Parameters.AddWithValue("@SemId", deptDetail.SemId);
            cmd.Parameters.AddWithValue("@SubjectName", deptDetail.SubjectName);
            cmd.Parameters.AddWithValue("@Marks", deptDetail.Marks);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            return i >= 1;
        }
        // Retrieve all Department Details without using a stored procedure
        public List<DepartmentDetailModel> GetDepartmentDetails()
        {
            connection(); // Ensure your connection method is called to set up the database connection
            List<DepartmentDetailModel> deptDetailList = new List<DepartmentDetailModel>();

            // SQL query to retrieve department details
            string query = "SELECT DeptDetailId, DeptId, SemId, SubjectName, Marks FROM DepartmentDetail";

            using (SqlCommand cmd = new SqlCommand(query, con))
            {
                SqlDataAdapter sd = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();

                try
                {
                    con.Open();
                    sd.Fill(dt);
                }
                catch (Exception ex)
                {
                    // Handle exceptions (e.g., log the error)
                    Console.WriteLine("Error: " + ex.Message);
                    return deptDetailList; // Return an empty list on error
                }
                finally
                {
                    con.Close(); // Ensure the connection is closed
                }

                // Iterate through the rows and populate the list
                foreach (DataRow dr in dt.Rows)
                {
                    deptDetailList.Add(new DepartmentDetailModel
                    {
                        DeptDetailId = Convert.ToInt32(dr["DeptDetailId"]),
                        DeptId = Convert.ToInt32(dr["DeptId"]),
                        SemId = Convert.ToInt32(dr["SemId"]),
                        SubjectName = Convert.ToString(dr["SubjectName"]),
                        Marks = Convert.ToDecimal(dr["Marks"]),
                    });
                }
            }

            return deptDetailList;
        }

        // Delete multiple Department Details without using a stored procedure
        public bool DeleteMultipleDepartmentDetails(string idList)
        {
            connection(); 

            string query = $"DELETE FROM DepartmentDetail WHERE DeptDetailId IN ({idList})";

            using (SqlCommand cmd = new SqlCommand(query, con))
            {
                try
                {
                    con.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0;  
                }
                catch (Exception ex)
                {
                    // Handle exceptions (e.g., log the error)
                    Console.WriteLine("Error: " + ex.Message);
                    return false; // Return false on error
                }
                finally
                {
                    con.Close(); // Ensure the connection is closed
                }
            }
        }


        // Update Department Detail
        public bool UpdateDepartmentDetail(DepartmentDetailModel deptDetail)
        {
            connection();
            SqlCommand cmd = new SqlCommand("UpdateDepartmentDetail", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@DeptDetailId", deptDetail.DeptDetailId);
            cmd.Parameters.AddWithValue("@DeptId", deptDetail.DeptId);
            cmd.Parameters.AddWithValue("@SemId", deptDetail.SemId);
            cmd.Parameters.AddWithValue("@SubjectName", deptDetail.SubjectName);
            cmd.Parameters.AddWithValue("@Marks", deptDetail.Marks);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            return i >= 1;
        }
    }
}
