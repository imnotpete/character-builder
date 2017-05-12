package com.imnotpete.rpg.web;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.imnotpete.rpg.model.repository.UserRepository;

@RestController
public class UserController {

	private UserRepository userRepository;

	@Autowired
	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@GetMapping("/users/loggedin")
	public String getLoggedInUser(Principal principal) {
		System.out.println("username " + principal.getName());
		return principal.getName();
	}
	
}
