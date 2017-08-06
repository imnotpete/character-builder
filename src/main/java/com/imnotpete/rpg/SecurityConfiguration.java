package com.imnotpete.rpg;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.provisioning.InMemoryUserDetailsManagerConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		InMemoryUserDetailsManagerConfigurer<AuthenticationManagerBuilder> inMemoryAuth = auth.inMemoryAuthentication();
		
		Map<String, String> users = interceptor().getUsers();
		
		for (String username : users.keySet()) {
			inMemoryAuth.withUser(username).password(users.get(username)).roles("USER");
		}
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.authorizeRequests()
				.antMatchers("/css/**", "/js/**", "/api/**").permitAll()
				.antMatchers("/login*").anonymous()
				.antMatchers("/**").authenticated()
		.and()
			.formLogin()
				.loginPage("/login.html")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/");
	}

	@Bean
	@ConfigurationProperties(prefix = "com.imnotpete.rpg")
	public BasicAuthAuthorizationInterceptor interceptor() {
		return new BasicAuthAuthorizationInterceptor();
	}

	public static class BasicAuthAuthorizationInterceptor {

		private Map<String, String> users = new HashMap<String, String>();

		public Map<String, String> getUsers() {
			return users;
		}
	}
}
