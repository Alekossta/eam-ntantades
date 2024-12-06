using System.Net;

namespace Eam.Dadades.Core.ExceptionHandler
{
    public class HttpStatusCodeException : Exception
    {

        public HttpStatusCode StatusCode { get; set; }

        public string ContentType { get; set; } = @"text/plain";

        public int ErrorCode { get; set; }

        public string Message { get; set; }

        public HttpStatusCodeException(HttpStatusCode statusCode, string message, int errorCode)
        {
            StatusCode = statusCode;
            ErrorCode = errorCode;
            Message = message;
        }

    }
}