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
    public class CountryDBHandle
    {
        private SqlConnection con;

        private void connection()
        {
            string constring = ConfigurationManager.ConnectionStrings["studentconn"].ToString();
            con = new SqlConnection(constring);
        }

        // **************** ADD NEW COUNTRY *********************
        public bool AddCountry(CountryModel country)
        {
            connection();
            SqlCommand cmd = new SqlCommand("AddCountry", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Name", country.Name);

            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            Debug.WriteLine(i);

            return i >= 1;
        }

        // ********** VIEW COUNTRY DETAILS ********************
        public List<CountryModel> GetCountries()
        {
            connection();
            List<CountryModel> countryList = new List<CountryModel>();

            SqlCommand cmd = new SqlCommand("GetAllCountries", con); // Updated stored procedure name
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter sd = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();

            con.Open();
            sd.Fill(dt);
            con.Close();

            foreach (DataRow dr in dt.Rows)
            {
                countryList.Add(new CountryModel
                {
                    CountId = Convert.ToInt32(dr["CountId"]), // Updated property name
                    Name = Convert.ToString(dr["Name"])
                });
            }

            return countryList;
        }

        // ********************** DELETE Multiple COUNTRY *******************

        public bool DeleteMultipleCountries(string idList)
        {
            connection();
            SqlCommand cmd = new SqlCommand("DeleteMultipleCountries", con); // Updated stored procedure name
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@CountIds", idList);

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            con.Close();

            return rowsAffected > 0;
        }

        // ***************** UPDATE COUNTRY *********************
        public bool UpdateCountry(CountryModel country)
        {
            connection(); // Make sure this sets up your SqlConnection
            SqlCommand cmd = new SqlCommand("UPDATE Countries SET Name = @Name WHERE CountId = @CountId", con); // Raw SQL command

            cmd.Parameters.AddWithValue("@CountId", country.CountId); // Parameter for country ID
            cmd.Parameters.AddWithValue("@Name", country.Name); // Parameter for country name

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery(); // Execute the command
            con.Close();

            return rowsAffected >= 1; // Return true if at least one row was affected
        }

    }
}
