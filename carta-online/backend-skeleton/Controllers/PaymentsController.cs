using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Text.Json;
using CartaOnline.Backend.Models;

namespace CartaOnline.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAll()
        {
            var list = await _context.Payments.ToListAsync();
            return Ok(list);
        }

        // GET: api/payments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetById(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();
            return Ok(payment);
        }

        // POST: api/payments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Payment model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            model.Date = DateTime.UtcNow;
            if (string.IsNullOrWhiteSpace(model.Status)) model.Status = "Pending";

            _context.Payments.Add(model);
            await _context.SaveChangesAsync();

            // Crear entrada de auditoría
            var audit = new AuditLog
            {
                Action = "CreatePayment",
                Data = JsonSerializer.Serialize(model),
                Date = DateTime.UtcNow
            };
            _context.AuditLogs.Add(audit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        // DELETE: api/payments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            var audit = new AuditLog
            {
                Action = "DeletePayment",
                Data = JsonSerializer.Serialize(new { payment.Id, payment.CustomerName, payment.Amount }),
                Date = DateTime.UtcNow
            };
            _context.AuditLogs.Add(audit);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
