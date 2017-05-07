package com.imnotpete.rpg.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;

@Entity
@Data
public class DndCharacter {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name;
	
	private Alignment alignment;
	
	private String deity;
	
	private String race;
	
	private Size size;
	
	private Integer age;
	
	private String gender;
	
	private String height;
	
	private Integer weight;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<ClassLevel> levels;
	
	
}
