using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using UserManagement.ORM;

[assembly: FunctionsStartup(typeof(UserManagement.Startup))]
namespace UserManagement
{    
    class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            string connectionString = Environment.GetEnvironmentVariable("SqlConnectionString");
            if(connectionString == null)
            {
                connectionString = Environment.GetEnvironmentVariable("SQLCONNSTR_SqlConnectionString");
            }
            builder.Services.AddDbContext<UserManagementDBContext>(
               options => SqlServerDbContextOptionsExtensions.UseSqlServer(options, connectionString));
        }
    }
}
