using CartaOnline.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CartaOnline.Backend.Repositories;

public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetByCompanyIdAsync(int companyId);
    Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId);
    Task<Product?> GetByIdWithRelationsAsync(int id);
    Task<IEnumerable<Product>> SearchAsync(string searchTerm);
    Task<IEnumerable<Product>> GetPagedAsync(int pageNumber, int pageSize);
}

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Product>> GetByCompanyIdAsync(int companyId)
    {
        return await _context.Products
            .Where(p => p.CompanyId == companyId)
            .Include(p => p.Category)
            .Include(p => p.Company)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId)
    {
        return await _context.Products
            .Where(p => p.CategoryId == categoryId)
            .Include(p => p.Category)
            .Include(p => p.Company)
            .ToListAsync();
    }

    public async Task<Product?> GetByIdWithRelationsAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Company)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        return await _context.Products
            .Where(p => p.Name.Contains(searchTerm) || 
                       (p.Description != null && p.Description.Contains(searchTerm)))
            .Include(p => p.Category)
            .Include(p => p.Company)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetPagedAsync(int pageNumber, int pageSize)
    {
        return await _context.Products
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Include(p => p.Category)
            .Include(p => p.Company)
            .ToListAsync();
    }
}
