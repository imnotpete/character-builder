package com.imnotpete.rpg.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.imnotpete.rpg.model.DndCharacter;
import com.imnotpete.rpg.model.repository.DndCharacterRepository;

@RestController
public class CharacterController {

	private DndCharacterRepository charRepo;

	@Autowired
	public CharacterController(DndCharacterRepository charRepo) {
		this.charRepo = charRepo;
	}

	@GetMapping("/characters")
	public List<DndCharacter> getAllCharacters() {
		return charRepo.findAll();
	}

	@GetMapping("/characters/{id}")
	public DndCharacter getCharacter(@PathVariable(name = "id") Long id) {
		return charRepo.findOne(id);
	}

	@PostMapping("/characters/{id}")
	public DndCharacter saveCharacter(@PathVariable(name = "id") Long id, @RequestBody DndCharacter dndChar) {
		return charRepo.save(dndChar);
	}
}
