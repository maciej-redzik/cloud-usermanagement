using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace UserManagement.ORM
{
    public class User
    {
        public int ID { get; set; }

        public string FirstName { get; set; }
        
        public string LastName { get; set; }
        
        public string Phone { get; set; }

        public virtual Location Location { get; set; }
    }
}
