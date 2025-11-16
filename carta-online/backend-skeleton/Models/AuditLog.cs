using System;
using System.ComponentModel.DataAnnotations;

namespace CartaOnline.Backend.Models
{
    public class AuditLog
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Action { get; set; }

        // Data related to the action (JSON or short message)
        public string Data { get; set; }

        public DateTime Date { get; set; }
    }
}
