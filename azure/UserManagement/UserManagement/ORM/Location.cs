using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace UserManagement.ORM
{
    public class Location
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
