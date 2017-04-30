package com.imnotpete.rpg.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.imnotpete.rpg.model.DndCharacter;
import com.imnotpete.rpg.model.repository.DndCharacterRepository;

//@Controller
public class CharacterController {

	private DndCharacterRepository charRepo;

	@Autowired
	public CharacterController(DndCharacterRepository charRepo) {
		this.charRepo = charRepo;
	}

	@GetMapping("character.html")
	public String displayCharacter(@RequestParam("id") DndCharacter character, ModelMap model) {
		// DndCharacter character = charRepo.findOne(id);
		System.out.println(character.getName());
		model.addAttribute("character", character);

		return "character";
	}
}
