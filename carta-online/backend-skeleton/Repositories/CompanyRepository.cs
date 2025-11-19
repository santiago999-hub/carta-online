using CartaOnline.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CartaOnline.Backend.Repositories;

public interface ICompanyRepository : IRepository<Company>
{
    Task<IEnumerable<Company>> GetWithStatsAsync();
    Task<Company?> GetByIdWithRelationsAsync(int id);
    Task<IEnumerable<Company>> SearchAsync(string searchTerm);
}

public class CompanyRepository : Repository<Company>, ICompanyRepository
{
    public CompanyRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Company>> GetWithStatsAsync()
    {
        return await _context.Companies
            .Include(c => c.Categories)
            .Include(c => c.Products)
            .ToListAsync();
    }

    public async Task<Company?> GetByIdWithRelationsAsync(int id)
    {
        return await _context.Companies
            .Include(c => c.Categories)
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Company>> SearchAsync(string searchTerm)
    {
        return await _context.Companies
            .Where(c => c.Name.Contains(searchTerm) || c.Address.Contains(searchTerm))
            .ToListAsync();
    }
}
