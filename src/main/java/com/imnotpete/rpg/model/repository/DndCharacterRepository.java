package com.imnotpete.rpg.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.imnotpete.rpg.model.DndCharacter;
import com.imnotpete.rpg.model.DndCharacterSummary;

public interface DndCharacterRepository extends JpaRepository<DndCharacter, Long> {
	List<DndCharacterSummary> findByIdIsNotNull();
	
	List<DndCharacterSummary> findByOwner(String username);

	@Query("select d.owner from DndCharacter d where d.id = :id")
	String findOwnerById(@Param("id") Long id);
}
