using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace UserManagement.ORM
{
    public class UserManagementDBContext : DbContext
    {
        public UserManagementDBContext(DbContextOptions options)
            : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Location).WithMany(l => l.Users);

            modelBuilder.Entity<Location>()
                .HasMany(l => l.Users);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Location> Locations { get; set; }
    }
}
