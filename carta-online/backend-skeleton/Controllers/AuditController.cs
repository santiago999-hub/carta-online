using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using CartaOnline.Backend.Models;

namespace CartaOnline.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuditController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/audit
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLog>>> GetAll()
        {
            var list = await _context.AuditLogs.OrderByDescending(a => a.Date).ToListAsync();
            return Ok(list);
        }
    }
}
