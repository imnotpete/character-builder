package com.imnotpete.rpg;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
public class CharsheetDnd35Application extends WebMvcConfigurerAdapter implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(CharsheetDnd35Application.class, args);
	}

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		super.addViewControllers(registry);

		registry.addViewController("/").setViewName("forward:/index.html");
	}

	// @Autowired
	// private DndCharacterRepository charRepo;

	@Override
	public void run(String... arg0) throws Exception {
		// // TODO Auto-generated method stub
		// DndCharacter character = new DndCharacter();
		// character.setName("MyChar");
		// character = charRepo.save(character);
		//
		// System.out.println(character.getId());
	}
}
