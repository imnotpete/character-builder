package com.imnotpete.rpg.model;

import lombok.Data;

//@Entity
@Data
public class ClassLevel {
	
//	@Id
	private Long id;
	
//	@ManyToOne
	private ClassDefinition classDefinition;
	
	private Integer level;
	
	private Integer hpRoll;
}
