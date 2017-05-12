package com.imnotpete.rpg.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imnotpete.rpg.model.DndCharacter;
import com.imnotpete.rpg.model.DndCharacterSummary;

public interface DndCharacterRepository extends JpaRepository<DndCharacter, Long> {
	List<DndCharacterSummary> findByIdIsNotNull();
}
