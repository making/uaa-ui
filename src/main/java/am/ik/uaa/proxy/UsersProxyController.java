package am.ik.uaa.proxy;

import com.fasterxml.jackson.databind.JsonNode;
import org.cloudfoundry.uaa.UaaClient;
import org.cloudfoundry.uaa.users.CreateUserRequest;
import org.cloudfoundry.uaa.users.DeleteUserRequest;
import org.cloudfoundry.uaa.users.Email;
import org.cloudfoundry.uaa.users.ListUsersRequest;
import org.cloudfoundry.uaa.users.ListUsersResponse;
import org.cloudfoundry.uaa.users.Name;
import org.cloudfoundry.uaa.users.UpdateUserRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Collections;

@RestController
@RequestMapping("proxy/users")
public class UsersProxyController {

    private final UaaClient uaaClient;

    public UsersProxyController(UaaClient uaaClient) {
        this.uaaClient = uaaClient;
    }

    @GetMapping("")
    public Mono<ListUsersResponse> listUsers() {
        return this.uaaClient.users()
            .list(ListUsersRequest.builder()
                .build());
    }

    @PostMapping("")
    public Mono<?> createUser(@RequestBody CreateUserRequest createUserRequest) {
        return this.uaaClient.users()
            .create(createUserRequest);
    }

    @PutMapping("{userId}")
    public Mono<?> updateUser(@PathVariable String userId, @RequestBody JsonNode body) {
        // TODO
        UpdateUserRequest updateUserRequest = UpdateUserRequest.builder()
            .id(userId)
            .version(body.get("version").asText())
            .userName(body.get("userName").asText())
            .name(Name.builder()
                .familyName(body.get("name").get("familyName").asText())
                .givenName(body.get("name").get("givenName").asText())
                .build())
            .emails(Collections.singletonList(Email.builder()
                .primary(body.get("emails").get(0).get("primary").asBoolean())
                .value(body.get("emails").get(0).get("value").asText())
                .build()))
            .build();
        return this.uaaClient.users()
            .update(updateUserRequest);
    }

    @DeleteMapping("{userId}")
    public Mono<?> deleteUser(@PathVariable String userId) {
        return this.uaaClient.users()
            .delete(DeleteUserRequest.builder()
                .userId(userId)
                .build());
    }
}
