using Microsoft.AspNetCore.Mvc;
using CartaOnline.Backend.Models;
using CartaOnline.Backend.Repositories;
using CartaOnline.Backend.DTOs;
using CartaOnline.Backend.Common;

namespace CartaOnline.Backend.Controllers;

/// <summary>
/// Controller para gestión de empresas
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyRepository _repository;
    private readonly ILogger<CompaniesController> _logger;

    public CompaniesController(ICompanyRepository repository, ILogger<CompaniesController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todas las empresas con estadísticas
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<CompanyDto>>>> GetAll()
    {
        _logger.LogInformation("Obteniendo todas las empresas");
        var companies = await _repository.GetWithStatsAsync();
        
        var dtos = companies.Select(c => new CompanyDto
        {
            Id = c.Id,
            Name = c.Name,
            Address = c.Address,
            Phone = c.Phone,
            Email = c.Email,
            LogoUrl = c.LogoUrl,
            ProductCount = c.Products?.Count ?? 0,
            CategoryCount = c.Categories?.Count ?? 0
        });

        return Ok(ApiResponse<IEnumerable<CompanyDto>>.SuccessResponse(dtos));
    }

    /// <summary>
    /// Obtiene una empresa por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CompanyDto>>> GetById(int id)
    {
        _logger.LogInformation("Obteniendo empresa con ID: {Id}", id);
        var company = await _repository.GetByIdWithRelationsAsync(id);
        
        if (company == null)
        {
            _logger.LogWarning("Empresa con ID {Id} no encontrada", id);
            return NotFound(ApiResponse<CompanyDto>.ErrorResponse("Empresa no encontrada"));
        }

        var dto = new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            Address = company.Address,
            Phone = company.Phone,
            Email = company.Email,
            LogoUrl = company.LogoUrl,
            ProductCount = company.Products?.Count ?? 0,
            CategoryCount = company.Categories?.Count ?? 0
        };

        return Ok(ApiResponse<CompanyDto>.SuccessResponse(dto));
    }

    /// <summary>
    /// Busca empresas por término
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<CompanyDto>>>> Search([FromQuery] string term)
    {
        _logger.LogInformation("Buscando empresas con término: {Term}", term);
        
        if (string.IsNullOrWhiteSpace(term))
        {
            return BadRequest(ApiResponse<IEnumerable<CompanyDto>>.ErrorResponse("El término de búsqueda no puede estar vacío"));
        }

        var companies = await _repository.SearchAsync(term);
        var dtos = companies.Select(c => new CompanyDto
        {
            Id = c.Id,
            Name = c.Name,
            Address = c.Address,
            Phone = c.Phone,
            Email = c.Email,
            LogoUrl = c.LogoUrl
        });

        return Ok(ApiResponse<IEnumerable<CompanyDto>>.SuccessResponse(dtos, $"Encontradas {dtos.Count()} empresas"));
    }

    /// <summary>
    /// Crea una nueva empresa
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<CompanyDto>>> Create([FromBody] CreateCompanyDto dto)
    {
        _logger.LogInformation("Creando nueva empresa: {Name}", dto.Name);

        var company = new Company
        {
            Name = dto.Name,
            Address = dto.Address,
            Phone = dto.Phone,
            Email = dto.Email,
            LogoUrl = dto.LogoUrl
        };

        var created = await _repository.AddAsync(company);
        _logger.LogInformation("Empresa creada exitosamente con ID: {Id}", created.Id);

        var responseDto = new CompanyDto
        {
            Id = created.Id,
            Name = created.Name,
            Address = created.Address,
            Phone = created.Phone,
            Email = created.Email,
            LogoUrl = created.LogoUrl
        };

        return CreatedAtAction(nameof(GetById), 
            new { id = created.Id }, 
            ApiResponse<CompanyDto>.SuccessResponse(responseDto, "Empresa creada exitosamente"));
    }

    /// <summary>
    /// Actualiza una empresa existente
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CompanyDto>>> Update(int id, [FromBody] UpdateCompanyDto dto)
    {
        _logger.LogInformation("Actualizando empresa con ID: {Id}", id);

        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
        {
            _logger.LogWarning("Empresa con ID {Id} no encontrada para actualizar", id);
            return NotFound(ApiResponse<CompanyDto>.ErrorResponse("Empresa no encontrada"));
        }

        existing.Name = dto.Name;
        existing.Address = dto.Address;
        existing.Phone = dto.Phone;
        existing.Email = dto.Email;
        existing.LogoUrl = dto.LogoUrl;

        var updated = await _repository.UpdateAsync(existing);
        _logger.LogInformation("Empresa con ID {Id} actualizada exitosamente", id);

        var responseDto = new CompanyDto
        {
            Id = updated.Id,
            Name = updated.Name,
            Address = updated.Address,
            Phone = updated.Phone,
            Email = updated.Email,
            LogoUrl = updated.LogoUrl
        };

        return Ok(ApiResponse<CompanyDto>.SuccessResponse(responseDto, "Empresa actualizada exitosamente"));
    }

    /// <summary>
    /// Elimina una empresa
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        _logger.LogInformation("Eliminando empresa con ID: {Id}", id);

        var success = await _repository.DeleteAsync(id);
        if (!success)
        {
            _logger.LogWarning("Empresa con ID {Id} no encontrada para eliminar", id);
            return NotFound(ApiResponse<bool>.ErrorResponse("Empresa no encontrada"));
        }

        _logger.LogInformation("Empresa con ID {Id} eliminada exitosamente", id);
        return Ok(ApiResponse<bool>.SuccessResponse(true, "Empresa eliminada exitosamente"));
    }
}
