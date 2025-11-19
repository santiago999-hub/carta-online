using Microsoft.EntityFrameworkCore;
using CartaOnline.Backend;
using CartaOnline.Backend.Repositories;
using CartaOnline.Backend.Middleware;

var builder = WebApplication.CreateBuilder(args);

// ========== SERVICIOS ==========

// 1. DbContext con SQL Server LocalDB (puede cambiarse a otra BD)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Server=(localdb)\\mssqllocaldb;Database=CartaOnlineDB;Trusted_Connection=True;TrustServerCertificate=True;"
    )
);

// 2. Repositorios (Patrón Repository)
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// 3. Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// 4. CORS - permitir requests desde el frontend Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200", "http://localhost:50596") // Puertos comunes de Angular
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// 5. Manejo global de excepciones
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// 6. Swagger/OpenAPI con mejor documentación
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "Carta Online API", 
        Version = "v1",
        Description = "API REST para sistema de gestión multiempresa de menús digitales",
        Contact = new() { Name = "Carta Online", Email = "contacto@cartaonline.com" }
    });
});

// ========== PIPELINE ==========

var app = builder.Build();

// Aplicar migraciones automáticamente al iniciar (opcional pero útil)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.Migrate();
        Console.WriteLine("✓ Base de datos migrada correctamente.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠ Error en migración: {ex.Message}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Carta Online API v1");
        c.RoutePrefix = "swagger";
    });
}

// Manejo global de excepciones
app.UseExceptionHandler();

app.UseHttpsRedirection();

// Aplicar CORS antes que Authorization
app.UseCors("AllowFrontend");

app.UseAuthorization();

// Mapear controllers
app.MapControllers();

// Health check endpoint mejorado
app.MapGet("/api/health", () => new 
{ 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    version = "1.0.0",
    environment = app.Environment.EnvironmentName
})
.WithName("HealthCheck")
.WithTags("Monitoring")
.WithOpenApi();

// ========== INICIAR ==========

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("🚀 Iniciando Carta Online API v1.0");
logger.LogInformation("📍 HTTP: http://localhost:5230");
logger.LogInformation("📍 HTTPS: https://localhost:7230");
logger.LogInformation("📚 Swagger: http://localhost:5230/swagger");

app.Run();
