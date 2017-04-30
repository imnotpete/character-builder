package com.imnotpete.rpg.model;

import lombok.Data;

//@Entity
@Data
public class ClassDefinition {
	
//	@Id
	private Long id;
	
	private String name;
	
	private BaseAttackBonus bab;
	
	private Save fortSave;
	
	private Save refSave;
	
	private Save willSave;
}
