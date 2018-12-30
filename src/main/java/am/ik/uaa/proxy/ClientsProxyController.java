package am.ik.uaa.proxy;

import org.cloudfoundry.uaa.UaaClient;
import org.cloudfoundry.uaa.clients.CreateClientRequest;
import org.cloudfoundry.uaa.clients.DeleteClientRequest;
import org.cloudfoundry.uaa.clients.ListClientsRequest;
import org.cloudfoundry.uaa.clients.ListClientsResponse;
import org.cloudfoundry.uaa.clients.UpdateClientRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("proxy/clients")
public class ClientsProxyController {

    private final UaaClient uaaClient;

    public ClientsProxyController(UaaClient uaaClient) {
        this.uaaClient = uaaClient;
    }

    @GetMapping("")
    public Mono<ListClientsResponse> clients() {
        return this.uaaClient.clients()
            .list(ListClientsRequest.builder()
                .build());
    }

    @PostMapping("")
    public Mono<?> createClient(@RequestBody CreateClientRequest createClientRequest) {
        return this.uaaClient.clients()
            .create(createClientRequest);
    }

    @PutMapping("{clientId}")
    public Mono<?> updateClient(@PathVariable String clientId, @RequestBody UpdateClientRequest updateClientRequest) {
        return this.uaaClient.clients()
            .update(updateClientRequest);
    }

    @DeleteMapping("{clientId}")
    public Mono<?> deleteClient(@PathVariable String clientId) {
        return this.uaaClient.clients()
            .delete(DeleteClientRequest.builder()
                .clientId(clientId)
                .build());
    }

}
