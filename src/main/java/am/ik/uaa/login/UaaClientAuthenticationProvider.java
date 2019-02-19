package am.ik.uaa.login;

import org.cloudfoundry.uaa.UaaClient;
import org.cloudfoundry.uaa.UaaException;
import org.cloudfoundry.uaa.serverinformation.GetInfoRequest;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class UaaClientAuthenticationProvider implements AuthenticationProvider {

	@Override
	public Authentication authenticate(Authentication authentication)
			throws AuthenticationException {
		UaaClientToken token = (UaaClientToken) authentication;
		UaaClient uaaClient = token.uaaClient();
		try {
			uaaClient.serverInformation().getInfo(GetInfoRequest.builder().build())
					.block();
		}
		catch (UaaException e) {
			throw new BadCredentialsException(e.getMessage(), e);
		}
		return token.authenticated();
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return UaaClientToken.class.isAssignableFrom(authentication);
	}
}
