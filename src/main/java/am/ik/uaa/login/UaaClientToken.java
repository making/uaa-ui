package am.ik.uaa.login;

import org.cloudfoundry.reactor.ConnectionContext;
import org.cloudfoundry.reactor.DefaultConnectionContext;
import org.cloudfoundry.reactor.RootProvider;
import org.cloudfoundry.reactor.tokenprovider.ClientCredentialsGrantTokenProvider;
import org.cloudfoundry.reactor.uaa.ReactorUaaClient;
import org.cloudfoundry.uaa.UaaClient;
import reactor.core.publisher.Mono;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;

public class UaaClientToken extends UsernamePasswordAuthenticationToken {
	private final String clientId;
	private final UaaClient uaaClient;

	public UaaClientToken(String clientId, String clientSecret, String uaaUrl,
			boolean skipTlsValidation) {
		super(clientId, clientSecret);
		this.clientId = clientId;
		DefaultConnectionContext context = DefaultConnectionContext.builder()
				.apiHost("not-used") //
				.skipSslValidation(skipTlsValidation) //
				.rootProvider(new RootProvider() {

					@Override
					public Mono<String> getRoot(ConnectionContext connectionContext) {
						return Mono.empty();
					}

					@Override
					public Mono<String> getRoot(String key,
							ConnectionContext connectionContext) {
						return Mono.just(uaaUrl);
					}
				}) //
				.build();
		ClientCredentialsGrantTokenProvider tokenProvider = ClientCredentialsGrantTokenProvider
				.builder() //
				.clientId(clientId) //
				.clientSecret(clientSecret) //
				.build();
		this.uaaClient = ReactorUaaClient.builder() //
				.connectionContext(context) //
				.tokenProvider(tokenProvider) //
				.build();
	}

	public UaaClientToken(String clientId, UaaClient uaaClient) {
		super(clientId, "", AuthorityUtils.createAuthorityList("ROLE_CLIENT"));
		this.clientId = clientId;
		this.uaaClient = uaaClient;
	}

	public UaaClient uaaClient() {
		return this.uaaClient;
	}

	public UaaClientToken authenticated() {
		UaaClientToken token = new UaaClientToken(this.clientId, this.uaaClient);
		token.setDetails(this.uaaClient);
		return token;
	}
}
