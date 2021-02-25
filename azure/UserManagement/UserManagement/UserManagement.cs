using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using UserManagement.ORM;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using UserManagement.DTO;

namespace UserManagement
{
    public class UserManagement
    {
        private readonly UserManagementDBContext dbContext;

        public UserManagement(UserManagementDBContext context)
        {
            dbContext = context;
        }

        [FunctionName("Users_Get")]
        public async Task<IActionResult> GetAllUsers(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "users")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("request - /api/users");

            try
            {                
                List<User> users = dbContext.Users.Include(x => x.Location).ToList();
                
                return new JsonResult(users.Select(user => new {
                    ID = user.ID,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Phone = user.Phone,
                    Location = user.Location.Name 
                }));
            }
            catch(Exception ex) 
            {
                log.LogError("ERROR: /api/users - " + ex.Message);
                return new OkObjectResult(ex.Message);
            }
        }

        [FunctionName("Users_Add")]
        public async Task<IActionResult> AddUser(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "users/add")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("request - /api/users/add");

            try
            {
                var content = await new StreamReader(req.Body).ReadToEndAsync();
                PostNewUser input = JsonConvert.DeserializeObject<PostNewUser>(content);

                Location location = dbContext.Locations.FirstOrDefault(l => l.ID == input.LocationID);
                User newUser = new User() { FirstName = input.FirstName, LastName = input.LastName, Phone = input.Phone, Location = location };
                dbContext.Users.Add(newUser);
                dbContext.SaveChanges();
                return new JsonResult(new { ID = newUser.ID, FirstName = newUser.FirstName, LastName = newUser.LastName, Phone = newUser.Phone, Location = newUser.Location.Name });
            }
            catch(Exception ex) 
            {
                log.LogError("ERROR: /api/users/add - " + ex.Message);
                return new OkObjectResult(ex.Message);
            }
            
            
        }

        [FunctionName("Users_Delete")]
        public async Task<IActionResult> DeleteUser(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "users/delete")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("request - /api/users/delete");
            try
            {
                var content = await new StreamReader(req.Body).ReadToEndAsync();
                PostDeleteUser input = JsonConvert.DeserializeObject<PostDeleteUser>(content);

                User userToDelete = dbContext.Users.FirstOrDefault(u => u.ID == input.ID);
                dbContext.Remove(userToDelete);
                dbContext.SaveChanges();

                return new OkResult();
            }
            catch (Exception ex)
            {
                log.LogError("ERROR: /api/users/delete - " + ex.Message);
                return new OkObjectResult(ex.Message);
            }
        }

        [FunctionName("Locations_Get")]
        public async Task<IActionResult> GetAllLocations(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "locations")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("request - /api/locations");
            try
            {
                List<Location> locations = dbContext.Locations.Include(x => x.Users).ToList();
                return new JsonResult(locations.Select(location => new { ID = location.ID, Name = location.Name, Users = location.Users.Count() }));
            }
            catch(Exception ex) 
            {
                log.LogError("ERROR: /api/locations - " + ex.Message);
                return new OkObjectResult(ex.Message);
            }            
        }

        [FunctionName("Locations_Add")]
        public async Task<IActionResult> AddLocation(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "locations/add")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("request - /api/locations/add");
            try
            {
                var content = await new StreamReader(req.Body).ReadToEndAsync();
                PostNewLocation input = JsonConvert.DeserializeObject<PostNewLocation>(content);

                Location newLocation = new Location() { Name = input.Name };
                dbContext.Locations.Add(newLocation);
                dbContext.SaveChanges();

                return new JsonResult(new { ID = newLocation.ID, Name = newLocation.Name, Users = 0 });

            }
            catch (Exception ex) 
            {
                log.LogError("ERROR: /api/locations/add - " + ex.Message);
                return new OkObjectResult(ex.Message);
            }
        }

        [FunctionName("Locations_Delete")]
        public async Task<IActionResult> DeleteLocation(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "locations/delete")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("request - /api/locations/delete");
            try
            {
                var content = await new StreamReader(req.Body).ReadToEndAsync();
                PostDeleteLocation input = JsonConvert.DeserializeObject<PostDeleteLocation>(content);

                Location locationToDelete = dbContext.Locations.Include(l => l.Users).FirstOrDefault(l => l.ID == input.ID);
                if(locationToDelete.Users.Count > 0)
                {
                    return new StatusCodeResult(403);
                }
                dbContext.Remove(locationToDelete);
                dbContext.SaveChanges();

                return new OkResult();
            }
            catch (Exception ex)
            {
                log.LogError("ERROR: /api/locations/delete - " + ex.Message);
                return new OkObjectResult(ex.Message);
            }
        }
    }
}
