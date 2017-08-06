package com.imnotpete.rpg.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.imnotpete.rpg.model.DndCharacter;
import com.imnotpete.rpg.model.DndCharacterSummary;
import com.imnotpete.rpg.model.repository.DndCharacterRepository;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

	private DndCharacterRepository charRepo;

	@Autowired
	public CharacterController(DndCharacterRepository charRepo) {
		this.charRepo = charRepo;
	}

	@GetMapping
	public List<DndCharacterSummary> getCharacters(@RequestParam(required = false) String owner) {
		if (null == owner) {
			return charRepo.findByIdIsNotNull();
		}

		return charRepo.findByOwner(owner);
	}

	@GetMapping("/{id}")
	public DndCharacter getCharacter(@PathVariable Long id) {
		return charRepo.findOne(id);
	}

	@PostMapping
	public Long saveCharacter(DndCharacter dndChar, Authentication auth) {
		validateOwnership(dndChar, auth);

		dndChar = charRepo.save(dndChar);
		return dndChar.getId();
	}

	private void validateOwnership(DndCharacter dndChar, Authentication auth) {
		if (null == dndChar.getId()) {
			// new character -- make sure we set the owner
			dndChar.setOwner(auth.getName());
		} else {
			// existing character -- make sure current user is the owner
			String owner = charRepo.findOwnerById(dndChar.getId());
			if (!auth.getName().equals(owner)) {
				throw new AccessDeniedException("You don't own this character!");
			}
			
			if (null == dndChar.getOwner()) {
				dndChar.setOwner(owner);
			}
		}
	}

	@DeleteMapping("/{id}")
	public void deleteCharacter(@PathVariable("id") Long id) {
		charRepo.delete(id);
	}
}
