using EmployeeAppApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAppApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : Controller
    {
        private readonly ApDbContextContext _context;
        public EmployeeController(ApDbContextContext context)
        {
            _context = context;
        }

        //API - 1 Search Employees
        [HttpGet("search")]
        public async Task<IActionResult> Search(string? firstName, string? lastName, string? email, string? location, int page = 1, int pageSize = 5)
        {
            var query = _context.Employees
                .Include(e => e.Skills)
                .Include(e => e.Experiences)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(firstName))
                query = query.Where(e => e.FirstName.Contains(firstName));

            if (!string.IsNullOrWhiteSpace(lastName))
                query = query.Where(e => e.LastName.Contains(lastName));

            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(e => e.Email.Contains(email));

            if (!string.IsNullOrWhiteSpace(location))
                query = query.Where(e => e.Location == location);

            var totalRecords = await query.CountAsync();
            var employees = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new { totalRecords, employees });
        }

        //API - 2 Get Employees Details(For Edit Pop-up)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var emp = await _context.Employees
                .Include(e => e.Skills)
                .Include(e => e.Experiences)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (emp == null)
                return NotFound();

            return Ok(emp);
        }

        //API - 3 Create or Update Employee
        [HttpPost("save")]
        public async Task<IActionResult> SaveEmployee([FromBody] Employee employee)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            if(employee.Id == 0)
                _context.Employees.Add(employee);
            else
                _context.Employees.Update(employee);

            await _context.SaveChangesAsync();
            return Ok(employee);
        }

        //API - 4 Delete Employee
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if(emp == null)
                return NotFound();
            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return Ok();
        }

        //API - 5 Get Locations
        [HttpGet("locations")]
        public async Task<IActionResult> GetLocations()
        {
            var locations = await _context.Employees
                .Select(e => e.Location)
                .Distinct()
                .ToListAsync();
            return Ok(locations);
        }
    }
}