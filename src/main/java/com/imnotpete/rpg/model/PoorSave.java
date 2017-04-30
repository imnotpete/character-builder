package com.imnotpete.rpg.model;

public class PoorSave implements Save {

	@Override
	public int getBonus(int level) {
		return level/3;
	}
}
