using System.Net;

namespace Eam.Dadades.Core.ExceptionHandler
{
    public static class ErrorException
    {

        public static readonly HttpStatusCodeException AuthenticationException = new(HttpStatusCode.Unauthorized, "Authentication failed", 401);

        public static readonly HttpStatusCodeException NoUserFountWithGivenIdException = new(HttpStatusCode.NotFound, "No user found with given id", 404);

        public static readonly HttpStatusCodeException EmailAlreadyExistsFromAnotherUserException = new(HttpStatusCode.NotFound, "Email already exist from another user", 400);

        public static readonly HttpStatusCodeException UnexpectedBehaviorException = new(HttpStatusCode.InternalServerError, "Please try again later...", 500);

        public static readonly HttpStatusCodeException ContactRequestAlreadyExistException = new(HttpStatusCode.BadRequest, "Contact request already exist", 400);
    }
}