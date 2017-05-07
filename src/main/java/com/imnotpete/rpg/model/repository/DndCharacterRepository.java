package com.imnotpete.rpg.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.imnotpete.rpg.model.DndCharacter;

public interface DndCharacterRepository extends JpaRepository<DndCharacter, Long>{

}
