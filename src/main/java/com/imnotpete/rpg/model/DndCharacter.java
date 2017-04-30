package com.imnotpete.rpg.model;

import java.util.List;

import lombok.Data;

//@Entity
@Data
public class DndCharacter {

//	@Id
//	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name;
	
	private Alignment alignment;
	
	private String deity;
	
	private String race;
	
	private Size size;
	
	private Integer age;
	
	private Gender gender;
	
	private String height;
	
	private Integer weight;
//
//	private String physicalDescription;
//	
//	private String backstory;
	
//	@OneToMany
	private List<ClassLevel> levels;
	
	
}
