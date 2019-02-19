package am.ik.uaa.login;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class UaaUsernamePasswordAuthenticationFilter
		extends UsernamePasswordAuthenticationFilter {
	private final Logger logger = LoggerFactory
			.getLogger(UaaUsernamePasswordAuthenticationFilter.class);

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request,
			HttpServletResponse response) throws AuthenticationException {
		String clientId = request.getParameter("clientId");
		String clientSecret = request.getParameter("clientSecret");
		String uaaUrl = request.getParameter("uaaUrl");
		String skipTlsValidation = request.getParameter("skipTlsValidation");
		logger.info("Attempt to login {} with {}", uaaUrl, clientId);
		UaaClientToken token = new UaaClientToken(clientId, clientSecret, uaaUrl,
				"on".equals(skipTlsValidation));
		this.setDetails(request, token);
		return this.getAuthenticationManager().authenticate(token);
	}
}
