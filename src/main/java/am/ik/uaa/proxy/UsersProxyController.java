package am.ik.uaa.proxy;

import java.util.Collections;

import am.ik.uaa.login.UaaClientToken;
import com.fasterxml.jackson.databind.JsonNode;
import org.cloudfoundry.uaa.users.CreateUserRequest;
import org.cloudfoundry.uaa.users.DeleteUserRequest;
import org.cloudfoundry.uaa.users.Email;
import org.cloudfoundry.uaa.users.ListUsersRequest;
import org.cloudfoundry.uaa.users.ListUsersResponse;
import org.cloudfoundry.uaa.users.Name;
import org.cloudfoundry.uaa.users.UpdateUserRequest;
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
@RequestMapping("proxy/users")
public class UsersProxyController {

	@GetMapping("")
	public Mono<ListUsersResponse> listUsers(Authentication authentication) {
		return ((UaaClientToken) authentication).uaaClient().users()
				.list(ListUsersRequest.builder().build());
	}

	@PostMapping("")
	public Mono<?> createUser(@RequestBody CreateUserRequest createUserRequest,
			Authentication authentication) {
		return ((UaaClientToken) authentication).uaaClient().users()
				.create(createUserRequest);
	}

	@PutMapping("{userId}")
	public Mono<?> updateUser(@PathVariable String userId, @RequestBody JsonNode body,
			Authentication authentication) {
		// TODO
		UpdateUserRequest updateUserRequest = UpdateUserRequest.builder().id(userId)
				.version(body.get("version").asText())
				.userName(body.get("userName").asText())
				.name(Name.builder()
						.familyName(body.get("name").get("familyName").asText())
						.givenName(body.get("name").get("givenName").asText()).build())
				.emails(Collections.singletonList(Email.builder()
						.primary(body.get("emails").get(0).get("primary").asBoolean())
						.value(body.get("emails").get(0).get("value").asText()).build()))
				.build();
		return ((UaaClientToken) authentication).uaaClient().users()
				.update(updateUserRequest);
	}

	@DeleteMapping("{userId}")
	public Mono<?> deleteUser(@PathVariable String userId,
			Authentication authentication) {
		return ((UaaClientToken) authentication).uaaClient().users()
				.delete(DeleteUserRequest.builder().userId(userId).build());
	}
}
