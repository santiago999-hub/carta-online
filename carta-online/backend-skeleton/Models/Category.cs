namespace CartaOnline.Backend.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; } = string.Empty;
    public int CompanyId { get; set; }

    // Navigation properties
    public virtual Company? Company { get; set; }
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
