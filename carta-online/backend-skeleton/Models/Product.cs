namespace CartaOnline.Backend.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public int CompanyId { get; set; }
    public string? ImageUrl { get; set; }

    // Navigation properties
    public virtual Category? Category { get; set; }
    public virtual Company? Company { get; set; }
}
