namespace CartaOnline.Backend.DTOs;

public class CreateCategoryDto
{
    public required string Name { get; set; }
    public int CompanyId { get; set; }
}

public class UpdateCategoryDto
{
    public required string Name { get; set; }
    public int CompanyId { get; set; }
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
}
