package am.ik.uaa.login;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

@Controller
public class LoginController {

	@GetMapping(path = "/login")
	public String login(
			@SessionAttribute(name = "SPRING_SECURITY_LAST_EXCEPTION", required = false) Exception exception,
			Model model) {
		if (exception != null) {
			model.addAttribute("error", exception.getMessage());
		}
		return "login";
	}
}
