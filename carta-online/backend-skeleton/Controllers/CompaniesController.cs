using Microsoft.AspNetCore.Mvc;
using CartaOnline.Backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace CartaOnline.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        // NOTE: This is a stub controller. Replace with DI of AppDbContext in real app.
        private static readonly List<Company> _data = new List<Company>();

        [HttpGet]
        public ActionResult<IEnumerable<Company>> Get() => Ok(_data);

        [HttpGet("{id}")]
        public ActionResult<Company> Get(int id)
        {
            var c = _data.FirstOrDefault(x => x.Id == id);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [HttpPost]
        public ActionResult<Company> Post([FromBody] Company model)
        {
            model.Id = _data.Count == 0 ? 1 : _data.Max(x => x.Id) + 1;
            _data.Add(model);
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Company model)
        {
            var idx = _data.FindIndex(x => x.Id == id);
            if (idx == -1) return NotFound();
            model.Id = id;
            _data[idx] = model;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var idx = _data.FindIndex(x => x.Id == id);
            if (idx == -1) return NotFound();
            _data.RemoveAt(idx);
            return NoContent();
        }
    }
}
