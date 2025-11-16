using Microsoft.EntityFrameworkCore;
using CartaOnline.Backend;

var builder = WebApplicationBuilder.CreateBuilder(args);

// ========== SERVICIOS ==========

// 1. DbContext con SQL Server LocalDB (puede cambiarse a otra BD)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Server=(localdb)\\mssqllocaldb;Database=CartaOnlineDB;Trusted_Connection=True;"
    )
);

// 2. Controllers
builder.Services.AddControllers();

// 3. CORS - permitir requests desde el frontend (ajustar origins si es necesario)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// 4. Swagger/OpenAPI (opcional, util para documentación)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Aplicar CORS antes que Authorization
app.UseCors("AllowFrontend");

app.UseAuthorization();

// Mapear controllers
app.MapControllers();

// Health check endpoint (opcional)
app.MapGet("/health", () => new { status = "ok", timestamp = DateTime.UtcNow })
    .WithName("Health")
    .WithOpenApi();

// ========== INICIAR ==========

Console.WriteLine("Iniciando servidor en http://localhost:5230 (HTTPS: https://localhost:7230)");
app.Run();
