using Eam.Dadades.Exceptions;

namespace Eam.Dadades.Middlewares
{
    public static class MiddlewareException
    {

        public static void UseExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
        }
    }
}
