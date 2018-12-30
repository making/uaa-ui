package am.ik.uaa.config;

import org.cloudfoundry.reactor.ConnectionContext;
import org.cloudfoundry.reactor.DefaultConnectionContext;
import org.cloudfoundry.reactor.RootProvider;
import org.cloudfoundry.reactor.TokenProvider;
import org.cloudfoundry.reactor.tokenprovider.ClientCredentialsGrantTokenProvider;
import org.cloudfoundry.reactor.uaa.ReactorUaaClient;
import org.cloudfoundry.uaa.UaaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class UaaConfig {
    private final UaaProps props;

    public UaaConfig(UaaProps props) {
        this.props = props;
    }

    @Bean
    public ConnectionContext connectionContext() {
        return DefaultConnectionContext.builder()
                .skipSslValidation(this.props.isSkipSslValidation())
                .apiHost("localhost") // not used
                .rootProvider(new RootProvider() {
                    @Override
                    public Mono<String> getRoot(ConnectionContext connectionContext) {
                        return Mono.empty();
                    }

                    @Override
                    public Mono<String> getRoot(String key, ConnectionContext connectionContext) {
                        return Mono.just(props.getUrl());
                    }
                })
                .build();
    }

    @Bean
    public TokenProvider tokenProvider() {
        return ClientCredentialsGrantTokenProvider.builder()
                .clientId(this.props.getClientId())
                .clientSecret(this.props.getClientSecret())
                .build();
    }

    @Bean
    public UaaClient uaaClient(ConnectionContext connectionContext, TokenProvider tokenProvider) {
        return ReactorUaaClient.builder()
                .connectionContext(connectionContext)
                .tokenProvider(tokenProvider)
                .build();
    }
}
