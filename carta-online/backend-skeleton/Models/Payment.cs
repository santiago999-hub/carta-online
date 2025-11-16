using System;
using System.ComponentModel.DataAnnotations;

namespace CartaOnline.Backend.Models
{
    public class Payment
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string CustomerName { get; set; }

        [Required]
        [StringLength(300)]
        public string Item { get; set; }

        [Range(0.01, 99999999.99)]
        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }
    }
}
