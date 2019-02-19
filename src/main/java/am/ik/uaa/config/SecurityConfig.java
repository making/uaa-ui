package am.ik.uaa.config;

import am.ik.uaa.login.UaaUsernamePasswordAuthenticationFilter;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().mvcMatchers("/*.css", "/*.js");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		UaaUsernamePasswordAuthenticationFilter usernamePasswordAuthenticationFilter = new UaaUsernamePasswordAuthenticationFilter();
		usernamePasswordAuthenticationFilter
				.setAuthenticationManager(this.authenticationManager());
		usernamePasswordAuthenticationFilter.setAuthenticationFailureHandler(
				new SimpleUrlAuthenticationFailureHandler("/login?error"));
		usernamePasswordAuthenticationFilter.setAuthenticationSuccessHandler(
				new SimpleUrlAuthenticationSuccessHandler("/index.html"));
		http //
				.logout()
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET"))
				.permitAll() //
				.and() //
				.formLogin() //
				.loginPage("/login").permitAll() //
				.and() //
				.authorizeRequests() //
				.mvcMatchers("/error").permitAll() //
				.anyRequest().authenticated() //
				.and()
				.addFilterAt(usernamePasswordAuthenticationFilter,
						UsernamePasswordAuthenticationFilter.class) //
				.csrf()
				.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
	}
}
