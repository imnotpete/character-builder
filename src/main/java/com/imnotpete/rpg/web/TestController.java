package com.imnotpete.rpg.web;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

//@RestController
public class TestController {

	@GetMapping("/test")
	public String get(Authentication auth) {
		System.out.println(auth.getName());
		return "Hello world";
	}
	
	@PostMapping(path="/test", consumes="application/json")
	public String post(String arg) {
		System.out.println("arg: " + arg);
		return arg;
	}
	
}
