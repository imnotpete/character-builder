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
		String owner = validateOwnership(dndChar.getId(), auth);
		
		if (null == owner) {
			dndChar.setOwner(auth.getName());
		} else if (null == dndChar.getOwner()) {
			dndChar.setOwner(owner);
		}
		
		dndChar = charRepo.save(dndChar);
		return dndChar.getId();
	}

	private String validateOwnership(Long charId, Authentication auth) {
		String owner = charRepo.findOwnerById(charId);
		if (null != owner && !auth.getName().equals(owner)) {
			throw new AccessDeniedException("You don't own this character!");
		}

		return owner;
	}

	@DeleteMapping("/{id}")
	public void deleteCharacter(@PathVariable("id") Long id, Authentication auth) {
		validateOwnership(id, auth);
		charRepo.delete(id);
	}
}
