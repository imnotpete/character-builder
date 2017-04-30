package com.imnotpete.rpg.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import com.imnotpete.rpg.model.DndCharacter;

@NoRepositoryBean
public interface DndCharacterRepository extends JpaRepository<DndCharacter, Long>{

}
