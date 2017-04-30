package com.imnotpete.rpg.model;

public class GoodSave implements Save {

	@Override
	public int getBonus(int level) {
		return level/2+2;
	}
}
