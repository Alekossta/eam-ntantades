using Eam.Dadades.Core.ExceptionHandler;
using Newtonsoft.Json;
using System.Net;

namespace Eam.Dadades.Exceptions
{
    /// <summary>
    /// Exception Middle ware
    /// </summary>
    public class ExceptionMiddleware
    {

        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }


        /// <summary>
        /// Invoke for Exception Middleware in HTTP Request
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task Invoke(HttpContext context)
        {

            try
            {
                await _next(context);
            }
            catch (HttpStatusCodeException ex)
            {
                await HandleExceptionAsync(context, ex);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                await HandleExceptionAsync(context, ex);

            }
        }

        /// <summary>
        /// Handle Exception for HTTP Status Code Exception
        /// </summary>
        /// <param name="context"></param>
        /// <param name="exception"></param>
        /// <returns></returns>
        private static Task HandleExceptionAsync(HttpContext context, HttpStatusCodeException exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = exception.ErrorCode;
            return context.Response.WriteAsync(JsonConvert.SerializeObject(new
            {
                StatusCode = context.Response.StatusCode,
                Message = exception.Message
            }));
        }

        /// <summary>
        /// Handle Exception for Exception
        /// </summary>
        /// <param name="context"></param>
        /// <param name="exception"></param>
        /// <returns></returns>
        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            return context.Response.WriteAsync(JsonConvert.SerializeObject(new
            {
                StatusCode = context.Response.StatusCode,
                Message = "Something went wrong. Please try again later."
            }));
        }

    }
}