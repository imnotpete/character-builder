package com.imnotpete.rpg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
public class CharsheetDnd35Application extends WebMvcConfigurerAdapter {

	public static void main(String[] args) {
		SpringApplication.run(CharsheetDnd35Application.class, args);
	}

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		super.addViewControllers(registry);
		registry.addViewController("/").setViewName("forward:/index.html");
		registry.addViewController("/character.html").setViewName("character");
		registry.addViewController("/index.html").setViewName("index");
	}
}
