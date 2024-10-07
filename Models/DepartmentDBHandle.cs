using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace StudentDashboard3.Models
{
    public class DepartmentDBHandle
    {
        private SqlConnection con;
        private void connection()
        {
            string constring = ConfigurationManager.ConnectionStrings["studentconn"].ToString();
            con = new SqlConnection(constring);
        }

        // **************** ADD NEW DEPARTMENT *********************
        public bool AddDepartment(DepartmentModel department)
        {
            connection();
            SqlCommand cmd = new SqlCommand("AddNewDepartment", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Name", department.Name);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            Debug.WriteLine(i);

            if (i >= 1)
                return true;
            else
                return false;
        }

        // ********** VIEW DEPARTMENT DETAILS ********************
        public List<DepartmentModel> GetDepartments()
        {
            connection();
            List<DepartmentModel> departmentList = new List<DepartmentModel>();

            SqlCommand cmd = new SqlCommand("GetAllDepartmentDetails", con);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sd = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();

            con.Open();
            sd.Fill(dt);
            con.Close();

            foreach (DataRow dr in dt.Rows)
            {
                departmentList.Add(new DepartmentModel
                {
                    DeptId = Convert.ToInt32(dr["DeptId"]),
                    Name = Convert.ToString(dr["Name"])
                });
            }

            return departmentList;
        }

        // ********************** DELETE DEPARTMENT *******************
        public bool DeleteDepartment(int id)
        {
            connection();
            SqlCommand cmd = new SqlCommand("DeleteDepartment", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@DeptId", id);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            return i >= 1;
        }

        public bool DeleteMultipleDepartments(string idList)
        {
            connection();
            SqlCommand cmd = new SqlCommand("DeleteMultipleDepartments", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdList", idList);

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            con.Close();

            return rowsAffected > 0;
        }


        // ***************** UPDATE DEPARTMENT *********************
        public bool UpdateDepartment(DepartmentModel dmodel)
        {
            connection();
            SqlCommand cmd = new SqlCommand("UpdateDepartment", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@DeptId", dmodel.DeptId);     // Assuming 'DeptId' is the primary key
            cmd.Parameters.AddWithValue("@Name", dmodel.Name);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            return i >= 1;
        }
    }
}
