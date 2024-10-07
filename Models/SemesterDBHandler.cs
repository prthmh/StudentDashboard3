using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace StudentDashboard3.Models
{
    public class SemesterDBHandle
    {
        private SqlConnection con;
        private void connection()
        {
            string constring = ConfigurationManager.ConnectionStrings["studentconn"].ToString();
            con = new SqlConnection(constring);
        }

        // **************** ADD NEW SEMESTER *********************
        public bool AddSemester(SemesterModel semester)
        {
            connection();
            SqlCommand cmd = new SqlCommand("AddSemester", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Name", semester.Name);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            Debug.WriteLine(i);

            return i >= 1;
        }

        // ********** VIEW SEMESTER DETAILS ********************
        public List<SemesterModel> GetSemesters()
        {
            connection();
            List<SemesterModel> semesterList = new List<SemesterModel>();

            SqlCommand cmd = new SqlCommand("GetAllSemesters", con);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sd = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();

            con.Open();
            sd.Fill(dt);
            con.Close();

            foreach (DataRow dr in dt.Rows)
            {
                semesterList.Add(new SemesterModel
                {
                    SemId = Convert.ToInt32(dr["SemId"]),
                    Name = Convert.ToString(dr["Name"])
                });
            }

            return semesterList;
        }

        // ********************** DELETE SEMESTER *******************

        public bool DeleteMultipleSemesters(string idList)
        {
            connection();
            SqlCommand cmd = new SqlCommand("DeleteMultipleSemesters", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@SemIds", idList);

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            con.Close();

            return rowsAffected > 0;
        }

        // ***************** UPDATE SEMESTER *********************
        public bool UpdateSemester(SemesterModel smodel)
        {
            connection();
            SqlCommand cmd = new SqlCommand("UpdateSemester", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@SemId", smodel.SemId);     // Assuming 'SemId' is the primary key
            cmd.Parameters.AddWithValue("@Name", smodel.Name);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            return i >= 1;
        }
    }
}
