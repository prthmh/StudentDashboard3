using StudentDashboard3.Models;
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
    public class StudentDBHandle
    {
        private SqlConnection con;
        private void connection()
        {
            string constring = ConfigurationManager.ConnectionStrings["studentconn"].ToString();
            con = new SqlConnection(constring);
        }

        // **************** ADD NEW STUDENT *********************
        public bool AddStudent(StudentModel student)
        {
            connection();
            SqlCommand cmd = new SqlCommand("AddNewStudent", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@FirstName", student.FirstName);
            cmd.Parameters.AddWithValue("@MiddleName", student.MiddleName);
            cmd.Parameters.AddWithValue("@LastName", student.LastName);
            cmd.Parameters.AddWithValue("@Gender", student.Gender);
            cmd.Parameters.AddWithValue("@DOB", student.DOB);
            cmd.Parameters.AddWithValue("@Address", student.Address);
            cmd.Parameters.AddWithValue("@PinCode", student.PinCode);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            Debug.WriteLine(i);
            if (i >= 1)
                return true;
            else
                return false;
        }



        // ********** VIEW STUDENT DETAILS ********************
        public List<StudentModel> GetStudents()
        {
            connection();
            List<StudentModel> studentList = new List<StudentModel>();

            // Assuming the stored procedure is named GetStudentDetails
            SqlCommand cmd = new SqlCommand("GetAllStudentDetails", con);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sd = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();

            con.Open();
            sd.Fill(dt);
            con.Close();

            foreach (DataRow dr in dt.Rows)
            {
                studentList.Add(new StudentModel
                {
                    StudId = Convert.ToInt32(dr["StudId"]),
                    FirstName = Convert.ToString(dr["FirstName"]),     
                    MiddleName = Convert.ToString(dr["MiddleName"]),   
                    LastName = Convert.ToString(dr["LastName"]),       
                    Gender = Convert.ToString(dr["Gender"]),           
                    DOB = Convert.ToDateTime(dr["DOB"]),               
                    Address = Convert.ToString(dr["Address"]),         
                    PinCode = Convert.ToString(dr["PinCode"])          
                });
            }

            return studentList;
        }


        // ********************** DELETE STUDENT DETAILS *******************
        public bool DeleteStudent(int id)
        {
            connection(); 
            SqlCommand cmd = new SqlCommand("DeleteStudent", con); 
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@StudId", id); 

            con.Open();
            int i = cmd.ExecuteNonQuery(); 
            con.Close();

            if (i >= 1)
                return true;
            else
                return false;
        }

        public bool DeleteMultipleStudents(string idList)
        {
            connection();
            SqlCommand cmd = new SqlCommand("DeleteMultipleStudents", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdList", idList);

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            con.Close();

            return rowsAffected > 0; 
        }


        // ***************** UPDATE STUDENT DETAILS *********************
        public bool UpdateDetails(StudentModel smodel)
        {
            connection();
            SqlCommand cmd = new SqlCommand("UpdateStudentDetails", con);
            cmd.CommandType = CommandType.StoredProcedure;

            // Add the parameters from the model, adjusting to your StudentModel fields
            cmd.Parameters.AddWithValue("@StudId", smodel.StudId);     // Assuming 'StudId' is the primary key
            cmd.Parameters.AddWithValue("@FirstName", smodel.FirstName);
            cmd.Parameters.AddWithValue("@MiddleName", smodel.MiddleName);
            cmd.Parameters.AddWithValue("@LastName", smodel.LastName);
            cmd.Parameters.AddWithValue("@Gender", smodel.Gender);
            cmd.Parameters.AddWithValue("@DOB", smodel.DOB);           // Assuming DOB is DateTime in your model
            cmd.Parameters.AddWithValue("@Address", smodel.Address);
            cmd.Parameters.AddWithValue("@PinCode", smodel.PinCode);    // Assuming PinCode is a string or number

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();

            return i >= 1;  // Returns true if one or more rows were affected
        }


    }
}