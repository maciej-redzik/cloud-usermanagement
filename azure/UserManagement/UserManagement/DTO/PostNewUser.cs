using System;
using System.Collections.Generic;
using System.Text;

namespace UserManagement.DTO
{
    public class PostNewUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public int LocationID { get; set; }
    }
}
