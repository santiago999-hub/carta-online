using CartaOnline.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CartaOnline.Backend.Repositories;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IEnumerable<Category>> GetByCompanyIdAsync(int companyId);
    Task<Category?> GetByIdWithRelationsAsync(int id);
}

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Category>> GetByCompanyIdAsync(int companyId)
    {
        return await _context.Categories
            .Where(c => c.CompanyId == companyId)
            .Include(c => c.Products)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdWithRelationsAsync(int id)
    {
        return await _context.Categories
            .Include(c => c.Company)
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
}
