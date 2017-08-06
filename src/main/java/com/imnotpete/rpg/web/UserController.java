package com.imnotpete.rpg.web;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
	
	@GetMapping("/loggedin")
	public String getLoggedInUser(Authentication auth) {
		return auth.getName();
	}
}
