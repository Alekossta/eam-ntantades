using System.Security.Claims;

namespace Eam.Dadades.Core.Helpers
{
    /// <summary>
    /// Helper class for ClaimsIdentity.
    /// </summary>
    public static class ClaimsIdentityaHelper
    {
        /// <summary>
        /// Gets the user ID from the claims identity.
        /// </summary>
        /// <param name="claimsIdentity">The claims identity.</param>
        /// <returns>The user ID.</returns>
        public static int GetUserIdAsync(this System.Security.Claims.ClaimsIdentity claimsIdentity)
        {
            return int.Parse(claimsIdentity?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}
