namespace CartaOnline.Backend.Models;

public class Company
{
    public int Id { get; set; }
    public required string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }

    // Navigation properties
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
