namespace CartaOnline.Backend.DTOs;

/// <summary>
/// DTO para crear una nueva empresa
/// </summary>
public class CreateCompanyDto
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public required string Phone { get; set; }
    public required string Email { get; set; }
    public string? LogoUrl { get; set; }
}

/// <summary>
/// DTO para actualizar una empresa existente
/// </summary>
public class UpdateCompanyDto
{
    public required string Name { get; set; }
    public required string Address { get; set; }
    public required string Phone { get; set; }
    public required string Email { get; set; }
    public string? LogoUrl { get; set; }
}

/// <summary>
/// DTO de respuesta para empresa
/// </summary>
public class CompanyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public int ProductCount { get; set; }
    public int CategoryCount { get; set; }
}
