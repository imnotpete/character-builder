package com.imnotpete.rpg.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.Data;

@Entity
@Data
public class DndCharacter {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

//	@NotEmpty
	private String owner;
	
	@NotEmpty
	private String name;
	
	@Column(length = 512000)
	private String json;
	
	@Override
	public String toString() {
		return String.format("id [%s], name [%s], json length [%s]", id, name, (null == json ? "null" : json.length()));
	}
}
