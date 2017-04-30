package com.imnotpete.rpg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.imnotpete.rpg.model.DndCharacter;
import com.imnotpete.rpg.model.repository.DndCharacterRepository;

@SpringBootApplication
public class CharsheetDnd35Application implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(CharsheetDnd35Application.class, args);
	}

//	@Autowired
//	private DndCharacterRepository charRepo;
	
	@Override
	public void run(String... arg0) throws Exception {
//		// TODO Auto-generated method stub
//		DndCharacter character = new DndCharacter();
//		character.setName("MyChar");
//		character = charRepo.save(character);
//		
//		System.out.println(character.getId());
	}
}
