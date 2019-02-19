package am.ik.uaa.proxy;

import am.ik.uaa.login.UaaClientToken;
import org.cloudfoundry.uaa.clients.CreateClientRequest;
import org.cloudfoundry.uaa.clients.DeleteClientRequest;
import org.cloudfoundry.uaa.clients.ListClientsRequest;
import org.cloudfoundry.uaa.clients.ListClientsResponse;
import org.cloudfoundry.uaa.clients.UpdateClientRequest;
import reactor.core.publisher.Mono;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("proxy/clients")
public class ClientsProxyController {

	@GetMapping("")
	public Mono<ListClientsResponse> clients(Authentication authentication) {
		return ((UaaClientToken) authentication).uaaClient().clients()
				.list(ListClientsRequest.builder().build());
	}

	@PostMapping("")
	public Mono<?> createClient(@RequestBody CreateClientRequest createClientRequest,
			Authentication authentication) {
		return ((UaaClientToken) authentication).uaaClient().clients()
				.create(createClientRequest);
	}

	@PutMapping("{clientId}")
	public Mono<?> updateClient(@PathVariable String clientId,
			@RequestBody UpdateClientRequest updateClientRequest,
			Authentication authentication) {
		return ((UaaClientToken) authentication).uaaClient().clients()
				.update(updateClientRequest);
	}

	@DeleteMapping("{clientId}")
	public Mono<?> deleteClient(@PathVariable String clientId,
			Authentication authentication) {
		return ((UaaClientToken) authentication).uaaClient().clients()
				.delete(DeleteClientRequest.builder().clientId(clientId).build());
	}

}
