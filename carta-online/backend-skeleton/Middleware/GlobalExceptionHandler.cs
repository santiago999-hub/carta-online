using Microsoft.AspNetCore.Diagnostics;
using System.Net;
using System.Text.Json;

namespace CartaOnline.Backend.Middleware;

/// <summary>
/// Middleware global para manejo de excepciones
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Error no controlado: {Message}", exception.Message);

        var response = new
        {
            success = false,
            message = "Ocurrió un error en el servidor",
            error = exception.Message,
            stackTrace = exception.StackTrace
        };

        httpContext.Response.StatusCode = exception switch
        {
            ArgumentNullException => (int)HttpStatusCode.BadRequest,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            _ => (int)HttpStatusCode.InternalServerError
        };

        httpContext.Response.ContentType = "application/json";
        await httpContext.Response.WriteAsync(
            JsonSerializer.Serialize(response),
            cancellationToken
        );

        return true;
    }
}
